// The Facade Design Pattern is a structural design pattern that provides a simplified interface to a larger body of code, such as a complex subsystem. It hides the complexities of the subsystem and provides a unified interface to the client, making the subsystem easier to use.

// Why and Where It Is Used:
// Simplification: It simplifies the interaction with complex subsystems by providing a single entry point.
// Decoupling: It decouples the client code from the subsystem, making the system more maintainable and flexible.
// Improved Readability: It improves code readability by reducing the number of classes and methods the client needs to interact with.
// Reduced Complexity: It reduces the complexity of the client code by hiding the intricate details of the subsystem.

// Use Cases:
// When you want to provide a unified interface to a set of interfaces in a subsystem.
// When you want to reduce dependencies between the client and the subsystem.
// When you want to make a system easier to use by hiding its complexity.

// Subsystem: ProductDAO
class ProductDAO {
    getProductDetails(productId) {
        // Simulate fetching product details
        return { id: productId, name: "Product A", price: 100 };
    }
}

// Subsystem: Invoice
class Invoice {
    generateInvoice(orderDetails) {
        console.log("Invoice generated for:", orderDetails);
    }
}

// Subsystem: Payment
class Payment {
    processPayment(amount) {
        console.log(`Payment of $${amount} processed successfully.`);
        return true;
    }
}

// Subsystem: Notification
class Notification {
    sendNotification(message) {
        console.log("Notification sent:", message);
    }
}

// Facade: OrderFacade
class OrderFacade {
    constructor() {
        this.productDAO = new ProductDAO();
        this.invoice = new Invoice();
        this.payment = new Payment();
        this.notification = new Notification();
    }

    placeOrder(productId, quantity) {
        const product = this.productDAO.getProductDetails(productId);
        const totalAmount = product.price * quantity;

        console.log(`Placing order for ${quantity} unit(s) of ${product.name}.`);
        
        if (this.payment.processPayment(totalAmount)) {
            const orderDetails = { product, quantity, totalAmount };
            this.invoice.generateInvoice(orderDetails);
            this.notification.sendNotification("Your order has been placed successfully!");
        } else {
            console.log("Payment failed. Order could not be placed.");
        }
    }
}

// Client Code
const orderFacade = new OrderFacade();
orderFacade.placeOrder(1, 2);


// Explanation of the Example:
// Subsystems:

// ProductDAO: Fetches product details.
// Invoice: Generates an invoice for the order.
// Payment: Processes the payment.
// Notification: Sends a notification to the user.
// Facade:

// OrderFacade provides a simplified interface (placeOrder) that internally interacts with all the subsystems.
// Client:

// The client only interacts with the OrderFacade and does not need to know about the complexities of the subsystems.
// This pattern is particularly useful in scenarios where you have a complex system with multiple subsystems, and you want to provide a simple interface for common tasks.

// Comparison with Proxy and Adapter Patterns:

// 1. Facade vs Proxy:
//    - Purpose: The Facade pattern simplifies the interface of a subsystem, while the Proxy pattern provides a placeholder or surrogate to control access to an object.
//    - Use Case: Facade is used to reduce complexity by providing a unified interface, whereas Proxy is used to add functionality like lazy initialization, access control, or logging without changing the original object.
//    - Example: In the current example, the OrderFacade simplifies interactions with multiple subsystems. A Proxy, on the other hand, could be used to control access to the Payment subsystem, such as adding security checks before processing payments.

// 2. Facade vs Adapter:
//    - Purpose: The Facade pattern provides a simplified interface to a subsystem, while the Adapter pattern allows incompatible interfaces to work together.
//    - Use Case: Facade is used to hide the complexity of a subsystem, whereas Adapter is used to bridge the gap between two incompatible interfaces.
//    - Example: In the current example, the OrderFacade hides the complexity of interacting with ProductDAO, Invoice, Payment, and Notification. An Adapter could be used if, for instance, the Notification subsystem had a different interface that needed to be adapted to work with the rest of the system.

// Summary:
// - Facade focuses on simplifying and unifying interfaces.
// - Proxy focuses on controlling access to an object.
// - Adapter focuses on making incompatible interfaces compatible.