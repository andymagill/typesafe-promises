import React from 'react';
import { quizQuestions } from '../data/quizQuestions';
import { lessons } from '../data/lessons';
import { calculateProficiency, getProficiencyLevel } from '../utils/randomization';
import { Award, ArrowRight, BookOpen } from 'lucide-react';

interface ResultsSlideProps {
  results: Array<{ questionId: string; selectedOptionId: string }>;
  onRetakeQuiz: () => void;
  onBackHome: () => void;
}

export function ResultsSlide({ results, onRetakeQuiz, onBackHome }: ResultsSlideProps) {
  const correctCount = results.reduce((acc, result) => {
    const question = quizQuestions.find(q => q.id === result.questionId);
    const selectedOption = question?.options.find(o => o.id === result.selectedOptionId);
    return acc + (selectedOption?.isCorrect ? 1 : 0);
  }, 0);

  const proficiency = calculateProficiency(correctCount, results.length);
  const level = getProficiencyLevel(proficiency);

  const incorrectResults = results.filter(result => {
    const question = quizQuestions.find(q => q.id === result.questionId);
    const selectedOption = question?.options.find(o => o.id === result.selectedOptionId);
    return !selectedOption?.isCorrect;
  });

  const recommendations = Array.from(new Set(
    incorrectResults
      .map(result => {
        const question = quizQuestions.find(q => q.id === result.questionId);
        return question?.relatedLessonId;
      })
      .filter(Boolean) as string[]
  )).map(lessonId => lessons.find(l => l.id === lessonId)).filter(Boolean);

  const scoreColor =
    proficiency >= 80 ? 'text-green-600' : proficiency >= 60 ? 'text-yellow-600' : 'text-red-600';
  const scoreBg =
    proficiency >= 80 ? 'bg-green-50' : proficiency >= 60 ? 'bg-yellow-50' : 'bg-red-50';

  return (
    <div className="h-full overflow-y-auto pb-32">
      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="text-center mb-12 animate-fadeIn">
          <Award className={`${scoreColor} mx-auto mb-4`} size={48} />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Quiz Complete!</h1>
          <p className="text-lg text-gray-600">
            You earned a proficiency level of <span className="font-semibold">{level}</span>
          </p>
        </div>

        <div className={`${scoreBg} rounded-lg p-8 mb-12 animate-scaleIn`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-600 text-sm font-semibold mb-2">YOUR SCORE</p>
              <p className={`${scoreColor} text-5xl font-bold`}>{proficiency}%</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600 text-sm font-semibold mb-2">ANSWERS</p>
              <p className="text-2xl font-bold text-gray-900">
                {correctCount} <span className="text-lg text-gray-600">/ {results.length}</span>
              </p>
            </div>
          </div>

          <div className="w-full bg-gray-300 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-1000 ${
                proficiency >= 80
                  ? 'bg-green-600'
                  : proficiency >= 60
                    ? 'bg-yellow-600'
                    : 'bg-red-600'
              }`}
              style={{ width: `${proficiency}%` }}
            />
          </div>
        </div>

        {recommendations.length > 0 && (
          <div className="mb-12 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BookOpen size={24} />
              Recommended Review
            </h2>
            <p className="text-gray-600 mb-6">
              Based on your answers, we recommend reviewing these concepts to strengthen your knowledge:
            </p>
            <div className="space-y-3">
              {recommendations.map(lesson => (
                <button
                  key={lesson?.id}
                  onClick={onBackHome}
                  className="w-full p-4 rounded-lg border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-blue-700">
                        {lesson?.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{lesson?.description}</p>
                    </div>
                    <ArrowRight
                      size={20}
                      className="text-blue-600 group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onRetakeQuiz}
            className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
          >
            Retake Quiz
          </button>
          <button
            onClick={onBackHome}
            className="px-6 py-3 rounded-lg bg-gray-200 text-gray-900 hover:bg-gray-300 transition-colors font-medium"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
