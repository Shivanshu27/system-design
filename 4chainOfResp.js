// The Chain of Responsibility design pattern is a behavioral design pattern that allows an object to pass a request along a chain of potential handlers until the request is handled. Each handler in the chain either handles the request or passes it to the next handler in the chain.

// Here's an example of how you can implement the Chain of Responsibility pattern with a logger that handles different levels of logging: info, debug, and error.



// Step-by-Step Implementation:
// Logger Interface: Define an interface for the loggers.
// Concrete Loggers: Implement concrete classes for each logger.
// Chain of Responsibility: Implement a chain of loggers.
// Client: Use the chain of loggers to log messages.
// Logger Interface     

class Logger {
    constructor(level) {
        this.level = level; // The log level that this logger handles
        this.nextLogger = null; // The next logger in the chain
    }

    setNextLogger(nextLogger) {
        this.nextLogger = nextLogger; // Set the next logger in the chain
    }

    logMessage(level, message) {
        // Check if this logger can handle the message
        // The '<=' operator ensures that loggers with higher priority (lower level value) can handle messages with lower priority (higher level value)
        if (this.level <= level) {
            this.write(message); // If yes, write the message
        }
        // Pass the message to the next logger in the chain if it exists
        if (this.nextLogger !== null) {
            this.nextLogger.logMessage(level, message);
        }
    }

    write(message) {
        // To be implemented by concrete loggers
    }
}

class InfoLogger extends Logger {
    constructor(level) {
        super(level);
    }

    write(message) {
        console.log("INFO: " + message);
    }
}

class DebugLogger extends Logger {
    constructor(level) {
        super(level);
    }

    write(message) {
        console.log("DEBUG: " + message);
    }
}

class ErrorLogger extends Logger {
    constructor(level) {
        super(level);
    }

    write(message) {
        console.log("ERROR: " + message);
    }
}

class DefaultLogger extends Logger {
    constructor(level) {
        super(level);
    }

    write(message) {
        console.log("DEFAULT: " + message);
    }
}

// Log levels
const INFO = 1;
const DEBUG = 2;
const ERROR = 3;
const DEFAULT = 4; // New log level for default handler

// Create loggers
const errorLogger = new ErrorLogger(ERROR);
const debugLogger = new DebugLogger(DEBUG);
const infoLogger = new InfoLogger(INFO);
const defaultLogger = new DefaultLogger(DEFAULT); // Create default logger

// Set the chain of responsibility
infoLogger.setNextLogger(debugLogger);
debugLogger.setNextLogger(errorLogger);
errorLogger.setNextLogger(defaultLogger); // Add default logger to the chain

// Use the chain
infoLogger.logMessage(INFO, "This is an information.");
infoLogger.logMessage(DEBUG, "This is a debug level information.");
infoLogger.logMessage(ERROR, "This is an error information.");
infoLogger.logMessage(4, "This is a message that no logger can handle."); // Test default handler



// In this example:

// Logger is the abstract base class that defines the structure for handling log messages.
// InfoLogger, DebugLogger, and ErrorLogger are concrete classes that extend Logger and implement the write method to handle specific log levels.
// The log levels are defined as constants: INFO, DEBUG, and ERROR.
// The chain of responsibility is set up by linking the loggers: infoLogger -> debugLogger -> errorLogger.
// When a log message is sent to infoLogger, it will pass the message along the chain until it finds a logger that can handle the message based on the log level.