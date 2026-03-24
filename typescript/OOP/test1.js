// ============================================
// JavaScript OOP Practice - Common Patterns
// ============================================

// -----------------------------------------------
// 1. Basic Class & Constructor
// -----------------------------------------------
class Animal {
    constructor(name, type) {
        this.name = name;
        this.type = type;
    }

    speak() {
        return `${this.name} makes a sound.`;
    }

    toString() {
        return `[Animal: ${this.name}, Type: ${this.type}]`;
    }
}

const dog = new Animal("Rex", "Dog");
console.log(dog.speak());       // Rex makes a sound.
console.log(dog.toString());    // [Animal: Rex, Type: Dog]

// -----------------------------------------------
// 2. Inheritance (extends / super)
// -----------------------------------------------
class Dog extends Animal {
    constructor(name, breed) {
        super(name, "Dog"); // call parent constructor
        this.breed = breed;
    }

    // Override parent method
    speak() {
        return `${this.name} barks!`;
    }

    fetch(item) {
        return `${this.name} fetches the ${item}.`;
    }
}

const myDog = new Dog("Buddy", "Golden Retriever");
console.log(myDog.speak());          // Buddy barks!
console.log(myDog.fetch("ball"));    // Buddy fetches the ball.
console.log(myDog instanceof Dog);   // true
console.log(myDog instanceof Animal); // true

// -----------------------------------------------
// 3. Encapsulation with Private Fields (#)
// -----------------------------------------------
class BankAccount {
    #balance; // private field

    constructor(owner, initialBalance = 0) {
        this.owner = owner;
        this.#balance = initialBalance;
    }

    deposit(amount) {
        if (amount <= 0) throw new Error("Deposit must be positive");
        this.#balance += amount;
        return this.#balance;
    }

    withdraw(amount) {
        if (amount > this.#balance) throw new Error("Insufficient funds");
        this.#balance -= amount;
        return this.#balance;
    }

    get balance() {
        return this.#balance;
    }
}

const acct = new BankAccount("Alice", 100);
acct.deposit(50);
console.log(acct.balance);       // 150
acct.withdraw(30);
console.log(acct.balance);       // 120
// console.log(acct.#balance);   // SyntaxError - private field!

// -----------------------------------------------
// 4. Getters & Setters
// -----------------------------------------------
class Temperature {
    #celsius;

    constructor(celsius) {
        this.#celsius = celsius;
    }

    get fahrenheit() {
        return this.#celsius * 9 / 5 + 32;
    }

    set fahrenheit(f) {
        this.#celsius = (f - 32) * 5 / 9;
    }

    get celsius() {
        return this.#celsius;
    }

    set celsius(c) {
        this.#celsius = c;
    }
}

const temp = new Temperature(0);
console.log(temp.fahrenheit);  // 32
temp.fahrenheit = 212;
console.log(temp.celsius);     // 100

// -----------------------------------------------
// 5. Static Methods & Properties
// -----------------------------------------------
class MathUtils {
    static PI = 3.14159;

    static circleArea(radius) {
        return MathUtils.PI * radius ** 2;
    }

    static factorial(n) {
        if (n <= 1) return 1;
        return n * MathUtils.factorial(n - 1);
    }
}

console.log(MathUtils.PI);            // 3.14159
console.log(MathUtils.circleArea(5)); // 78.53975
console.log(MathUtils.factorial(5));  // 120
// Note: static members belong to the class, not instances

// -----------------------------------------------
// 6. Composition over Inheritance
// -----------------------------------------------
// Instead of deep inheritance chains, compose objects from smaller pieces

const canWalk = (state) => ({
    walk: () => `${state.name} is walking.`,
});

const canSwim = (state) => ({
    swim: () => `${state.name} is swimming.`,
});

const canFly = (state) => ({
    fly: () => `${state.name} is flying.`,
});

function createDuck(name) {
    const state = { name };
    return {
        ...state,
        ...canWalk(state),
        ...canSwim(state),
        ...canFly(state),
    };
}

const duck = createDuck("Donald");
console.log(duck.walk());  // Donald is walking.
console.log(duck.swim());  // Donald is swimming.
console.log(duck.fly());   // Donald is flying.

// -----------------------------------------------
// 7. Builder Pattern
// -----------------------------------------------
class QueryBuilder {
    #table;
    #conditions = [];
    #orderBy = null;
    #limit = null;

    from(table) {
        this.#table = table;
        return this; // return this for chaining
    }

    where(condition) {
        this.#conditions.push(condition);
        return this;
    }

    order(field) {
        this.#orderBy = field;
        return this;
    }

    take(n) {
        this.#limit = n;
        return this;
    }

    build() {
        let query = `SELECT * FROM ${this.#table}`;
        if (this.#conditions.length) {
            query += ` WHERE ${this.#conditions.join(" AND ")}`;
        }
        if (this.#orderBy) query += ` ORDER BY ${this.#orderBy}`;
        if (this.#limit) query += ` LIMIT ${this.#limit}`;
        return query;
    }
}

const sql = new QueryBuilder()
    .from("users")
    .where("age > 18")
    .where("active = true")
    .order("name")
    .take(10)
    .build();

console.log(sql);
// SELECT * FROM users WHERE age > 18 AND active = true ORDER BY name LIMIT 10

// -----------------------------------------------
// 8. Singleton Pattern
// -----------------------------------------------
class Database {
    static #instance = null;

    constructor(connectionString) {
        if (Database.#instance) {
            return Database.#instance;
        }
        this.connectionString = connectionString;
        this.connected = false;
        Database.#instance = this;
    }

    connect() {
        this.connected = true;
        return `Connected to ${this.connectionString}`;
    }

    static getInstance() {
        return Database.#instance;
    }
}

const db1 = new Database("mongodb://localhost");
const db2 = new Database("postgres://localhost"); // returns same instance
console.log(db1 === db2); // true
console.log(db2.connectionString); // mongodb://localhost

// -----------------------------------------------
// 9. Observer Pattern (Pub/Sub)
// -----------------------------------------------
class EventEmitter {
    #listeners = {};

    on(event, callback) {
        if (!this.#listeners[event]) this.#listeners[event] = [];
        this.#listeners[event].push(callback);
        return this;
    }

    off(event, callback) {
        if (!this.#listeners[event]) return;
        this.#listeners[event] = this.#listeners[event].filter(cb => cb !== callback);
        return this;
    }

    emit(event, ...args) {
        if (!this.#listeners[event]) return;
        this.#listeners[event].forEach(cb => cb(...args));
        return this;
    }
}

const emitter = new EventEmitter();
const onMessage = (msg) => console.log(`Received: ${msg}`);

emitter.on("message", onMessage);
emitter.emit("message", "Hello OOP!");  // Received: Hello OOP!
emitter.off("message", onMessage);
emitter.emit("message", "This won't print");

// -----------------------------------------------
// 10. Polymorphism
// -----------------------------------------------
class Shape {
    area() {
        throw new Error("area() must be implemented");
    }
}

class Circle extends Shape {
    constructor(radius) {
        super();
        this.radius = radius;
    }
    area() {
        return Math.PI * this.radius ** 2;
    }
}

class Rectangle extends Shape {
    constructor(w, h) {
        super();
        this.w = w;
        this.h = h;
    }
    area() {
        return this.w * this.h;
    }
}

// Same interface, different behavior
const shapes = [new Circle(5), new Rectangle(4, 6)];
shapes.forEach(s => console.log(s.area().toFixed(2)));
// 78.54
// 24.00
