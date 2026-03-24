Node.js interview questions for backend roles. Consolidated from multiple sources — concise, interview-ready answers plus practical code examples.

> **See also:** [nodejs_1.md](nodejs_1.md) for deeper senior-level topics with production code (streams, profiling, N-API, AbortController, etc.)

---

## Core Node.js questions

**1. What is Node.js?**
Node.js is a JavaScript runtime built on Chrome's V8 engine. It lets you run JavaScript outside the browser, especially for backend and scripting use cases.

**2. Why is Node.js considered good for I/O-heavy workloads?**
Because it uses non-blocking I/O and an event-driven model, so it can handle many concurrent network or file operations efficiently without creating a thread per request.

**3. Why is Node.js not ideal for CPU-heavy workloads?**
Because long CPU-bound tasks block the main thread and delay other requests. Heavy computation usually needs worker threads, child processes, or another service.

**4. What is the event loop?**
The event loop is the mechanism Node uses to process queued callbacks and async work. It lets Node continue handling other tasks while waiting for I/O to complete.

**5. What is the difference between synchronous and asynchronous code in Node?**
Synchronous code blocks execution until it finishes. Asynchronous code starts work and lets the program continue, handling the result later through callbacks, promises, or `async/await`.

---

## Event loop and async behavior

**6. How does the Node.js event loop work?**
Node moves through phases such as timers, pending callbacks, poll, check, and close callbacks. It processes work from queues in those phases, while microtasks like promises are handled between turns.

**7. What is the difference between `setTimeout`, `setImmediate`, and `process.nextTick`?**
`setTimeout` runs after at least a given delay. `setImmediate` runs in the check phase, often after I/O. `process.nextTick` runs before the event loop continues, so overusing it can starve other work.

```javascript
setImmediate(() => console.log('setImmediate'));
process.nextTick(() => console.log('nextTick'));
// Output: nextTick, then setImmediate
```

**8. What is the difference between callbacks, promises, and `async/await`?**
Callbacks are the older pattern and can become hard to manage when nested. Promises make async flows more composable. `async/await` is syntax built on promises that makes async code read more like synchronous code.

**9. What happens when you throw inside an async function?**
The thrown error becomes a rejected promise. You usually handle it with `try/catch` around `await` or with `.catch()`.

**10. What is an unhandled promise rejection?**
It is a promise rejection that does not have an attached error handler. It can lead to unstable application behavior and should be treated as a bug.

---

## Node runtime and architecture

**11. Is Node.js single-threaded?**
JavaScript execution is single-threaded in the main event loop, but Node also uses libuv and thread pools behind the scenes for some operations. So the usual interview answer is: JavaScript runs on one main thread, but Node is not limited to one OS thread internally.

**12. What is libuv?**
Libuv is the library that provides Node's event loop, async I/O support, and thread pool. It is a key part of how Node handles concurrency.

**13. What operations use the libuv thread pool?**
Examples include some filesystem work, DNS lookups, compression, and crypto operations. Network sockets often rely more directly on OS async mechanisms.

**14. What is the difference between `require` and `import`?**
`require` is the CommonJS module system. `import` is the ES module syntax. They differ in syntax, loading behavior, and configuration, and modern Node supports both with some rules.

```javascript
// CommonJS
const express = require('express');
module.exports = myFunction;

// ES6 Modules
import express from 'express';
export default myFunction;
export { namedExport };
```

**15. What is module caching in Node?**
When a module is loaded once, Node caches it, so subsequent imports or requires reuse the same module instance. This can improve performance and also means module-level state can be shared.

**16. What is EventEmitter in Node.js?**
EventEmitter is a class that allows objects to emit named events that cause listener functions to be called. It is foundational to Node's event-driven architecture, used by streams, HTTP servers, and many core modules.

```javascript
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

myEmitter.on('event', () => {
  console.log('An event occurred!');
});

myEmitter.emit('event');
```

---

## APIs, servers, and backend usage

**17. How do you create a basic HTTP server in Node?**
You can use the built-in `http` module or a framework like Express or Fastify. The basic idea is creating a server, reading the request, and sending a response.

**18. What is middleware in Express?**
Middleware is a function that runs during request processing and can inspect or modify the request, response, or control flow. It is commonly used for logging, auth, validation, and error handling.

```javascript
app.use((req, res, next) => {
  console.log('Time:', Date.now());
  next();
});
```

**19. What is the difference between Express and Fastify?**
Express is older and widely used with a large ecosystem. Fastify focuses more on performance, schema support, and structured plugins. Both are valid choices depending on the project.

**20. How do you handle errors in an Express app?**
Usually with centralized error-handling middleware plus `try/catch` for async logic or wrappers for async route handlers. The goal is consistent responses and good logging.

**21. What status code would you return for validation errors, auth failures, and server errors?**
Typically `400` for validation issues, `401` for unauthenticated, `403` for forbidden, and `500` for unexpected server failures.

---

## Streams, buffers, and files

**22. What is a stream in Node.js?**
A stream lets you process data piece by piece instead of loading everything into memory at once. This is useful for files, network responses, and large payloads.

**23. What are the types of streams?**
Readable, writable, duplex, and transform streams. Duplex can read and write, while transform streams modify data as it passes through.

```javascript
const fs = require('fs');
const readStream = fs.createReadStream('input.txt');
const writeStream = fs.createWriteStream('output.txt');
readStream.pipe(writeStream);
```

**24. What is a Buffer in Node.js?**
A Buffer is a raw binary data structure used to work with bytes directly. It is common in file handling, networking, and encoding tasks.

**25. Why are streams better than reading an entire file into memory?**
Streams reduce memory usage and often improve performance for large files. They also let you start processing before the full payload is available.

**26. What is backpressure?**
Backpressure is the mechanism that prevents a fast producer from overwhelming a slower consumer. Streams support this so memory usage does not grow uncontrollably.

---

## Databases and async backend patterns

**27. How do you connect Node to a database safely?**
Use a proper driver or ORM, parameterized queries, connection pooling, validation, and error handling. Never build SQL from raw user input.

```javascript
// MongoDB connection example
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10
});

// MySQL connection pool example
const mysql = require('mysql2');
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

**28. What is connection pooling?**
A connection pool reuses database connections instead of opening a new one for every request. This reduces overhead and improves performance.

**29. What is the N+1 query problem?**
It happens when code fetches a list of records and then performs one additional query per record. This creates unnecessary database round trips and hurts performance. Solutions include eager loading, JOINs, and the DataLoader batch pattern.

**30. When would you use a queue in a Node backend?**
For slow, retryable, or background tasks like email sending, file processing, or webhooks. Queues help smooth spikes and decouple request handling from long-running work.

**31. How do you make async jobs idempotent?**
By making repeated processing safe, often through unique keys, deduplication, or checking whether the side effect already happened.

**32. What is Mongoose?**
Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It manages relationships between data, provides schema validation, and translates between objects in code and MongoDB documents.

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  age: Number,
  created: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
```

---

## Performance and scaling

**33. How do you scale a Node.js application?**
Common approaches are running multiple instances behind a load balancer, using clustering or container orchestration, caching, and moving long-running work to background workers.

**34. What is the `cluster` module?**
It allows multiple Node processes to share the same server port, often to better use multi-core CPUs. In many modern setups, orchestration at the container or process-manager level is more common.

```javascript
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Hello World\n');
  }).listen(8000);
}
```

**35. How would you handle CPU-heavy work in Node?**
Use worker threads, child processes, or offload the task to another service or queue-based worker system.

```javascript
const { Worker, isMainThread, parentPort } = require('worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename);
  worker.on('message', (result) => {
    console.log('Result:', result);
  });
  worker.postMessage({ cmd: 'calculate', num: 1000000 });
} else {
  parentPort.on('message', (data) => {
    if (data.cmd === 'calculate') {
      const result = heavyCalculation(data.num);
      parentPort.postMessage(result);
    }
  });
}
```

**36. What causes memory leaks in Node.js apps?**
Common causes include global references, unbounded caches, event listeners not cleaned up, timers left running, and closures holding onto large objects.

```javascript
// Clean up to prevent leaks
emitter.removeListener('data', callback);
clearInterval(intervalId);
clearTimeout(timeoutId);

// Monitor memory usage
console.log(process.memoryUsage());
```

**37. How do you debug high memory usage in Node?**
Use heap snapshots, profiling tools, metrics, and process monitoring. Look for retained objects, growing collections, and request paths that keep references alive.

**38. What is PM2?**
PM2 is a production process manager for Node.js with automatic restarts, load balancing, zero-downtime deployments, cluster mode, and monitoring.

---

## Security and production readiness

**39. How do you secure a Node API?**
Validate input, sanitize where needed, use proper auth and authorization, parameterized DB queries, secure headers, rate limiting, secret management, and logging without leaking sensitive data.

```javascript
// Helmet for security headers
const helmet = require('helmet');
app.use(helmet());

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);
```

**40. What is CORS?**
CORS is a browser security feature that controls which origins can access a resource. It matters for browser clients but does not replace real backend security.

```javascript
const cors = require('cors');

app.use(cors({
  origin: 'https://example.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**41. How should secrets be stored in Node apps?**
Not in source code. Use environment variables or, better, a secret manager in production.

**42. How do you log effectively in a Node backend?**
Use structured logs with request IDs, error context, and important metadata. Avoid noisy logs and never log secrets.

**43. What metrics would you watch in production?**
Latency, error rate, request volume, CPU, memory, event loop lag, DB latency, queue depth, and downstream dependency health.

---

## Common practical interview questions

**44. How do you read environment variables in Node?**
Using `process.env`. It's common to validate required env vars at startup.

```javascript
require('dotenv').config();
const dbHost = process.env.DB_HOST;
const apiKey = process.env.API_KEY;
const port = process.env.PORT || 3000;
```

**45. What is the difference between `__dirname` and `process.cwd()`?**
`__dirname` refers to the directory of the current file in CommonJS. `process.cwd()` is the current working directory where the process was started.

**46. What is the difference between `spawn`, `exec`, and `fork`?**
`spawn` starts a process and streams output, good for large output. `exec` buffers output and is simpler for short commands. `fork` is specialized for starting another Node process with IPC support.

**47. What is the difference between `fs.readFile` and `fs.createReadStream`?**
`fs.readFile` loads the whole file into memory before returning it. `fs.createReadStream` reads the file in chunks and is better for large files.

**48. What is the purpose of `package.json`?**
It defines project metadata, scripts, dependencies, and configuration. It is the central manifest for a Node project.

**49. What is the difference between dependencies and devDependencies?**
`dependencies` are needed at runtime. `devDependencies` are usually only needed for development, testing, or building.

**50. What is `package-lock.json`?**
It locks the exact versions of the entire dependency tree so installs are reproducible across machines. It is auto-generated by npm.

**51. What does `npm ci` do differently from `npm install`?**
`npm ci` installs exactly from the lockfile and is intended for clean, reproducible installs, especially in CI. It is stricter and usually faster for automation.

**52. What are common causes of event loop blocking?**
Large synchronous loops, heavy JSON parsing/stringifying, crypto/compression on the main thread, and synchronous filesystem operations.

**53. How would you implement rate limiting in Node?**
Usually through middleware plus a store like Redis for distributed environments. Common algorithms are token bucket, fixed window, or sliding window.

**54. How do you gracefully shut down a Node server?**
Listen for termination signals, stop accepting new requests, allow in-flight requests to finish, close DB connections and consumers, then exit cleanly.

**55. How do you handle authentication in Node?**
Common methods are JWT, session-based auth, OAuth 2.0, and Passport.js middleware.

```javascript
const jwt = require('jsonwebtoken');

// Generate token
const token = jwt.sign(
  { userId: user.id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

// Verify token middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};
```

**56. How do you debug Node.js applications?**
Use `console.log` for basics, `node --inspect` with Chrome DevTools, VS Code debugger, or the `debug` module for conditional logging.

---

## Real-time, data, and advanced patterns

**57. What is WebSocket and how is it used in Node?**
WebSocket provides full-duplex communication over a single TCP connection for real-time applications.

```javascript
// Using ws package
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log('Received:', message);
    ws.send(`Echo: ${message}`);
  });
  ws.send('Welcome!');
});
```

**58. What is Redis and how is it used with Node?**
Redis is an in-memory data store used for caching, session storage, rate limiting, pub/sub, and queues.

```javascript
const redis = require('redis');
const client = redis.createClient();

async function getCachedData(key) {
  const cached = await client.get(key);
  if (cached) return JSON.parse(cached);

  const data = await fetchFromDatabase();
  await client.setex(key, 3600, JSON.stringify(data));
  return data;
}
```

**59. What is GraphQL and how does it differ from REST?**
GraphQL is a query language for APIs where clients request exactly the data they need. Key differences: single endpoint vs multiple, no over/under-fetching, strong typing. Adds complexity around caching and performance.

**60. How do you handle file uploads in Node?**
Usually with middleware like multer for multipart form data.

```javascript
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only images allowed'));
  }
});

app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ filename: req.file.filename });
});
```

---

## Testing

**61. What are the popular testing frameworks for Node.js?**
Jest (full-featured, by Meta), Mocha (flexible), Chai (assertion library), Supertest (HTTP assertions), and Sinon (spies, stubs, mocks).

**62. What is the difference between unit testing and integration testing?**
Unit tests isolate individual functions/components. Integration tests verify how components work together.

```javascript
// Unit test
test('formatDate returns correct format', () => {
  const result = formatDate(new Date('2024-01-01'));
  expect(result).toBe('01/01/2024');
});

// Integration test
test('API endpoint returns user data', async () => {
  const response = await request(app)
    .get('/api/users/1')
    .expect(200);
  expect(response.body).toHaveProperty('name');
});
```

---

## Coding challenges

**63. Implement a simple rate limiter**

```javascript
class RateLimiter {
  constructor(maxRequests, timeWindow) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
    this.requests = new Map();
  }

  isAllowed(userId) {
    const now = Date.now();
    const userRequests = this.requests.get(userId) || [];
    const validRequests = userRequests.filter(
      time => now - time < this.timeWindow
    );

    if (validRequests.length < this.maxRequests) {
      validRequests.push(now);
      this.requests.set(userId, validRequests);
      return true;
    }
    return false;
  }
}
```

**64. Create a simple LRU Cache**

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
}
```

**65. Implement retry logic with exponential backoff**

```javascript
async function retryRequest(fn, maxRetries = 3, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      console.log(`Attempt ${i + 1} failed. Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
}
```

---

## High-signal Node.js questions interviewers really like

These often separate stronger candidates from weaker ones:

**66. Why can `process.nextTick` be dangerous if overused?**
Because it runs before the event loop continues, so recursively scheduling too many `nextTick` callbacks can starve I/O and timers.

**67. Why is `async/await` not "making code synchronous"?**
It only makes async code easier to read. Under the hood it still works with promises and the event loop.

**68. Why can low CPU still mean your Node service is overloaded?**
Because the bottleneck may be I/O waits, connection pool exhaustion, event loop lag, memory pressure, or slow dependencies rather than CPU.

**69. Why are synchronous filesystem calls usually avoided in servers?**
Because they block the event loop and delay unrelated requests. They are fine for some startup scripts but risky on hot request paths.

**70. Why are worker threads not the first answer to every scaling problem?**
Because many Node services are bottlenecked by I/O or external dependencies, not CPU. Worker threads help only when CPU-bound work is the real issue.

---

## Great behavioral Node/backend questions

**71. Tell me about a Node production incident you debugged.**
They want your investigation process, root cause, mitigation, and follow-up improvements.

**72. Tell me about a performance bottleneck you fixed in a Node service.**
Focus on what was slow, how you measured it, what you changed, and the impact.

**73. Describe a time async behavior caused a bug.**
Good examples include race conditions, duplicate processing, unhandled rejections, or event loop blocking.

**74. Tell me about a scaling issue in a Node backend.**
Discuss the bottleneck and why the original architecture did not hold up under load.

**75. What Node project are you most proud of?**
Choose one with real ownership, clear technical depth, and measurable outcome.

---

## Best way to answer in interviews

Use this structure:

**What it is → why it matters → example → tradeoff**

Example:

**Q: Why is Node good for I/O-heavy apps?**
Node is good for I/O-heavy apps because it uses non-blocking I/O and an event-driven model, so one process can handle many concurrent requests efficiently. That matters for APIs, proxies, and real-time services where the server spends a lot of time waiting on databases or network calls. For example, a REST API gateway often performs well in Node. The tradeoff is that CPU-heavy work can block the event loop.
