import { Injectable, Inject } from "@nestjs/common";
import {
  Event,
  EventId,
  EventTitle,
  EventDescription,
  EventDateTime,
  EventType,
  EventTypeEnum,
  RecurringPattern,
  type RecurringType,
} from "../../domain/calendar/event.entity";
import { EventRepository } from "../../domain/calendar/event.repository";
import {
  type DomainResult,
  DomainError,
  Result,
} from "../../common/result/result";

export const EVENT_REPOSITORY = Symbol("EventRepository");

const VACCINATION_SCHEDULE_WEEKS = {
  FIRST_DHPP: 6,
  SECOND_DHPP: 9,
  THIRD_DHPP: 12,
  RABIES: 16,
} as const;

const MILLISECONDS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

export interface CreateEventCommand {
  title: string;
  description: string;
  eventDateTime: Date;
  eventType: EventTypeEnum;
  puppyId: string;
  recurringPattern?: {
    type: RecurringType;
    interval: number;
    endDate?: Date;
  };
}

export interface UpdateEventCommand {
  eventId: string;
  title?: string;
  description?: string;
  eventDateTime?: Date;
}

export interface GenerateHealthTimelineCommand {
  puppyId: string;
  breed: string;
  birthDate: Date;
}

@Injectable()
export class CreateEventUseCase {
  constructor(
    @Inject(EVENT_REPOSITORY) private readonly eventRepository: EventRepository
  ) {}

  async execute(command: CreateEventCommand): Promise<DomainResult<Event>> {
    // Validate and create value objects
    const validationResult = this.validateAndCreateValueObjects(command);
    if (validationResult.isFailure()) {
      return Result.failure(validationResult.getError());
    }

    const {
      eventId,
      title,
      description,
      eventDateTime,
      eventType,
      recurringPattern,
    } = validationResult.getValue();

    // Create the event
    const eventResult = Event.create(
      eventId,
      title,
      description,
      eventDateTime,
      eventType,
      command.puppyId,
      recurringPattern
    );

    if (eventResult.isFailure()) {
      return eventResult;
    }

    // Save the event
    return await this.eventRepository.save(eventResult.getValue());
  }

  private validateAndCreateValueObjects(
    command: CreateEventCommand
  ): DomainResult<{
    eventId: EventId;
    title: EventTitle;
    description: EventDescription;
    eventDateTime: EventDateTime;
    eventType: EventType;
    recurringPattern?: RecurringPattern;
  }> {
    const eventIdResult = EventId.create(this.generateId());
    if (eventIdResult.isFailure())
      return Result.failure(eventIdResult.getError());

    const titleResult = EventTitle.create(command.title);
    if (titleResult.isFailure()) return Result.failure(titleResult.getError());

    const descriptionResult = EventDescription.create(command.description);
    if (descriptionResult.isFailure())
      return Result.failure(descriptionResult.getError());

    const eventDateTimeResult = EventDateTime.create(command.eventDateTime);
    if (eventDateTimeResult.isFailure())
      return Result.failure(eventDateTimeResult.getError());

    const eventTypeResult = EventType.create(command.eventType);
    if (eventTypeResult.isFailure())
      return Result.failure(eventTypeResult.getError());

    let recurringPattern: RecurringPattern | undefined;
    if (!command.recurringPattern) {
      recurringPattern = undefined;
    } else {
      const recurringPatternResult = RecurringPattern.create(
        command.recurringPattern.type,
        command.recurringPattern.interval,
        command.recurringPattern.endDate
      );
      if (recurringPatternResult.isFailure()) {
        return Result.failure(recurringPatternResult.getError());
      }
      recurringPattern = recurringPatternResult.getValue();
    }

    return Result.success({
      eventId: eventIdResult.getValue(),
      title: titleResult.getValue(),
      description: descriptionResult.getValue(),
      eventDateTime: eventDateTimeResult.getValue(),
      eventType: eventTypeResult.getValue(),
      recurringPattern,
    });
  }

  private generateId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

@Injectable()
export class UpdateEventUseCase {
  constructor(
    @Inject(EVENT_REPOSITORY) private readonly eventRepository: EventRepository
  ) {}

  async execute(command: UpdateEventCommand): Promise<DomainResult<Event>> {
    const eventIdResult = EventId.create(command.eventId);
    if (eventIdResult.isFailure()) {
      return Result.failure(eventIdResult.getError());
    }

    const eventResult = await this.eventRepository.findById(
      eventIdResult.getValue()
    );
    if (eventResult.isFailure()) {
      return eventResult;
    }

    const event = eventResult.getValue();
    if (!event) {
      return Result.failure(DomainError.notFound("Event", command.eventId));
    }

    let updatedEvent = event;

    if (command.title !== undefined) {
      const titleResult = EventTitle.create(command.title);
      if (titleResult.isFailure()) {
        return Result.failure(titleResult.getError());
      }
      updatedEvent = updatedEvent.updateTitle(titleResult.getValue());
    }

    if (command.description !== undefined) {
      const descriptionResult = EventDescription.create(command.description);
      if (descriptionResult.isFailure()) {
        return Result.failure(descriptionResult.getError());
      }
      updatedEvent = updatedEvent.updateDescription(
        descriptionResult.getValue()
      );
    }

    if (command.eventDateTime) {
      const dateTimeResult = EventDateTime.create(command.eventDateTime);
      if (dateTimeResult.isFailure()) {
        return Result.failure(dateTimeResult.getError());
      }
      updatedEvent = updatedEvent.updateDateTime(dateTimeResult.getValue());
    }

    return await this.eventRepository.update(updatedEvent);
  }
}

@Injectable()
export class GenerateHealthTimelineUseCase {
  constructor(
    @Inject(EVENT_REPOSITORY) private readonly eventRepository: EventRepository
  ) {}

  async execute(
    command: GenerateHealthTimelineCommand
  ): Promise<DomainResult<Event[]>> {
    if (!command.puppyId || command.puppyId.trim().length === 0) {
      return Result.failure(DomainError.validation("PuppyId cannot be empty"));
    }

    const events: Event[] = [];
    const birthDate = new Date(command.birthDate);
    const currentDate = new Date();

    const vaccinationSchedule = this.getVaccinationSchedule(
      command.breed,
      birthDate
    );

    for (const vaccine of vaccinationSchedule) {
      // Only include future vaccination events
      if (vaccine.date > currentDate) {
        const eventResult = this.createVaccinationEvent(
          vaccine,
          command.puppyId
        );
        if (eventResult.isFailure()) {
          return Result.failure(eventResult.getError());
        }
        events.push(eventResult.getValue());
      }
    }

    // Save all events
    for (const event of events) {
      const saveResult = await this.eventRepository.save(event);
      if (saveResult.isFailure()) {
        return Result.failure(saveResult.getError());
      }
    }

    return Result.success(events);
  }

  private createVaccinationEvent(
    vaccine: { name: string; description: string; date: Date },
    puppyId: string
  ): DomainResult<Event> {
    const eventIdResult = EventId.create(this.generateId());
    if (eventIdResult.isFailure()) {
      return Result.failure(eventIdResult.getError());
    }

    const titleResult = EventTitle.create(vaccine.name);
    if (titleResult.isFailure()) {
      return Result.failure(titleResult.getError());
    }

    const descriptionResult = EventDescription.create(vaccine.description);
    if (descriptionResult.isFailure()) {
      return Result.failure(descriptionResult.getError());
    }

    const eventDateTimeResult = EventDateTime.create(vaccine.date);
    if (eventDateTimeResult.isFailure()) {
      return Result.failure(eventDateTimeResult.getError());
    }

    const eventTypeResult = EventType.create(EventTypeEnum.VACCINATION);
    if (eventTypeResult.isFailure()) {
      return Result.failure(eventTypeResult.getError());
    }

    return Event.create(
      eventIdResult.getValue(),
      titleResult.getValue(),
      descriptionResult.getValue(),
      eventDateTimeResult.getValue(),
      eventTypeResult.getValue(),
      puppyId
    );
  }

  private getVaccinationSchedule(
    breed: string,
    birthDate: Date
  ): Array<{
    name: string;
    description: string;
    date: Date;
  }> {
    const schedule = [
      {
        name: "First DHPP Vaccination",
        description:
          "First dose of DHPP (Distemper, Hepatitis, Parvovirus, Parainfluenza)",
        date: new Date(
          birthDate.getTime() +
            VACCINATION_SCHEDULE_WEEKS.FIRST_DHPP * MILLISECONDS_PER_WEEK
        ),
      },
      {
        name: "Second DHPP Vaccination",
        description: "Second dose of DHPP",
        date: new Date(
          birthDate.getTime() +
            VACCINATION_SCHEDULE_WEEKS.SECOND_DHPP * MILLISECONDS_PER_WEEK
        ),
      },
      {
        name: "Third DHPP Vaccination",
        description: "Third dose of DHPP",
        date: new Date(
          birthDate.getTime() +
            VACCINATION_SCHEDULE_WEEKS.THIRD_DHPP * MILLISECONDS_PER_WEEK
        ),
      },
      {
        name: "Rabies Vaccination",
        description: "First rabies vaccination",
        date: new Date(
          birthDate.getTime() +
            VACCINATION_SCHEDULE_WEEKS.RABIES * MILLISECONDS_PER_WEEK
        ),
      },
    ];

    return schedule;
  }

  private generateId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
