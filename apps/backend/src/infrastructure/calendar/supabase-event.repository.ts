import { Injectable } from "@nestjs/common";
import { SupabaseService } from "../config/supabase.service";
import { EventRepository } from "../../domain/calendar/event.repository";
import {
  Event,
  EventId,
  EventTitle,
  EventDescription,
  EventDateTime,
  EventType,
  EventTypeEnum,
} from "../../domain/calendar/event.entity";
import {
  Result,
  DomainError,
  type DomainResult,
} from "../../common/result/result";

interface EventRow {
  id: string;
  puppy_id: string;
  type: string;
  title: string;
  scheduled_date: string;
  completed_date?: string;
  notes?: string;
  created_at: string;
}

@Injectable()
export class SupabaseEventRepository extends EventRepository {
  constructor(private readonly supabaseService: SupabaseService) {
    super();
  }

  async save(event: Event): Promise<DomainResult<Event>> {
    try {
      const eventData = {
        id: event.id.value,
        puppy_id: event.puppyId,
        type: event.eventType.value,
        title: event.title.value,
        scheduled_date: event.eventDateTime.value.toISOString(),
        completed_date: null,
        notes: event.description.value,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await this.supabaseService
        .getClient()
        .from("events")
        .insert(eventData)
        .select()
        .single();

      if (error) {
        return Result.failure(
          DomainError.internal(`Failed to save event: ${error.message}`)
        );
      }

      return Result.success(this.mapRowToEvent(data));
    } catch (error) {
      return Result.failure(
        DomainError.internal(
          `Unexpected error saving event: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  }

  async findById(id: EventId): Promise<DomainResult<Event | null>> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from("events")
        .select("*")
        .eq("id", id.value)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return Result.success(null);
        }
        return Result.failure(
          DomainError.internal(`Failed to find event: ${error.message}`)
        );
      }

      return Result.success(this.mapRowToEvent(data));
    } catch (error) {
      return Result.failure(
        DomainError.internal(
          `Unexpected error finding event: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  }

  async findByPuppyId(puppyId: string): Promise<DomainResult<Event[]>> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from("events")
        .select("*")
        .eq("puppy_id", puppyId)
        .order("scheduled_date", { ascending: true });

      if (error) {
        return Result.failure(
          DomainError.internal(
            `Failed to find events by puppy: ${error.message}`
          )
        );
      }

      const events = data.map(row => this.mapRowToEvent(row));
      return Result.success(events);
    } catch (error) {
      return Result.failure(
        DomainError.internal(
          `Unexpected error finding events by puppy: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<DomainResult<Event[]>> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from("events")
        .select("*")
        .gte("scheduled_date", startDate.toISOString())
        .lte("scheduled_date", endDate.toISOString())
        .order("scheduled_date", { ascending: true });

      if (error) {
        return Result.failure(
          DomainError.internal(
            `Failed to find events by date range: ${error.message}`
          )
        );
      }

      const events = data.map(row => this.mapRowToEvent(row));
      return Result.success(events);
    } catch (error) {
      return Result.failure(
        DomainError.internal(
          `Unexpected error finding events by date range: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  }

  async findByType(eventType: string): Promise<DomainResult<Event[]>> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from("events")
        .select("*")
        .eq("type", eventType)
        .order("scheduled_date", { ascending: true });

      if (error) {
        return Result.failure(
          DomainError.internal(
            `Failed to find events by type: ${error.message}`
          )
        );
      }

      const events = data.map(row => this.mapRowToEvent(row));
      return Result.success(events);
    } catch (error) {
      return Result.failure(
        DomainError.internal(
          `Unexpected error finding events by type: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  }

  async update(event: Event): Promise<DomainResult<Event>> {
    try {
      const eventData = {
        type: event.eventType.value,
        title: event.title.value,
        scheduled_date: event.eventDateTime.value.toISOString(),
        notes: event.description.value,
      };

      const { data, error } = await this.supabaseService
        .getClient()
        .from("events")
        .update(eventData)
        .eq("id", event.id.value)
        .select()
        .single();

      if (error) {
        return Result.failure(
          DomainError.internal(`Failed to update event: ${error.message}`)
        );
      }

      return Result.success(this.mapRowToEvent(data));
    } catch (error) {
      return Result.failure(
        DomainError.internal(
          `Unexpected error updating event: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  }

  async delete(id: EventId): Promise<DomainResult<void>> {
    try {
      const { error } = await this.supabaseService
        .getClient()
        .from("events")
        .delete()
        .eq("id", id.value);

      if (error) {
        return Result.failure(
          DomainError.internal(`Failed to delete event: ${error.message}`)
        );
      }

      return Result.success(undefined);
    } catch (error) {
      return Result.failure(
        DomainError.internal(
          `Unexpected error deleting event: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  }

  async findUpcomingEvents(
    puppyId: string,
    limit: number = 10
  ): Promise<DomainResult<Event[]>> {
    try {
      const now = new Date().toISOString();

      const { data, error } = await this.supabaseService
        .getClient()
        .from("events")
        .select("*")
        .eq("puppy_id", puppyId)
        .gte("scheduled_date", now)
        .order("scheduled_date", { ascending: true })
        .limit(limit);

      if (error) {
        return Result.failure(
          DomainError.internal(
            `Failed to find upcoming events: ${error.message}`
          )
        );
      }

      const events = data.map(row => this.mapRowToEvent(row));
      return Result.success(events);
    } catch (error) {
      return Result.failure(
        DomainError.internal(
          `Unexpected error finding upcoming events: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  }

  private mapRowToEvent(row: EventRow): Event {
    const eventIdResult = EventId.create(row.id);
    const titleResult = EventTitle.create(row.title);
    const descriptionResult = EventDescription.create(row.notes || "");
    const eventDateTimeResult = EventDateTime.create(
      new Date(row.scheduled_date)
    );

    const eventTypeValue = this.mapStringToEventType(row.type);
    const eventTypeResult = EventType.create(eventTypeValue);

    if (eventIdResult.isFailure()) {
      throw new Error(`Invalid event ID: ${eventIdResult.getError().message}`);
    }
    if (titleResult.isFailure()) {
      throw new Error(`Invalid event title: ${titleResult.getError().message}`);
    }
    if (descriptionResult.isFailure()) {
      throw new Error(
        `Invalid event description: ${descriptionResult.getError().message}`
      );
    }
    if (eventDateTimeResult.isFailure()) {
      throw new Error(
        `Invalid event date: ${eventDateTimeResult.getError().message}`
      );
    }
    if (eventTypeResult.isFailure()) {
      throw new Error(
        `Invalid event type: ${eventTypeResult.getError().message}`
      );
    }

    const eventResult = Event.create(
      eventIdResult.getValue(),
      titleResult.getValue(),
      descriptionResult.getValue(),
      eventDateTimeResult.getValue(),
      eventTypeResult.getValue(),
      row.puppy_id
    );

    if (eventResult.isFailure()) {
      throw new Error(
        `Failed to create event: ${eventResult.getError().message}`
      );
    }

    return eventResult.getValue();
  }

  private mapStringToEventType(type: string): EventTypeEnum {
    switch (type) {
      case "vet":
        return EventTypeEnum.VET_APPOINTMENT;
      case "vaccination":
        return EventTypeEnum.VACCINATION;
      case "grooming":
        return EventTypeEnum.GROOMING;
      case "training":
        return EventTypeEnum.TRAINING;
      case "other":
        return EventTypeEnum.CUSTOM;
      default:
        return EventTypeEnum.CUSTOM;
    }
  }
}
