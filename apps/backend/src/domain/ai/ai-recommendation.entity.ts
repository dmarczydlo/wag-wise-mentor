import { Entity } from "../shared/base.entity";

export class AIRecommendation extends Entity<string> {
  private constructor(
    id: string,
    public readonly puppyId: string,
    public readonly category: string,
    public readonly recommendation: string,
    public readonly confidence: number,
    public readonly metadata: Record<string, any>,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id, createdAt, updatedAt);
  }

  public static create(
    id: string,
    puppyId: string,
    category: string,
    recommendation: string,
    confidence: number,
    metadata: Record<string, any> = {}
  ): AIRecommendation {
    return new AIRecommendation(
      id,
      puppyId,
      category,
      recommendation,
      confidence,
      metadata
    );
  }

  public updateConfidence(confidence: number): AIRecommendation {
    return new AIRecommendation(
      this.id,
      this.puppyId,
      this.category,
      this.recommendation,
      confidence,
      this.metadata,
      this.createdAt,
      new Date()
    );
  }
}
