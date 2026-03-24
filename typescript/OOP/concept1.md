Here’s a **practical, interview-friendly guide to common OOP patterns in TypeScript**, with:

✅ When to use
✅ Mental model
✅ Clean TypeScript example
✅ Real-world relevance (backend / Node / AWS / frontend — useful for your media-pipeline + API work)

I’ll focus on patterns you’ll actually use in production — not just textbook ones.

---

# 🧱 Core TypeScript OOP Building Blocks (quick refresher)

TypeScript gives you:

```ts
class
interface
abstract class
readonly
private/protected/public
generics
```

Patterns below are just **ways to combine these cleanly**.

---

# 1. Factory Pattern

Create objects **without exposing `new` logic**.

### When to use

* Different subclasses
* Conditional construction
* Hiding complexity (AWS clients, DB adapters, encoders, etc.)

### Example

```ts
interface Storage {
  upload(file: Buffer): Promise<string>;
}

class S3Storage implements Storage {
  async upload(file: Buffer) {
    return "s3-url";
  }
}

class LocalStorage implements Storage {
  async upload(file: Buffer) {
    return "local-path";
  }
}

class StorageFactory {
  static create(type: "s3" | "local"): Storage {
    switch (type) {
      case "s3":
        return new S3Storage();
      case "local":
        return new LocalStorage();
    }
  }
}
```

### Usage

```ts
const storage = StorageFactory.create(process.env.STORAGE_TYPE as any);
```

### Real world (you)

* S3 vs GCS
* FFmpeg vs MediaConvert backend
* Local vs cloud processing

---

# 2. Strategy Pattern

Swap algorithms dynamically.

### When to use

* Multiple behaviors
* Avoid giant `if/else`
* Pluggable logic

### Example

```ts
interface EncoderStrategy {
  encode(input: string): Promise<string>;
}

class ProxyEncoder implements EncoderStrategy {
  async encode(input: string) {
    return "proxy.mp4";
  }
}

class MezzanineEncoder implements EncoderStrategy {
  async encode(input: string) {
    return "mezzanine.mov";
  }
}

class Encoder {
  constructor(private strategy: EncoderStrategy) {}

  run(file: string) {
    return this.strategy.encode(file);
  }
}
```

### Usage

```ts
const encoder = new Encoder(new ProxyEncoder());
```

### Real world (you)

Perfect for:

* proxy vs mezzanine encoding
* different transcoding presets
* compression types
* pricing strategies

---

# 3. Singleton Pattern

Only **one instance exists**.

### When to use

* Config
* DB client
* Logger
* Metrics

### Example

```ts
class Logger {
  private static instance: Logger;

  private constructor() {}

  static getInstance() {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  log(msg: string) {
    console.log(msg);
  }
}
```

### Usage

```ts
Logger.getInstance().log("hello");
```

### Real world

* Redis client
* Prisma client
* AWS SDK client
* global metrics collector

---

# 4. Repository Pattern

Separate **data access** from business logic.

### When to use

* APIs
* DB abstraction
* clean architecture

### Example

```ts
interface User {
  id: string;
  name: string;
}

interface UserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
}

class PostgresUserRepository implements UserRepository {
  async findById(id: string) {
    // query db
    return { id, name: "Mo" };
  }

  async save(user: User) {
    // insert
  }
}
```

### Real world (you)

Great for:

* job state storage
* pipeline metadata
* Step Functions state
* audit tables

---

# 5. Dependency Injection (DI)

Pass dependencies in — don’t create internally.

### Why

* Testable
* Mockable
* Loose coupling

### Bad ❌

```ts
class Service {
  private repo = new PostgresUserRepository();
}
```

### Good ✅

```ts
class Service {
  constructor(private repo: UserRepository) {}
}
```

### Usage

```ts
const service = new Service(new PostgresUserRepository());
```

### Real world

Makes unit tests trivial:

```ts
new Service(mockRepo)
```

---

# 6. Observer Pattern (Event Driven)

Notify subscribers when something happens.

### When to use

* events
* async systems
* pub/sub

### Example

```ts
type Listener = (msg: string) => void;

class EventBus {
  private listeners: Listener[] = [];

  subscribe(fn: Listener) {
    this.listeners.push(fn);
  }

  publish(msg: string) {
    this.listeners.forEach(l => l(msg));
  }
}
```

### Real world (you)

Maps directly to:

* SQS
* SNS
* Kafka
* pipeline events

---

# 7. Decorator Pattern

Add behavior without modifying class.

### When to use

* logging
* caching
* retries
* metrics

### Example

```ts
class FileService {
  async process(file: string) {
    return "done";
  }
}

class LoggingDecorator {
  constructor(private service: FileService) {}

  async process(file: string) {
    console.time("process");
    const result = await this.service.process(file);
    console.timeEnd("process");
    return result;
  }
}
```

### Real world

* add retries to API calls
* wrap FFmpeg commands
* metrics timing

---

# 8. Builder Pattern

Construct complex objects step-by-step.

### When to use

* many optional params
* avoid huge constructors

### Example

```ts
class JobBuilder {
  private job: any = {};

  setInput(i: string) {
    this.job.input = i;
    return this;
  }

  setOutput(o: string) {
    this.job.output = o;
    return this;
  }

  build() {
    return this.job;
  }
}
```

### Usage

```ts
const job = new JobBuilder()
  .setInput("in.mp4")
  .setOutput("out.mp4")
  .build();
```

### Real world

Perfect for:

* MediaConvert job configs
* API request objects
* large pipeline definitions

---

# 🎯 Most Useful in Practice (priority order)

If you only master a few:

1. Strategy
2. Repository
3. Dependency Injection
4. Factory
5. Decorator

These cover ~90% of real systems.

---

# 🚀 Quick Architecture Example (your style system)

Combining patterns:

```ts
const encoder = new Encoder(
  EncoderFactory.create("proxy")
);

const repo = new PostgresJobRepository();

const service = new PipelineService(encoder, repo);
```

Patterns used:

* Factory
* Strategy
* Repository
* DI

Very interview-friendly design.

---

If you'd like, I can next:

✅ show a full FastAPI/Node service structured with these patterns
✅ give interview questions using these
✅ or refactor one of your media pipeline examples into clean OOP

Just say which 👍
