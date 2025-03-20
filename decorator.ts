// The Decorator Design Pattern is a structural pattern that allows behavior to be added to individual objects, dynamically, without affecting the behavior of other objects from the same class. It is typically used to extend the functionalities of classes in a flexible and reusable way.

// When to Use the Decorator Pattern
// When you want to add responsibilities to individual objects dynamically and transparently, i.e., without affecting other objects.
// When extending the behavior of a class by subclassing is impractical.
// When you need to add functionalities that can be withdrawn.
// Example: Pizza Toppings
// Let's create an example of a pizza ordering system where we can add different toppings to a base pizza. We will use the Decorator Design Pattern to add toppings dynamically.

// Step-by-Step Implementation:
// Pizza Interface: Define an interface for pizza.
// Concrete Pizza Class: Implement a concrete class for the base pizza.
// Topping Decorator Class: Define an abstract decorator class that implements the pizza interface.
// Concrete Topping Decorators: Implement concrete decorators for each topping.



// Pizza Interface
interface Pizza {
    getDescription(): string;
    getCost(): number;
}

// Concrete Pizza Class: MargheritaPizza
class MargheritaPizza implements Pizza {
    getDescription(): string {
        return "Margherita Pizza";
    }

    getCost(): number {
        return 6.99;
    }
}

// Topping Decorator Class
abstract class ToppingDecorator implements Pizza {
    protected pizza: Pizza;

    constructor(pizza: Pizza) {
        this.pizza = pizza;
    }

    abstract getDescription(): string;
    abstract getCost(): number;
}

// Concrete Topping Decorator: CheeseTopping
class CheeseTopping extends ToppingDecorator {
    getDescription(): string {
        return this.pizza.getDescription() + ", Cheese";
    }

    getCost(): number {
        return this.pizza.getCost() + 1.50;
    }
}

// Concrete Topping Decorator: PepperoniTopping
class PepperoniTopping extends ToppingDecorator {
    getDescription(): string {
        return this.pizza.getDescription() + ", Pepperoni";
    }

    getCost(): number {
        return this.pizza.getCost() + 1.75;
    }
}


// Concrete Topping Decorator: OlivesTopping
class OlivesTopping extends ToppingDecorator {
    getDescription(): string {
        return this.pizza.getDescription() + ", Olives";
    }

    getCost(): number {
        return this.pizza.getCost() + 1.25;
    }
}


// Example usage
const pizza = new MargheritaPizza();
console.log(`${pizza.getDescription()} Cost: $${pizza.getCost()}`);

const cheesePizza = new CheeseTopping(pizza);
console.log(`${cheesePizza.getDescription()} Cost: $${cheesePizza.getCost()}`);

const pepperoniCheesePizza = new PepperoniTopping(cheesePizza);
console.log(`${pepperoniCheesePizza.getDescription()} Cost: $${pepperoniCheesePizza.getCost()}`);

const deluxePizza = new OlivesTopping(pepperoniCheesePizza);
console.log(`${deluxePizza.getDescription()} Cost: $${deluxePizza.getCost()}`);


