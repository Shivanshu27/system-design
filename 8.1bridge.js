// The Bridge Design Pattern is a structural design pattern that decouples an abstraction from its implementation, allowing the two to vary independently. It is often used to avoid a permanent binding between an abstraction and its implementation, enabling flexibility and scalability.

// Key Concepts:
// Abstraction: Represents the high-level control layer, which defines the interface for the client.
// Implementation: Represents the low-level layer, which contains the actual implementation details.
// Bridge: Acts as a connector between the abstraction and the implementation.
// Why Use the Bridge Pattern?
// To separate abstraction from implementation, making the code more maintainable and extensible.
// To avoid a combinatorial explosion of classes when dealing with multiple dimensions of variation (e.g., different types of devices and operating systems).
// To allow the abstraction and implementation to evolve independently.


// Where It Is Used:
// Graphics Rendering: Separating rendering logic (e.g., 2D or 3D) from the platform-specific implementation (e.g., OpenGL, DirectX).
// Device Drivers: Abstracting device operations (e.g., printers, scanners) from their specific implementations.
// UI Frameworks: Decoupling UI components from their platform-specific rendering logic.


// Example Use Case:
// Imagine a scenario where you need to support multiple shapes (e.g., Circle, Rectangle) and multiple rendering APIs (e.g., OpenGL, DirectX). Without the Bridge Pattern, you would need to create a class for every combination (e.g., OpenGLCircle, DirectXRectangle). The Bridge Pattern allows you to separate the shape abstraction from the rendering implementation, reducing the number of classes.

// Abstraction
class Shape {
    constructor(renderer) {
        this.renderer = renderer; // Bridge to the implementation
    }
    draw() {
        throw new Error("This method should be overridden");
    }
}

// Refined Abstraction
class Circle extends Shape {
    constructor(renderer, radius) {
        super(renderer);
        this.radius = radius;
    }
    draw() {
        this.renderer.renderCircle(this.radius);
    }
}

// Implementation
class Renderer {
    renderCircle(radius) {
        throw new Error("This method should be overridden");
    }
}

// Concrete Implementation 1
class SVGRenderer extends Renderer {
    renderCircle(radius) {
        console.log(`Drawing a circle with radius ${radius} using SVG`);
    }
}

// Concrete Implementation 2
class CanvasRenderer extends Renderer {
    renderCircle(radius) {
        console.log(`Drawing a circle with radius ${radius} using Canvas`);
    }
}

// Client Code
const svgRenderer = new SVGRenderer();
const canvasRenderer = new CanvasRenderer();

const circle1 = new Circle(svgRenderer, 10);
circle1.draw(); // Output: Drawing a circle with radius 10 using SVG

const circle2 = new Circle(canvasRenderer, 20);
circle2.draw(); // Output: Drawing a circle with radius 20 using Canvas
