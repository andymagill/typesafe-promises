# Architecture & Design Patterns

This document explains the architectural decisions and design patterns used in the TypeSafe Promises learning application.

---

## State Management Model

### Unidirectional Data Flow

```
User Action
    ↓
Event Handler (handleSelectLesson, handleCompleteQuiz, etc.)
    ↓
setState() calls
    ↓
Component Re-render
    ↓
localStorage Persistence (in handler side effects)
```

**Key Principle:** State changes flow in one direction. No direct DOM manipulation.

### UserProgress: Persistent State

```typescript
interface UserProgress {
  completedLessons: string[];        // Completed lesson IDs
  completedExercises: string[];      // Completed exercise IDs
  quizAttempts: QuizAttempt[];       // Historical quiz attempts with scores
  currentSlide: number;              // User's last position (hydrated but not actively used)
}
```

**Why separate `UserProgress` from transient state?**
- Permanent changes (lessons completed, quizzes taken) go to UserProgress
- Transient state (current form input, button loading state) stays in React component state
- localStorage only persists UserProgress; transient state is computed fresh each session

### Transient State: Session Only

```typescript
const [currentSlide, setCurrentSlide] = useState(0);           // Session-only
const [quizResults, setQuizResults] = useState(null);          // Session-only
const [answers, setAnswers] = useState<Record<string, string>>({});  // Session-only
```

Not persisted to localStorage. Fresh on page reload.

---

## Component Mounting Strategy

### Conditional Mounting (E-1)

**Old Pattern (Anti-pattern):**
```tsx
// All 4 components always mounted, just hidden
<SlideContainer isVisible={slide.type === 'home'}>
  <HomeSlide ... />
</SlideContainer>
<SlideContainer isVisible={slide.type === 'lesson'}>
  <LessonSlide ... />  // Still mounted even when invisible!
</SlideContainer>
```

**New Pattern (Best Practice):**
```tsx
// Only the active component is mounted
{slide.type === 'home' && <HomeSlide ... />}
{slide.type === 'lesson' && <LessonSlide ... />}
{slide.type === 'quiz' && <QuizSlide ... />}
{slide.type === 'results' && quizResults && <ResultsSlide ... />}
```

**Benefits:**
1. **Zero State Overhead** — Unmounted components have no state, hooks, or subscriptions
2. **Fresh State on Mount** — Each slide gets a clean slate when re-mounted (fixes currentSection bug)
3. **Cleaner Lifecycle** — Component mount/unmount is explicit, not hidden behind visibility

---

## Performance Optimization Strategies

### 1. Lookup Tables Instead of Searches

**Problem: O(n) lookup in every render**
```tsx
// BAD: O(n) search every time component renders
const lesson = lessons.find(l => l.id === lessonId);
```

**Solution: Memoize + Pre-compute**
```tsx
// GOOD: O(1) lookup, memoized
const lesson = useMemo(() => lessons.find(l => l.id === lessonId), [lessonId]);

// Or pre-compute the entire lookup map in handler:
const lessonMap = new Map(lessons.map(l => [l.id, l]));
const lesson = lessonMap.get(lessonId); // O(1)
```

### 2. Sets for Membership Testing

**Problem: O(n) check inside O(n) map = O(n²)**
```tsx
// BAD: 100 lessons × 50 completed = 5,000 includes() calls
{lessons.map(lesson => {
  const isCompleted = progress.completedLessons.includes(lesson.id); // O(n)
  return ...;
})}
```

**Solution: Set for O(1) lookup**
```tsx
// GOOD: Build once, O(1) lookups in map
const completedSet = new Set(progress.completedLessons);
{lessons.map(lesson => {
  const isCompleted = completedSet.has(lesson.id); // O(1)
  return ...;
})}
```

### 3. Single-Pass Processing

**Problem: Multiple traversals of same data**
```tsx
// BAD: Two separate passes
const correctCount = results.reduce((acc, r) => {
  const option = quizQuestions.find(q => q.id === r.questionId); // O(n)
  return acc + (option?.isCorrect ? 1 : 0);
}, 0);

// THEN again in the map:
const questionsAnswered = results.map(r => {
  const option = quizQuestions.find(q => q.id === r.questionId); // O(n) again!
  return { questionId: r.questionId, isCorrect: option?.isCorrect };
});
```

**Solution: Merge passes with lookup maps**
```tsx
// GOOD: Single pass, precomputed lookups
const optionMap = new Map(quizQuestions.flatMap(q => q.options.map(o => [o.id, o])));
let correctCount = 0;
const questionsAnswered = results.map(r => {
  const option = optionMap.get(r.selectedOptionId); // O(1)
  const isCorrect = option?.isCorrect ?? false;
  if (isCorrect) correctCount++;
  return { questionId: r.questionId, selectedOptionId: r.selectedOptionId, isCorrect };
});
```

---

## Error Handling & Resilience

### 1. ErrorBoundary (Top Level)

```typescript
// Catches any render-time errors in the entire app
class ErrorBoundary extends Component {
  componentDidCatch(error) {
    console.error('[ErrorBoundary]', error);
  }
  render() {
    if (this.state.hasError) return <ErrorFallback />;
    return this.props.children;
  }
}
```

**When to use:** Top-level catch-all. Prevents blank screen of death.

### 2. Try/Catch for APIs

```typescript
// Clipboard API can fail (non-HTTPS, no permission, etc.)
const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(code);
    setCopied(true);
  } catch (err) {
    console.error('[CodeBlock] Clipboard error:', err);
  }
};
```

**When to use:** Async APIs that can reject (fetch, clipboard, etc.)

### 3. Runtime Validation

```typescript
// Validate data from untrusted sources (localStorage, API responses)
function migrateProgress(stored: unknown): UserProgress {
  if (!stored || typeof stored !== 'object') return defaultProgress;
  const data = stored as Record<string, unknown>;
  
  // Validate each field
  return {
    completedLessons: Array.isArray(data.completedLessons) ? data.completedLessons : [],
    // ... fill in missing fields with defaults
  };
}
```

**When to use:** Deserializing user data, loading from localStorage.

---

## Navigation State Management

### Slides Array: Session History

```typescript
const [slides, setSlides] = useState<Slide[]>([INITIAL_HOME_SLIDE]);
```

**What it contains:**
- Home slide (always first, always index 0)
- Lesson slides (one per selected lesson)
- Single quiz slide (one active quiz)
- Single results slide (one quiz attempt display)

**Why not use a router?**
- App is a single-page narrative flow, not multiple pages
- Slides have animation transitions
- Back button is meaningful (go to previous slide, not history)
- Quiz state is transient (cleared on navigation)

### Bounded Array (E-2)

**Old behavior:** Array grows on every nav action
```
home → lesson-1 → quiz → results → (home) → lesson-2 → quiz → results
Array: [home, lesson-1, quiz, results, lesson-2, quiz, results]  // 7 items
```

**New behavior:** Reset to single home slide
```
home → lesson-1 → quiz → results → (handleBackHome resets) → home
Array: [home]  // Always just 1 item
```

**Trade-offs:**
- ✅ Constant memory footprint
- ✅ Clean back-home semantics
- ❌ Can't go "back" to a previous lesson (but fresh mount is better anyway)

---

## Type Safety Patterns

### 1. Discriminated Unions

```typescript
type SlideType = 'home' | 'lesson' | 'quiz' | 'results';

interface Slide {
  id: string;
  type: SlideType;           // Discriminator
  contentId: string;         // Meaning depends on `type`
  title: string;
}

// TypeScript can't narrow contentId's meaning, but we handle manually:
const slide: Slide = ...;
if (slide.type === 'lesson') {
  const lessonId = slide.contentId; // We know this is a lesson ID
}
```

**Better pattern for new code:**
```typescript
type HomeSlide = { type: 'home'; ... };
type LessonSlide = { type: 'lesson'; lessonId: string; ... };
type QuizSlide = { type: 'quiz'; questionIds: string[]; ... };

type Slide = HomeSlide | LessonSlide | QuizSlide;
// Now TypeScript knows lessonId exists when type === 'lesson'
```

### 2. Const as Type

```typescript
export const PROFICIENCY_THRESHOLDS = {
  EXPERT: 90,
  ADVANCED: 75,
  INTERMEDIATE: 60,
  BEGINNER: 40,
} as const;

type ProficiencyLevel = keyof typeof PROFICIENCY_THRESHOLDS;  // 'EXPERT' | 'ADVANCED' | ...
```

**Benefits:**
- Single source of truth for thresholds
- Type-safe keys
- No duplicate values in code

### 3. Defensive Type Guards

```typescript
// Filter with type predicate for proper type narrowing
const recommendations = recommendedLessonIds
  .map(lessonId => lessonMap.get(lessonId))
  .filter((lesson): lesson is typeof lessons[0] => lesson !== undefined);

// Now TypeScript knows `recommendations` contains non-undefined Lesson objects
```

---

## Memoization Strategy

### When to Memoize

```typescript
// ✅ DO: Memoize expensive computations
const lesson = useMemo(
  () => lessons.find(l => l.id === lessonId),
  [lessonId]
);

// ✅ DO: Memoize callbacks passed to child components
const handleSelectLesson = useCallback(
  (lessonId: string) => {
    setSlides([...slides, { id: `lesson-${lessonId}`, ... }]);
  },
  [slides]
);
```

### When NOT to Memoize

```typescript
// ❌ DON'T: Memoize simple primitive operations
const isLast = currentIndex === questions.length - 1; // Just check, don't memoize
const total = results.length; // Accessing array length is O(1)
```

---

## State Colocation

Keep state as local as possible:

```
Global (App.tsx):
├── progress (UserProgress from localStorage)
├── slides (slide stack)
└── currentSlide

Component Local (LessonSlide.tsx):
├── currentSection (which lesson section to display)

Component Local (QuizSlide.tsx):
├── answers (user's selected answers)
└── showExplanation (reveal/hide explanation)
```

**Benefits:**
- Easier to reason about state flow
- Easier to test components in isolation
- Unmounting clears local state automatically

---

## Footer Component

`Footer.tsx` renders a 2-column responsive footer at the bottom of every slide's scrollable content area.

**Left column:** CC BY-SA 4.0 license attribution with a link to the license deed.

**Right column:** Creator credit ("Coded with ♥ by Andrew Magill") and an inline list of "Other Stuff" links.

**Design decisions:**
- Scrolls with content (not fixed) — visible when the user reaches the bottom of a slide
- Embedded inside each slide component rather than at the App level, preserving the conditional mounting pattern (E-1)
- `otherStuffLinks` is a simple array constant at the top of `Footer.tsx` — easy to update without touching JSX
- Uses the `Heart` icon from `lucide-react` (already a project dependency) for the filled heart symbol
- Responsive: 2-column grid on `sm` and above, single column on mobile

---

## Next Steps for Improvement

1. **Replace discriminated union** with proper type-safe slide discriminant
2. **Add `vitest` + `@testing-library/react`** for unit tests
3. **Enable `noUncheckedIndexedAccess`** in tsconfig for runtime safety
4. **Implement route-based code splitting** if lessons grow beyond ~10
5. **Add performance monitoring** (Core Web Vitals)

