# SOLID Design Principles

The SOLID principles are a set of five design principles intended to make software designs more understandable, flexible, and maintainable. They are especially useful in object-oriented design. The principles are:

1. Single Responsibility Principle (SRP)
2. Open/Closed Principle (OCP)
3. Liskov Substitution Principle (LSP)
4. Interface Segregation Principle (ISP)
5. Dependency Inversion Principle (DIP)

## 1. Single Responsibility Principle (SRP)

**Definition:** A class should have only one reason to change, meaning it should have only one job or responsibility.

**Example:**

```javascript
// Violating SRP
class User {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }

    saveToDatabase() {
        // code to save user to database
    }

    sendEmail() {
        // code to send email
    }
}

// Following SRP
class User {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }
}

class UserRepository {
    save(user) {
        // code to save user to database
    }
}

class EmailService {
    sendEmail(user) {
        // code to send email
    }
}
```

## 2. Open/Closed Principle (OCP)

**Definition:** Software entities (classes, modules, functions, etc.) should be open for extension but closed for modification.

**Example:**

```javascript
// Violating OCP
class Rectangle {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    area() {
        return this.width * this.height;
    }
}

class Circle {
    constructor(radius) {
        this.radius = radius;
    }

    area() {
        return Math.PI * Math.pow(this.radius, 2);
    }
}

class AreaCalculator {
    calculate(shape) {
        if (shape instanceof Rectangle) {
            return shape.area();
        } else if (shape instanceof Circle) {
            return shape.area();
        }
        return 0;
    }
}

// Following OCP
class Shape {
    area() {
        throw new Error('This method should be overridden');
    }
}

class Rectangle extends Shape {
    constructor(width, height) {
        super();
        this.width = width;
        this.height = height;
    }

    area() {
        return this.width * this.height;
    }
}

class Circle extends Shape {
    constructor(radius) {
        super();
        this.radius = radius;
    }

    area() {
        return Math.PI * Math.pow(this.radius, 2);
    }
}

class AreaCalculator {
    calculate(shape) {
        return shape.area();
    }
}
```

## 3. Liskov Substitution Principle (LSP)

**Definition:** Objects of a superclass should be replaceable with objects of a subclass without affecting the correctness of the program.

**Example:**

```javascript
// Violating LSP
class Bird {
    fly() {
        // code to make bird fly
    }
}

class Ostrich extends Bird {
    fly() {
        throw new Error('Ostriches cannot fly');
    }
}

// Following LSP
class Bird {
    // bird properties and methods
}

class FlyingBird extends Bird {
    fly() {
        // code to make bird fly
    }
}

class Ostrich extends Bird {
    // ostrich specific properties and methods
}
```

## 4. Interface Segregation Principle (ISP)

**Definition:** A client should not be forced to depend on interfaces it does not use. Instead of one fat interface, many small interfaces are preferred based on groups of methods with specific behaviors.

**Example:**

```javascript
// Violating ISP
class Printer {
    print() {
        // print logic
    }

    scan() {
        // scan logic
    }

    fax() {
        // fax logic
    }
}

// Following ISP
class Printer {
    print() {
        // print logic
    }
}

class Scanner {
    scan() {
        // scan logic
    }
}

class Fax {
    fax() {
        // fax logic
    }
}

class MultiFunctionPrinter {
    constructor(printer, scanner, fax) {
        this.printer = printer;
        this.scanner = scanner;
        this.fax = fax;
    }

    print() {
        this.printer.print();
    }

    scan() {
        this.scanner.scan();
    }

    fax() {
        this.fax.fax();
    }
}
```

## 5. Dependency Inversion Principle (DIP)

**Definition:** High-level modules should not depend on low-level modules. Both should depend on abstractions. Abstractions should not depend on details. Details should depend on abstractions.

**Example:**

```javascript
// Violating DIP
class MySQLDatabase {
    connect() {
        // MySQL specific connection logic
    }
}

class UserRepository {
    constructor() {
        this.db = new MySQLDatabase();
    }

    getUserById(id) {
        this.db.connect();
        // get user logic
    }
}

// Following DIP
class Database {
    connect() {
        throw new Error('This method should be overridden');
    }
}

class MySQLDatabase extends Database {
    connect() {
        // MySQL specific connection logic
    }
}

class UserRepository {
    constructor(db) {
        this.db = db;
    }

    getUserById(id) {
        this.db.connect();
        // get user logic
    }
}

// Usage
const mySQLDatabase = new MySQLDatabase();
const userRepository = new UserRepository(mySQLDatabase);
```

# Summary

- **Single Responsibility Principle:** A class should have only one reason to change.
- **Open/Closed Principle:** Software entities should be open for extension but closed for modification.
- **Liskov Substitution Principle:** Subclasses should be substitutable for their base classes.
- **Interface Segregation Principle:** Clients should not be forced to depend on interfaces they do not use.
- **Dependency Inversion Principle:** High-level modules should not depend on low-level modules. Both should depend on abstractions.

By following these principles, you can create more maintainable, scalable, and flexible software designs.
