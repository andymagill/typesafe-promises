import { lessons } from '../data/lessons';
import { BookOpen, Award, ArrowRight, RotateCcw } from 'lucide-react';
import { Footer } from './Footer';
import { UserProgress } from '../types';

interface HomeSlideProps {
  progress: UserProgress;
  onSelectLesson: (lessonId: string) => void;
  onStartQuiz: () => void;
  onResetProgress: () => void;
}

export function HomeSlide({
  progress,
  onSelectLesson,
  onStartQuiz,
  onResetProgress,
}: HomeSlideProps) {
  const lastQuizAttempt = progress.quizAttempts[progress.quizAttempts.length - 1];
  
  // Guard against empty lessons array
  const completionPercentage = lessons.length > 0
    ? Math.round((progress.completedLessons.length / lessons.length) * 100)
    : 0;

  // Pre-compute Set for O(1) lookups instead of O(n) Array.includes()
  const completedSet = new Set(progress.completedLessons);

  return (
    <div className="h-full overflow-y-auto">
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-6xl mx-auto px-8">
          <h1 className="text-5xl font-bold mb-4 animate-slideInRight">
            Mastering Type-Safe Promises in TypeScript
          </h1>
          <p className="text-xl text-blue-100 mb-8 animate-slideInRight" style={{ animationDelay: '0.1s' }}>
            Master Promise states, generics, error handling, and advanced composition patterns
          </p>

          {lastQuizAttempt && (
            <div className="bg-blue-500 bg-opacity-30 rounded-lg p-6 backdrop-blur-sm animate-slideInRight" style={{ animationDelay: '0.2s' }}>
              <p className="text-sm text-blue-100 mb-2">Last Quiz Performance</p>
              <p className="text-3xl font-bold">
                {lastQuizAttempt.proficiency}% Proficiency
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 xs:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-blue-600 animate-slideInLeft">
            <BookOpen size={32} className="text-blue-600 mb-4" />
            <p className="text-3xl font-bold text-gray-900">{progress.completedLessons.length}</p>
            <p className="text-gray-600 text-sm mt-2">Lessons Completed</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-green-600 animate-slideInLeft" style={{ animationDelay: '0.1s' }}>
            <Award size={32} className="text-green-600 mb-4" />
            <p className="text-3xl font-bold text-gray-900">{progress.quizAttempts.length}</p>
            <p className="text-gray-600 text-sm mt-2">Quizzes Taken</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-purple-600 animate-slideInLeft" style={{ animationDelay: '0.2s' }}>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Overall Progress</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
            <p className="text-gray-900 font-semibold">{completionPercentage}% Complete</p>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Lessons</h2>
            {progress.completedLessons.length > 0 && (
              <button
                onClick={onResetProgress}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <RotateCcw size={16} />
                Reset Progress
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 gap-6">
            {lessons.map(lesson => {
              const isCompleted = completedSet.has(lesson.id);
              const isUnlocked = lesson.prerequisites.every(p => completedSet.has(p));
              return (
                <button
                  key={lesson.id}
                  onClick={() => onSelectLesson(lesson.id)}
                  className={`p-6 rounded-lg border-2 text-left transition-all hover:shadow-lg ${
                    isCompleted
                      ? 'border-green-200 bg-green-50'
                      : isUnlocked
                        ? 'border-blue-200 bg-white hover:border-blue-400'
                        : 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                  } animate-fadeIn`}
                  disabled={!isUnlocked}
                  title={!isUnlocked ? 'Complete prerequisites to unlock' : undefined}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                        {lesson.difficulty}
                      </p>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{lesson.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{lesson.description}</p>
                      <p className="text-xs text-gray-500">
                        {lesson.estimatedTimeMinutes} min read
                      </p>
                    </div>
                    {isCompleted && (
                      <div className="ml-4 px-3 py-1 rounded-full bg-green-200 text-green-800 text-xs font-semibold whitespace-nowrap">
                        Complete
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={onStartQuiz}
          className="w-full py-4 px-6 rounded-lg bg-gradient-to-r from-green-600 to-green-700 text-white text-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 mb-8 animate-slideInRight"
        >
          <Award size={24} />
          Start Quiz
          <ArrowRight size={20} />
        </button>
      </div>

      <Footer />
    </div>
  );
}
