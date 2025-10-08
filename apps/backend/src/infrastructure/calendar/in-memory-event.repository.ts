import { Injectable } from "@nestjs/common";
import { Event, EventId } from "../../domain/calendar/event.entity";
import { EventRepository } from "../../domain/calendar/event.repository";

@Injectable()
export class InMemoryEventRepository implements EventRepository {
  private events: Map<string, Event> = new Map();

  async save(event: Event): Promise<Event> {
    this.events.set(event.id.value, event);
    return event;
  }

  async findById(id: EventId): Promise<Event | null> {
    return this.events.get(id.value) || null;
  }

  async findByPuppyId(puppyId: string): Promise<Event[]> {
    return Array.from(this.events.values()).filter(
      (event) => event.puppyId === puppyId
    );
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Event[]> {
    return Array.from(this.events.values()).filter(
      (event) =>
        event.eventDateTime.value >= startDate &&
        event.eventDateTime.value <= endDate
    );
  }

  async findByType(eventType: string): Promise<Event[]> {
    return Array.from(this.events.values()).filter(
      (event) => event.eventType.value === eventType
    );
  }

  async update(event: Event): Promise<Event> {
    this.events.set(event.id.value, event);
    return event;
  }

  async delete(id: EventId): Promise<void> {
    this.events.delete(id.value);
  }

  async findUpcomingEvents(
    puppyId: string,
    limit: number = 10
  ): Promise<Event[]> {
    const puppyEvents = await this.findByPuppyId(puppyId);
    const upcomingEvents = puppyEvents
      .filter((event) => event.isUpcoming())
      .sort(
        (a, b) =>
          a.eventDateTime.value.getTime() - b.eventDateTime.value.getTime()
      )
      .slice(0, limit);

    return upcomingEvents;
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
