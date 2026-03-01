import { PROFICIENCY_THRESHOLDS, QUIZ_QUESTION_COUNT } from '../types';
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
