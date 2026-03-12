import { Lesson, Difficulty } from '../types';

export const lessons: Lesson[] = [
  {
    id: 'intro-promises',
    title: 'Introduction to Promises',
    description: 'Master the fundamentals of JavaScript Promises and their three states',
    difficulty: Difficulty.Beginner,
    prerequisites: [],
    estimatedTimeMinutes: 12,
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
  
  // Do something asynchronous here
   
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
      {
        id: 'intro-4',
        title: 'Real-World Example: Fetching Data',
        content: `The fetch() API is a real-world use of Promises. It fetches resources from a server and returns a Promise that resolves with a Response object.

Fetch is commonly chained with .then() to:
1. Call fetch() to retrieve data
2. Use .then() to parse the response (e.g., .json())
3. Use another .then() to process the data
4. Use .catch() to handle network errors`,
        codeExample: `// Real-world Promise chain with fetch()
fetch('https://api.example.com/users/1')
  .then(response => {
    // response is a Response object
    // .json() returns a Promise that resolves to the parsed JSON
    return response.json();
  })
  .then(data => {
    // data is now the parsed JavaScript object
    console.log('User:', data.name);
    return data;
  })
  .catch(error => {
    // Handles network errors or JSON parsing errors
    console.error('Failed to fetch user:', error);
  });`,
      },
    ],
    resources: [
      {
        title: 'MDN: Promise',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise',
        description: 'Complete documentation on Promises from Mozilla Developer Network',
      },
      {
        title: 'MDN: Promise.prototype.then()',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then',
        description: 'Detailed guide on the then() method and Promise chaining',
      },
      {
        title: 'JavaScript.info: Promises',
        url: 'https://javascript.info/promise-basics',
        description: 'Interactive guide to Promise fundamentals',
      },
      {
        title: 'MDN: Fetch API',
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API',
        description: 'Learn how the Fetch API uses Promises for HTTP requests',
      },
    ],
  },
  {
    id: 'generic-syntax',
    title: 'Generic Syntax: Promise<T>',
    description: 'Understanding TypeScript generics with Promise types',
    difficulty: Difficulty.Intermediate,
    prerequisites: ['intro-promises'],
    estimatedTimeMinutes: 15,
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
      {
        id: 'generic-4',
        title: 'Promise<void> for Side-Effect Operations',
        content: `Promise<void> is used for async functions or Promises that don't return a meaningful value — they just perform side effects.

Examples include:
- Saving data to a database
- Writing to a file
- Making an API call without needing the response
- Completing a task

Using Promise<void> signals to other developers that the caller shouldn't expect a return value.`,
        codeExample: `// Async function returning Promise<void>
async function saveUser(name: string): Promise<void> {
  const user = { name, createdAt: new Date() };
  await database.save(user);
  // No return statement needed - void indicates no meaningful return value
}

// Using Promise<void>
saveUser('Alice').then(() => {
  console.log('User saved');
});

// Promise<void> for fire-and-forget operations
function logError(message: string): Promise<void> {
  return fetch('/api/logs', {
    method: 'POST',
    body: JSON.stringify({ message, timestamp: Date.now() }),
  })
  .then(() => {
    // void: we don't care about the response
  });
}`,
      },
    ],
    resources: [
      {
        title: 'TypeScript Handbook: Generics',
        url: 'https://www.typescriptlang.org/docs/handbook/2/generics.html',
        description: 'Official TypeScript guide to understanding and using generics',
      },
      {
        title: 'TypeScript Deep Dive: Generics',
        url: 'https://basarat.gitbook.io/typescript/type-system/generics',
        description: 'In-depth exploration of TypeScript generics',
      },
      {
        title: 'MDN: Promise Type Parameters',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#description',
        description: 'Promise documentation covering type parameters',
      },
    ],
  },
  {
    id: 'error-handling',
    title: 'Error Handling with unknown',
    description: 'Mastering type-safe error handling in catch blocks',
    difficulty: Difficulty.Intermediate,
    prerequisites: ['intro-promises', 'generic-syntax'],
    estimatedTimeMinutes: 18,
    sections: [
      {
        id: 'error-1',
        title: 'The Problem with Error Types',
        content: `In JavaScript, anything can be thrown - not just Error objects. This includes strings, numbers, objects, or null.

In TypeScript, the error parameter in .catch() callbacks defaults to type 'any', which defeats type safety. In try/catch blocks with strict mode enabled, TypeScript 4.4+ treats the caught error as 'unknown', which forces you to verify the type before using it.

To make .catch() callbacks type-safe, you should explicitly annotate the error parameter as 'unknown' so TypeScript requires you to check the actual type.`,
        codeExample: `// Without type annotation, error is 'any' (unsafe)
const unsafePromise = Promise.reject('Something went wrong');

unsafePromise.catch((error) => {
  // Without explicit annotation, 'error' is typed as 'any' (unsafe!)
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
      {
        id: 'error-4',
        title: 'Cleanup with .finally()',
        content: `The .finally() method runs cleanup code that should execute regardless of whether the Promise fulfilled or rejected.

.finally() is useful for:
- Closing connections or streams
- Hiding loading spinners
- Cleaning up temporary resources
- Logging that an operation completed

Unlike .then() and .catch(), .finally() doesn't receive a value or error argument. It always returns the original Promise value or error (so the chain continues with the same value/error).`,
        codeExample: `// Using .finally() for cleanup
function fetchDataWithCleanup(url: string) {
  console.log('Loading...');
  
  return fetch(url)
    .then(response => response.json())
    .catch((error: unknown) => {
      if (error instanceof Error) {
        console.error('Error:', error.message);
      }
      throw error; // Re-throw to let caller handle it
    })
    .finally(() => {
      // This runs whether the Promise succeeded or failed
      console.log('Request completed');
    });
}

// Another example: closing a connection
function executeQuery(connection: any, sql: string) {
  return connection
    .query(sql)
    .then(result => result)
    .finally(() => {
      connection.close(); // Always close, success or failure
    });
}`,
      },
    ],
    resources: [
      {
        title: 'TypeScript Handbook: Narrowing Type Guards',
        url: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html',
        description: 'Learn type narrowing techniques including instanceof and typeof checks',
      },
      {
        title: 'MDN: Error Object',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error',
        description: 'Documentation on JavaScript Error objects and error handling',
      },
      {
        title: 'TypeScript 4.4: useUnknownInCatchVariables',
        url: 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-4.html#use-unknown-in-catch-variables',
        description: 'How to use unknown type in try/catch blocks for type-safe error handling',
      },
    ],
  },
  {
    id: 'advanced-composition',
    title: 'Advanced Promise Composition',
    description: 'Master Promise.all, async/await, and complex patterns',
    difficulty: Difficulty.Advanced,
    prerequisites: ['intro-promises', 'generic-syntax', 'error-handling'],
    estimatedTimeMinutes: 20,
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
      {
        id: 'advanced-4',
        title: 'Promise Combinators: allSettled, race, and any',
        content: `Beyond Promise.all(), TypeScript provides other combinator methods for different use cases:

**Promise.allSettled()** — Waits for all Promises to settle (fulfill or reject), then returns results for both successes and failures.

**Promise.race()** — Returns the result of whichever Promise settles first.

**Promise.any()** — Returns the first fulfilled Promise, or aggregates all rejection reasons if none fulfill.

Use Promise.allSettled() when you want all results regardless of failures (e.g., parallel API calls where some might fail but you want to continue).`,
        codeExample: `// Promise.allSettled - get all results, even if some fail
const promises = [
  Promise.resolve('success'),
  Promise.reject('failed'),
  Promise.resolve('also success'),
];

Promise.allSettled(promises).then((results) => {
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log(\`Result \${index}: \${result.value}\`);
    } else {
      console.log(\`Error \${index}: \${result.reason}\`);
    }
  });
});

// Promise.race - get the first to settle
const raceResults = Promise.race([
  new Promise(r => setTimeout(() => r('slow'), 1000)),
  new Promise(r => setTimeout(() => r('fast'), 100)),
]);

raceResults.then(winner => {
  console.log('Winner:', winner); // 'fast'
});`,
      },
    ],
    resources: [
      {
        title: 'MDN: Promise.all()',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all',
        description: 'Comprehensive guide to Promise.all() and parallel Promise composition',
      },
      {
        title: 'MDN: async/await',
        url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises',
        description: 'Learn async/await syntax and how to work with Promises',
      },
      {
        title: 'TypeScript Handbook: async/await',
        url: 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-1-7.html#asyncawait',
        description: 'TypeScript async/await implementation and type safety',
      },
      {
        title: 'MDN: Promise Combinators',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#promise_concurrency',
        description: 'Advanced Promise methods like Promise.race() and Promise.allSettled()',
      },
    ],
  },
];
