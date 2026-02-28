import React, { ReactNode } from 'react';

interface SlideContainerProps {
  children: ReactNode;
  isVisible: boolean;
  direction?: 'left' | 'right';
  onAnimationComplete?: () => void;
}

export function SlideContainer({
  children,
  isVisible,
  direction = 'right',
  onAnimationComplete,
}: SlideContainerProps) {
  return (
    <div
      className={`absolute inset-0 transition-all duration-500 ease-in-out ${
        isVisible
          ? 'opacity-100 translate-x-0'
          : direction === 'right'
            ? 'opacity-0 translate-x-full'
            : 'opacity-0 -translate-x-full'
      }`}
      onTransitionEnd={onAnimationComplete}
    >
      {children}
    </div>
  );
}
