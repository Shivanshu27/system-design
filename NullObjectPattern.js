// # Null Object Pattern

// The Null Object Pattern is all about handling the `null` keyword in a way that removes all of those nasty `if (object != null)` checks from your code. Instead of using `null` to represent the absence of an object, you use a special object that implements the expected interface but does nothing.

// ## Explanation

// In many object-oriented programs, you often encounter situations where you need to check if an object is `null` before performing some operations. This can lead to a lot of repetitive and error-prone code. The Null Object Pattern provides a way to avoid these checks by using a special object that represents the absence of a real object but still adheres to the expected interface.

// ## Example

// Consider a logging system where you want to log messages to a file. If no logger is provided, you don't want to perform any logging but also don't want to check for `null` every time you log a message.

// ```javascript
// Logger Interface
class Logger {
    log(message) {
        throw new Error('This method should be overridden');
    }
}

// Real Logger
class FileLogger extends Logger {
    log(message) {
        console.log(`Logging to file: ${message}`);
    }
}

// Null Logger
class NullLogger extends Logger {
    log(message) {
        // Do nothing
    }
}

// Client code
class Application {
    constructor(logger = new NullLogger()) {
        this.logger = logger;
    }

    run() {
        this.logger.log('Application is running');
        // ...other code...
    }
}

// Usage
const fileLogger = new FileLogger();
const appWithLogger = new Application(fileLogger);
appWithLogger.run(); // Outputs: Logging to file: Application is running

const appWithoutLogger = new Application();
appWithoutLogger.run(); // No output, but no null checks needed
// ```

// ## Summary

// - The Null Object Pattern helps to avoid `null` checks by using a special object that does nothing but adheres to the expected interface.
// - This pattern can make your code cleaner and less error-prone by removing repetitive `null` checks.
// - In the example, `NullLogger` is used to represent the absence of a real logger, allowing the `Application` class to log messages without worrying about whether a logger is provided or not.
