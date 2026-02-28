import React, { useState } from 'react';
import { quizQuestions } from '../data/quizQuestions';
import { QuizQuestion } from '../types';

interface QuizSlideProps {
  questionIds: string[];
  onComplete: (results: Array<{ questionId: string; selectedOptionId: string }>) => void;
}

export function QuizSlide({ questionIds, onComplete }: QuizSlideProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, string>>(new Map());
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestionId = questionIds[currentIndex];
  const question = quizQuestions.find(q => q.id === currentQuestionId);
  const selectedOptionId = answers.get(currentQuestionId);

  if (!question) return null;

  const handleSelectOption = (optionId: string) => {
    setAnswers(new Map(answers).set(currentQuestionId, optionId));
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
      const results = questionIds.map(qId => ({
        questionId: qId,
        selectedOptionId: answers.get(qId) || '',
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
          {question.options.map(option => (
            <button
              key={option.id}
              onClick={() => !showExplanation && handleSelectOption(option.id)}
              disabled={showExplanation}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                selectedOptionId === option.id
                  ? isCorrect && showExplanation
                    ? 'border-green-500 bg-green-50'
                    : !isCorrect && showExplanation
                      ? 'border-red-500 bg-red-50'
                      : 'border-blue-500 bg-blue-50'
                  : showExplanation && option.isCorrect
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <p className="font-medium text-gray-900">{option.text}</p>
              {selectedOptionId === option.id && showExplanation && (
                <p className="text-sm mt-2 text-gray-700">{option.explanation}</p>
              )}
            </button>
          ))}
        </div>

        {showExplanation && (
          <div
            className={`p-6 rounded-lg mb-8 animate-fadeIn ${
              isCorrect
                ? 'bg-green-50 border-2 border-green-200'
                : 'bg-red-50 border-2 border-red-200'
            }`}
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
