// TODO: Replace with API call to /api/diet-plans
export interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
}

export interface DietPlan {
  id: string;
  name: string;
  tag: string;
  totalCalories: number;
  meals: {
    breakfast: Meal;
    lunch: Meal;
    snack: Meal;
    dinner: Meal;
    evening_snack: Meal;
  };
}

export const staticDietPlans: DietPlan[] = [
  {
    id: "plan-a",
    name: "Clean & Simple",
    tag: "Balanced",
    totalCalories: 1800,
    meals: {
      breakfast: { name: "Oats with banana & almond milk", calories: 380, protein: 12, carbs: 65, fat: 8, time: "7:30 AM" },
      lunch: { name: "Grilled chicken with brown rice & veggies", calories: 520, protein: 42, carbs: 55, fat: 12, time: "1:00 PM" },
      snack: { name: "Greek yogurt with mixed berries", calories: 180, protein: 15, carbs: 22, fat: 3, time: "4:00 PM" },
      dinner: { name: "Paneer tikka with whole wheat roti & salad", calories: 480, protein: 28, carbs: 48, fat: 16, time: "7:30 PM" },
      evening_snack: { name: "A handful of mixed nuts", calories: 160, protein: 5, carbs: 8, fat: 14, time: "10:00 PM" },
    },
  },
  {
    id: "plan-b",
    name: "High Protein",
    tag: "Muscle Focus",
    totalCalories: 2100,
    meals: {
      breakfast: { name: "Egg white omelette with whole grain toast", calories: 420, protein: 32, carbs: 38, fat: 10, time: "7:00 AM" },
      lunch: { name: "Tuna salad with quinoa & olive oil dressing", calories: 580, protein: 48, carbs: 44, fat: 18, time: "12:30 PM" },
      snack: { name: "Whey protein shake + banana", calories: 240, protein: 28, carbs: 30, fat: 3, time: "3:30 PM" },
      dinner: { name: "Salmon fillet with roasted sweet potato", calories: 560, protein: 44, carbs: 50, fat: 14, time: "7:00 PM" },
      evening_snack: { name: "Cottage cheese with flaxseeds", calories: 180, protein: 20, carbs: 10, fat: 6, time: "9:30 PM" },
    },
  },
];

// TODO: Replace with API call to /api/quotes
export const motivationalQuotes = [
  "Discipline is choosing what you want most over what you want now.",
  "Small steps. Every single day.",
  "You don't have to be extreme. Just consistent.",
  "Your body hears everything your mind says.",
  "Strength is built in silence.",
];

// TODO: Replace with API call to /api/testimonials
export const testimonials = [
  { name: "Priya S.", goal: "Lost 12 kg in 5 months", quote: "The plan finally felt designed for my life — not a generic spreadsheet. Six months in and I'm still on it." },
  { name: "Daniel K.", goal: "Gained 6 kg lean mass", quote: "I tried every protein calculator. NorthForm gave me the first plan I actually understood and could cook." },
  { name: "Aisha R.", goal: "Cut body fat 18% → 14%", quote: "It reads like a friend who happens to be a dietician. The dashboard keeps me honest without nagging." },
];

// TODO: Replace with API call to /api/features
export const features = [
  { title: "Mifflin-St Jeor accuracy", desc: "Calories built on the formula nutritionists actually use — not a vibes-based guess.", icon: "calculator" },
  { title: "Cuisine-aware meals", desc: "Indian, Mediterranean, East Asian — your plan respects the food you grew up loving.", icon: "utensils" },
  { title: "Macro-balanced by goal", desc: "Protein, carbs and fat tuned to weight loss, muscle gain or maintenance.", icon: "donut" },
  { title: "Allergen-safe by default", desc: "Tell us once. Every meal we suggest works around it — quietly, every time.", icon: "shield" },
  { title: "Dashboard you'll re-open", desc: "Weight, streaks, macros and meals in one calm view. No popups, no upsells.", icon: "gauge" },
  { title: "Human consultation, on-demand", desc: "Want a registered dietitian to review your plan? One tap.", icon: "headset" },
];

// TODO: Replace with API call to /api/how-it-works
export const howItWorks = [
  { n: "01", title: "Answer 7 short questions", desc: "Body, lifestyle, taste, budget, goal. Two minutes, no fluff." },
  { n: "02", title: "Get a calibrated plan", desc: "Calories, macros and a real meal schedule — generated instantly." },
  { n: "03", title: "Track. Adjust. Transform.", desc: "Log weight weekly. Your dashboard shows what's actually moving." },
];

// TODO: Replace with API call to /api/social-proof
export const socialProof = [
  "10,000+ plans generated",
  "4.9★ average rating",
  "5,000 active users",
  "92% hit their first milestone",
  "Featured in Health Weekly",
  "Reviewed by RD nutritionists",
];
// ─────────────────────────────────────────────────────────
// 7-day plans + optional pre/post-workout meals
// ─────────────────────────────────────────────────────────

import type { DietType, Workout } from "./store";

export interface WeekMeal {
  key: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
  recipe?: string;
}

export interface WeekDay {
  day: string;             // Monday, Tuesday...
  totalCalories: number;
  meals: WeekMeal[];       // includes optional pre/post workout
}

export const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const VEG_DAYS: { breakfast: string; lunch: string; snack: string; dinner: string }[] = [
  { breakfast: "Masala oats with vegetables & curd", lunch: "Rajma chawal with cucumber salad", snack: "Roasted chana & green tea", dinner: "Palak paneer with 2 phulka" },
  { breakfast: "Vegetable poha with peanuts", lunch: "Chole with brown rice & raita", snack: "Apple with peanut butter", dinner: "Mixed dal khichdi with ghee & papad" },
  { breakfast: "Multigrain paratha with curd", lunch: "Quinoa pulao with paneer bhurji", snack: "Sprouts chaat", dinner: "Tofu tikka masala with 2 phulka" },
  { breakfast: "Greek yogurt parfait with granola & berries", lunch: "Dal tadka, jeera rice, mixed sabzi", snack: "Banana smoothie", dinner: "Vegetable biryani with raita" },
  { breakfast: "Idli with sambar & coconut chutney", lunch: "Paneer butter masala with 2 roti", snack: "Hummus with cucumber sticks", dinner: "Mushroom stir-fry with brown rice" },
  { breakfast: "Avocado toast with feta & seeds", lunch: "Stuffed paratha with curd & pickle", snack: "Trail mix & herbal tea", dinner: "Soya chunks curry with millet roti" },
  { breakfast: "Pancakes with banana & honey", lunch: "Veg thali — dal, sabzi, roti, rice", snack: "Coffee with dark chocolate square", dinner: "Vegetable soup with grilled cheese sandwich" },
];

const NONVEG_DAYS: { breakfast: string; lunch: string; snack: string; dinner: string }[] = [
  { breakfast: "Egg-white omelette with toast & avocado", lunch: "Grilled chicken with brown rice & salad", snack: "Boiled eggs & green tea", dinner: "Fish curry with 2 phulka" },
  { breakfast: "Scrambled eggs with spinach & toast", lunch: "Chicken biryani with raita", snack: "Tuna on cucumber slices", dinner: "Grilled prawns with quinoa pilaf" },
  { breakfast: "Greek yogurt with granola & berries", lunch: "Chicken caesar wrap", snack: "Whey shake & banana", dinner: "Lamb keema with 2 roti" },
  { breakfast: "Oats with whey & peanut butter", lunch: "Salmon, sweet potato, broccoli", snack: "Egg salad on rye", dinner: "Tandoori chicken with jeera rice" },
  { breakfast: "3-egg masala omelette with paratha", lunch: "Butter chicken with brown rice", snack: "Cottage cheese with flaxseeds", dinner: "Grilled fish tikka & roasted veg" },
  { breakfast: "Smoked salmon bagel with cream cheese", lunch: "Chicken tikka with naan & raita", snack: "Apple, almonds, boiled egg", dinner: "Beef stir-fry with rice noodles" },
  { breakfast: "Eggs benedict with smoked turkey", lunch: "Mutton curry with steamed rice", snack: "Greek yogurt with honey", dinner: "Chicken stew with crusty bread" },
];

const VEGAN_DAYS = VEG_DAYS.map(d => ({
  breakfast: d.breakfast.replace(/curd|paneer|yogurt|ghee|cheese|butter/gi, "tofu"),
  lunch: d.lunch.replace(/curd|paneer|raita|ghee|cheese/gi, "tofu"),
  snack: d.snack.replace(/yogurt|cheese/gi, "almond yogurt"),
  dinner: d.dinner.replace(/paneer|tofu|raita|ghee|cheese|butter/gi, "tofu"),
}));

const EGG_DAYS = VEG_DAYS.map((d, i) => ({
  ...d,
  breakfast: i % 2 === 0 ? "Egg bhurji with multigrain toast" : d.breakfast,
  snack: i % 3 === 0 ? "2 boiled eggs & green tea" : d.snack,
}));

function makeWeek(rows: typeof VEG_DAYS, workout: Workout, baseCal: number): WeekDay[] {
  return rows.map((r, i) => {
    const meals: WeekMeal[] = [];
    if (workout !== "none") {
      meals.push({
        key: "pre", name: workout === "gym" ? "Banana with black coffee" : "Apple slices with almond butter",
        calories: 180, protein: 4, carbs: 30, fat: 5, time: "6:30 AM",
      });
    }
    meals.push({ key: "breakfast", name: r.breakfast, calories: 380, protein: 16, carbs: 50, fat: 12, time: "8:00 AM" });
    if (workout !== "none") {
      meals.push({
        key: "post", name: workout === "gym" ? "Whey protein shake with oats" : "Greek yogurt with banana",
        calories: 260, protein: 28, carbs: 28, fat: 4, time: "9:30 AM",
      });
    }
    meals.push({ key: "lunch", name: r.lunch, calories: 540, protein: 32, carbs: 60, fat: 16, time: "1:00 PM" });
    meals.push({ key: "snack", name: r.snack, calories: 200, protein: 10, carbs: 22, fat: 7, time: "4:30 PM" });
    meals.push({ key: "dinner", name: r.dinner, calories: 480, protein: 28, carbs: 48, fat: 14, time: "7:30 PM" });
    const total = meals.reduce((s, m) => s + m.calories, 0);
    return { day: DAY_NAMES[i], totalCalories: total, meals };
  });
}

export function getWeeklyPlan(diet: DietType | null, workout: Workout | null): WeekDay[] {
  const w: Workout = workout ?? "none";
  switch (diet) {
    case "vegan": return makeWeek(VEGAN_DAYS, w, 1800);
    case "non-veg": return makeWeek(NONVEG_DAYS, w, 2000);
    case "eggetarian": return makeWeek(EGG_DAYS, w, 1900);
    case "vegetarian":
    default: return makeWeek(VEG_DAYS, w, 1850);
  }
}

export function todayName(): string {
  // Monday-first index
  const js = new Date().getDay(); // 0=Sun..6=Sat
  const idx = js === 0 ? 6 : js - 1;
  return DAY_NAMES[idx];
}
