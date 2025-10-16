import type { Puppy, PuppyId } from "./puppy.entity";
import type { DomainResult } from "../../common/result/result";

export abstract class PuppyRepository {
  abstract findById(id: PuppyId): Promise<DomainResult<Puppy | null>>;
  abstract findByOwnerId(ownerId: string): Promise<DomainResult<Puppy[]>>;
  abstract findAll(): Promise<DomainResult<Puppy[]>>;
  abstract save(puppy: Puppy): Promise<DomainResult<Puppy>>;
  abstract update(puppy: Puppy): Promise<DomainResult<Puppy>>;
  abstract delete(id: PuppyId): Promise<DomainResult<void>>;
}

export abstract class NotificationService {
  abstract sendNotification(
    message: string,
    recipient: string
  ): Promise<DomainResult<void>>;
}

export abstract class EventPublisher {
  abstract publish(event: unknown): Promise<DomainResult<void>>;
}
