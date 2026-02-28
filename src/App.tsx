import React, { useState, useEffect } from 'react';
import { HomeSlide } from './components/HomeSlide';
import { LessonSlide } from './components/LessonSlide';
import { QuizSlide } from './components/QuizSlide';
import { ResultsSlide } from './components/ResultsSlide';
import { SlideContainer } from './components/SlideContainer';
import { SlideNavigation } from './components/SlideNavigation';
import { UserProgress, SlideType } from './types';
import {
  getProgress,
  saveProgress,
  completeLesson,
  addQuizAttempt,
  resetProgress,
} from './utils/storage';
import { getRandomQuizQuestions, calculateProficiency } from './utils/randomization';

interface Slide {
  id: string;
  type: SlideType;
  contentId: string;
  title: string;
}

function App() {
  const [progress, setProgress] = useState<UserProgress>(getProgress());
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quizResults, setQuizResults] = useState<Array<{
    questionId: string;
    selectedOptionId: string;
  }> | null>(null);

  useEffect(() => {
    const initialSlides: Slide[] = [
      {
        id: 'home',
        type: 'home',
        contentId: 'home',
        title: 'Home',
      },
    ];
    setSlides(initialSlides);
  }, []);

  const handleSelectLesson = (lessonId: string) => {
    setSlides(current => [
      ...current,
      {
        id: `lesson-${lessonId}`,
        type: 'lesson',
        contentId: lessonId,
        title: 'Lesson',
      },
    ]);
    setCurrentSlide(slides.length);
  };

  const handleCompleteLesson = (lessonId: string) => {
    const updated = completeLesson(lessonId);
    setProgress(updated);
    handleNext();
  };

  const handleStartQuiz = () => {
    const questionIds = getRandomQuizQuestions(5);
    setSlides(current => [
      ...current,
      {
        id: `quiz-${Date.now()}`,
        type: 'quiz',
        contentId: questionIds.join(','),
        title: 'Quiz',
      },
    ]);
    setCurrentSlide(slides.length);
  };

  const handleCompleteQuiz = (results: Array<{ questionId: string; selectedOptionId: string }>) => {
    const correctCount = results.reduce((acc, result) => {
      const question = require('./data/quizQuestions').quizQuestions.find(
        (q: any) => q.id === result.questionId
      );
      const selectedOption = question?.options.find(
        (o: any) => o.id === result.selectedOptionId
      );
      return acc + (selectedOption?.isCorrect ? 1 : 0);
    }, 0);

    const proficiency = calculateProficiency(correctCount, results.length);
    const attemptId = `attempt-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const attempt = {
      id: attemptId,
      questionsAnswered: results.map(r => {
        const question = require('./data/quizQuestions').quizQuestions.find(
          (q: any) => q.id === r.questionId
        );
        const selectedOption = question?.options.find((o: any) => o.id === r.selectedOptionId);
        return {
          questionId: r.questionId,
          selectedOptionId: r.selectedOptionId,
          isCorrect: selectedOption?.isCorrect ?? false,
        };
      }),
      score: correctCount,
      proficiency,
      timestamp: Date.now(),
      selectedQuestions: results.map(r => r.questionId),
    };

    const updated = addQuizAttempt(attempt);
    setProgress(updated);
    setQuizResults(results);

    setSlides(current => [
      ...current,
      {
        id: `results-${Date.now()}`,
        type: 'results',
        contentId: attemptId,
        title: 'Results',
      },
    ]);
    setCurrentSlide(slides.length);
  };

  const handleRetakeQuiz = () => {
    setQuizResults(null);
    handleStartQuiz();
  };

  const handleBackHome = () => {
    setCurrentSlide(0);
    setQuizResults(null);
  };

  const handleResetProgress = () => {
    resetProgress();
    setProgress(getProgress());
    setCurrentSlide(0);
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const slide = slides[currentSlide];
  const canNext = currentSlide < slides.length - 1;
  const canPrevious = currentSlide > 0;

  if (!slide) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-white overflow-hidden">
      <SlideContainer isVisible={slide.type === 'home'}>
        <HomeSlide
          progress={progress}
          onSelectLesson={handleSelectLesson}
          onStartQuiz={handleStartQuiz}
          onResetProgress={handleResetProgress}
        />
      </SlideContainer>

      <SlideContainer isVisible={slide.type === 'lesson'}>
        <LessonSlide lessonId={slide.contentId} onComplete={handleCompleteLesson} />
      </SlideContainer>

      <SlideContainer isVisible={slide.type === 'quiz'}>
        <QuizSlide
          questionIds={slide.contentId.split(',')}
          onComplete={handleCompleteQuiz}
        />
      </SlideContainer>

      <SlideContainer isVisible={slide.type === 'results'}>
        {quizResults && (
          <ResultsSlide
            results={quizResults}
            onRetakeQuiz={handleRetakeQuiz}
            onBackHome={handleBackHome}
          />
        )}
      </SlideContainer>

      <SlideNavigation
        currentSlide={currentSlide}
        totalSlides={slides.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
        canPrevious={canPrevious}
        canNext={canNext}
      />
    </div>
  );
}

export default App;
