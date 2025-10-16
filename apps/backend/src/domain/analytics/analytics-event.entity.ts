import { Entity } from "../shared/base.entity";

export class AnalyticsEvent extends Entity<string> {
  private constructor(
    id: string,
    public readonly userId: string,
    public readonly eventType: string,
    public readonly eventName: string,
    public readonly properties: Record<string, unknown>,
    public readonly timestamp: Date,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id, createdAt, updatedAt);
  }

  public static create(
    id: string,
    userId: string,
    eventType: string,
    eventName: string,
    properties: Record<string, unknown> = {},
    timestamp: Date
  ): AnalyticsEvent {
    return new AnalyticsEvent(
      id,
      userId,
      eventType,
      eventName,
      properties,
      timestamp
    );
  }

  public enrichProperties(
    additionalProperties: Record<string, unknown>
  ): AnalyticsEvent {
    return new AnalyticsEvent(
      this.id,
      this.userId,
      this.eventType,
      this.eventName,
      { ...this.properties, ...additionalProperties },
      this.timestamp,
      this.createdAt,
      new Date()
    );
  }
}
