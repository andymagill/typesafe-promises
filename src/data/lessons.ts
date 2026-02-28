import { Lesson, Difficulty } from '../types';

export const lessons: Lesson[] = [
  {
    id: 'intro-promises',
    title: 'Introduction to Promises',
    description: 'Master the fundamentals of JavaScript Promises and their three states',
    difficulty: Difficulty.Beginner,
    prerequisites: [],
    estimatedTime: 12,
    sections: [
      {
        id: 'intro-1',
        title: 'What is a Promise?',
        content: `A Promise is an object that represents the eventual completion (or failure) of an asynchronous operation and its resulting value.

Promises allow you to handle asynchronous operations more elegantly than callbacks. Instead of passing a callback function, you can chain operations using .then() and .catch().

Key benefits:
- Avoids "callback hell" or "pyramid of doom"
- Provides consistent error handling
- Enables better code readability and maintainability`,
        codeExample: `// Creating a simple Promise
const myPromise = new Promise((resolve, reject) => {
  const success = true;
  if (success) {
    resolve('Operation successful!');
  } else {
    reject('Operation failed!');
  }
});

// Using the Promise
myPromise
  .then(result => console.log(result))
  .catch(error => console.error(error));`,
      },
      {
        id: 'intro-2',
        title: 'Promise States',
        content: `Every Promise is in one of three states:

1. **Pending**: The initial state. The operation has not completed yet.

2. **Fulfilled (Resolved)**: The operation completed successfully, and the Promise has a value.

3. **Rejected**: The operation failed, and the Promise has a reason for the failure (an error).

Once a Promise transitions from pending to either fulfilled or rejected, it becomes **settled** and cannot change states again. This is called the "immutability of Promise state".`,
        codeExample: `// A Promise that settles after 1 second
const delayedPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('Promise resolved!');
  }, 1000);
});

// Pending state (immediate)
console.log('Promise state: pending');

// Fulfilled state (after 1 second)
delayedPromise.then(value => {
  console.log('Promise state: fulfilled');
  console.log('Value:', value);
});`,
      },
      {
        id: 'intro-3',
        title: 'Promise Consumption',
        content: `You can attach handlers to a Promise using .then() and .catch() methods.

The .then() method takes up to two callbacks:
- onFulfilled: called when the Promise is fulfilled
- onRejected: called when the Promise is rejected

The .catch() method is a shorthand for .then(null, onRejected) and is used for error handling.

Both methods return a new Promise, allowing you to chain multiple operations.`,
        codeExample: `const fetchData = new Promise((resolve, reject) => {
  const data = { id: 1, name: 'John' };
  resolve(data);
});

fetchData
  .then(data => {
    console.log('Data received:', data);
    return data.id;
  })
  .then(id => {
    console.log('Processing ID:', id);
  })
  .catch(error => {
    console.error('Error occurred:', error);
  });`,
      },
    ],
  },
  {
    id: 'generic-syntax',
    title: 'Generic Syntax: Promise<T>',
    description: 'Understanding TypeScript generics with Promise types',
    difficulty: Difficulty.Intermediate,
    prerequisites: ['intro-promises'],
    estimatedTime: 15,
    sections: [
      {
        id: 'generic-1',
        title: 'Introduction to Promise<T>',
        content: `In TypeScript, Promise is a generic type that takes a type parameter T, which represents the type of the value that will be resolved.

The syntax is: Promise<T>

Where T is the type of the resolved value. This allows TypeScript to provide type safety and intellisense for Promise handling.`,
        codeExample: `// Promise that resolves to a string
const stringPromise: Promise<string> = new Promise((resolve) => {
  resolve('Hello, TypeScript!');
});

// Promise that resolves to a number
const numberPromise: Promise<number> = new Promise((resolve) => {
  resolve(42);
});

// Promise that resolves to an object
interface User {
  id: number;
  name: string;
}
const userPromise: Promise<User> = new Promise((resolve) => {
  resolve({ id: 1, name: 'Alice' });
});`,
      },
      {
        id: 'generic-2',
        title: 'Type Inference with Promises',
        content: `TypeScript can automatically infer the type parameter T from the value passed to resolve().

When you don't explicitly annotate the Promise type, TypeScript will infer it based on what you resolve with. This makes your code cleaner while maintaining type safety.`,
        codeExample: `// Type is inferred as Promise<string>
const greeting = new Promise((resolve) => {
  resolve('Hello!');
});

// Type is inferred as Promise<number>
const count = new Promise((resolve) => {
  resolve(100);
});

// Type is inferred as Promise<{x: number, y: number}>
const coordinates = new Promise((resolve) => {
  resolve({ x: 10, y: 20 });
});

// Explicit annotation (not necessary but sometimes helpful for clarity)
const explicit: Promise<string> = new Promise((resolve) => {
  resolve('Explicit type');
});`,
      },
      {
        id: 'generic-3',
        title: 'Promise Method Return Types',
        content: `When you use .then(), the return value determines the type of the next Promise in the chain.

If your callback returns a value of type U, the resulting Promise will be Promise<U>.
If your callback returns a Promise<U>, the resulting Promise will also be Promise<U> (not Promise<Promise<U>>).`,
        codeExample: `// Original promise resolves to a number
const numberPromise: Promise<number> = Promise.resolve(5);

// .then() returns a Promise<string>
const stringPromise: Promise<string> = numberPromise
  .then(num => {
    return 'Number was: ' + num; // returns string
  });

// Chaining with different return types
const finalPromise: Promise<boolean> = stringPromise
  .then(str => {
    console.log(str);
    return str.length > 5; // returns boolean
  });`,
      },
    ],
  },
  {
    id: 'error-handling',
    title: 'Error Handling with unknown',
    description: 'Mastering type-safe error handling in catch blocks',
    difficulty: Difficulty.Intermediate,
    prerequisites: ['intro-promises', 'generic-syntax'],
    estimatedTime: 18,
    sections: [
      {
        id: 'error-1',
        title: 'The Problem with Error Types',
        content: `In JavaScript, anything can be thrown - not just Error objects. This includes strings, numbers, objects, or null.

In TypeScript, if you don't specify a type for the error in a .catch() block, TypeScript treats it as unknown (when strict mode is enabled).

Using unknown forces you to check the actual type before using the error, making your code safer.`,
        codeExample: `// Without type annotation, error is 'any' (unsafe)
const unsafePromise = Promise.reject('Something went wrong');

unsafePromise.catch((error) => {
  // 'error' is typed as 'any' - dangerous!
  console.log(error.message); // Could crash if error is a string
});

// With 'unknown' (safer)
unsafePromise.catch((error: unknown) => {
  // Must check type before using
  if (error instanceof Error) {
    console.log(error.message);
  } else if (typeof error === 'string') {
    console.log(error);
  }
});`,
      },
      {
        id: 'error-2',
        title: 'Type Narrowing in Catch Blocks',
        content: `Type narrowing is the process of refining a variable's type from a general type (like unknown) to a more specific type.

Common techniques:
1. instanceof checks - for Error objects
2. typeof checks - for primitives
3. Property existence checks - for objects with specific properties`,
        codeExample: `const handleError = (error: unknown) => {
  // Type narrowing with instanceof
  if (error instanceof Error) {
    console.log('Error message:', error.message);
    console.log('Stack:', error.stack);
    return;
  }

  // Type narrowing with typeof
  if (typeof error === 'string') {
    console.log('String error:', error);
    return;
  }

  if (typeof error === 'number') {
    console.log('Error code:', error);
    return;
  }

  // Catch-all for other types
  console.log('Unknown error:', error);
};`,
      },
      {
        id: 'error-3',
        title: 'Creating Error Handling Utilities',
        content: `It's common to create helper functions that handle unknown errors consistently across your application.

These utilities can extract error messages, log errors, and provide type-safe error handling.`,
        codeExample: `// Utility function to safely extract error message
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}

// Using the utility
const fetchData = () => Promise.reject(new Error('API failed'));

fetchData().catch((error) => {
  const message = getErrorMessage(error);
  console.error('Error:', message);
});`,
      },
    ],
  },
  {
    id: 'advanced-composition',
    title: 'Advanced Promise Composition',
    description: 'Master Promise.all, async/await, and complex patterns',
    difficulty: Difficulty.Advanced,
    prerequisites: ['intro-promises', 'generic-syntax', 'error-handling'],
    estimatedTime: 20,
    sections: [
      {
        id: 'advanced-1',
        title: 'Promise.all with Tuple Types',
        content: `Promise.all() is used to combine multiple Promises into a single Promise that resolves when all input Promises have resolved.

With TypeScript, when you pass an array of Promises with specific types, Promise.all() will infer a tuple type that matches the resolved values in order.`,
        codeExample: `// Promise.all with specific types
const name: Promise<string> = Promise.resolve('Alice');
const age: Promise<number> = Promise.resolve(30);
const isActive: Promise<boolean> = Promise.resolve(true);

// Result type is Promise<[string, number, boolean]>
const combined = Promise.all([name, age, isActive]);

combined.then(([n, a, active]) => {
  // n is string, a is number, active is boolean
  console.log(\`User: \${n}, Age: \${a}, Active: \${active}\`);
});`,
      },
      {
        id: 'advanced-2',
        title: 'Async/Await Pattern',
        content: `Async/await is syntactic sugar over Promises that makes asynchronous code look and behave more like synchronous code.

The await keyword pauses execution until a Promise settles, and the value is returned directly (not wrapped in a Promise).

An async function always returns a Promise.`,
        codeExample: `// Async function that returns Promise<string>
async function fetchUserName(id: number): Promise<string> {
  // await pauses execution until the Promise resolves
  const response = await fetch(\`/api/users/\${id}\`);
  const data: { name: string } = await response.json();
  return data.name; // Return value is wrapped in Promise
}

// Using async function
async function main() {
  try {
    const name = await fetchUserName(1); // name is string
    console.log('User:', name);
  } catch (error) {
    console.error('Failed to fetch:', error);
  }
}`,
      },
      {
        id: 'advanced-3',
        title: 'Complex Async Patterns',
        content: `Understanding how to combine multiple async operations efficiently with proper type safety.

Common patterns include parallel execution, sequential execution, error recovery, and timeout handling.`,
        codeExample: `// Parallel async operations
async function loadUserData(userId: number) {
  const [user, posts, comments] = await Promise.all([
    fetchUser(userId),
    fetchPosts(userId),
    fetchComments(userId),
  ]);
  return { user, posts, comments };
}

// Sequential async operations with error handling
async function processData() {
  try {
    const data1 = await fetch1();
    const data2 = await fetch2(data1);
    const data3 = await fetch3(data2);
    return data3;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    }
    throw error;
  }
}`,
      },
    ],
  },
];
