// Expense Type Enum
const ExpenseType = {
    EQUAL: 'equal',
    EXACT: 'exact',
    PERCENTAGE: 'percentage',
    SHARES: 'shares'
};

// Payment Status Enum
const PaymentStatus = {
    PENDING: 'pending',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
};

// User Entity
class User {
    constructor(id, name, email, phoneNumber = null) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.groups = new Map(); // groupId -> Group
        this.expenses = new Map(); // expenseId -> Expense
        this.balances = new Map(); // userId -> amount (positive: owes to user, negative: user owes)
    }

    addGroup(group) {
        this.groups.set(group.id, group);
    }

    removeGroup(groupId) {
        this.groups.delete(groupId);
    }

    addExpense(expense) {
        this.expenses.set(expense.id, expense);
    }

    getTotalBalance() {
        let total = 0;
        for (const balance of this.balances.values()) {
            total += balance;
        }
        return total;
    }

    // Update balance between this user and another user
    updateBalanceWith(userId, amount) {
        const currentBalance = this.balances.get(userId) || 0;
        this.balances.set(userId, currentBalance + amount);
    }
}

// Group Entity
class Group {
    constructor(id, name, description = '') {
        this.id = id;
        this.name = name;
        this.description = description;
        this.members = new Map(); // userId -> User
        this.expenses = new Map(); // expenseId -> Expense
        this.created = new Date();
    }

    addMember(user) {
        this.members.set(user.id, user);
        user.addGroup(this);
    }

    removeMember(userId) {
        const user = this.members.get(userId);
        if (user) {
            user.removeGroup(this.id);
            this.members.delete(userId);
            return true;
        }
        return false;
    }

    addExpense(expense) {
        this.expenses.set(expense.id, expense);
    }

    getBalanceSheet() {
        const balanceSheet = new Map(); 
        // Initialize balances for all members
        for (const memberId of this.members.keys()) {
            balanceSheet.set(memberId, new Map());
            
            for (const otherMemberId of this.members.keys()) {
                if (memberId !== otherMemberId) {
                    balanceSheet.get(memberId).set(otherMemberId, 0);
                }
            }
        }

        // Calculate balances from all expenses
        for (const expense of this.expenses.values()) {
            const paidBy = expense.paidBy;
            const splits = expense.splits;

            for (const [userId, amount] of splits.entries()) {
                if (userId !== paidBy) {
                    const payerBalance = balanceSheet.get(paidBy).get(userId) || 0;
                    balanceSheet.get(paidBy).set(userId, payerBalance + amount);
                    
                    const payeeBalance = balanceSheet.get(userId).get(paidBy) || 0;
                    balanceSheet.get(userId).set(paidBy, payeeBalance - amount);
                }
            }
        }

        return balanceSheet;
    }

    simplifyDebts() {
        const balanceSheet = this.getBalanceSheet();
        const simplifiedDebts = [];
        
        // Create netAmount array: [userId, netAmount]
        const netAmounts = [];
        for (const [userId, balances] of balanceSheet.entries()) {
            let netAmount = 0;
            for (const amount of balances.values()) {
                netAmount += amount;
            }
            netAmounts.push([userId, netAmount]);
        }

        // Sort by net amount
        netAmounts.sort((a, b) => a[1] - b[1]);
        
        let i = 0;  // Most negative (maximum debtor)
        let j = netAmounts.length - 1;  // Most positive (maximum creditor)
        
        // Simplify debts
        while (i < j) {
            const debtor = netAmounts[i];
            const creditor = netAmounts[j];
            
            const amount = Math.min(Math.abs(debtor[1]), creditor[1]);
            
            if (amount > 0) {
                simplifiedDebts.push({
                    from: debtor[0],
                    to: creditor[0],
                    amount
                });
            }
            
            // Update balances
            debtor[1] += amount;
            creditor[1] -= amount;
            
            // Move indices if balance is settled
            if (Math.abs(debtor[1]) < 0.01) i++;
            if (Math.abs(creditor[1]) < 0.01) j--;
        }
        
        return simplifiedDebts;
    }
}

// Expense Entity
class Expense {
    constructor(id, description, amount, paidBy, expenseType = ExpenseType.EQUAL) {
        this.id = id;
        this.description = description;
        this.amount = amount;
        this.paidBy = paidBy; // userId
        this.expenseType = expenseType;
        this.splits = new Map(); // userId -> amount
        this.date = new Date();
        this.category = null;
        this.notes = '';
        this.attachments = [];
    }

    distribute(participants, distribution = null) {
        switch (this.expenseType) {
            case ExpenseType.EQUAL:
                this.distributeEqually(participants);
                break;
            case ExpenseType.EXACT:
                this.distributeExactly(distribution);
                break;
            case ExpenseType.PERCENTAGE:
                this.distributeByPercentage(participants, distribution);
                break;
            case ExpenseType.SHARES:
                this.distributeByShares(participants, distribution);
                break;
            default:
                throw new Error(`Invalid expense type: ${this.expenseType}`);
        }
    }

    distributeEqually(participants) {
        const share = this.amount / participants.length;
        participants.forEach(userId => {
            this.splits.set(userId, share);
        });
    }

    distributeExactly(exactAmounts) {
        let totalAmount = 0;
        exactAmounts.forEach((amount, userId) => {
            this.splits.set(userId, amount);
            totalAmount += amount;
        });

        // Validate total equals expense amount
        if (Math.abs(totalAmount - this.amount) > 0.01) {
            throw new Error(`Sum of exact amounts (${totalAmount}) doesn't match expense amount (${this.amount})`);
        }
    }

    distributeByPercentage(participants, percentages) {
        let totalPercentage = 0;
        participants.forEach((userId, index) => {
            const percentage = percentages[index];
            totalPercentage += percentage;
            const amount = (this.amount * percentage) / 100;
            this.splits.set(userId, amount);
        });

        // Validate total percentage equals 100%
        if (Math.abs(totalPercentage - 100) > 0.01) {
            throw new Error(`Total percentage (${totalPercentage}%) doesn't equal 100%`);
        }
    }

    distributeByShares(participants, shares) {
        const totalShares = shares.reduce((sum, share) => sum + share, 0);
        participants.forEach((userId, index) => {
            const userShares = shares[index];
            const amount = (this.amount * userShares) / totalShares;
            this.splits.set(userId, amount);
        });
    }
}

// Payment Entity
class Payment {
    constructor(id, fromUser, toUser, amount, relatedExpense = null) {
        this.id = id;
        this.fromUser = fromUser; // userId
        this.toUser = toUser; // userId
        this.amount = amount;
        this.date = new Date();
        this.status = PaymentStatus.PENDING;
        this.relatedExpense = relatedExpense; // expenseId
        this.notes = '';
    }

    markAsCompleted() {
        this.status = PaymentStatus.COMPLETED;
        return this;
    }

    cancel() {
        this.status = PaymentStatus.CANCELLED;
        return this;
    }
}

// Expense Manager - Core Service
class ExpenseManager {
    constructor() {
        this.users = new Map(); // userId -> User
        this.groups = new Map(); // groupId -> Group
        this.expenses = new Map(); // expenseId -> Expense
        this.payments = new Map(); // paymentId -> Payment
        this.idCounter = {
            user: 1,
            group: 1,
            expense: 1,
            payment: 1
        };
    }

    // User Management
    createUser(name, email, phoneNumber = null) {
        const userId = `u${this.idCounter.user++}`;
        const user = new User(userId, name, email, phoneNumber);
        this.users.set(userId, user);
        return user;
    }

    getUser(userId) {
        return this.users.get(userId);
    }

    // Group Management
    createGroup(name, description = '') {
        const groupId = `g${this.idCounter.group++}`;
        const group = new Group(groupId, name, description);
        this.groups.set(groupId, group);
        return group;
    }

    getGroup(groupId) {
        return this.groups.get(groupId);
    }

    addUserToGroup(userId, groupId) {
        const user = this.users.get(userId);
        const group = this.groups.get(groupId);
        
        if (!user || !group) {
            throw new Error('User or group not found');
        }

        group.addMember(user);
    }

    // Expense Management
    createExpense(description, amount, paidByUserId, expenseType = ExpenseType.EQUAL) {
        const expenseId = `e${this.idCounter.expense++}`;
        const expense = new Expense(expenseId, description, amount, paidByUserId, expenseType);
        this.expenses.set(expenseId, expense);
        return expense;
    }

    addExpenseToGroup(expenseId, groupId, participants, distribution = null) {
        const expense = this.expenses.get(expenseId);
        const group = this.groups.get(groupId);
        
        if (!expense || !group) {
            throw new Error('Expense or group not found');
        }

        // Distribute the expense among participants
        expense.distribute(participants, distribution);
        
        // Add expense to group
        group.addExpense(expense);
        
        // Update balances for all users involved
        const paidByUser = this.users.get(expense.paidBy);
        
        for (const [userId, amount] of expense.splits.entries()) {
            if (userId !== expense.paidBy) {
                paidByUser.updateBalanceWith(userId, amount);
                const user = this.users.get(userId);
                user.updateBalanceWith(expense.paidBy, -amount);
            }
            
            // Add expense to user's expense list
            const user = this.users.get(userId);
            user.addExpense(expense);
        }
        
        return expense;
    }

    // Payment Management
    createPayment(fromUserId, toUserId, amount, relatedExpenseId = null) {
        const paymentId = `p${this.idCounter.payment++}`;
        const payment = new Payment(paymentId, fromUserId, toUserId, amount, relatedExpenseId);
        this.payments.set(paymentId, payment);
        
        // Update user balances
        const fromUser = this.users.get(fromUserId);
        const toUser = this.users.get(toUserId);
        
        if (!fromUser || !toUser) {
            throw new Error('User not found');
        }
        
        fromUser.updateBalanceWith(toUserId, -amount);
        toUser.updateBalanceWith(fromUserId, amount);
        
        return payment;
    }

    getUserBalances(userId) {
        const user = this.users.get(userId);
        if (!user) {
            throw new Error('User not found');
        }
        
        return {
            totalBalance: user.getTotalBalance(),
            balances: user.balances
        };
    }

    getGroupBalanceSheet(groupId) {
        const group = this.groups.get(groupId);
        if (!group) {
            throw new Error('Group not found');
        }
        
        return group.getBalanceSheet();
    }

    getSimplifiedDebts(groupId) {
        const group = this.groups.get(groupId);
        if (!group) {
            throw new Error('Group not found');
        }
        
        return group.simplifyDebts();
    }
}

// Demonstration Function
function demonstrateExpenseSharingApp() {
    // Create expense manager
    const expenseManager = new ExpenseManager();
    
    // Create users
    const alice = expenseManager.createUser('Alice', 'alice@example.com');
    const bob = expenseManager.createUser('Bob', 'bob@example.com');
    const charlie = expenseManager.createUser('Charlie', 'charlie@example.com');
    
    // Create a group
    const tripGroup = expenseManager.createGroup('Weekend Trip', 'Weekend trip to the mountains');
    
    // Add users to group
    expenseManager.addUserToGroup(alice.id, tripGroup.id);
    expenseManager.addUserToGroup(bob.id, tripGroup.id);
    expenseManager.addUserToGroup(charlie.id, tripGroup.id);
    
    // Create expenses
    const dinnerExpense = expenseManager.createExpense('Dinner', 150, alice.id);
    expenseManager.addExpenseToGroup(
        dinnerExpense.id, 
        tripGroup.id, 
        [alice.id, bob.id, charlie.id]
    );
    
    const cabExpense = expenseManager.createExpense('Cab ride', 60, bob.id);
    expenseManager.addExpenseToGroup(
        cabExpense.id, 
        tripGroup.id, 
        [alice.id, bob.id, charlie.id]
    );
    
    const hotelExpense = expenseManager.createExpense(
        'Hotel', 
        300, 
        charlie.id, 
        ExpenseType.EXACT
    );
    
    // Custom distribution for hotel
    const hotelDistribution = new Map();
    hotelDistribution.set(alice.id, 100);
    hotelDistribution.set(bob.id, 100);
    hotelDistribution.set(charlie.id, 100);
    
    expenseManager.addExpenseToGroup(
        hotelExpense.id, 
        tripGroup.id, 
        [alice.id, bob.id, charlie.id], 
        hotelDistribution
    );
    
    // Get balance sheet
    console.log('Group Balance Sheet:');
    const balanceSheet = expenseManager.getGroupBalanceSheet(tripGroup.id);
    
    for (const [userId, balances] of balanceSheet.entries()) {
        const user = expenseManager.getUser(userId);
        console.log(`\n${user.name}'s balances:`);
        
        for (const [otherUserId, amount] of balances.entries()) {
            if (Math.abs(amount) > 0.01) {
                const otherUser = expenseManager.getUser(otherUserId);
                if (amount > 0) {
                    console.log(`  ${otherUser.name} owes ${user.name}: $${amount.toFixed(2)}`);
                } else {
                    console.log(`  ${user.name} owes ${otherUser.name}: $${Math.abs(amount).toFixed(2)}`);
                }
            }
        }
    }
    
    // Get simplified debts
    console.log('\nSimplified Payments:');
    const simplifiedDebts = expenseManager.getSimplifiedDebts(tripGroup.id);
    
    for (const debt of simplifiedDebts) {
        const fromUser = expenseManager.getUser(debt.from);
        const toUser = expenseManager.getUser(debt.to);
        console.log(`${fromUser.name} pays ${toUser.name}: $${debt.amount.toFixed(2)}`);
    }
    
    // Settle a debt
    const payment = expenseManager.createPayment(bob.id, alice.id, 50);
    payment.markAsCompleted();
    
    console.log('\nAfter Bob pays Alice $50:');
    console.log('Updated balances for Alice:');
    console.log(expenseManager.getUserBalances(alice.id));
}

// Run the demonstration
demonstrateExpenseSharingApp();