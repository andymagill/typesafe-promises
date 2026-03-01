import { UserProgress, QuizAttempt } from '../types';

const PROGRESS_KEY = 'learn_typescript_progress';

const defaultProgress: UserProgress = {
  completedLessons: [],
  completedExercises: [],
  quizAttempts: [],
  currentSlide: 0,
};

/**
 * Validates and migrates user progress data from storage to ensure compatibility
 * Handles schema evolution by filling in missing fields with defaults
 * @param stored Potentially incomplete or outdated progress object
 * @returns Valid UserProgress object with all required fields
 */
function migrateProgress(stored: unknown): UserProgress {
  if (!stored || typeof stored !== 'object') {
    return { ...defaultProgress };
  }

  const data = stored as Record<string, unknown>;

  // Ensure all required fields exist, using defaults for missing ones
  return {
    completedLessons: Array.isArray(data.completedLessons) ? data.completedLessons : [],
    completedExercises: Array.isArray(data.completedExercises) ? data.completedExercises : [],
    quizAttempts: Array.isArray(data.quizAttempts) ? (data.quizAttempts as QuizAttempt[]) : [],
    currentSlide: typeof data.currentSlide === 'number' && data.currentSlide >= 0
      ? data.currentSlide
      : 0,
  };
}

/**
 * Retrieves the current user progress from localStorage or returns defaults
 * Validates data integrity and handles schema migration transparently
 * @returns Valid current user progress object
 */
export function getProgress(): UserProgress {
  if (typeof window === 'undefined') return defaultProgress;

  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    if (!stored) return defaultProgress;

    const parsed = JSON.parse(stored);
    return migrateProgress(parsed);
  } catch (err) {
    console.error('[storage] Failed to parse progress from localStorage', err);
    return defaultProgress;
  }
}

/**
 * Persists user progress to localStorage
 * @param progress The progress object to save
 */
export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error('[storage] Failed to save progress', err);
  }
}

/**
 * Marks a lesson as completed and updates progress
 * @param lessonId The ID of the lesson to mark as completed
 * @returns Updated user progress
 */
export function completeLesson(lessonId: string): UserProgress {
  const progress = getProgress();
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons = [...progress.completedLessons, lessonId];
    saveProgress(progress);
  }
  return progress;
}

/**
 * Records a new quiz attempt in user progress
 * @param attempt The quiz attempt to record
 * @returns Updated user progress
 */
export function addQuizAttempt(attempt: QuizAttempt): UserProgress {
  const progress = getProgress();
  progress.quizAttempts = [...progress.quizAttempts, attempt];
  saveProgress(progress);
  return progress;
}

/**
 * Clears all user progress from localStorage
 */
export function resetProgress(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(PROGRESS_KEY);
  } catch (err) {
    console.error('[storage] Failed to reset progress', err);
  }
}
