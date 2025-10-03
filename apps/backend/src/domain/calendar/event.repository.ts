import { Event, EventId } from "./event.entity";

export abstract class EventRepository {
  abstract save(event: Event): Promise<Event>;
  abstract findById(id: EventId): Promise<Event | null>;
  abstract findByPuppyId(puppyId: string): Promise<Event[]>;
  abstract findByDateRange(startDate: Date, endDate: Date): Promise<Event[]>;
  abstract findByType(eventType: string): Promise<Event[]>;
  abstract update(event: Event): Promise<Event>;
  abstract delete(id: EventId): Promise<void>;
  abstract findUpcomingEvents(puppyId: string, limit?: number): Promise<Event[]>;
}
