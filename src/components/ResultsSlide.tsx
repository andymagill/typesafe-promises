import { quizQuestions } from '../data/quizQuestions';
import { lessons } from '../data/lessons';
import { calculateProficiency, getProficiencyLevel } from '../utils/randomization';
import { PROFICIENCY_THRESHOLDS } from '../types';
import { Award, AlertTriangle, BookOpen } from 'lucide-react';
import { CodeBlock } from './CodeBlock';

interface ResultsSlideProps {
  results: Array<{ questionId: string; selectedOptionId: string }>;
  onRetakeQuiz: () => void;
  onBackHome: () => void;
}

export function ResultsSlide({ results, onRetakeQuiz, onBackHome }: ResultsSlideProps) {
  // Pre-build lookup maps for O(1) access instead of O(n) searches
  const questionMap = new Map(quizQuestions.map(q => [q.id, q]));
  const optionMap = new Map(
    quizQuestions.flatMap(q => q.options.map(o => [o.id, o]))
  );
  const lessonMap = new Map(lessons.map(l => [l.id, l]));

  // Single pass to calculate score and track all question data
  let correctCount = 0;
  const questionResults: Array<{
    question: (typeof quizQuestions)[0];
    userAnswered: string;
    isCorrect: boolean;
  }> = [];
  const incorrectQuestionIds: string[] = [];

  results.forEach(result => {
    const question = questionMap.get(result.questionId);
    if (!question) return;

    const selectedOption = optionMap.get(result.selectedOptionId);
    const isCorrect = selectedOption?.isCorrect ?? false;

    questionResults.push({
      question,
      userAnswered: result.selectedOptionId,
      isCorrect,
    });

    if (isCorrect) {
      correctCount++;
    } else {
      incorrectQuestionIds.push(result.questionId);
    }
  });

  const proficiency = calculateProficiency(correctCount, results.length);
  const level = getProficiencyLevel(proficiency);

  // Get unique recommended lessons from incorrect answers
  const recommendedLessonIds = Array.from(
    new Set(
      incorrectQuestionIds
        .map(qId => questionMap.get(qId)?.relatedLessonId)
        .filter((id): id is string => id !== undefined)
    )
  );

  const scoreColor =
    proficiency >= PROFICIENCY_THRESHOLDS.ADVANCED
      ? 'text-green-600'
      : proficiency >= PROFICIENCY_THRESHOLDS.INTERMEDIATE
        ? 'text-yellow-600'
        : 'text-red-600';
  const scoreBg =
    proficiency >= PROFICIENCY_THRESHOLDS.ADVANCED
      ? 'bg-green-50'
      : proficiency >= PROFICIENCY_THRESHOLDS.INTERMEDIATE
        ? 'bg-yellow-50'
        : 'bg-red-50';

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Score Header */}
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
                proficiency >= PROFICIENCY_THRESHOLDS.ADVANCED
                  ? 'bg-green-600'
                  : proficiency >= PROFICIENCY_THRESHOLDS.INTERMEDIATE
                    ? 'bg-yellow-600'
                    : 'bg-red-600'
              }`}
              style={{ width: `${proficiency}%` }}
            />
          </div>
        </div>

        {/* Per-Question Breakdown */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BookOpen size={24} />
            Question Breakdown
          </h2>
          <div className="space-y-8">
            {questionResults.map((qResult, idx) => {
              const { question, userAnswered, isCorrect } = qResult;
              const userAnswer = optionMap.get(userAnswered);
              const correctOption = question.options.find(o => o.isCorrect);

              return (
                <div
                  key={`${question.id}-${idx}`}
                  className={`rounded-lg border-2 p-6 ${
                    isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}
                >
                  {/* Question Number and Text */}
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-600 mb-2">
                      Question {idx + 1} of {results.length}
                    </p>
                    <h3 className="text-lg font-bold text-gray-900">{question.question}</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      Difficulty: <span className="font-semibold capitalize">{question.difficulty}</span>
                    </p>
                  </div>

                  {/* Answer Status */}
                  <div className="mb-6">
                    <p
                      className={`font-semibold mb-2 ${
                        isCorrect ? 'text-green-900' : 'text-red-900'
                      }`}
                    >
                      {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </p>
                  </div>

                  {/* Options Display */}
                  <div className="space-y-2 mb-6">
                    {question.options.map(option => {
                      const isUserAnswer = option.id === userAnswered;
                      const isCorrectAnswer = option.isCorrect;

                      let bgColor = 'bg-white border-gray-200';
                      if (isUserAnswer && isCorrectAnswer) {
                        bgColor = 'bg-green-100 border-green-400';
                      } else if (isUserAnswer && !isCorrectAnswer) {
                        bgColor = 'bg-red-100 border-red-400';
                      } else if (isCorrectAnswer) {
                        bgColor = 'bg-green-100 border-green-400';
                      }

                      return (
                        <div
                          key={option.id}
                          className={`p-3 rounded border-2 ${bgColor}`}
                        >
                          <p className="text-gray-900 font-medium">{option.text}</p>
                          {isUserAnswer && !isCorrectAnswer && (
                            <p className="text-xs text-red-700 mt-1">Your answer</p>
                          )}
                          {isCorrectAnswer && (
                            <p className="text-xs text-green-700 mt-1">
                              {isUserAnswer ? 'Your answer (correct)' : 'Correct answer'}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  <div className="mb-6 p-4 bg-white rounded border border-gray-300">
                    <p className="text-sm font-semibold text-gray-900 mb-2">Explanation:</p>
                    <p className="text-gray-700 text-sm">{question.explanation}</p>
                  </div>

                  {/* Common Mistake - Only show if answer was wrong */}
                  {!isCorrect && (
                    <div className="flex gap-3 p-4 bg-yellow-100 border border-yellow-400 rounded">
                      <AlertTriangle size={20} className="text-yellow-700 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-yellow-900">Common Mistake:</p>
                        <p className="text-yellow-800 text-sm mt-1">{question.commonMistake}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Code Examples to Revisit */}
        {recommendedLessonIds.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BookOpen size={24} />
              Code Examples to Revisit
            </h2>
            <p className="text-gray-600 mb-6">
              Study these code examples from lessons related to your incorrect answers:
            </p>
            <div className="space-y-8">
              {recommendedLessonIds.map(lessonId => {
                const lesson = lessonMap.get(lessonId);
                if (!lesson) return null;

                // Find first section with code example
                const sectionWithCode = lesson.sections.find(s => s.codeExample);
                if (!sectionWithCode) return null;

                return (
                  <div key={lessonId} className="border-2 border-blue-200 rounded-lg p-6 bg-blue-50">
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-gray-900">{lesson.title}</h3>
                      <p className="text-sm text-gray-600 mt-2">{lesson.description}</p>
                      <p className="text-xs text-blue-600 font-semibold mt-3">
                        From lesson section: {sectionWithCode.title}
                      </p>
                    </div>
                    <CodeBlock
                      code={sectionWithCode.codeExample}
                      language="typescript"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-12">
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
