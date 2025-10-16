/**
 * Calculation utility functions for pet-related calculations
 */

/**
 * Calculate ideal weight range for a puppy based on breed and age
 */
export function calculateIdealWeightRange(
  breed: string,
  ageInWeeks: number
): { min: number; max: number; unit: "kg" | "lbs" } {
  const baseWeight = getBreedBaseWeight(breed);
  const growthFactor = getGrowthFactor(breed, ageInWeeks);

  const idealWeight = baseWeight * growthFactor;
  const variance = idealWeight * 0.15; // 15% variance

  return {
    min: Math.max(0.5, idealWeight - variance),
    max: idealWeight + variance,
    unit: "kg",
  };
}

/**
 * Calculate feeding portion based on weight and age
 */
export function calculateFeedingPortion(
  weight: number,
  ageInWeeks: number,
  activityLevel: "low" | "medium" | "high" = "medium"
): { amount: number; unit: "g" | "cups"; frequency: number } {
  const basePercentage = ageInWeeks < 12 ? 0.03 : 0.025;

  const activityMultiplier = {
    low: 0.9,
    medium: 1.0,
    high: 1.1,
  };

  const dailyAmount =
    weight * basePercentage * activityMultiplier[activityLevel];

  const amountInGrams = dailyAmount * 1000;

  const frequency = ageInWeeks < 12 ? 4 : ageInWeeks < 24 ? 3 : 2;

  return {
    amount: Math.round(amountInGrams / frequency),
    unit: "g",
    frequency,
  };
}

/**
 * Calculate growth rate between two weight measurements
 */
export function calculateGrowthRate(
  currentWeight: number,
  previousWeight: number,
  daysBetween: number
): { rate: number; unit: "g/day" | "lbs/week" } {
  if (daysBetween <= 0) {
    return { rate: 0, unit: "g/day" };
  }

  const weightGain = currentWeight - previousWeight;
  const dailyRate = (weightGain / daysBetween) * 1000; // Convert to grams per day

  return {
    rate: Math.round(dailyRate * 10) / 10,
    unit: "g/day",
  };
}

/**
 * Calculate body condition score (simplified)
 */
export function calculateBodyConditionScore(
  weight: number,
  idealWeight: number,
  ribVisibility: "visible" | "slightly_visible" | "not_visible",
  waistDefinition: "pronounced" | "visible" | "not_visible"
): { score: number; description: string } {
  const weightRatio = weight / idealWeight;

  let score = 5; // Start with ideal score

  if (weightRatio < 0.9) score -= 2;
  else if (weightRatio < 0.95) score -= 1;
  else if (weightRatio > 1.1) score += 1;
  else if (weightRatio > 1.2) score += 2;

  if (ribVisibility === "visible") score -= 1;
  else if (ribVisibility === "not_visible") score += 1;

  if (waistDefinition === "pronounced") score -= 1;
  else if (waistDefinition === "not_visible") score += 1;

  score = Math.max(1, Math.min(9, score));

  const descriptions = {
    1: "Emaciated",
    2: "Very thin",
    3: "Thin",
    4: "Underweight",
    5: "Ideal",
    6: "Overweight",
    7: "Heavy",
    8: "Obese",
    9: "Severely obese",
  };

  return {
    score,
    description: descriptions[score as keyof typeof descriptions],
  };
}

/**
 * Calculate vaccination schedule based on age
 */
export function calculateVaccinationSchedule(ageInWeeks: number): {
  due: string[];
  next: string | null;
  nextDueDate: Date | null;
} {
  const schedule = [
    { name: "DHPP (First)", weeks: 6 },
    { name: "DHPP (Second)", weeks: 10 },
    { name: "DHPP (Third)", weeks: 14 },
    { name: "Rabies", weeks: 16 },
    { name: "Bordetella", weeks: 16 },
    { name: "Lyme Disease", weeks: 20 },
  ];

  const due = schedule
    .filter(vaccine => ageInWeeks >= vaccine.weeks)
    .map(vaccine => vaccine.name);

  const next = schedule.find(vaccine => ageInWeeks < vaccine.weeks);

  return {
    due,
    next: next?.name || null,
    nextDueDate: next
      ? new Date(
          Date.now() + (next.weeks - ageInWeeks) * 7 * 24 * 60 * 60 * 1000
        )
      : null,
  };
}

/**
 * Calculate training progress percentage
 */
export function calculateTrainingProgress(
  completedExercises: number,
  totalExercises: number,
  masteryLevel: "beginner" | "intermediate" | "advanced" = "beginner"
): { percentage: number; level: string } {
  if (totalExercises === 0) {
    return { percentage: 0, level: "Not started" };
  }

  const basePercentage = (completedExercises / totalExercises) * 100;

  const masteryMultiplier = {
    beginner: 1.0,
    intermediate: 0.8,
    advanced: 0.6,
  };

  const adjustedPercentage = basePercentage * masteryMultiplier[masteryLevel];

  let level = "Beginner";
  if (adjustedPercentage >= 80) level = "Advanced";
  else if (adjustedPercentage >= 50) level = "Intermediate";

  return {
    percentage: Math.round(adjustedPercentage),
    level,
  };
}

function getBreedBaseWeight(breed: string): number {
  const breedWeights: Record<string, number> = {
    golden_retriever: 30,
    labrador: 30,
    german_shepherd: 35,
    french_bulldog: 12,
    poodle: 20,
    beagle: 15,
    rottweiler: 45,
    yorkshire_terrier: 3,
    chihuahua: 2,
    bulldog: 25,
  };

  return breedWeights[breed.toLowerCase()] || 20; // Default to 20kg
}

function getGrowthFactor(breed: string, ageInWeeks: number): number {
  if (ageInWeeks < 8) return 0.1;
  if (ageInWeeks < 16) return 0.3;
  if (ageInWeeks < 24) return 0.6;
  if (ageInWeeks < 52) return 0.9;
  return 1.0;
}
