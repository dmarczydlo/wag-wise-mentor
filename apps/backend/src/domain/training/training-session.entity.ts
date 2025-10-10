import { Entity } from "../shared/base.entity";

export class TrainingSession extends Entity<string> {
  private constructor(
    id: string,
    public readonly puppyId: string,
    public readonly sessionType: string,
    public readonly duration: number,
    public readonly notes: string,
    public readonly completedAt: Date,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id, createdAt, updatedAt);
  }

  public static create(
    id: string,
    puppyId: string,
    sessionType: string,
    duration: number,
    notes: string,
    completedAt: Date
  ): TrainingSession {
    return new TrainingSession(
      id,
      puppyId,
      sessionType,
      duration,
      notes,
      completedAt
    );
  }

  public updateNotes(notes: string): TrainingSession {
    return new TrainingSession(
      this.id,
      this.puppyId,
      this.sessionType,
      this.duration,
      notes,
      this.completedAt,
      this.createdAt,
      new Date()
    );
  }
}
