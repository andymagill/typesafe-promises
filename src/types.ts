/**
 * Proficiency level thresholds for quiz scoring (percentage-based)
 */
export const PROFICIENCY_THRESHOLDS = {
  EXPERT: 90,
  ADVANCED: 75,
  INTERMEDIATE: 60,
  BEGINNER: 40,
} as const;

/**
 * Number of questions per quiz session
 */
export const QUIZ_QUESTION_COUNT = 5;

export enum Difficulty {
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Advanced = 'advanced',
}

export interface CodeExercise {
  id: string;
  initialCode: string;
  blanks: Array<{ id: string; line: number; column: number; expectedType: string }>;
  hint: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  prerequisites: string[];
  sections: Array<{
    id: string;
    title: string;
    content: string;
    codeExample?: string;
    exercise?: CodeExercise;
  }>;
  /** Estimated time to complete lesson in minutes */
  estimatedTimeMinutes: number;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
  relatedLesson?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  difficulty: Difficulty;
  relatedLessonId: string;
  commonMistake: string;
  explanation: string;
}

export interface UserProgress {
  completedLessons: string[];
  completedExercises: string[];
  quizAttempts: QuizAttempt[];
  currentSlide: number;
}

export interface QuizAttempt {
  id: string;
  questionsAnswered: Array<{
    questionId: string;
    selectedOptionId: string;
    isCorrect: boolean;
  }>;
  score: number;
  proficiency: number;
  timestamp: number;
  selectedQuestions: string[];
}

/** Type of slide component to render */
export type SlideType = 'home' | 'lesson' | 'quiz' | 'results';

export interface Slide {
  id: string;
  type: SlideType;
  contentId: string;
  title: string;
}
