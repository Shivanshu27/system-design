// The Builder Design Pattern is a creational design pattern that is used to construct complex objects step by step. It separates the construction of an object from its representation, allowing the same construction process to create different representations.

// Key Concepts of Builder Pattern
// Builder: Defines the steps to build the object.
// Concrete Builder: Implements the steps defined by the builder.
// Director: Orchestrates the building process using the builder.
// Product: The final object that is constructed.



// Product Class
class Computer {
    constructor() {
        this.cpu = null;
        this.ram = null;
        this.storage = null;
        this.gpu = null;
        this.os = null;
    }

    displayConfiguration() {
        return `Computer Configuration:
        CPU: ${this.cpu}
        RAM: ${this.ram}
        Storage: ${this.storage}
        GPU: ${this.gpu}
        OS: ${this.os}`;
    }
}

// Builder Interface
class ComputerBuilder {
    setCPU(cpu) {
        throw new Error("Method 'setCPU()' must be implemented.");
    }

    setRAM(ram) {
        throw new Error("Method 'setRAM()' must be implemented.");
    }

    setStorage(storage) {
        throw new Error("Method 'setStorage()' must be implemented.");
    }

    setGPU(gpu) {
        throw new Error("Method 'setGPU()' must be implemented.");
    }

    setOS(os) {
        throw new Error("Method 'setOS()' must be implemented.");
    }

    build() {
        throw new Error("Method 'build()' must be implemented.");
    }
}

// Concrete Builder
class GamingComputerBuilder extends ComputerBuilder {
    constructor() {
        super();
        this.computer = new Computer();
    }

    setCPU(cpu) {
        this.computer.cpu = cpu;
        return this;
    }

    setRAM(ram) {
        this.computer.ram = ram;
        return this;
    }

    setStorage(storage) {
        this.computer.storage = storage;
        return this;
    }

    setGPU(gpu) {
        this.computer.gpu = gpu;
        return this;
    }

    setOS(os) {
        this.computer.os = os;
        return this;
    }

    build() {
        return this.computer;
    }
}

// Director
class ComputerDirector {
    static constructGamingComputer(builder) {
        return builder
            .setCPU("Intel Core i9")
            .setRAM("32GB")
            .setStorage("1TB SSD")
            .setGPU("NVIDIA RTX 4090")
            .setOS("Windows 11")
            .build();
    }

    static constructOfficeComputer(builder) {
        return builder
            .setCPU("Intel Core i5")
            .setRAM("16GB")
            .setStorage("512GB SSD")
            .setGPU("Integrated Graphics")
            .setOS("Windows 10")
            .build();
    }
}

// Example Usage
function demonstrateBuilderPattern() {
    const gamingBuilder = new GamingComputerBuilder();
    const gamingComputer = ComputerDirector.constructGamingComputer(gamingBuilder);
    console.log(gamingComputer.displayConfiguration());

    const officeBuilder = new GamingComputerBuilder();
    const officeComputer = ComputerDirector.constructOfficeComputer(officeBuilder);
    console.log(officeComputer.displayConfiguration());
}

// Run the demonstration
demonstrateBuilderPattern();



// Explanation of the Code
// Product (Computer):

// Represents the object being built.
// Contains properties like cpu, ram, storage, gpu, and os.
// Builder Interface (ComputerBuilder):

// Defines the methods required to build the product (e.g., setCPU, setRAM, etc.).
// Ensures a consistent interface for all concrete builders.
// Concrete Builder (GamingComputerBuilder):

// Implements the methods defined in the builder interface.
// Constructs the Computer object step by step.
// Director (ComputerDirector):

// Orchestrates the building process by calling the builder methods in a specific sequence.
// Provides predefined configurations for different types of computers (e.g., gaming or office).
// Usage:

// The ComputerDirector uses the GamingComputerBuilder to construct a gaming computer and an office computer.
// The final configurations are displayed using the displayConfiguration method.


// Computer Configuration:
//         CPU: Intel Core i9
//         RAM: 32GB
//         Storage: 1TB SSD
//         GPU: NVIDIA RTX 4090
//         OS: Windows 11
// Computer Configuration:
//         CPU: Intel Core i5
//         RAM: 16GB
//         Storage: 512GB SSD
//         GPU: Integrated Graphics
//         OS: Windows 10



//         Advantages of Builder Pattern
// Step-by-Step Construction: Allows constructing complex objects step by step.
// Reusability: The same builder can be reused to create different representations of the product.
// Separation of Concerns: The construction logic is separated from the product itself.
// This pattern is particularly useful when creating objects with many optional parameters or configurations.