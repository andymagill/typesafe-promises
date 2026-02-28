import { UserProgress, QuizAttempt } from '../types';

const PROGRESS_KEY = 'learn_typescript_progress';
const PREFERENCES_KEY = 'learn_typescript_preferences';

export interface UserPreferences {
  animationSpeed: 'slow' | 'normal' | 'fast';
  autoAdvance: boolean;
  darkMode: boolean;
}

const defaultProgress: UserProgress = {
  completedLessons: [],
  completedExercises: [],
  quizAttempts: [],
  currentSlide: 0,
};

const defaultPreferences: UserPreferences = {
  animationSpeed: 'normal',
  autoAdvance: false,
  darkMode: false,
};

export function getProgress(): UserProgress {
  if (typeof window === 'undefined') return defaultProgress;

  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    return stored ? JSON.parse(stored) : defaultProgress;
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    console.error('Failed to save progress');
  }
}

export function updateProgress(updates: Partial<UserProgress>): UserProgress {
  const current = getProgress();
  const updated = { ...current, ...updates };
  saveProgress(updated);
  return updated;
}

export function completeLesson(lessonId: string): UserProgress {
  const progress = getProgress();
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
    saveProgress(progress);
  }
  return progress;
}

export function completeExercise(exerciseId: string): UserProgress {
  const progress = getProgress();
  if (!progress.completedExercises.includes(exerciseId)) {
    progress.completedExercises.push(exerciseId);
    saveProgress(progress);
  }
  return progress;
}

export function addQuizAttempt(attempt: QuizAttempt): UserProgress {
  const progress = getProgress();
  progress.quizAttempts.push(attempt);
  saveProgress(progress);
  return progress;
}

export function getLastQuizAttempt(): QuizAttempt | null {
  const progress = getProgress();
  return progress.quizAttempts.length > 0
    ? progress.quizAttempts[progress.quizAttempts.length - 1]
    : null;
}

export function getPreferences(): UserPreferences {
  if (typeof window === 'undefined') return defaultPreferences;

  try {
    const stored = localStorage.getItem(PREFERENCES_KEY);
    return stored ? { ...defaultPreferences, ...JSON.parse(stored) } : defaultPreferences;
  } catch {
    return defaultPreferences;
  }
}

export function savePreferences(preferences: UserPreferences): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  } catch {
    console.error('Failed to save preferences');
  }
}

export function resetProgress(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(PROGRESS_KEY);
  } catch {
    console.error('Failed to reset progress');
  }
}
