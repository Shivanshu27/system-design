// The Flyweight Design Pattern is a structural design pattern that focuses on minimizing memory usage by sharing as much data as possible with similar objects. It is particularly useful when you need to create a large number of objects that share common properties, reducing redundancy and improving performance.

// What is the Flyweight Design Pattern?

// Definition: It is a design pattern that allows you to share common parts of an object state among multiple objects, while keeping the unique state externalized.

// Key Idea: Separate intrinsic (shared) state from extrinsic (unique) state. Intrinsic state is stored in the Flyweight object, while extrinsic state is passed to the object when needed.


// Why Use the Flyweight Pattern?
// To reduce memory usage when dealing with a large number of similar objects.
// To improve performance by avoiding the overhead of creating and managing many similar objects.


// Where is it Used?
// Applications with a large number of similar objects, such as:
// Rendering systems (e.g., text editors, where characters are shared).
// Game development (e.g., sharing common properties of game entities).
// Caching mechanisms.


// Example: Robotic Game
// In a robotic game, you want to create multiple robots (e.g., humanoid robots and robotic dogs) at various coordinates. Instead of creating separate objects for each robot, you can use the Flyweight pattern to share common properties (e.g., type, appearance) and only store unique properties (e.g., coordinates) externally.

// Flyweight class to represent shared properties of robots
class Robot {
    constructor(type) {
        this.type = type; // Intrinsic state (shared)
    }

    render(x, y) {
        console.log(`${this.type} robot is at (${x}, ${y})`);
    }
}

// Flyweight Factory to manage shared Robot instances
class RobotFactory {
    constructor() {
        this.robots = {}; // Cache for shared Robot instances
    }

    getRobot(type) {
        if (!this.robots[type]) {
            this.robots[type] = new Robot(type); // Create and cache new Robot
        }
        return this.robots[type];
    }
}

// Client code
class Game {
    constructor() {
        this.robotFactory = new RobotFactory();
        this.robots = []; // Store extrinsic state (coordinates)
    }

    addRobot(type, x, y) {
        const robot = this.robotFactory.getRobot(type); // Get shared Robot instance
        this.robots.push({ robot, x, y }); // Store extrinsic state
    }

    renderRobots() {
        this.robots.forEach(({ robot, x, y }) => robot.render(x, y));
    }
}

// Example usage
const game = new Game();
game.addRobot('Humanoid', 10, 20);
game.addRobot('Robotic Dog', 30, 40);
game.addRobot('Humanoid', 50, 60); // Shares the same Humanoid instance
game.addRobot('Robotic Dog', 70, 80); // Shares the same Robotic Dog instance

game.renderRobots();




// Explanation of the Code
// Robot Class: Represents the Flyweight object with intrinsic state (type).
// RobotFactory: Manages the creation and sharing of Flyweight objects.
// Game Class: Stores the extrinsic state (coordinates) and uses the Flyweight objects.
// Efficiency: Only two Robot instances (Humanoid and Robotic Dog) are created, even though multiple robots are added to the game.
// This approach reduces memory usage and improves performance by sharing common properties of robots.


// Example: Word Processor
// In a word processor, characters are repeated frequently. Instead of creating a new object for each character, 
// the Flyweight pattern can be used to share character objects and store their unique positions externally.

class Character {
    constructor(char) {
        this.char = char; // Intrinsic state (shared)
    }

    render(x, y) {
        console.log(`Character '${this.char}' is at (${x}, ${y})`);
    }
}

class CharacterFactory {
    constructor() {
        this.characters = {}; // Cache for shared Character instances
    }

    getCharacter(char) {
        if (!this.characters[char]) {
            this.characters[char] = new Character(char); // Create and cache new Character
        }
        return this.characters[char];
    }
}

class Document {
    constructor() {
        this.characterFactory = new CharacterFactory();
        this.characters = []; // Store extrinsic state (positions)
    }

    addCharacter(char, x, y) {
        const character = this.characterFactory.getCharacter(char); // Get shared Character instance
        this.characters.push({ character, x, y }); // Store extrinsic state
    }

    renderDocument() {
        this.characters.forEach(({ character, x, y }) => character.render(x, y));
    }
}

// Example usage
const document = new Document();
document.addCharacter('H', 0, 0);
document.addCharacter('e', 1, 0);
document.addCharacter('l', 2, 0);
document.addCharacter('l', 3, 0); // Shares the same 'l' instance
document.addCharacter('o', 4, 0);

document.renderDocument();

// Explanation of the Word Processor Example
// Character Class: Represents the Flyweight object with intrinsic state (char).
// CharacterFactory: Manages the creation and sharing of Flyweight objects.
// Document Class: Stores the extrinsic state (positions) and uses the Flyweight objects.
// Efficiency: Only one instance is created for each unique character, reducing memory usage.