import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SlideNavigationProps {
  currentSlide: number;
  totalSlides: number;
  onPrevious: () => void;
  onNext: () => void;
  canPrevious: boolean;
  canNext: boolean;
}

export function SlideNavigation({
  currentSlide,
  totalSlides,
  onPrevious,
  onNext,
  canPrevious,
  canNext,
}: SlideNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-8 py-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <button
          onClick={onPrevious}
          disabled={!canPrevious}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
        >
          <ChevronLeft size={20} />
          Previous
        </button>

        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === currentSlide ? 'w-8 bg-blue-600' : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-4">
            {currentSlide + 1} / {totalSlides}
          </span>
        </div>

        <button
          onClick={onNext}
          disabled={!canNext}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          Next
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
