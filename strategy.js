// The Strategy Pattern is a behavioral design pattern that allows a class's behavior to be selected at runtime. It defines a family of algorithms, encapsulates each one, and makes them interchangeable without altering the client code that uses them.

// When to Use the Strategy Pattern
// Use the Strategy Pattern when:

// You have multiple algorithms for a specific task, and you want to switch between them dynamically.
// You want to avoid conditional statements (if-else or switch) for selecting different behaviors.
// You want to make your code more flexible and maintainable by encapsulating behavior separately.
// Example: Payment Processing System (JavaScript)
// Imagine an e-commerce application where users can pay using different payment methods (Credit Card, PayPal, and Bitcoin). The Strategy Pattern allows switching between payment methods without modifying the core logic.

// Step 1: Define a Strategy Interface
// Each strategy should have a common method (e.g., pay()).

// Payment strategy interface
class PaymentStrategy {
    pay(amount) {
      throw new Error("Method 'pay()' must be implemented");
    }
  }

  
//   Step 2: Implement Concrete Strategies
// Each payment method follows the same interface.


// Concrete Strategy: Credit Card Payment
class CreditCardPayment extends PaymentStrategy {
    constructor(cardNumber) {
      super();
      this.cardNumber = cardNumber;
    }
  
    pay(amount) {
      console.log(`Paid $${amount} using Credit Card (Card Number: ${this.cardNumber}).`);
    }
  }
  
  // Concrete Strategy: PayPal Payment
  class PayPalPayment extends PaymentStrategy {
    constructor(email) {
      super();
      this.email = email;
    }
  
    pay(amount) {
      console.log(`Paid $${amount} using PayPal (Email: ${this.email}).`);
    }
  }
  
  // Concrete Strategy: Bitcoin Payment
  class BitcoinPayment extends PaymentStrategy {
    constructor(walletAddress) {
      super();
      this.walletAddress = walletAddress;
    }
  
    pay(amount) {
      console.log(`Paid $${amount} using Bitcoin (Wallet: ${this.walletAddress}).`);
    }
  }
//     Step 3: Create a Context Class
// The context (PaymentProcessor) uses a strategy dynamically.

class PaymentProcessor {
    constructor(paymentStrategy) {
      this.paymentStrategy = paymentStrategy;
    }
  
    setPaymentStrategy(paymentStrategy) {
      this.paymentStrategy = paymentStrategy;
    }
  
    processPayment(amount) {
      this.paymentStrategy.pay(amount);
    }
  }

//   Step 4: Usage Example
// Now, let's test our Strategy Pattern:

  // Using Credit Card Payment
const creditCardPayment = new CreditCardPayment("1234-5678-9876-5432");
const paymentProcessor = new PaymentProcessor(creditCardPayment);
paymentProcessor.processPayment(100); 

// Switching to PayPal Payment
const paypalPayment = new PayPalPayment("user@example.com");
paymentProcessor.setPaymentStrategy(paypalPayment);
paymentProcessor.processPayment(50);

// Switching to Bitcoin Payment
const bitcoinPayment = new BitcoinPayment("1A2b3C4d5E6f");
paymentProcessor.setPaymentStrategy(bitcoinPayment);
paymentProcessor.processPayment(200);


// Paid $100 using Credit Card (Card Number: 1234-5678-9876-5432).
// Paid $50 using PayPal (Email: user@example.com).
// Paid $200 using Bitcoin (Wallet: 1A2b3C4d5E6f).


// Advantages of the Strategy Pattern
// ✅ Encapsulation of Algorithms – Keeps payment methods separate from the main business logic.
// ✅ Easier Maintenance – Adding new payment methods is simple, without modifying existing logic.
// ✅ Better Code Reusability – Each payment method is reusable in different contexts.
// ✅ Eliminates if-else Statements – Dynamically selects behavior instead of using conditionals.

// Real-World Use Cases
// Sorting Algorithms: Different sorting methods (QuickSort, MergeSort, BubbleSort).
// Authentication Strategies: Logging in via Google, Facebook, or email/password.
// Compression Algorithms: Choosing between ZIP, RAR, and GZIP for file compression.
// AI Game Behavior: Different AI strategies for easy, medium, and hard difficulty levels.