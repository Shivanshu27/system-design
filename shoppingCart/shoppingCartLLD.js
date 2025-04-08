// // Product Class
// class Product {
//     constructor(id, name, price, category) {
//         this.id = id;
//         this.name = name;
//         this.price = price;
//         this.category = category;
//     }
// }

// // CartItem Class
// class CartItem {
//     constructor(product, quantity) {
//         this.product = product;
//         this.quantity = quantity;
//     }

//     getTotalPrice() {
//         return this.product.price * this.quantity;
//     }
// }

// // ShoppingCart Class
// class ShoppingCart {
//     constructor() {
//         this.items = [];
//     }

//     addItem(product, quantity) {
//         const existingItem = this.items.find(item => item.product.id === product.id);
//         if (existingItem) {
//             existingItem.quantity += quantity;
//         } else {
//             this.items.push(new CartItem(product, quantity));
//         }
//     }

//     removeItem(productId) {
//         this.items = this.items.filter(item => item.product.id !== productId);
//     }

//     calculateTotal() {
//         return this.items.reduce((total, item) => total + item.getTotalPrice(), 0);
//     }

//     applyCoupon(coupon) {
//         return coupon.apply(this.items);
//     }
// }

// // Coupon Interface
// class Coupon {
//     apply(items) {
//         throw new Error("apply method must be implemented");
//     }
// }

// // Percentage Discount Coupon
// class PercentageDiscountCoupon extends Coupon {
//     constructor(percentage, applicableCategory = null) {
//         super();
//         this.percentage = percentage;
//         this.applicableCategory = applicableCategory;
//     }

//     apply(items) {
//         let discount = 0;
//         items.forEach(item => {
//             if (!this.applicableCategory || item.product.category === this.applicableCategory) {
//                 discount += (item.getTotalPrice() * this.percentage) / 100;
//             }
//         });
//         return discount;
//     }
// }

// // Fixed Amount Discount Coupon
// class FixedAmountCoupon extends Coupon {
//     constructor(amount, applicableCategory = null) {
//         super();
//         this.amount = amount;
//         this.applicableCategory = applicableCategory;
//     }

//     apply(items) {
//         let discount = 0;
//         items.forEach(item => {
//             if (!this.applicableCategory || item.product.category === this.applicableCategory) {
//                 discount += this.amount;
//             }
//         });
//         return Math.min(discount, items.reduce((total, item) => total + item.getTotalPrice(), 0));
//     }
// }

// // Example Usage
// function demonstrateShoppingCart() {
//     // Create products
//     const apple = new Product(1, "Apple", 2, "Fruits");
//     const banana = new Product(2, "Banana", 1, "Fruits");
//     const laptop = new Product(3, "Laptop", 1000, "Electronics");

//     // Create shopping cart
//     const cart = new ShoppingCart();

//     // Add items to cart
//     cart.addItem(apple, 1); // 5 apples
//     // cart.addItem(banana, 10); // 10 bananas
//     cart.addItem(laptop, 1); // 1 laptop

//     console.log("Cart Total (Before Discount):", cart.calculateTotal());

//     // Apply percentage discount coupon (10% on all items)
//     const percentageCoupon = new PercentageDiscountCoupon(10);
//     const percentageDiscount = cart.applyCoupon(percentageCoupon);
//     console.log("Percentage Discount Applied:", percentageDiscount);

//     // Apply fixed amount coupon ($5 on Fruits category)
//     const fixedCoupon = new FixedAmountCoupon(5, "Fruits");
//     const fixedDiscount = cart.applyCoupon(fixedCoupon);
//     console.log("Fixed Discount Applied:", fixedDiscount);

//     // Final total after applying discounts
//     const finalTotal = cart.calculateTotal() - (percentageDiscount + fixedDiscount);
//     console.log("Cart Total (After Discounts):", finalTotal);
// }

// // Run the demonstration
// demonstrateShoppingCart();




// Product Categories Enum
const ProductCategory = {
    ELECTRONICS: 'electronics',
    CLOTHING: 'clothing',
    BOOKS: 'books',
    GROCERIES: 'groceries',
    FURNITURE: 'furniture'
};

// Base Product Class
class Product {
    constructor(id, name, price, category, brand = null) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
        this.brand = brand;
    }

    clone() {
        return new Product(
            this.id, 
            this.name, 
            this.price, 
            this.category, 
            this.brand
        );
    }
}

// Discount Strategy Interface
class DiscountStrategy {
    apply(cart, product, quantity) {
        throw new Error('Discount strategy must implement apply method');
    }
}

// Concrete Discount Strategies
class PercentageDiscountStrategy extends DiscountStrategy {
    constructor(percentage) {
        super();
        this.percentage = percentage;
    }

    apply(cart, product, quantity) {
        return product.price * quantity * (1 - this.percentage / 100);
    }
}

class BuyXGetYFreeDiscountStrategy extends DiscountStrategy {
    constructor(buyQuantity, freeQuantity) {
        super();
        this.buyQuantity = buyQuantity;
        this.freeQuantity = freeQuantity;
    }

    apply(cart, product, quantity) {
        const discountableSets = Math.floor(quantity / (this.buyQuantity + this.freeQuantity));
        const remainingItems = quantity % (this.buyQuantity + this.freeQuantity);
        
        const paidItems = discountableSets * this.buyQuantity + Math.min(remainingItems, this.buyQuantity);
        return product.price * paidItems;
    }
}

class CategorySpecificDiscountStrategy extends DiscountStrategy {
    constructor(category, discountPercentage) {
        super();
        this.category = category;
        this.discountPercentage = discountPercentage;
    }

    apply(cart, product, quantity) {
        if (product.category === this.category) {
            return product.price * quantity * (1 - this.discountPercentage / 100);
        }
        return product.price * quantity;
    }
}

class CartItem {
    constructor(product, quantity, discountStrategy = null) {
        this.product = product;
        this.quantity = quantity;
        this.discountStrategy = discountStrategy;
    }

    getPrice() {
        if (this.discountStrategy) {
            return this.discountStrategy.apply(null, this.product, this.quantity);
        }
        return this.product.price * this.quantity;
    }
}

class ShoppingCart {
    constructor() {
        this.items = [];
        this.discounts = [];
    }

    addItem(product, quantity, discountStrategy = null) {
        // Check if product already exists in cart
        const existingItem = this.items.find(
            item => item.product.id === product.id
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push(new CartItem(product, quantity, discountStrategy));
        }

        return this;
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.product.id !== productId);
        return this;
    }

    updateQuantity(productId, newQuantity) {
        const item = this.items.find(item => item.product.id === productId);
        if (item) {
            item.quantity = newQuantity;
        }
        return this;
    }

    calculateSubtotal() {
        return this.items.reduce((total, item) => total + item.getPrice(), 0);
    }

    applyCartLevelDiscount(discountStrategy) {
        this.discounts.push(discountStrategy);
        return this;
    }

    calculateTotal() {
        let subtotal = this.calculateSubtotal();

        // Apply cart-level discounts
        for (let discount of this.discounts) {
            for (let item of this.items) {
                subtotal -= item.product.price * item.quantity - discount.apply(this, item.product, item.quantity);
            }
        }

        return subtotal;
    }

    clearCart() {
        this.items = [];
        this.discounts = [];
        return this;
    }

    getItemCount() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }
}

// Discount Factory
class DiscountFactory {
    static createPercentageDiscount(percentage) {
        return new PercentageDiscountStrategy(percentage);
    }

    static createBuyXGetYFreeDiscount(buyQuantity, freeQuantity) {
        return new BuyXGetYFreeDiscountStrategy(buyQuantity, freeQuantity);
    }

    static createCategoryDiscount(category, percentage) {
        return new CategorySpecificDiscountStrategy(category, percentage);
    }
}

// Demonstration Function
function demonstrateShoppingCart() {
    // Create some products
    const laptop = new Product(
        'ELEC001', 
        'Gaming Laptop', 
        1500, 
        ProductCategory.ELECTRONICS, 
        'AlienWare'
    );
    
    const tshirt = new Product(
        'CLOTH001', 
        'Graphic T-Shirt', 
        25, 
        ProductCategory.CLOTHING
    );
    
    const book = new Product(
        'BOOK001', 
        'Programming Cookbook', 
        50, 
        ProductCategory.BOOKS
    );

    // Create shopping cart
    const cart = new ShoppingCart();

    // Add items with different discount strategies
    cart
        .addItem(laptop, 1) // No specific discount
        .addItem(
            tshirt, 
            3, 
            DiscountFactory.createBuyXGetYFreeDiscount(2, 1) // Buy 2 get 1 free
        )
        .addItem(
            book, 
            2, 
            DiscountFactory.createPercentageDiscount(10) // 10% off
        )
        .applyCartLevelDiscount(
            DiscountFactory.createCategoryDiscount(
                ProductCategory.ELECTRONICS, 
                15 // 15% off electronics
            )
        );

    // Calculate and display cart details
    console.log('Cart Items:', cart.getItemCount());
    console.log('Subtotal:', cart.calculateSubtotal());
    console.log('Total after discounts:', cart.calculateTotal());
}

// Run the demonstration
demonstrateShoppingCart();






// at the time of checkout 


// Discount Types Enum
const DiscountType = {
    PERCENTAGE: 'percentage',
    FIXED_AMOUNT: 'fixed_amount',
    BUY_X_GET_Y: 'buy_x_get_y',
    BUNDLE: 'bundle'
};

// Condition Types for Discount Eligibility
const DiscountCondition = {
    TOTAL_CART_VALUE: 'total_cart_value',
    PRODUCT_CATEGORY: 'product_category',
    SPECIFIC_PRODUCTS: 'specific_products',
    FIRST_PURCHASE: 'first_purchase',
    SEASONAL: 'seasonal'
};

// Discount Eligibility Checker
class DiscountEligibilityChecker {
    constructor() {
        this.conditions = [];
    }

    addCondition(conditionType, parameters) {
        this.conditions.push({ type: conditionType, ...parameters });
        return this;
    }

    checkEligibility(cart, customerProfile) {
        return this.conditions.every(condition => {
            switch (condition.type) {
                case DiscountCondition.TOTAL_CART_VALUE:
                    return cart.calculateSubtotal() >= condition.minValue;
                
                case DiscountCondition.PRODUCT_CATEGORY:
                    return cart.items.some(item => 
                        condition.categories.includes(item.product.category)
                    );
                
                case DiscountCondition.SPECIFIC_PRODUCTS:
                    return cart.items.some(item => 
                        condition.productIds.includes(item.product.id)
                    );
                
                case DiscountCondition.FIRST_PURCHASE:
                    return customerProfile.isFirstPurchase;
                
                case DiscountCondition.SEASONAL:
                    const now = new Date();
                    return now >= condition.startDate && now <= condition.endDate;
                
                default:
                    return false;
            }
        });
    }
}

// Advanced Discount Class
class Discount {
    constructor(config) {
        this.id = config.id;
        this.name = config.name;
        this.type = config.type;
        this.value = config.value;
        this.eligibilityChecker = new DiscountEligibilityChecker();
        
        // Optional conditions
        if (config.conditions) {
            config.conditions.forEach(condition => 
                this.eligibilityChecker.addCondition(
                    condition.type, 
                    condition.parameters
                )
            );
        }
    }

    apply(cart, customerProfile) {
        // Check if discount is eligible
        if (!this.eligibilityChecker.checkEligibility(cart, customerProfile)) {
            return 0;
        }

        switch (this.type) {
            case DiscountType.PERCENTAGE:
                return cart.calculateSubtotal() * (this.value / 100);
            
            case DiscountType.FIXED_AMOUNT:
                return Math.min(this.value, cart.calculateSubtotal());
            
            case DiscountType.BUY_X_GET_Y:
                return this.applyBuyXGetY(cart);
            
            case DiscountType.BUNDLE:
                return this.applyBundleDiscount(cart);
            
            default:
                return 0;
        }
    }

    applyBuyXGetY(cart) {
        // Complex logic for Buy X Get Y discounts
        let totalDiscount = 0;
        const eligibleItems = cart.items.filter(item => 
            item.product.category === this.category
        );

        eligibleItems.forEach(item => {
            const discountSets = Math.floor(item.quantity / (this.x + this.y));
            const discountedPrice = item.product.price * this.x * discountSets;
            totalDiscount += discountedPrice;
        });

        return totalDiscount;
    }

    applyBundleDiscount(cart) {
        // Logic for bundle discounts
        let totalDiscount = 0;
        const bundleProducts = this.bundleProductIds;
        
        // Find all bundle products in the cart
        const bundleItems = cart.items.filter(item => 
            bundleProducts.includes(item.product.id)
        );

        if (bundleItems.length === bundleProducts.length) {
            totalDiscount = this.value;
        }

        return totalDiscount;
    }
}

// Checkout Class
class Checkout {
    constructor(cart, customerProfile) {
        this.cart = cart;
        this.customerProfile = customerProfile;
        this.availableDiscounts = [];
        this.appliedDiscounts = [];
    }

    registerDiscount(discount) {
        this.availableDiscounts.push(discount);
        return this;
    }

    calculateTotal() {
        let subtotal = this.cart.calculateSubtotal();
        
        // Apply eligible discounts
        this.appliedDiscounts = this.availableDiscounts.filter(discount => 
            discount.eligibilityChecker.checkEligibility(this.cart, this.customerProfile)
        );

        // Calculate total discounts
        const totalDiscount = this.appliedDiscounts.reduce((total, discount) => 
            total + discount.apply(this.cart, this.customerProfile), 
            0
        );

        return {
            subtotal,
            discounts: this.appliedDiscounts,
            totalDiscount,
            finalTotal: subtotal - totalDiscount
        };
    }
}

// Customer Profile
class CustomerProfile {
    constructor(id, isFirstPurchase = true) {
        this.id = id;
        this.isFirstPurchase = isFirstPurchase;
        this.previousPurchases = [];
    }
}

// Demonstration Function
function demonstrateCheckoutDiscounts() {
    // Create products
    const laptop = new Product(
        'ELEC001', 
        'Gaming Laptop', 
        1500, 
        ProductCategory.ELECTRONICS
    );
    
    const mouse = new Product(
        'ELEC002', 
        'Gaming Mouse', 
        100, 
        ProductCategory.ELECTRONICS
    );
    
    const book = new Product(
        'BOOK001', 
        'Programming Book', 
        50, 
        ProductCategory.BOOKS
    );

    // Create shopping cart
    const cart = new ShoppingCart();
    cart.addItem(laptop, 1)
        .addItem(mouse, 2)
        .addItem(book, 1);

    // Create customer profile
    const customerProfile = new CustomerProfile('CUST001');

    // Create checkout with discounts
    const checkout = new Checkout(cart, customerProfile);

    // Register various discounts
    checkout
        .registerDiscount(new Discount({
            id: 'SUMMER_SALE',
            name: 'Summer Electronics Sale',
            type: DiscountType.PERCENTAGE,
            value: 15,
            conditions: [
                {
                    type: DiscountCondition.PRODUCT_CATEGORY,
                    parameters: { 
                        categories: [ProductCategory.ELECTRONICS] 
                    }
                },
                {
                    type: DiscountCondition.TOTAL_CART_VALUE,
                    parameters: { 
                        minValue: 1000 
                    }
                }
            ]
        }))
        .registerDiscount(new Discount({
            id: 'FIRST_PURCHASE',
            name: 'First Purchase Discount',
            type: DiscountType.FIXED_AMOUNT,
            value: 100,
            conditions: [
                {
                    type: DiscountCondition.FIRST_PURCHASE,
                    parameters: {}
                }
            ]
        }))
        .registerDiscount(new Discount({
            id: 'BUNDLE_DEAL',
            name: 'Electronics Bundle Deal',
            type: DiscountType.BUNDLE,
            value: 50,
            bundleProductIds: ['ELEC001', 'ELEC002']
        }));

    // Calculate total with discounts
    const checkoutResult = checkout.calculateTotal();
    
    console.log('Checkout Details:');
    console.log('Subtotal:', checkoutResult.subtotal);
    console.log('Applied Discounts:');
    checkoutResult.discounts.forEach(discount => 
        console.log(`- ${discount.name}: $${discount.apply(cart, customerProfile).toFixed(2)}`)
    );
    console.log('Total Discount:', checkoutResult.totalDiscount);
    console.log('Final Total:', checkoutResult.finalTotal);
}

// Run the demonstration
demonstrateCheckoutDiscounts();