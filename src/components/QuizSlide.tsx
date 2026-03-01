import { useState, useMemo } from 'react';
import { quizQuestions } from '../data/quizQuestions';

interface QuizSlideProps {
  questionIds: string[];
  onComplete: (results: Array<{ questionId: string; selectedOptionId: string }>) => void;
}

/**
 * Determines CSS classes for option button based on answer state
 */
function getOptionClassName(
  optionId: string,
  selectedOptionId: string | undefined,
  showExplanation: boolean,
  isCorrect: boolean
): string {
  if (selectedOptionId === optionId) {
    if (isCorrect && showExplanation) return 'border-green-500 bg-green-50';
    if (!isCorrect && showExplanation) return 'border-red-500 bg-red-50';
    return 'border-blue-500 bg-blue-50';
  }
  if (showExplanation && isCorrect) return 'border-green-500 bg-green-50';
  return 'border-gray-200 bg-white hover:border-gray-300';
}

export function QuizSlide({ questionIds, onComplete }: QuizSlideProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestionId = questionIds[currentIndex];
  const question = useMemo(
    () => quizQuestions.find(q => q.id === currentQuestionId),
    [currentQuestionId]
  );
  const selectedOptionId = answers[currentQuestionId];

  if (!question) return null;

  const handleSelectOption = (optionId: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestionId]: optionId }));
    setShowExplanation(false);
  };

  const handleSubmitAnswer = () => {
    if (selectedOptionId) {
      setShowExplanation(true);
    }
  };

  const handleNext = () => {
    if (currentIndex < questionIds.length - 1) {
      setCurrentIndex(i => i + 1);
      setShowExplanation(false);
    } else {
      // Validate all questions have answers before completing
      const allAnswered = questionIds.every(qId => answers[qId]);
      if (!allAnswered) {
        alert('Please answer all questions before submitting.');
        return;
      }
      const results = questionIds.map(qId => ({
        questionId: qId,
        selectedOptionId: answers[qId],
      }));
      onComplete(results);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
      setShowExplanation(false);
    }
  };

  const isAnswered = selectedOptionId !== undefined;
  const selectedOption = question.options.find(o => o.id === selectedOptionId);
  const isCorrect = selectedOption?.isCorrect ?? false;

  return (
    <div className="h-full overflow-y-auto pb-32">
      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="mb-8">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
            Quiz Question
          </span>
          <p className="text-sm text-gray-500 mt-2">
            {currentIndex + 1} / {questionIds.length}
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 mb-8 animate-fadeIn">
          <h2 className="text-2xl font-bold text-gray-900">{question.question}</h2>
          <p className="text-sm text-gray-600 mt-4">
            Difficulty: <span className="font-semibold capitalize">{question.difficulty}</span>
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {question.options.map(option => {
            const isCorrect = option.isCorrect;
            return (
              <button
                key={option.id}
                onClick={() => !showExplanation && handleSelectOption(option.id)}
                disabled={showExplanation}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  getOptionClassName(option.id, selectedOptionId, showExplanation, isCorrect)
                }`}
              >
                <p className="font-medium text-gray-900">{option.text}</p>
                {selectedOptionId === option.id && showExplanation && (
                  <p className="text-sm mt-2 text-gray-700">{option.explanation}</p>
                )}
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div
            className={`p-6 rounded-lg mb-8 animate-fadeIn ${
              isCorrect
                ? 'bg-green-50 border-2 border-green-200'
                : 'bg-red-50 border-2 border-red-200'
            }`}
            role="alert"
            aria-live="polite"
          >
            <p
              className={`font-semibold mb-2 ${
                isCorrect ? 'text-green-900' : 'text-red-900'
              }`}
            >
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </p>
            <p className="text-gray-700 text-sm">{question.explanation}</p>
            <p className="text-gray-600 text-sm mt-3">
              <span className="font-semibold">Common Mistake:</span> {question.commonMistake}
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="px-6 py-3 rounded-lg bg-gray-200 text-gray-900 disabled:opacity-50 hover:bg-gray-300 transition-colors font-medium"
          >
            Previous
          </button>

          {!showExplanation ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={!isAnswered}
              className="px-6 py-3 rounded-lg bg-blue-600 text-white disabled:opacity-50 hover:bg-blue-700 transition-colors font-medium ml-auto"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors font-medium ml-auto"
            >
              {currentIndex === questionIds.length - 1 ? 'See Results' : 'Next Question'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
