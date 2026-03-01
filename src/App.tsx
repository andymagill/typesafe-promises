import { useState } from 'react';
import { HomeSlide } from './components/HomeSlide';
import { LessonSlide } from './components/LessonSlide';
import { QuizSlide } from './components/QuizSlide';
import { ResultsSlide } from './components/ResultsSlide';
import { SlideNavigation } from './components/SlideNavigation';
import { UserProgress, Slide, SlideType, QUIZ_QUESTION_COUNT } from './types';
import {
  getProgress,
  completeLesson,
  addQuizAttempt,
  resetProgress,
} from './utils/storage';
import { getRandomQuizQuestions, calculateProficiency } from './utils/randomization';
import { quizQuestions } from './data/quizQuestions';

function App() {
  const [progress, setProgress] = useState<UserProgress>(getProgress());
  const [slides, setSlides] = useState<Slide[]>([
    {
      id: 'home',
      type: 'home',
      contentId: 'home',
      title: 'Home',
    },
  ]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quizResults, setQuizResults] = useState<Array<{
    questionId: string;
    selectedOptionId: string;
  }> | null>(null);

  const handleSelectLesson = (lessonId: string) => {
    const newSlides = [
      ...slides,
      {
        id: `lesson-${lessonId}`,
        type: 'lesson' as SlideType,
        contentId: lessonId,
        title: 'Lesson',
      },
    ];
    setSlides(newSlides);
    setCurrentSlide(newSlides.length - 1);
  };

  const handleCompleteLesson = (lessonId: string) => {
    const updated = completeLesson(lessonId);
    setProgress(updated);
    handleNext();
  };

  const handleStartQuiz = () => {
    const questionIds = getRandomQuizQuestions(QUIZ_QUESTION_COUNT);
    const newSlides = [
      ...slides,
      {
        id: `quiz-${Date.now()}`,
        type: 'quiz' as SlideType,
        contentId: questionIds.join(','),
        title: 'Quiz',
      },
    ];
    setSlides(newSlides);
    setCurrentSlide(newSlides.length - 1);
  };

  const handleCompleteQuiz = (results: Array<{ questionId: string; selectedOptionId: string }>) => {
    // Single pass: compute correctCount and questionsAnswered together
    const optionMap = new Map(
      quizQuestions.flatMap(q => q.options.map(o => [o.id, o]))
    );

    let correctCount = 0;
    const questionsAnswered = results.map(r => {
      const selectedOption = optionMap.get(r.selectedOptionId);
      const isCorrect = selectedOption?.isCorrect ?? false;
      if (isCorrect) correctCount++;
      return {
        questionId: r.questionId,
        selectedOptionId: r.selectedOptionId,
        isCorrect,
      };
    });

    const proficiency = calculateProficiency(correctCount, results.length);
    const attemptId = `attempt-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const attempt = {
      id: attemptId,
      questionsAnswered,
      score: correctCount,
      proficiency,
      timestamp: Date.now(),
      selectedQuestions: results.map(r => r.questionId),
    };

    const updated = addQuizAttempt(attempt);
    setProgress(updated);
    setQuizResults(results);

    const newSlides = [
      ...slides,
      {
        id: `results-${Date.now()}`,
        type: 'results' as SlideType,
        contentId: attemptId,
        title: 'Results',
      },
    ];
    setSlides(newSlides);
    setCurrentSlide(newSlides.length - 1);
  };

  const handleRetakeQuiz = () => {
    setQuizResults(null);
    handleStartQuiz();
  };

  const handleBackHome = () => {
    // Reset to home slide only (bounded slides array)
    setSlides([
      {
        id: 'home',
        type: 'home',
        contentId: 'home',
        title: 'Home',
      },
    ]);
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
      {slide.type === 'home' && (
        <div className="absolute inset-0 animate-fadeIn">
          <HomeSlide
            progress={progress}
            onSelectLesson={handleSelectLesson}
            onStartQuiz={handleStartQuiz}
            onResetProgress={handleResetProgress}
          />
        </div>
      )}

      {slide.type === 'lesson' && (
        <div className="absolute inset-0 animate-fadeIn">
          <LessonSlide lessonId={slide.contentId} onComplete={handleCompleteLesson} />
        </div>
      )}

      {slide.type === 'quiz' && (
        <div className="absolute inset-0 animate-fadeIn">
          <QuizSlide
            questionIds={slide.contentId.split(',')}
            onComplete={handleCompleteQuiz}
          />
        </div>
      )}

      {slide.type === 'results' && quizResults && (
        <div className="absolute inset-0 animate-fadeIn">
          <ResultsSlide
            results={quizResults}
            onRetakeQuiz={handleRetakeQuiz}
            onBackHome={handleBackHome}
          />
        </div>
      )}

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
