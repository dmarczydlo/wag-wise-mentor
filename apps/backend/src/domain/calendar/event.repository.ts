import type { Event, EventId } from "./event.entity";
import type { DomainResult } from "../../common/result/result";

export abstract class EventRepository {
  abstract save(event: Event): Promise<DomainResult<Event>>;
  abstract findById(id: EventId): Promise<DomainResult<Event | null>>;
  abstract findByPuppyId(puppyId: string): Promise<DomainResult<Event[]>>;
  abstract findByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<DomainResult<Event[]>>;
  abstract findByType(eventType: string): Promise<DomainResult<Event[]>>;
  abstract update(event: Event): Promise<DomainResult<Event>>;
  abstract delete(id: EventId): Promise<DomainResult<void>>;
  abstract findUpcomingEvents(
    puppyId: string,
    limit?: number
  ): Promise<DomainResult<Event[]>>;
}
