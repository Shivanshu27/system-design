// The Observer Design Pattern is a behavioral design pattern where an object, known as the subject, maintains a list of its dependents, called observers, and notifies them of any state changes, typically by calling one of their methods. It is mainly used to implement distributed event-handling systems.

// When to Use the Observer Pattern
// When changes to one object need to be propagated to a set of dependent objects.
// When an object should be able to notify other objects without making assumptions about who those objects are.
// When a single event in one object needs to trigger updates in multiple other objects.
// Example: Notification System
// Let's create a notification system where users can subscribe to notifications, and the system will notify all subscribed users whenever there is a new notification.

// Step-by-Step Implementation:
// Observer Interface: Define an interface for the observers.
// Concrete Observers: Implement concrete classes for each observer.
// Subject Class: Define a class for the subject that maintains a list of observers.
// Concrete Subject: Implement a concrete class for the subject.


// Observer Interface
class Observer {
    update(notification) {
        throw new Error("This method must be overridden!");
    }
}


// Concrete Observer: UserObserver
class UserObserver extends Observer {
    constructor(userName) {
        super();
        this.userName = userName;
    }

    update(notification) {
        console.log(`${this.userName} received notification: ${notification}`);
    }
}



// Subject Class
class Subject {
    constructor() {
        this.observers = [];
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    removeObserver(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notifyObservers(notification) {
        this.observers.forEach(observer => observer.update(notification));
    }
}



// Concrete Subject: NotificationSystem
class NotificationSystem extends Subject {
    createNotification(notification) {
        console.log(`New notification: ${notification}`);
        this.notifyObservers(notification);
    }
}


// Example usage
const notificationSystem = new NotificationSystem();

const user1 = new UserObserver('User1');
const user2 = new UserObserver('User2');
const user3 = new UserObserver('User3');

// Add observers
notificationSystem.addObserver(user1);
notificationSystem.addObserver(user2);
notificationSystem.addObserver(user3);

// Create a new notification
notificationSystem.createNotification('This is a test notification.');

// Remove an observer
notificationSystem.removeObserver(user2);

// Create another notification
notificationSystem.createNotification('Another test notification.');