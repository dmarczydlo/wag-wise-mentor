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
  RecurringType,
} from "../../domain/calendar/event.entity";
import { EventRepository } from "../../domain/calendar/event.repository";

export const EVENT_REPOSITORY = Symbol("EventRepository");

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

export interface CreateEventResult {
  success: boolean;
  event?: Event;
  error?: string;
}

export interface UpdateEventCommand {
  eventId: string;
  title?: string;
  description?: string;
  eventDateTime?: Date;
}

export interface UpdateEventResult {
  success: boolean;
  event?: Event;
  error?: string;
}

export interface GenerateHealthTimelineCommand {
  puppyId: string;
  breed: string;
  birthDate: Date;
}

export interface GenerateHealthTimelineResult {
  success: boolean;
  events?: Event[];
  error?: string;
}

@Injectable()
export class CreateEventUseCase {
  constructor(
    @Inject(EVENT_REPOSITORY) private readonly eventRepository: EventRepository
  ) {}

  async execute(command: CreateEventCommand): Promise<CreateEventResult> {
    try {
      const eventId = new EventId(this.generateId());
      const title = new EventTitle(command.title);
      const description = new EventDescription(command.description);
      const eventDateTime = new EventDateTime(command.eventDateTime);
      const eventType = new EventType(command.eventType);

      let recurringPattern: RecurringPattern | undefined;
      if (command.recurringPattern) {
        recurringPattern = new RecurringPattern(
          command.recurringPattern.type,
          command.recurringPattern.interval,
          command.recurringPattern.endDate
        );
      }

      const event = Event.create(
        eventId,
        title,
        description,
        eventDateTime,
        eventType,
        command.puppyId,
        recurringPattern
      );

      const savedEvent = await this.eventRepository.save(event);

      return {
        success: true,
        event: savedEvent,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
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

  async execute(command: UpdateEventCommand): Promise<UpdateEventResult> {
    try {
      const eventId = new EventId(command.eventId);
      const event = await this.eventRepository.findById(eventId);

      if (!event) {
        return {
          success: false,
          error: "Event not found",
        };
      }

      let updatedEvent = event;

      if (command.title) {
        const newTitle = new EventTitle(command.title);
        updatedEvent = updatedEvent.updateTitle(newTitle);
      }

      if (command.description) {
        const newDescription = new EventDescription(command.description);
        updatedEvent = updatedEvent.updateDescription(newDescription);
      }

      if (command.eventDateTime) {
        const newDateTime = new EventDateTime(command.eventDateTime);
        updatedEvent = updatedEvent.updateDateTime(newDateTime);
      }

      const savedEvent = await this.eventRepository.update(updatedEvent);

      return {
        success: true,
        event: savedEvent,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }
}

@Injectable()
export class GenerateHealthTimelineUseCase {
  constructor(
    @Inject(EVENT_REPOSITORY) private readonly eventRepository: EventRepository
  ) {}

  async execute(command: GenerateHealthTimelineCommand): Promise<GenerateHealthTimelineResult> {
    try {
      const events: Event[] = [];
      const birthDate = new Date(command.birthDate);
      const currentDate = new Date();

      const vaccinationSchedule = this.getVaccinationSchedule(command.breed, birthDate);
      
      for (const vaccine of vaccinationSchedule) {
        if (vaccine.date <= currentDate) {
          continue;
        }

        const eventId = new EventId(this.generateId());
        const title = new EventTitle(vaccine.name);
        const description = new EventDescription(vaccine.description);
        const eventDateTime = new EventDateTime(vaccine.date);
        const eventType = new EventType(EventTypeEnum.VACCINATION);

        const event = Event.create(
          eventId,
          title,
          description,
          eventDateTime,
          eventType,
          command.puppyId
        );

        events.push(event);
      }

      for (const event of events) {
        await this.eventRepository.save(event);
      }

      return {
        success: true,
        events,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  private getVaccinationSchedule(breed: string, birthDate: Date): Array<{
    name: string;
    description: string;
    date: Date;
  }> {
    const schedule = [
      {
        name: "First DHPP Vaccination",
        description: "First dose of DHPP (Distemper, Hepatitis, Parvovirus, Parainfluenza)",
        date: new Date(birthDate.getTime() + 6 * 7 * 24 * 60 * 60 * 1000), // 6 weeks
      },
      {
        name: "Second DHPP Vaccination",
        description: "Second dose of DHPP",
        date: new Date(birthDate.getTime() + 9 * 7 * 24 * 60 * 60 * 1000), // 9 weeks
      },
      {
        name: "Third DHPP Vaccination",
        description: "Third dose of DHPP",
        date: new Date(birthDate.getTime() + 12 * 7 * 24 * 60 * 60 * 1000), // 12 weeks
      },
      {
        name: "Rabies Vaccination",
        description: "First rabies vaccination",
        date: new Date(birthDate.getTime() + 16 * 7 * 24 * 60 * 60 * 1000), // 16 weeks
      },
    ];

    return schedule;
  }

  private generateId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
