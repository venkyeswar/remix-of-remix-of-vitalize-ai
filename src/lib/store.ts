import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Gender = "male" | "female" | "other";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "very" | "athlete";
export type DietType = "vegetarian" | "vegan" | "eggetarian" | "non-veg";
export type Goal = "weight-loss" | "weight-gain" | "muscle-gain" | "fat-loss" | "maintenance";
export type Budget = "budget" | "moderate" | "premium";
export type Workout = "gym" | "home" | "none";

export interface OnboardingData {
  fullName: string;
  age: number | null;
  gender: Gender | null;
  email: string;
  heightCm: number | null;
  weightKg: number | null;
  targetWeightKg: number | null;
  activity: ActivityLevel | null;
  dietType: DietType | null;
  allergies: string[];
  preferred: string[];
  disliked: string[];
  budget: Budget | null;
  goal: Goal | null;
  workout: Workout | null;
}

const emptyOnboarding: OnboardingData = {
  fullName: "",
  age: null,
  gender: null,
  email: "",
  heightCm: null,
  weightKg: null,
  targetWeightKg: null,
  activity: null,
  dietType: null,
  allergies: [],
  preferred: [],
  disliked: [],
  budget: null,
  goal: null,
  workout: null,
};

interface UserStore {
  isLoggedIn: boolean;
  user: { name: string; email: string; avatar: string | null };
  login: (email: string) => void;
  logout: () => void;
  updateUser: (u: Partial<{ name: string; email: string; avatar: string | null }>) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: { name: "Alex Morgan", email: "alex@northform.app", avatar: null },
      login: (email) =>
        set((s) => ({ isLoggedIn: true, user: { ...s.user, email, name: s.user.name || email.split("@")[0] } })),
      logout: () => set({ isLoggedIn: false }),
      updateUser: (u) => set((s) => ({ user: { ...s.user, ...u } })),
    }),
    { name: "northform-user" }
  )
);

interface OnboardingStore {
  step: number;
  data: OnboardingData;
  isComplete: boolean;
  setStep: (n: number) => void;
  next: () => void;
  prev: () => void;
  patch: (d: Partial<OnboardingData>) => void;
  complete: () => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      step: 0,
      data: emptyOnboarding,
      isComplete: false,
      setStep: (n) => set({ step: n }),
      next: () => set((s) => ({ step: Math.min(7, s.step + 1) })),
      prev: () => set((s) => ({ step: Math.max(0, s.step - 1) })),
      patch: (d) => set((s) => ({ data: { ...s.data, ...d } })),
      complete: () => set({ isComplete: true }),
      reset: () => set({ step: 0, data: emptyOnboarding, isComplete: false }),
    }),
    { name: "northform-onboarding" }
  )
);

export interface DayLog {
  date: string;             // yyyy-mm-dd
  meals: Record<string, boolean>;   // mealKey -> done
  waterMl: number;
  workoutDone: boolean;
}

interface DietStore {
  selectedPlanId: string;
  weightLog: { date: string; kg: number }[];
  logs: Record<string, DayLog>;     // by date
  selectPlan: (id: string) => void;
  logWeight: (kg: number) => void;
  toggleMeal: (date: string, mealKey: string) => void;
  addWater: (date: string, ml: number) => void;
  toggleWorkout: (date: string) => void;
  ensureDay: (date: string) => void;
}

const todayStr = () => new Date().toISOString().slice(0, 10);

const seedWeights = () => {
  const out: { date: string; kg: number }[] = [];
  const start = 82;
  for (let i = 7; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i * 7);
    out.push({ date: d.toISOString().slice(0, 10), kg: +(start - (7 - i) * 0.6).toFixed(1) });
  }
  return out;
};

const blankDay = (date: string): DayLog => ({ date, meals: {}, waterMl: 0, workoutDone: false });

export const useDietStore = create<DietStore>()(
  persist(
    (set, get) => ({
      selectedPlanId: "plan-a",
      weightLog: seedWeights(),
      logs: { [todayStr()]: blankDay(todayStr()) },
      selectPlan: (id) => set({ selectedPlanId: id }),
      logWeight: (kg) =>
        set((s) => ({
          weightLog: [...s.weightLog, { date: todayStr(), kg }],
        })),
      ensureDay: (date) => {
        if (!get().logs[date]) {
          set((s) => ({ logs: { ...s.logs, [date]: blankDay(date) } }));
        }
      },
      toggleMeal: (date, mealKey) =>
        set((s) => {
          const day = s.logs[date] ?? blankDay(date);
          return { logs: { ...s.logs, [date]: { ...day, meals: { ...day.meals, [mealKey]: !day.meals[mealKey] } } } };
        }),
      addWater: (date, ml) =>
        set((s) => {
          const day = s.logs[date] ?? blankDay(date);
          return { logs: { ...s.logs, [date]: { ...day, waterMl: Math.max(0, day.waterMl + ml) } } };
        }),
      toggleWorkout: (date) =>
        set((s) => {
          const day = s.logs[date] ?? blankDay(date);
          return { logs: { ...s.logs, [date]: { ...day, workoutDone: !day.workoutDone } } };
        }),
    }),
    { name: "northform-diet-v2" }
  )
);

interface ThemeStore {
  isDark: boolean;
  toggle: () => void;
  set: (v: boolean) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      isDark: true,
      toggle: () => set((s) => ({ isDark: !s.isDark })),
      set: (v) => set({ isDark: v }),
    }),
    { name: "northform-theme" }
  )
);
