import { Puppy, PuppyId } from "./puppy.entity";

// Port - Repository Interface
export interface PuppyRepository {
  findById(id: PuppyId): Promise<Puppy | null>;
  findByOwnerId(ownerId: string): Promise<Puppy[]>;
  findAll(): Promise<Puppy[]>;
  save(puppy: Puppy): Promise<Puppy>;
  update(puppy: Puppy): Promise<Puppy>;
  delete(id: PuppyId): Promise<void>;
}

// Port - External Service Interface
export interface NotificationService {
  sendNotification(message: string, recipient: string): Promise<void>;
}

// Port - Event Publisher Interface
export interface EventPublisher {
  publish(event: any): Promise<void>;
}
