import { useMemo } from 'react';
import { CodeBlock } from './CodeBlock';
import { lessons } from '../data/lessons';

interface LessonSlideProps {
  lessonId: string;
  currentSection: number;
  onSectionChange: (index: number) => void;
  onComplete: (lessonId: string) => void;
}

export function LessonSlide({
  lessonId,
  currentSection,
  onSectionChange,
  onComplete,
}: LessonSlideProps) {
  // Memoize lesson lookup to avoid O(n) search on every render
  const lesson = useMemo(() => lessons.find(l => l.id === lessonId), [lessonId]);

  if (!lesson) {
    return (
      <div className="h-full flex items-center justify-center text-gray-600">
        <p>Lesson not found</p>
      </div>
    );
  }

  const section = lesson.sections[currentSection];
  const isLastSection = currentSection === lesson.sections.length - 1;

  const handleNext = () => {
    if (isLastSection) {
      onComplete(lessonId);
    } else {
      onSectionChange(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      onSectionChange(currentSection - 1);
    }
  };

  return (
    <div className="h-full overflow-y-auto pb-32">
      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="mb-8">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
            Lesson {lesson.id.replace(/-/g, ' ')}
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mt-2">{lesson.title}</h1>
          <p className="text-lg text-gray-600 mt-4">{lesson.description}</p>
        </div>

        <div className="mt-12 animate-fadeIn">
          <div className="mb-8 border-b-2 border-gray-200 pb-4">
            <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
            <p className="text-sm text-gray-500 mt-2">
              Section {currentSection + 1} of {lesson.sections.length}
            </p>
          </div>

          <div className="prose prose-sm max-w-none mb-8">
            {section.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap">
                {paragraph}
              </p>
            ))}
          </div>

          {section.codeExample && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Example</h3>
              <CodeBlock code={section.codeExample} language="typescript" />
            </div>
          )}

          <div className="flex gap-4 mt-12">
            <button
              onClick={handlePrevious}
              disabled={currentSection === 0}
              className="px-6 py-3 rounded-lg bg-gray-200 text-gray-900 disabled:opacity-50 hover:bg-gray-300 transition-colors font-medium"
            >
              Previous Section
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium ml-auto"
            >
              {isLastSection ? 'Complete Lesson' : 'Next Section'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
