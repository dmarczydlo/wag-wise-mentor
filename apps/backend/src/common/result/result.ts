export abstract class Result<T, E = string> {
  abstract isSuccess(): boolean;
  abstract isFailure(): boolean;
  abstract getValue(): T;
  abstract getError(): E;

  static success<T, E = string>(value: T): Result<T, E> {
    return new Success(value);
  }

  static failure<T, E = string>(error: E): Result<T, E> {
    return new Failure(error);
  }

  static combine<T>(results: Result<T>[]): Result<T[]> {
    const failures = results.filter((r) => r.isFailure());
    if (failures.length > 0) {
      return Result.failure(failures[0].getError());
    }
    return Result.success(results.map((r) => r.getValue()));
  }

  map<U>(fn: (value: T) => U): Result<U, E> {
    if (this.isSuccess()) {
      try {
        return Result.success(fn(this.getValue())) as Result<U, E>;
      } catch (error) {
        // For map operations, we need to handle the case where E might not be string
        // This is a limitation of the current design - map should probably not catch exceptions
        throw error;
      }
    }
    return Result.failure(this.getError());
  }

  flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    if (this.isSuccess()) {
      return fn(this.getValue());
    }
    return Result.failure(this.getError());
  }

  onSuccess(fn: (value: T) => void): Result<T, E> {
    if (this.isSuccess()) {
      fn(this.getValue());
    }
    return this;
  }

  onFailure(fn: (error: E) => void): Result<T, E> {
    if (this.isFailure()) {
      fn(this.getError());
    }
    return this;
  }

  getOrElse(defaultValue: T): T {
    return this.isSuccess() ? this.getValue() : defaultValue;
  }

  getOrThrow(): T {
    if (this.isSuccess()) {
      return this.getValue();
    }
    throw new Error(String(this.getError()));
  }
}

class Success<T, E = string> extends Result<T, E> {
  constructor(private readonly value: T) {
    super();
  }

  isSuccess(): boolean {
    return true;
  }

  isFailure(): boolean {
    return false;
  }

  getValue(): T {
    return this.value;
  }

  getError(): E {
    throw new Error("Cannot get error from success result");
  }
}

class Failure<T, E = string> extends Result<T, E> {
  constructor(private readonly error: E) {
    super();
  }

  isSuccess(): boolean {
    return false;
  }

  isFailure(): boolean {
    return true;
  }

  getValue(): T {
    throw new Error("Cannot get value from failure result");
  }

  getError(): E {
    return this.error;
  }
}

/**
 * Domain error types for better error categorization
 */
export class DomainError {
  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly details?: any
  ) {}

  static validation(message: string, details?: any): DomainError {
    return new DomainError("VALIDATION_ERROR", message, details);
  }

  static notFound(resource: string, id?: string): DomainError {
    const message = id
      ? `${resource} with id ${id} not found`
      : `${resource} not found`;
    return new DomainError("NOT_FOUND", message);
  }

  static unauthorized(message: string = "Unauthorized access"): DomainError {
    return new DomainError("UNAUTHORIZED", message);
  }

  static forbidden(message: string = "Forbidden access"): DomainError {
    return new DomainError("FORBIDDEN", message);
  }

  static conflict(message: string, details?: any): DomainError {
    return new DomainError("CONFLICT", message, details);
  }

  static internal(message: string = "Internal server error"): DomainError {
    return new DomainError("INTERNAL_ERROR", message);
  }
}

export type DomainResult<T> = Result<T, DomainError>;
