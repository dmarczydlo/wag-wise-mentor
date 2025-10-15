import { Entity } from "../shared/base.entity";
import { ValueObject } from "../shared/base.entity";
import { Result, DomainError, DomainResult } from "../../common/result/result";

export class EventId extends ValueObject {
  constructor(public readonly value: string) {
    super();
  }

  static create(value: string): DomainResult<EventId> {
    if (!value || value.trim().length === 0) {
      return Result.failure(DomainError.validation("EventId cannot be empty"));
    }
    return Result.success(new EventId(value));
  }
}

export class EventTitle extends ValueObject {
  constructor(public readonly value: string) {
    super();
  }

  static create(value: string): DomainResult<EventTitle> {
    if (!value || value.trim().length === 0) {
      return Result.failure(
        DomainError.validation("EventTitle cannot be empty")
      );
    }
    if (value.length > 200) {
      return Result.failure(
        DomainError.validation("EventTitle cannot exceed 200 characters")
      );
    }
    return Result.success(new EventTitle(value));
  }
}

export class EventDescription extends ValueObject {
  constructor(public readonly value: string) {
    super();
  }

  static create(value: string): DomainResult<EventDescription> {
    if (value.length > 1000) {
      return Result.failure(
        DomainError.validation("EventDescription cannot exceed 1000 characters")
      );
    }
    return Result.success(new EventDescription(value));
  }
}

export class EventDateTime extends ValueObject {
  constructor(public readonly value: Date) {
    super();
  }

  static create(value: Date): DomainResult<EventDateTime> {
    if (!value) {
      return Result.failure(
        DomainError.validation("EventDateTime cannot be null")
      );
    }
    return Result.success(new EventDateTime(value));
  }

  public isPast(): boolean {
    return this.value < new Date();
  }

  public isFuture(): boolean {
    return this.value > new Date();
  }

  public getDaysUntil(): number {
    const now = new Date();
    const diffTime = this.value.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}

export class EventType extends ValueObject {
  constructor(public readonly value: EventTypeEnum) {
    super();
  }

  static create(value: EventTypeEnum): DomainResult<EventType> {
    if (!Object.values(EventTypeEnum).includes(value)) {
      return Result.failure(DomainError.validation("Invalid event type"));
    }
    return Result.success(new EventType(value));
  }
}

export enum EventTypeEnum {
  VACCINATION = "vaccination",
  VET_APPOINTMENT = "vet_appointment",
  FEEDING = "feeding",
  TRAINING = "training",
  GROOMING = "grooming",
  MEDICATION = "medication",
  CUSTOM = "custom",
}

export class RecurringPattern extends ValueObject {
  constructor(
    public readonly type: RecurringType,
    public readonly interval: number,
    public readonly endDate?: Date
  ) {
    super();
  }

  static create(
    type: RecurringType,
    interval: number,
    endDate?: Date
  ): DomainResult<RecurringPattern> {
    if (interval <= 0) {
      return Result.failure(
        DomainError.validation("Recurring interval must be positive")
      );
    }
    if (endDate && endDate <= new Date()) {
      return Result.failure(
        DomainError.validation("Recurring end date must be in the future")
      );
    }
    return Result.success(new RecurringPattern(type, interval, endDate));
  }

  public shouldRecur(currentDate: Date): boolean {
    if (this.endDate && currentDate > this.endDate) {
      return false;
    }
    return true;
  }

  public getNextOccurrence(fromDate: Date): Date {
    const nextDate = new Date(fromDate);

    switch (this.type) {
      case RecurringType.DAILY:
        nextDate.setDate(nextDate.getDate() + this.interval);
        break;
      case RecurringType.WEEKLY:
        nextDate.setDate(nextDate.getDate() + 7 * this.interval);
        break;
      case RecurringType.MONTHLY:
        nextDate.setMonth(nextDate.getMonth() + this.interval);
        break;
      case RecurringType.YEARLY:
        nextDate.setFullYear(nextDate.getFullYear() + this.interval);
        break;
    }

    return nextDate;
  }
}

export enum RecurringType {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  YEARLY = "yearly",
}

export class Event extends Entity<EventId> {
  private constructor(
    id: EventId,
    public readonly title: EventTitle,
    public readonly description: EventDescription,
    public readonly eventDateTime: EventDateTime,
    public readonly eventType: EventType,
    public readonly puppyId: string,
    public readonly recurringPattern?: RecurringPattern,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id, createdAt, updatedAt);
  }

  public static create(
    id: EventId,
    title: EventTitle,
    description: EventDescription,
    eventDateTime: EventDateTime,
    eventType: EventType,
    puppyId: string,
    recurringPattern?: RecurringPattern
  ): DomainResult<Event> {
    if (!puppyId || puppyId.trim().length === 0) {
      return Result.failure(DomainError.validation("PuppyId cannot be empty"));
    }

    return Result.success(
      new Event(
        id,
        title,
        description,
        eventDateTime,
        eventType,
        puppyId,
        recurringPattern
      )
    );
  }

  public updateDateTime(newDateTime: EventDateTime): Event {
    return new Event(
      this.id,
      this.title,
      this.description,
      newDateTime,
      this.eventType,
      this.puppyId,
      this.recurringPattern,
      this.createdAt,
      new Date()
    );
  }

  public updateTitle(newTitle: EventTitle): Event {
    return new Event(
      this.id,
      newTitle,
      this.description,
      this.eventDateTime,
      this.eventType,
      this.puppyId,
      this.recurringPattern,
      this.createdAt,
      new Date()
    );
  }

  public updateDescription(newDescription: EventDescription): Event {
    return new Event(
      this.id,
      this.title,
      newDescription,
      this.eventDateTime,
      this.eventType,
      this.puppyId,
      this.recurringPattern,
      this.createdAt,
      new Date()
    );
  }

  public isRecurring(): boolean {
    return this.recurringPattern !== undefined;
  }

  public isUpcoming(): boolean {
    return this.eventDateTime.isFuture();
  }

  public isOverdue(): boolean {
    return (
      this.eventDateTime.isPast() &&
      this.eventType.value === EventTypeEnum.VACCINATION
    );
  }

  public getUrgencyLevel(): "low" | "medium" | "high" {
    const daysUntil = this.eventDateTime.getDaysUntil();

    if (daysUntil <= 1) {
      return "high";
    } else if (daysUntil <= 7) {
      return "medium";
    } else {
      return "low";
    }
  }
}
