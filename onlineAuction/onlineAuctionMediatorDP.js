// Auction Status Enum
const AuctionStatus = {
    PENDING: 'pending',
    ACTIVE: 'active',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
};

// Mediator Interface
class AuctionMediator {
    registerBidder(bidder) {
        throw new Error('Must implement registerBidder method');
    }

    placeBid(bidder, bidAmount) {
        throw new Error('Must implement placeBid method');
    }

    notifyBidders(currentBidder, bidAmount) {
        throw new Error('Must implement notifyBidders method');
    }
}

// Colleague Interface
class Bidder {
    constructor(name, mediator) {
        this.name = name;
        this.mediator = mediator;
        this.maxBidLimit = 0;
        this.currentBidAmount = 0;
    }

    placeBid(bidAmount) {
        throw new Error('Must implement placeBid method');
    }

    receiveBidNotification(bidderName, bidAmount) {
        throw new Error('Must implement receiveBidNotification method');
    }

    setMaxBidLimit(amount) {
        this.maxBidLimit = amount;
        return this;
    }
}

// Concrete Mediator
class OnlineAuctionMediator extends AuctionMediator {
    constructor(auction) {
        super();
        this.bidders = new Map();
        this.auction = auction;
    }

    registerBidder(bidder) {
        if (!this.bidders.has(bidder.name)) {
            this.bidders.set(bidder.name, bidder);
            return true;
        }
        return false;
    }

    placeBid(bidder, bidAmount) {
        // Check auction status
        if (this.auction.status !== AuctionStatus.ACTIVE) {
            console.log(`Auction is not active. Current status: ${this.auction.status}`);
            return false;
        }

        // Validate bid amount
        if (bidAmount <= this.auction.currentHighestBid) {
            console.log(`Bid must be higher than current highest bid of $${this.auction.currentHighestBid}`);
            return false;
        }

        // Check bidder's max bid limit
        if (bidder.maxBidLimit > 0 && bidAmount > bidder.maxBidLimit) {
            console.log(`Bid exceeds ${bidder.name}'s max bid limit of $${bidder.maxBidLimit}`);
            return false;
        }

        // Update auction details
        this.auction.currentHighestBid = bidAmount;
        this.auction.highestBidder = bidder;

        // Notify other bidders
        this.notifyBidders(bidder, bidAmount);

        return true;
    }

    notifyBidders(currentBidder, bidAmount) {
        for (let [name, bidder] of this.bidders.entries()) {
            if (bidder !== currentBidder) {
                bidder.receiveBidNotification(currentBidder.name, bidAmount);
            }
        }
    }
}

// Concrete Colleague (Bidder)
class IndividualBidder extends Bidder {
    constructor(name, mediator) {
        super(name, mediator);
        this.bidHistory = [];
    }

    placeBid(bidAmount) {
        console.log(`${this.name} attempting to place bid of $${bidAmount}`);
        
        if (this.mediator.placeBid(this, bidAmount)) {
            this.currentBidAmount = bidAmount;
            this.bidHistory.push({
                amount: bidAmount,
                timestamp: new Date()
            });
            return true;
        }
        return false;
    }

    receiveBidNotification(bidderName, bidAmount) {
        console.log(`${this.name} received notification: ${bidderName} placed a bid of $${bidAmount}`);
    }

    // Optional: Implement auto-bidding strategy
    autoBid(maxBidAmount) {
        const incrementAmount = Math.min(
            maxBidAmount, 
            this.currentBidAmount * 1.1 // 10% increment
        );
        
        return this.placeBid(incrementAmount);
    }
}

// Auction Item Class
class AuctionItem {
    constructor(id, name, startingPrice, reservePrice) {
        this.id = id;
        this.name = name;
        this.startingPrice = startingPrice;
        this.reservePrice = reservePrice;
        this.currentHighestBid = startingPrice;
        this.highestBidder = null;
        this.status = AuctionStatus.PENDING;
    }

    startAuction() {
        this.status = AuctionStatus.ACTIVE;
        return this;
    }

    endAuction() {
        this.status = this.currentHighestBid >= this.reservePrice 
            ? AuctionStatus.COMPLETED 
            : AuctionStatus.CANCELLED;
        return this;
    }
}

// Auction System Demonstration
function demonstrateAuctionSystem() {
    // Create auction item
    const luxuryWatch = new AuctionItem(
        'ITEM001', 
        'Luxury Vintage Watch', 
        1000, 
        1500
    );

    // Create auction mediator
    const auctionMediator = new OnlineAuctionMediator(luxuryWatch);

    // Create bidders
    const alice = new IndividualBidder('Alice', auctionMediator);
    const bob = new IndividualBidder('Bob', auctionMediator);
    const charlie = new IndividualBidder('Charlie', auctionMediator);

    // Register bidders
    auctionMediator.registerBidder(alice);
    auctionMediator.registerBidder(bob);
    auctionMediator.registerBidder(charlie);

    // Set max bid limits
    alice.setMaxBidLimit(2000);
    bob.setMaxBidLimit(1800);
    charlie.setMaxBidLimit(2500);

    // Start the auction
    luxuryWatch.startAuction();

    // Bidding process
    alice.placeBid(1200);
    bob.placeBid(1300);
    charlie.placeBid(1500);
    alice.placeBid(1600);

    // End the auction
    luxuryWatch.endAuction();

    // Display auction results
    console.log('\nAuction Result:');
    console.log('Item:', luxuryWatch.name);
    console.log('Status:', luxuryWatch.status);
    console.log('Highest Bid:', luxuryWatch.currentHighestBid);
    console.log('Highest Bidder:', luxuryWatch.highestBidder?.name || 'No bidder');
}

// Run the demonstration
demonstrateAuctionSystem();