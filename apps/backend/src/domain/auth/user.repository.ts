import type { User, UserId } from "./user.entity";
import type { DomainResult } from "../../common/result/result";

export abstract class UserRepository {
  abstract save(user: User): Promise<DomainResult<User>>;
  abstract findById(id: UserId): Promise<DomainResult<User | null>>;
  abstract findByEmail(email: string): Promise<DomainResult<User | null>>;
  abstract update(user: User): Promise<DomainResult<User>>;
  abstract delete(id: UserId): Promise<DomainResult<void>>;
  abstract findAll(): Promise<DomainResult<User[]>>;
}
