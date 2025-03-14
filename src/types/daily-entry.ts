// Base section props interface
export type SectionProps<T> = {
  data: T;
  onChange: (data: T) => void;
  onNext: () => void;
  onBack?: () => void;
  isLastStep: boolean;
  isSubmitting?: boolean;
  isQuickEntry?: boolean;
}

// Mood section data
export type MoodData = {
  rating: number;
  notes?: string;
}

// Sleep section data
export type SleepData = {
  hours: number;
  quality: number;
}

// Exercise section data
export type ExerciseData = {
  didExercise: "yes" | "no";
  type?: string;
  duration?: number;
}

// Diet section data
export type DietData = {
  rating: number;
  foodChoices: string[];
  waterIntake: "less-than-1l" | "1l-1.5l" | "1.5l-2l" | "2l-plus";
}

export const defaultDietData: DietData = {
  rating: 5,
  foodChoices: [],
  waterIntake: "less-than-1l"
}

// Complete daily entry data
export type DailyEntryData = {
  mood: MoodData;
  sleep: SleepData | null;
  exercise: ExerciseData | null;
  diet: DietData | null;
  date: Date;
} 