// Prototype Design Pattern
// The Prototype pattern is used to create new objects by copying an existing object, known as the prototype.
// This is useful when object creation is expensive, and you want to avoid creating objects from scratch.

class Prototype {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    clone() {
        return new Prototype(this.name, this.age);
    }
}

// Example usage
const original = new Prototype('Alice', 30);
const clone = original.clone();
console.log(clone); // Outputs: Prototype { name: 'Alice', age: 30 }

// Singleton Design Pattern
// The Singleton pattern ensures that a class has only one instance and provides a global point of access to it.
// Why Use the Singleton Pattern?
// - To control access to a shared resource, such as a database connection or a configuration file.
// - To ensure consistency by having a single point of control.
// - To reduce memory usage by reusing the same instance instead of creating multiple instances.
// - To simplify debugging and testing by avoiding multiple instances of the same class.

class Singleton {
    constructor() {
        if (Singleton.instance) {
            return Singleton.instance;
        }
        Singleton.instance = this;
        this.data = {};
    }

    set(key, value) {
        this.data[key] = value;
    }

    get(key) {
        return this.data[key];
    }
}

// Example usage
const singleton1 = new Singleton();
singleton1.set('name', 'SingletonInstance');
const singleton2 = new Singleton();
console.log(singleton2.get('name')); // Outputs: SingletonInstance
console.log(singleton1 === singleton2); // Outputs: true

// Singleton Design Pattern with Database Connection Example

// 1. Eager Initialization
// The instance is created at the time of class loading.
class EagerSingletonDB {
    constructor() {
        if (EagerSingletonDB.instance) {
            return EagerSingletonDB.instance;
        }
        this.connection = this.createConnection();
        EagerSingletonDB.instance = this;
    }

    createConnection() {
        return 'Eager DB Connection';
    }

    getConnection() {
        return this.connection;
    }
}

// Example usage
const eagerDB1 = new EagerSingletonDB();
const eagerDB2 = new EagerSingletonDB();
console.log(eagerDB1.getConnection()); // Outputs: Eager DB Connection
console.log(eagerDB1 === eagerDB2); // Outputs: true

// 2. Lazy Initialization
// The instance is created only when it is needed.
class LazySingletonDB {
    constructor() {
        if (LazySingletonDB.instance) {
            return LazySingletonDB.instance;
        }
        LazySingletonDB.instance = this;
    }

    createConnection() {
        if (!this.connection) {
            this.connection = 'Lazy DB Connection';
        }
        return this.connection;
    }

    getConnection() {
        return this.createConnection();
    }
}

// Example usage
const lazyDB1 = new LazySingletonDB();
const lazyDB2 = new LazySingletonDB();
console.log(lazyDB1.getConnection()); // Outputs: Lazy DB Connection
console.log(lazyDB1 === lazyDB2); // Outputs: true

// 3. Synchronized Singleton
// Ensures thread safety by synchronizing the instance creation.
class SynchronizedSingletonDB {
    constructor() {
        if (SynchronizedSingletonDB.instance) {
            return SynchronizedSingletonDB.instance;
        }
        SynchronizedSingletonDB.instance = this;
    }

    static getInstance() {
        if (!SynchronizedSingletonDB.instance) {
            synchronized(() => {
                if (!SynchronizedSingletonDB.instance) {
                    SynchronizedSingletonDB.instance = new SynchronizedSingletonDB();
                }
            });
        }
        return SynchronizedSingletonDB.instance;
    }

    createConnection() {
        if (!this.connection) {
            this.connection = 'Synchronized DB Connection';
        }
        return this.connection;
    }

    getConnection() {
        return this.createConnection();
    }
}

// Example usage
const syncDB1 = SynchronizedSingletonDB.getInstance();
const syncDB2 = SynchronizedSingletonDB.getInstance();
console.log(syncDB1.getConnection()); // Outputs: Synchronized DB Connection
console.log(syncDB1 === syncDB2); // Outputs: true

// 4. Double-Checked Locking Singleton
// Optimizes performance by reducing the overhead of synchronization.
class DoubleCheckedLockingSingletonDB {
    constructor() {
        if (DoubleCheckedLockingSingletonDB.instance) {
            return DoubleCheckedLockingSingletonDB.instance;
        }
        DoubleCheckedLockingSingletonDB.instance = this;
    }

    static getInstance() {
        if (!DoubleCheckedLockingSingletonDB.instance) {
            if (!DoubleCheckedLockingSingletonDB.instance) {
                DoubleCheckedLockingSingletonDB.instance = new DoubleCheckedLockingSingletonDB();
                DoubleCheckedLockingSingletonDB.instance.connection = 'Double-Checked Locking DB Connection';
            }
        }
        return DoubleCheckedLockingSingletonDB.instance;
    }

    getConnection() {
        return DoubleCheckedLockingSingletonDB.instance.connection;
    }
}

// Example usage
const doubleLockDB1 = DoubleCheckedLockingSingletonDB.getInstance();
const doubleLockDB2 = DoubleCheckedLockingSingletonDB.getInstance();
console.log(doubleLockDB1.getConnection()); // Outputs: Double-Checked Locking DB Connection
console.log(doubleLockDB1 === doubleLockDB2); // Outputs: true

// Factory Design Pattern
// The Factory pattern provides a way to create objects without specifying the exact class of the object that will be created.

class Car {
    constructor(brand, model) {
        this.brand = brand;
        this.model = model;
    }
}

class Bike {
    constructor(brand, model) {
        this.brand = brand;
        this.model = model;
    }
}

class VehicleFactory {
    static createVehicle(type, brand, model) {
        switch (type) {
            case 'car':
                return new Car(brand, model);
            case 'bike':
                return new Bike(brand, model);
            default:
                throw new Error('Unknown vehicle type');
        }
    }
}

// Example usage
const car = VehicleFactory.createVehicle('car', 'Toyota', 'Corolla');
console.log(car); // Outputs: Car { brand: 'Toyota', model: 'Corolla' }

const bike = VehicleFactory.createVehicle('bike', 'Yamaha', 'R15');
console.log(bike); // Outputs: Bike { brand: 'Yamaha', model: 'R15' }
