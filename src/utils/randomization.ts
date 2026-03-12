import { PROFICIENCY_THRESHOLDS, QUIZ_QUESTION_COUNT, Difficulty, UserProgress } from '../types';
import { quizQuestions } from '../data/quizQuestions';

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Returns an array of random quiz question IDs, shuffled and limited to specified count
 * @param count Number of questions to return (defaults to QUIZ_QUESTION_COUNT)
 * @returns Array of question IDs
 */
export function getRandomQuizQuestions(count: number = QUIZ_QUESTION_COUNT): string[] {
  const allQuestionIds = quizQuestions.map(q => q.id);
  const shuffled = shuffleArray(allQuestionIds);
  return shuffled.slice(0, count);
}

/**
 * Returns quiz questions filtered by user progress and difficulty level (adaptive selection)
 * @param userProgress User's progress including completed lessons and quiz attempts
 * @param count Number of questions to return (defaults to QUIZ_QUESTION_COUNT)
 * @returns Array of question IDs filtered by completed lessons
 */
export function getAdaptiveQuizQuestions(
  userProgress: UserProgress,
  count: number = QUIZ_QUESTION_COUNT
): string[] {
  // If user hasn't completed any lessons, start with beginner questions
  if (userProgress.completedLessons.length === 0) {
    const beginnerQuestions = quizQuestions
      .filter(q => q.difficulty === Difficulty.Beginner)
      .map(q => q.id);
    const shuffled = shuffleArray(beginnerQuestions);
    return shuffled.slice(0, count);
  }

  // Get questions related to completed lessons
  const completedLessonIds = new Set(userProgress.completedLessons);
  const relatedQuestions = quizQuestions.filter(q =>
    completedLessonIds.has(q.relatedLessonId)
  );

  // If we have enough related questions, use those
  if (relatedQuestions.length >= count) {
    const shuffled = shuffleArray(relatedQuestions.map(q => q.id));
    return shuffled.slice(0, count);
  }

  // Otherwise, mix in other questions (still try to stay relevant)
  const allQuestionsIds = quizQuestions.map(q => q.id);
  const shuffled = shuffleArray(allQuestionsIds);
  return shuffled.slice(0, count);
}

/**
 * Calculates proficiency percentage from quiz score
 * @param correctCount Number of correct answers
 * @param totalCount Total number of questions
 * @returns Proficiency percentage (0-100), or 0 if no questions
 */
export function calculateProficiency(correctCount: number, totalCount: number): number {
  if (totalCount === 0) return 0;
  return Math.round((correctCount / totalCount) * 100);
}

/**
 * Converts a proficiency percentage (0-100) into a descriptive skill level
 * @param proficiency Proficiency percentage
 * @returns Skill level name (Expert, Advanced, Intermediate, Beginner, or Novice)
 */
export function getProficiencyLevel(proficiency: number): string {
  if (proficiency >= PROFICIENCY_THRESHOLDS.EXPERT) return 'Expert';
  if (proficiency >= PROFICIENCY_THRESHOLDS.ADVANCED) return 'Advanced';
  if (proficiency >= PROFICIENCY_THRESHOLDS.INTERMEDIATE) return 'Intermediate';
  if (proficiency >= PROFICIENCY_THRESHOLDS.BEGINNER) return 'Beginner';
  return 'Novice';
}
