# Low-Level Design (LLD) & Object-Oriented Architecture Catalog 🏛️

[![Language: TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Language: JavaScript](https://img.shields.io/badge/Language-JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Architecture: Clean Code](https://img.shields.io/badge/Architecture-SOLID_Principles-success)](https://en.wikipedia.org/wiki/SOLID)

> Production-ready reference implementations of classic Gang of Four (GoF) design patterns and complete Low-Level Design (LLD) systems in TypeScript / Modern JavaScript, structured around high cohesion, loose coupling, and SOLID principles.

---

## 📑 Repository Contents

### 1. Real-World Low-Level System Designs (LLD)
Complete object-oriented domain models, state machines, and concurrency handling for complex real-world systems:

| System | Key Domain Patterns & Concepts | Source Directory |
|---|---|---|
| **BookMyShow** | Seat locking concurrency, Show/Screen aggregates, pricing strategies, composite theater hierarchy | [`/bookMyShow`](./bookMyShow) |
| **Splitwise** | Graph debt simplification, Exact / Percentage / Equal split strategies, Transaction ledger | [`/splitwise`](./splitwise) |
| **Vending Machine** | Finite State Machine (`NoMoneyState`, `HasMoneyState`, `DispenseState`), coin validation, inventory matrix | [`/vendingMachine`](./vendingMachine) |
| **Online Auction** | Observer pattern, real-time bid validation, concurrency control, proxy bidding | [`/onlineAuction`](./onlineAuction) |
| **Shopping Cart** | Cart aggregate, coupon decoration, dynamic discount rule engine, inventory check | [`/shoppingCart`](./shoppingCart) |

---

### 2. Gang of Four (GoF) Design Patterns

```text
+---------------------------------------------------------------------------------------+
|                              GOF PATTERN TAXONOMY                                     |
+---------------------------------------------------------------------------------------+
|                                                                                       |
|  CREATIONAL                     STRUCTURAL                    BEHAVIORAL              |
|  * Factory / Abstract Factory   * Decorator Pattern           * Strategy Pattern      |
|  * Builder Pattern              * Adapter Pattern             * Observer Pattern      |
|  * Singleton Pattern            * Facade Pattern              * Chain of Responsibility|
|                                 * Composite Pattern           * Null Object Pattern   |
|                                 * Proxy Pattern                                       |
|                                 * Flyweight Pattern                                   |
|                                 * Bridge Pattern                                      |
+---------------------------------------------------------------------------------------+
```

| Pattern | Category | Implementation File | Architectural Intent |
|---|---|---|---|
| **Factory / Abstract Factory** | Creational | [`1creationalDP.js`](./1creationalDP.js) | Decouples object instantiation logic from caller domain code. |
| **Builder Pattern** | Creational | [`2builder.js`](./2builder.js) | Separates construction of complex objects from their runtime representations. |
| **Decorator Pattern** | Structural | [`3decorator.ts`](./3decorator.ts) | Dynamically attaches responsibilities to objects without subclass explosion. |
| **Proxy Pattern** | Structural | [`4proxy.js`](./4proxy.js) | Provides a surrogate or placeholder to control access, caching, or lazy loading. |
| **Composite Pattern** | Structural | [`5compositeDP.js`](./5compositeDP.js) | Composes objects into tree structures to represent part-whole hierarchies uniformly. |
| **Adapter Pattern** | Structural | [`6adapterDP.js`](./6adapterDP.js) | Translates incompatible interfaces to enable disparate subsystems to collaborate. |
| **Flyweight Pattern** | Structural | [`7flyweightDP.js`](./7flyweightDP.js) | Minimizes memory footprint by sharing intrinsic state across large numbers of fine-grained objects. |
| **Bridge Pattern** | Structural | [`8.1bridge.js`](./8.1bridge.js) | Decouples an abstraction from its implementation so both can vary independently. |
| **Facade Pattern** | Structural | [`8facadeDP.js`](./8facadeDP.js) | Provides a unified, high-level interface to a complex set of subsystem interfaces. |
| **Strategy Pattern** | Behavioral | [`9strategy.js`](./9strategy.js) | Defines a family of algorithms, encapsulates each one, and makes them interchangeable at runtime. |
| **Observer Pattern** | Behavioral | [`10observer.js`](./10observer.js) | Defines a 1-to-N dependency where state changes automatically trigger subscriber notifications. |
| **Chain of Responsibility** | Behavioral | [`11chainOfResp.js`](./11chainOfResp.js) | Passes requests along a chain of handlers until one handles it, avoiding sender-receiver coupling. |
| **Null Object Pattern** | Behavioral | [`12NullObjectPattern.js`](./12NullObjectPattern.js) | Encapsulates absence of an object by providing non-throwing default behavior. |

---

## 🏛️ SOLID Principles Reference
For detailed analysis and code smells across Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion, refer to:
- [`SOLID.md`](./SOLID.md) — Comprehensive guide with code transformations.
- [`basics.md`](./basics.md) — Foundational OOP paradigms, inheritance vs composition, and coupling dynamics.

---

## 🚀 Execution & Testing

All modules are written in modular JavaScript / TypeScript and can be executed directly using Node.js:

```bash
# Run a specific design pattern
node 9strategy.js
node 10observer.js

# Run full LLD case studies
node bookMyShow/bookMyShow.js
node splitwise/splitwiseLLD.js
node vendingMachine/vendingMachineLLD.js
```
