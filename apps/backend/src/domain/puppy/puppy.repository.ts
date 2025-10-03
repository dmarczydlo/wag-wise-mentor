import { Puppy, PuppyId } from "./puppy.entity";

export abstract class PuppyRepository {
  abstract findById(id: PuppyId): Promise<Puppy | null>;
  abstract findByOwnerId(ownerId: string): Promise<Puppy[]>;
  abstract findAll(): Promise<Puppy[]>;
  abstract save(puppy: Puppy): Promise<Puppy>;
  abstract update(puppy: Puppy): Promise<Puppy>;
  abstract delete(id: PuppyId): Promise<void>;
}

export abstract class NotificationService {
  abstract sendNotification(message: string, recipient: string): Promise<void>;
}

export abstract class EventPublisher {
  abstract publish(event: any): Promise<void>;
}
