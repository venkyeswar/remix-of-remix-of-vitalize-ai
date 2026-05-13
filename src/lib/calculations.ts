import type { ActivityLevel, Gender, Goal, OnboardingData } from "./store";

const ACTIVITY: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
  athlete: 1.9,
};

const GOAL_DELTA: Record<Goal, number> = {
  "weight-loss": -500,
  "fat-loss": -300,
  maintenance: 0,
  "muscle-gain": 300,
  "weight-gain": 500,
};

export interface CalcResult {
  bmr: number;
  tdee: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  weeks: number;
  delta: number;
}

export function calculate(data: OnboardingData): CalcResult {
  const weight = data.weightKg ?? 70;
  const height = data.heightCm ?? 170;
  const age = data.age ?? 28;
  const gender: Gender = data.gender ?? "male";
  const activity = data.activity ?? "moderate";
  const goal = data.goal ?? "maintenance";
  const target = data.targetWeightKg ?? weight;

  const base = 10 * weight + 6.25 * height - 5 * age;
  const bmr = Math.round(gender === "female" ? base - 161 : gender === "male" ? base + 5 : base - 78);
  const tdee = Math.round(bmr * ACTIVITY[activity]);
  const calories = Math.max(1200, tdee + GOAL_DELTA[goal]);

  const protein = Math.round((calories * 0.3) / 4);
  const carbs = Math.round((calories * 0.45) / 4);
  const fat = Math.round((calories * 0.25) / 9);

  const delta = +(target - weight).toFixed(1);
  const weeks = Math.max(1, Math.round(Math.abs(delta) / 0.5));

  return { bmr, tdee, calories, protein, carbs, fat, weeks, delta };
}