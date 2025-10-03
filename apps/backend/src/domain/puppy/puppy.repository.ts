import { Puppy, PuppyId } from "./puppy.entity";

export interface PuppyRepository {
  findById(id: PuppyId): Promise<Puppy | null>;
  findByOwnerId(ownerId: string): Promise<Puppy[]>;
  findAll(): Promise<Puppy[]>;
  save(puppy: Puppy): Promise<Puppy>;
  update(puppy: Puppy): Promise<Puppy>;
  delete(id: PuppyId): Promise<void>;
}

export interface NotificationService {
  sendNotification(message: string, recipient: string): Promise<void>;
}

export interface EventPublisher {
  publish(event: any): Promise<void>;
}
