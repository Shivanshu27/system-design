// Item Class - Represents a product in the vending machine
class Item {
    constructor(name, price, code) {
      this.name = name;
      this.price = price;
      this.code = code; // Unique code for the item (e.g., "A1", "B2")
    }
  }
  
  // ItemShelf Class - Represents a slot in the vending machine
  class ItemShelf {
    constructor(id) {
      this.id = id;
      this.item = null;
      this.quantity = 0;
    }
  
    addItem(item, quantity) {
      this.item = item;
      this.quantity += quantity;
    }
  
    dispenseItem() {
      if (this.quantity > 0) {
        this.quantity--;
        return this.item;
      }
      return null;
    }
  
    isEmpty() {
      return this.quantity === 0;
    }
  
    getItem() {
      return this.item;
    }
  
    getQuantity() {
      return this.quantity;
    }
  }
  
  // Inventory Class - Manages all shelves in the vending machine
  class Inventory {
    constructor(shelfCount) {
      this.shelves = new Map();
      
      // Initialize shelves
      for (let i = 1; i <= shelfCount; i++) {
        this.shelves.set(i, new ItemShelf(i));
      }
    }
  
    addItem(shelfId, item, quantity) {
      if (this.shelves.has(shelfId)) {
        this.shelves.get(shelfId).addItem(item, quantity);
        return true;
      }
      return false;
    }
  
    getItem(shelfId) {
      if (this.shelves.has(shelfId) && !this.shelves.get(shelfId).isEmpty()) {
        return this.shelves.get(shelfId).getItem();
      }
      return null;
    }
  
    dispenseItem(shelfId) {
      if (this.shelves.has(shelfId) && !this.shelves.get(shelfId).isEmpty()) {
        return this.shelves.get(shelfId).dispenseItem();
      }
      return null;
    }
  
    isItemAvailable(shelfId) {
      return this.shelves.has(shelfId) && !this.shelves.get(shelfId).isEmpty();
    }
  
    getItemPrice(shelfId) {
      const item = this.getItem(shelfId);
      return item ? item.price : 0;
    }
  
    displayItems() {
      const items = [];
      this.shelves.forEach((shelf, shelfId) => {
        if (!shelf.isEmpty()) {
          items.push({
            shelfId,
            name: shelf.getItem().name,
            price: shelf.getItem().price,
            quantity: shelf.getQuantity()
          });
        }
      });
      return items;
    }
  }
  
  // State Interface - Abstract base state for the vending machine
  class VendingMachineState {
    insertMoney(amount) {
      throw new Error("Method not implemented for this state");
    }
  
    selectItem(shelfId) {
      throw new Error("Method not implemented for this state");
    }
  
    dispenseItem() {
      throw new Error("Method not implemented for this state");
    }
  
    cancel() {
      throw new Error("Method not implemented for this state");
    }
  }
  
  // Idle State - Initial state when no money is inserted
  class IdleState extends VendingMachineState {
    constructor(vendingMachine) {
      super();
      this.vendingMachine = vendingMachine;
    }
  
    insertMoney(amount) {
      this.vendingMachine.addMoney(amount);
      this.vendingMachine.setState(this.vendingMachine.getHasMoneyState());
      return `${amount} inserted. Total: ${this.vendingMachine.getBalance()}`;
    }
  
    selectItem(shelfId) {
      return "Please insert money first";
    }
  
    dispenseItem() {
      return "Please insert money and select an item first";
    }
  
    cancel() {
      return "No money to return";
    }
  }
  
  // HasMoney State - Money has been inserted, but no item selected yet
  class HasMoneyState extends VendingMachineState {
    constructor(vendingMachine) {
      super();
      this.vendingMachine = vendingMachine;
    }
  
    insertMoney(amount) {
      this.vendingMachine.addMoney(amount);
      return `${amount} more inserted. Total: ${this.vendingMachine.getBalance()}`;
    }
  
    selectItem(shelfId) {
      const inventory = this.vendingMachine.getInventory();
      
      if (!inventory.isItemAvailable(shelfId)) {
        return `Item at shelf ${shelfId} is not available`;
      }
  
      const itemPrice = inventory.getItemPrice(shelfId);
      
      if (this.vendingMachine.getBalance() < itemPrice) {
        return `Insufficient funds. Need ${itemPrice - this.vendingMachine.getBalance()} more`;
      }
  
      this.vendingMachine.setSelectedShelf(shelfId);
      this.vendingMachine.setState(this.vendingMachine.getProductSelectedState());
      return `Item selected: ${inventory.getItem(shelfId).name}. Press confirm to dispense.`;
    }
  
    dispenseItem() {
      return "Please select an item first";
    }
  
    cancel() {
      const refundAmount = this.vendingMachine.getBalance();
      this.vendingMachine.resetBalance();
      this.vendingMachine.setState(this.vendingMachine.getIdleState());
      return `Returned ${refundAmount}`;
    }
  }
  
  // ProductSelected State - Item has been selected, waiting for confirmation
  class ProductSelectedState extends VendingMachineState {
    constructor(vendingMachine) {
      super();
      this.vendingMachine = vendingMachine;
    }
  
    insertMoney(amount) {
      this.vendingMachine.addMoney(amount);
      return `${amount} more inserted. Total: ${this.vendingMachine.getBalance()}`;
    }
  
    selectItem(shelfId) {
      return "Item already selected. Press confirm to dispense or cancel.";
    }
  
    dispenseItem() {
      const shelfId = this.vendingMachine.getSelectedShelf();
      const inventory = this.vendingMachine.getInventory();
      const item = inventory.getItem(shelfId);
      
      if (!item) {
        this.vendingMachine.setState(this.vendingMachine.getHasMoneyState());
        return "Selected item no longer available";
      }
  
      const itemPrice = item.price;
      
      if (this.vendingMachine.getBalance() >= itemPrice) {
        const dispensedItem = inventory.dispenseItem(shelfId);
        this.vendingMachine.deductMoney(itemPrice);
        
        this.vendingMachine.setState(
          this.vendingMachine.getBalance() > 0 
            ? this.vendingMachine.getDispensingState() 
            : this.vendingMachine.getIdleState()
        );
        
        return `Dispensed ${dispensedItem.name}. Remaining balance: ${this.vendingMachine.getBalance()}`;
      } else {
        return `Insufficient funds. Need ${itemPrice - this.vendingMachine.getBalance()} more`;
      }
    }
  
    cancel() {
      this.vendingMachine.resetSelectedShelf();
      this.vendingMachine.setState(this.vendingMachine.getHasMoneyState());
      return "Selection cancelled. Please select another item or get refund.";
    }
  }
  
  // Dispensing State - Item is being dispensed, remaining balance available
  class DispensingState extends VendingMachineState {
    constructor(vendingMachine) {
      super();
      this.vendingMachine = vendingMachine;
    }
  
    insertMoney(amount) {
      this.vendingMachine.addMoney(amount);
      this.vendingMachine.setState(this.vendingMachine.getHasMoneyState());
      return `${amount} more inserted. Total: ${this.vendingMachine.getBalance()}`;
    }
  
    selectItem(shelfId) {
      this.vendingMachine.setState(this.vendingMachine.getHasMoneyState());
      return this.vendingMachine.selectItem(shelfId);
    }
  
    dispenseItem() {
      return "Item already dispensed. Select another item or collect change.";
    }
  
    cancel() {
      const refundAmount = this.vendingMachine.getBalance();
      this.vendingMachine.resetBalance();
      this.vendingMachine.setState(this.vendingMachine.getIdleState());
      return `Returned remaining balance: ${refundAmount}`;
    }
  }
  
  // Main Vending Machine Class
  class VendingMachine {
    constructor(shelfCount = 10) {
      this.inventory = new Inventory(shelfCount);
      this.balance = 0;
      this.selectedShelf = null;
      
      // Initialize states
      this.idleState = new IdleState(this);
      this.hasMoneyState = new HasMoneyState(this);
      this.productSelectedState = new ProductSelectedState(this);
      this.dispensingState = new DispensingState(this);
      
      // Set initial state
      this.currentState = this.idleState;
    }
  
    // State getters
    getIdleState() {
      return this.idleState;
    }
  
    getHasMoneyState() {
      return this.hasMoneyState;
    }
  
    getProductSelectedState() {
      return this.productSelectedState;
    }
  
    getDispensingState() {
      return this.dispensingState;
    }
  
    // State setter
    setState(state) {
      this.currentState = state;
    }
  
    // Delegate methods to current state
    insertMoney(amount) {
      return this.currentState.insertMoney(amount);
    }
  
    selectItem(shelfId) {
      return this.currentState.selectItem(shelfId);
    }
  
    dispenseItem() {
      return this.currentState.dispenseItem();
    }
  
    cancel() {
      return this.currentState.cancel();
    }
  
    // Money management
    addMoney(amount) {
      this.balance += amount;
    }
  
    deductMoney(amount) {
      this.balance -= amount;
    }
  
    resetBalance() {
      const oldBalance = this.balance;
      this.balance = 0;
      return oldBalance;
    }
  
    getBalance() {
      return this.balance;
    }
  
    // Item selection
    setSelectedShelf(shelfId) {
      this.selectedShelf = shelfId;
    }
  
    getSelectedShelf() {
      return this.selectedShelf;
    }
  
    resetSelectedShelf() {
      this.selectedShelf = null;
    }
  
    // Inventory access
    getInventory() {
      return this.inventory;
    }
  
    // Administrative functions
    refillItem(shelfId, item, quantity) {
      return this.inventory.addItem(shelfId, item, quantity);
    }
  
    displayItems() {
      return this.inventory.displayItems();
    }
  
    getCurrentState() {
      if (this.currentState === this.idleState) return "IDLE";
      if (this.currentState === this.hasMoneyState) return "HAS_MONEY";
      if (this.currentState === this.productSelectedState) return "PRODUCT_SELECTED";
      if (this.currentState === this.dispensingState) return "DISPENSING";
      return "UNKNOWN";
    }
  }
  
  // Usage Example
  function demoVendingMachine() {
    // Create a vending machine with 5 shelves
    const vendingMachine = new VendingMachine(5);
    
    // Stock the machine
    vendingMachine.refillItem(1, new Item("Coca Cola", 1.50, "A1"), 10);
    vendingMachine.refillItem(2, new Item("Pepsi", 1.50, "A2"), 10);
    vendingMachine.refillItem(3, new Item("Water", 1.00, "B1"), 10);
    vendingMachine.refillItem(4, new Item("Chips", 2.00, "B2"), 5);
    vendingMachine.refillItem(5, new Item("Chocolate", 2.50, "C1"), 5);
    
    console.log("Vending Machine Inventory:");
    console.log(vendingMachine.displayItems());
    
    console.log("\nStarting State:", vendingMachine.getCurrentState());
    
    console.log("\nTrying to select item without money:");
    console.log(vendingMachine.selectItem(1));
    
    console.log("\nInserting money:");
    console.log(vendingMachine.insertMoney(1));
    console.log("Current State:", vendingMachine.getCurrentState());
    
    console.log("\nInserting more money:");
    console.log(vendingMachine.insertMoney(0.50));
    console.log("Balance:", vendingMachine.getBalance());
    
    console.log("\nSelecting item (Coca Cola):");
    console.log(vendingMachine.selectItem(1));
    console.log("Current State:", vendingMachine.getCurrentState());
    
    console.log("\nDispensing item:");
    console.log(vendingMachine.dispenseItem());
    console.log("Current State:", vendingMachine.getCurrentState());
    
    console.log("\nGetting refund of remaining balance:");
    console.log(vendingMachine.cancel());
    console.log("Current State:", vendingMachine.getCurrentState());
    
    console.log("\nTrying different scenario with insufficient funds:");
    console.log(vendingMachine.insertMoney(1));
    console.log(vendingMachine.selectItem(4)); // Chips cost $2.00
    console.log(vendingMachine.dispenseItem());
    console.log("Current State:", vendingMachine.getCurrentState());
    
    console.log("\nAdding more money and trying again:");
    console.log(vendingMachine.insertMoney(1.50));
    console.log(vendingMachine.dispenseItem());
    console.log("Current State:", vendingMachine.getCurrentState());
    
    console.log("\nVending Machine Inventory after purchases:");
    console.log(vendingMachine.displayItems());
  }
  
  // Run the demo
  demoVendingMachine();




//   Vending Machine System with State Design Pattern - Explanation
// Overview
// I've designed a vending machine system using the State Design Pattern in JavaScript. This pattern is particularly well-suited for a vending machine because the machine's behavior changes based on its current state (idle, has money, etc.).
// Core Components
// 1. State Design Pattern Implementation
// The State Design Pattern allows an object to alter its behavior when its internal state changes. In our vending machine:

// VendingMachineState: The abstract base state that defines the interface for all concrete states
// Four Concrete States:

// IdleState: Initial state when no money is inserted
// HasMoneyState: Money has been inserted, but no product selected
// ProductSelectedState: Product has been selected, waiting for confirmation
// DispensingState: Product is being dispensed, with possible remaining balance



// Each state implements four key operations:

// insertMoney(amount): Add money to the machine
// selectItem(shelfId): Select an item from a specific shelf
// dispenseItem(): Confirm and dispense the selected item
// cancel(): Cancel the current operation and return money

// 2. Main Classes
// Item Class
// Represents a product with:

// Name
// Price
// Code (unique identifier like "A1", "B2")

// ItemShelf Class
// Represents a slot in the vending machine:

// Holds a specific Item
// Tracks quantity
// Handles dispensing

// Inventory Class
// Manages all shelves in the vending machine:

// Maintains a collection of ItemShelves
// Provides methods to add, retrieve, and dispense items
// Gives information about item availability and pricing

// VendingMachine Class
// The core class that:

// Maintains the current state
// Delegates operations to the current state
// Manages money balance
// Tracks selected items
// Provides administrative functions for restocking

// State Transitions

// Idle → HasMoney: When money is inserted into the machine
// HasMoney → ProductSelected: When a valid product is selected
// ProductSelected → Dispensing/Idle: When product is dispensed (to Idle if no balance remains)
// HasMoney → Idle: When operation is canceled and money returned
// ProductSelected → HasMoney: When selection is canceled
// Dispensing → HasMoney: When selecting another item with remaining balance
// Dispensing → Idle: When remaining balance is collected

// Key Benefits of This Design
// 1. Separation of Concerns

// Each state encapsulates its own behavior
// The VendingMachine class doesn't need to use complex if/else or switch statements

// 2. Easy to Extend

// Adding new states or modifying existing ones doesn't affect other parts of the system
// New operations can be added by updating the state interface and implementations

// 3. Maintainable Code

// State transitions are clear and explicit
// Business rules for each state are isolated

// 4. Clean API

// The public interface of the VendingMachine is simple and intuitive
// Internal complexity is hidden from clients

// Usage Flow

// Create a VendingMachine instance
// Stock it with items using refillItem()
// Users interact through:

// insertMoney(amount)
// selectItem(shelfId)
// dispenseItem()
// cancel()


// The machine handles state transitions automatically

// Error Handling

// Each state handles invalid operations gracefully
// Clear error messages guide the user toward the correct sequence of actions
// Edge cases (like insufficient funds) are handled within the appropriate states

// The state diagram visually represents all possible state transitions and their associated operations, making it easier to understand the system's behavior.