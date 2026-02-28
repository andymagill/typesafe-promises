import { lessons } from '../data/lessons';
import { quizQuestions } from '../data/quizQuestions';

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getRandomLessons(): string[] {
  const allLessonIds = lessons.map(l => l.id);

  const ordered: string[] = [];
  const remaining = new Set(allLessonIds);

  while (remaining.size > 0) {
    const available = Array.from(remaining).filter(id => {
      const lesson = lessons.find(l => l.id === id);
      return lesson?.prerequisites.every(prereq => ordered.includes(prereq)) ?? false;
    });

    if (available.length === 0) {
      remaining.forEach(id => ordered.push(id));
      break;
    }

    const shuffled = shuffleArray(available);
    shuffled.forEach(id => {
      ordered.push(id);
      remaining.delete(id);
    });
  }

  return ordered;
}

export function getRandomQuizQuestions(count: number = 5): string[] {
  const allQuestionIds = quizQuestions.map(q => q.id);
  const shuffled = shuffleArray(allQuestionIds);
  return shuffled.slice(0, count);
}

export function calculateProficiency(correctCount: number, totalCount: number): number {
  return Math.round((correctCount / totalCount) * 100);
}

export function getProficiencyLevel(proficiency: number): string {
  if (proficiency >= 90) return 'Expert';
  if (proficiency >= 75) return 'Advanced';
  if (proficiency >= 60) return 'Intermediate';
  if (proficiency >= 40) return 'Beginner';
  return 'Novice';
}
