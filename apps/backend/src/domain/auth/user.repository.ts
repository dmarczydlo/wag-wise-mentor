import { User, UserId } from "./user.entity";

export abstract class UserRepository {
  abstract save(user: User): Promise<User>;
  abstract findById(id: UserId): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract update(user: User): Promise<User>;
  abstract delete(id: UserId): Promise<void>;
  abstract findAll(): Promise<User[]>;
}
