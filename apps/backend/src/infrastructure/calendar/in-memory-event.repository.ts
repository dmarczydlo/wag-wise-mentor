import { Injectable } from "@nestjs/common";
import type { Event, EventId } from "../../domain/calendar/event.entity";
import type { EventRepository } from "../../domain/calendar/event.repository";
import { type DomainResult, Result } from "../../common/result/result";

@Injectable()
export class InMemoryEventRepository implements EventRepository {
  private events: Map<string, Event> = new Map();

  async save(event: Event): Promise<DomainResult<Event>> {
    try {
      this.events.set(event.id.value, event);
      return Result.success(event);
    } catch (error) {
      return Result.failure({
        code: "INTERNAL_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to save event",
      });
    }
  }

  async findById(id: EventId): Promise<DomainResult<Event | null>> {
    try {
      const event = this.events.get(id.value) || null;
      return Result.success(event);
    } catch (error) {
      return Result.failure({
        code: "INTERNAL_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to find event",
      });
    }
  }

  async findByPuppyId(puppyId: string): Promise<DomainResult<Event[]>> {
    try {
      const events = Array.from(this.events.values()).filter(
        event => event.puppyId === puppyId
      );
      return Result.success(events);
    } catch (error) {
      return Result.failure({
        code: "INTERNAL_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Failed to find events by puppy ID",
      });
    }
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<DomainResult<Event[]>> {
    try {
      const events = Array.from(this.events.values()).filter(
        event =>
          event.eventDateTime.value >= startDate &&
          event.eventDateTime.value <= endDate
      );
      return Result.success(events);
    } catch (error) {
      return Result.failure({
        code: "INTERNAL_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Failed to find events by date range",
      });
    }
  }

  async findByType(eventType: string): Promise<DomainResult<Event[]>> {
    try {
      const events = Array.from(this.events.values()).filter(
        event => event.eventType.value === eventType
      );
      return Result.success(events);
    } catch (error) {
      return Result.failure({
        code: "INTERNAL_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Failed to find events by type",
      });
    }
  }

  async update(event: Event): Promise<DomainResult<Event>> {
    try {
      this.events.set(event.id.value, event);
      return Result.success(event);
    } catch (error) {
      return Result.failure({
        code: "INTERNAL_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to update event",
      });
    }
  }

  async delete(id: EventId): Promise<DomainResult<void>> {
    try {
      this.events.delete(id.value);
      return Result.success(undefined);
    } catch (error) {
      return Result.failure({
        code: "INTERNAL_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to delete event",
      });
    }
  }

  async findUpcomingEvents(
    puppyId: string,
    limit: number = 10
  ): Promise<DomainResult<Event[]>> {
    try {
      const puppyEventsResult = await this.findByPuppyId(puppyId);
      if (puppyEventsResult.isFailure()) {
        return puppyEventsResult;
      }

      const puppyEvents = puppyEventsResult.getValue();
      const upcomingEvents = puppyEvents
        .filter(event => event.isUpcoming())
        .sort(
          (a, b) =>
            a.eventDateTime.value.getTime() - b.eventDateTime.value.getTime()
        )
        .slice(0, limit);

      return Result.success(upcomingEvents);
    } catch (error) {
      return Result.failure({
        code: "INTERNAL_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Failed to find upcoming events",
      });
    }
  }

  // Test helper methods
  clear(): void {
    this.events.clear();
  }

  getCount(): number {
    return this.events.size;
  }

  getAllEvents(): Event[] {
    return Array.from(this.events.values());
  }
}
