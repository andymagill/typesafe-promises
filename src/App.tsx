import { useState, useEffect } from 'react';
import { HomeSlide } from './components/HomeSlide';
import { LessonSlide } from './components/LessonSlide';
import { QuizSlide } from './components/QuizSlide';
import { ResultsSlide } from './components/ResultsSlide';
import { UserProgress, Slide, SlideType, QUIZ_QUESTION_COUNT } from './types';
import {
  getProgress,
  completeLesson,
  addQuizAttempt,
  resetProgress,
} from './utils/storage';
import { getAdaptiveQuizQuestions, calculateProficiency } from './utils/randomization';
import { quizQuestions } from './data/quizQuestions';

/**
 * Main application component that manages the learning flow:
 * Home → Lesson → Quiz → Results
 * 
 * Handles navigation between slides, tracks user progress (lessons completed, quiz attempts),
 * and manages browser history for back/forward button support.
 */
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
  const [lessonSectionIndex, setLessonSectionIndex] = useState(0);
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
  const [quizResults, setQuizResults] = useState<Array<{
    questionId: string;
    selectedOptionId: string;
  }> | null>(null);

  // Initialize history on mount
  useEffect(() => {
    // Initialize with home state without changing URL
    window.history.replaceState(
      { currentSlide: 0, lessonSectionIndex: 0, quizQuestionIndex: 0 },
      '',
      window.location.pathname
    );

    const handlePopState = (event: PopStateEvent) => {
      const state = event.state as {
        currentSlide: number;
        lessonSectionIndex: number;
        quizQuestionIndex: number;
      } | null;
      if (state) {
        setCurrentSlide(state.currentSlide);
        setLessonSectionIndex(state.lessonSectionIndex);
        setQuizQuestionIndex(state.quizQuestionIndex);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  /**
   * Navigates to a lesson when user selects one from the home slide.
   * Creates a new lesson slide, resets the section index, and updates browser history.
   */
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
    setLessonSectionIndex(0);
    window.history.pushState(
      { currentSlide: newSlides.length - 1, lessonSectionIndex: 0, quizQuestionIndex: 0 },
      '',
      `#/lesson/${lessonId}/0`
    );
  };

  /**
   * Called when user completes a lesson by clicking "Complete Lesson" button.
   * Marks the lesson as completed in storage, then automatically navigates to a quiz.
   * Quiz questions are adaptively selected based on the completed lesson.
   */
  const handleCompleteLesson = (lessonId: string) => {
    const updated = completeLesson(lessonId);
    setProgress(updated);
    
    // Navigate to quiz with questions related to the completed lesson
    const questionIds = getAdaptiveQuizQuestions(updated, QUIZ_QUESTION_COUNT);
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
    setQuizQuestionIndex(0);
    window.history.pushState(
      { currentSlide: newSlides.length - 1, lessonSectionIndex: 0, quizQuestionIndex: 0 },
      '',
      '#/quiz/0'
    );
  };

  /**
   * Navigates to a quiz from the home slide.
   * Selects adaptive quiz questions based on user's completed lessons and progress.
   * Creates a new quiz slide and resets the question index.
   */
  const handleStartQuiz = () => {
    const questionIds = getAdaptiveQuizQuestions(progress, QUIZ_QUESTION_COUNT);
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
    setQuizQuestionIndex(0);
    window.history.pushState(
      { currentSlide: newSlides.length - 1, lessonSectionIndex: 0, quizQuestionIndex: 0 },
      '',
      '#/quiz/0'
    );
  };

  /**
   * Called when user completes the quiz by answering all questions.
   * Calculates proficiency score, records the attempt in storage, and navigates to results.
   * Maps selected option IDs to determine correct/incorrect answers.
   */
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
    window.history.pushState(
      { currentSlide: newSlides.length - 1, lessonSectionIndex: 0, quizQuestionIndex: 0 },
      '',
      '#/results'
    );
  };

  /**
   * Allows user to retake the quiz from the results slide.
   * Clears previous results and starts a new quiz with different adaptive questions.
   */
  const handleRetakeQuiz = () => {
    setQuizResults(null);
    handleStartQuiz();
  };

  /**
   * Resets the application to the home slide.
   * Clears all slides, progress, and quiz results, returning to initial state.
   */
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
    setLessonSectionIndex(0);
    setQuizQuestionIndex(0);
    setQuizResults(null);
    window.history.replaceState(
      { currentSlide: 0, lessonSectionIndex: 0, quizQuestionIndex: 0 },
      '',
      window.location.pathname
    );
  };

  /**
   * Clears all user progress from storage (completed lessons and quiz attempts).
   * Resets the application to the home slide with fresh state.
   */
  const handleResetProgress = () => {
    resetProgress();
    setProgress(getProgress());
    setCurrentSlide(0);
  };

  /**
   * Updates the current section when user navigates within a lesson.
   * Only updates if the current slide is a lesson slide.
   * Updates browser history to maintain back/forward navigation.
   */
  const handleLessonSectionChange = (newIndex: number) => {
    const slide = slides[currentSlide];
    if (slide.type === 'lesson') {
      setLessonSectionIndex(newIndex);
      window.history.pushState(
        { currentSlide, lessonSectionIndex: newIndex, quizQuestionIndex: 0 },
        '',
        `#/lesson/${slide.contentId}/${newIndex}`
      );
    }
  };

  /**
   * Updates the current quiz question index when user navigates within a quiz.
   * Updates browser history to maintain back/forward navigation.
   */
  const handleQuizQuestionChange = (newIndex: number) => {
    setQuizQuestionIndex(newIndex);
    window.history.pushState(
      { currentSlide, lessonSectionIndex: 0, quizQuestionIndex: newIndex },
      '',
      `#/quiz/${newIndex}`
    );
  };

  // Get the current slide to render based on the slide stack
  const slide = slides[currentSlide];

  if (!slide) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  // Render the current slide based on its type (home, lesson, quiz, or results)
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
          <LessonSlide
            lessonId={slide.contentId}
            currentSection={lessonSectionIndex}
            onSectionChange={handleLessonSectionChange}
            onComplete={handleCompleteLesson}
          />
        </div>
      )}

      {slide.type === 'quiz' && (
        <div className="absolute inset-0 animate-fadeIn">
          <QuizSlide
            questionIds={slide.contentId.split(',')}
            currentIndex={quizQuestionIndex}
            onIndexChange={handleQuizQuestionChange}
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
    </div>
  );
}

export default App;
