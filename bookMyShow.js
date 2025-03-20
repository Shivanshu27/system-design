// Core Domain Models

class User {
    constructor(id, name, email, phoneNumber) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.phoneNumber = phoneNumber;
      this.bookingHistory = [];
    }
    
    addBooking(booking) {
      this.bookingHistory.push(booking);
    }
  }
  
  class Movie {
    constructor(id, title, description, duration, language, releaseDate, genre) {
      this.id = id;
      this.title = title;
      this.description = description;
      this.duration = duration; // in minutes
      this.language = language;
      this.releaseDate = releaseDate;
      this.genre = genre;
      this.shows = [];
    }
    
    addShow(show) {
      this.shows.push(show);
    }
  }
  
  class Cinema {
    constructor(id, name, location, totalScreens) {
      this.id = id;
      this.name = name;
      this.location = location;
      this.screens = [];
      this.totalScreens = totalScreens;
    }
    
    addScreen(screen) {
      if (this.screens.length < this.totalScreens) {
        this.screens.push(screen);
        return true;
      }
      return false;
    }
  }
  
  class Screen {
    constructor(id, name, totalSeats, cinemaId) {
      this.id = id;
      this.name = name;
      this.totalSeats = totalSeats;
      this.cinemaId = cinemaId;
      this.seats = [];
      this.shows = [];
    }
    
    addSeat(seat) {
      this.seats.push(seat);
    }
    
    addShow(show) {
      this.shows.push(show);
    }
  }
  
  class Seat {
    constructor(id, row, number, type, price) {
      this.id = id;
      this.row = row;
      this.number = number;
      this.type = type; // e.g., "STANDARD", "PREMIUM", "RECLINER"
      this.price = price;
    }
  }
  
  class Show {
    constructor(id, movieId, screenId, startTime, endTime, date) {
      this.id = id;
      this.movieId = movieId;
      this.screenId = screenId;
      this.startTime = startTime;
      this.endTime = endTime;
      this.date = date;
      this.bookedSeats = new Map(); // Map of seatId to bookingId
    }
    
    isShowAvailable() {
      // Logic to check if show is available for booking
      const now = new Date();
      const showDateTime = new Date(`${this.date}T${this.startTime}`);
      return showDateTime > now;
    }
    
    isSeatAvailable(seatId) {
      return !this.bookedSeats.has(seatId);
    }
    
    bookSeat(seatId, bookingId) {
      if (this.isSeatAvailable(seatId)) {
        this.bookedSeats.set(seatId, bookingId);
        return true;
      }
      return false;
    }
  }
  
  class Booking {
    constructor(id, userId, showId, seats, totalAmount, status) {
      this.id = id;
      this.userId = userId;
      this.showId = showId;
      this.seats = seats; // Array of seat IDs
      this.totalAmount = totalAmount;
      this.status = status; // "CONFIRMED", "PENDING", "CANCELLED"
      this.createdAt = new Date();
      this.paymentInfo = null;
    }
    
    addPayment(payment) {
      this.paymentInfo = payment;
      if (payment.status === "COMPLETED") {
        this.status = "CONFIRMED";
      }
    }
    
    cancelBooking() {
      if (this.status !== "CONFIRMED") {
        this.status = "CANCELLED";
        return true;
      }
      // Add logic for cancellation policy
      return false;
    }
  }
  
  class Payment {
    constructor(id, bookingId, amount, method, status) {
      this.id = id;
      this.bookingId = bookingId;
      this.amount = amount;
      this.method = method; // "CREDIT_CARD", "DEBIT_CARD", "UPI", etc.
      this.status = status; // "PENDING", "COMPLETED", "FAILED"
      this.transactionId = null;
      this.createdAt = new Date();
    }
    
    processPayment(transactionId) {
      this.transactionId = transactionId;
      this.status = "COMPLETED";
    }
  }
  
  // Service Layer
  
  class UserService {
    constructor() {
      this.users = new Map();
    }
    
    createUser(name, email, phoneNumber) {
      const id = this.generateId();
      const user = new User(id, name, email, phoneNumber);
      this.users.set(id, user);
      return user;
    }
    
    getUser(id) {
      return this.users.get(id);
    }
    
    generateId() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
  }
  
  class MovieService {
    constructor() {
      this.movies = new Map();
    }
    
    addMovie(title, description, duration, language, releaseDate, genre) {
      const id = this.generateId();
      const movie = new Movie(id, title, description, duration, language, releaseDate, genre);
      this.movies.set(id, movie);
      return movie;
    }
    
    getMovie(id) {
      return this.movies.get(id);
    }
    
    searchMovies(query) {
      const results = [];
      for (const movie of this.movies.values()) {
        if (movie.title.toLowerCase().includes(query.toLowerCase()) || 
            movie.genre.toLowerCase().includes(query.toLowerCase())) {
          results.push(movie);
        }
      }
      return results;
    }
    
    generateId() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
  }
  
  class CinemaService {
    constructor() {
      this.cinemas = new Map();
    }
    
    addCinema(name, location, totalScreens) {
      const id = this.generateId();
      const cinema = new Cinema(id, name, location, totalScreens);
      this.cinemas.set(id, cinema);
      return cinema;
    }
    
    getCinema(id) {
      return this.cinemas.get(id);
    }
    
    searchCinemasByLocation(location) {
      const results = [];
      for (const cinema of this.cinemas.values()) {
        if (cinema.location.toLowerCase().includes(location.toLowerCase())) {
          results.push(cinema);
        }
      }
      return results;
    }
    
    generateId() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
  }
  
  class ShowService {
    constructor(movieService, cinemaService) {
      this.shows = new Map();
      this.movieService = movieService;
      this.cinemaService = cinemaService;
    }
    
    createShow(movieId, screenId, startTime, endTime, date) {
      const id = this.generateId();
      const show = new Show(id, movieId, screenId, startTime, endTime, date);
      this.shows.set(id, show);
      
      // Add show to movie
      const movie = this.movieService.getMovie(movieId);
      if (movie) {
        movie.addShow(show);
      }
      
      // Add show to screen
      for (const cinema of this.cinemaService.cinemas.values()) {
        for (const screen of cinema.screens) {
          if (screen.id === screenId) {
            screen.addShow(show);
            break;
          }
        }
      }
      
      return show;
    }
    
    getShow(id) {
      return this.shows.get(id);
    }
    
    getShowsForMovie(movieId, date) {
      const results = [];
      for (const show of this.shows.values()) {
        if (show.movieId === movieId && show.date === date) {
          results.push(show);
        }
      }
      return results;
    }
    
    getShowsForCinema(cinemaId, date) {
      const results = [];
      const cinema = this.cinemaService.getCinema(cinemaId);
      if (!cinema) return results;
      
      for (const screen of cinema.screens) {
        for (const show of this.shows.values()) {
          if (show.screenId === screen.id && show.date === date) {
            results.push(show);
          }
        }
      }
      return results;
    }
    
    generateId() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
  }
  
  class BookingService {
    constructor(userService, showService) {
      this.bookings = new Map();
      this.userService = userService;
      this.showService = showService;
    }
    
    createBooking(userId, showId, seats) {
      const user = this.userService.getUser(userId);
      const show = this.showService.getShow(showId);
      
      if (!user || !show) {
        throw new Error("User or Show not found");
      }
      
      // Check if seats are available
      for (const seatId of seats) {
        if (!show.isSeatAvailable(seatId)) {
          throw new Error(`Seat ${seatId} is not available`);
        }
      }
      
      // Calculate total amount
      let totalAmount = 0;
      // This would need to fetch actual seat prices from the database
      // For simplicity, using a fixed price
      totalAmount = seats.length * 10;
      
      const id = this.generateId();
      const booking = new Booking(id, userId, showId, seats, totalAmount, "PENDING");
      
      // Mark seats as booked
      for (const seatId of seats) {
        show.bookSeat(seatId, id);
      }
      
      this.bookings.set(id, booking);
      user.addBooking(booking);
      
      return booking;
    }
    
    getBooking(id) {
      return this.bookings.get(id);
    }
    
    confirmBooking(bookingId, paymentMethod) {
      const booking = this.getBooking(bookingId);
      if (!booking) {
        throw new Error("Booking not found");
      }
      
      const payment = new Payment(this.generateId(), bookingId, booking.totalAmount, paymentMethod, "PENDING");
      
      // In a real system, you'd integrate with a payment gateway here
      // For demo purposes, we'll just mark it as completed
      payment.processPayment("DEMO_TRANSACTION_" + Date.now());
      
      booking.addPayment(payment);
      return booking;
    }
    
    cancelBooking(bookingId) {
      const booking = this.getBooking(bookingId);
      if (!booking) {
        throw new Error("Booking not found");
      }
      
      const result = booking.cancelBooking();
      if (result) {
        // Release the seats
        const show = this.showService.getShow(booking.showId);
        for (const seatId of booking.seats) {
          show.bookedSeats.delete(seatId);
        }
      }
      
      return result;
    }
    
    generateId() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
  }
  
  // API Layer (simplified for demonstration)
  
  class BookMyShowAPI {
    constructor() {
      this.userService = new UserService();
      this.movieService = new MovieService();
      this.cinemaService = new CinemaService();
      this.showService = new ShowService(this.movieService, this.cinemaService);
      this.bookingService = new BookingService(this.userService, this.showService);
    }
    
    // User API
    registerUser(name, email, phoneNumber) {
      return this.userService.createUser(name, email, phoneNumber);
    }
    
    // Movie API
    addMovie(title, description, duration, language, releaseDate, genre) {
      return this.movieService.addMovie(title, description, duration, language, releaseDate, genre);
    }
    
    searchMovies(query) {
      return this.movieService.searchMovies(query);
    }
    
    // Cinema API
    addCinema(name, location, totalScreens) {
      return this.cinemaService.addCinema(name, location, totalScreens);
    }
    
    searchCinemas(location) {
      return this.cinemaService.searchCinemasByLocation(location);
    }
    
    // Show API
    addShow(movieId, screenId, startTime, endTime, date) {
      return this.showService.createShow(movieId, screenId, startTime, endTime, date);
    }
    
    getShowsForMovie(movieId, date) {
      return this.showService.getShowsForMovie(movieId, date);
    }
    
    getShowsForCinema(cinemaId, date) {
      return this.showService.getShowsForCinema(cinemaId, date);
    }
    
    // Booking API
    createBooking(userId, showId, seats) {
      return this.bookingService.createBooking(userId, showId, seats);
    }
    
    confirmBooking(bookingId, paymentMethod) {
      return this.bookingService.confirmBooking(bookingId, paymentMethod);
    }
    
    cancelBooking(bookingId) {
      return this.bookingService.cancelBooking(bookingId);
    }
  }
  
  // Usage Example
  
  function demoBookMyShow() {
    const app = new BookMyShowAPI();
    
    // Register a user
    const user = app.registerUser("John Doe", "john@example.com", "1234567890");
    console.log("User registered:", user);
    
    // Add a movie
    const movie = app.addMovie(
      "The Matrix",
      "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
      136,
      "English",
      "1999-03-31",
      "Sci-Fi"
    );
    console.log("Movie added:", movie);
    
    // Add a cinema
    const cinema = app.addCinema("PVR Cinemas", "Mumbai", 5);
    console.log("Cinema added:", cinema);
    
    // Add a screen to the cinema
    const screen = new Screen("SCR001", "Screen 1", 100, cinema.id);
    cinema.addScreen(screen);
    
    // Add seats to the screen
    for (let row = 'A'; row <= 'J'; row = String.fromCharCode(row.charCodeAt(0) + 1)) {
      for (let num = 1; num <= 10; num++) {
        const seatType = row < 'D' ? "STANDARD" : row < 'H' ? "PREMIUM" : "RECLINER";
        const price = seatType === "STANDARD" ? 10 : seatType === "PREMIUM" ? 15 : 20;
        const seat = new Seat(`${row}${num}`, row, num, seatType, price);
        screen.addSeat(seat);
      }
    }
    
    // Add a show
    const show = app.addShow(movie.id, screen.id, "18:00", "20:30", "2023-09-20");
    console.log("Show added:", show);
    
    // Create a booking
    const booking = app.createBooking(user.id, show.id, ["A1", "A2"]);
    console.log("Booking created:", booking);
    
    // Confirm booking with payment
    const confirmedBooking = app.confirmBooking(booking.id, "CREDIT_CARD");
    console.log("Booking confirmed:", confirmedBooking);
    
    // Search for movies
    const searchResults = app.searchMovies("Matrix");
    console.log("Search results:", searchResults);
    
    // Get shows for a movie on a specific date
    const movieShows = app.getShowsForMovie(movie.id, "2023-09-20");
    console.log("Shows for movie:", movieShows);
    
    return {
      user,
      movie,
      cinema,
      show,
      booking: confirmedBooking
    };
  }
  
  // Run the demo
  const demoResult = demoBookMyShow();
  console.log("Demo completed successfully:", demoResult);



//   System Architecture Explanation
// The above code implements a low-level design for a movie ticket booking application similar to BookMyShow. Let me explain the key components:
// 1. Domain Models

// User: Represents registered users with personal information and booking history
// Movie: Contains movie details like title, description, duration, etc.
// Cinema: Represents a theater with multiple screens
// Screen: A specific auditorium within a cinema with seats
// Seat: Individual seats in a screen with type and pricing
// Show: A specific screening of a movie at a particular time and screen
// Booking: Represents a user's reservation for specific seats at a show
// Payment: Handles payment information for bookings

// 2. Service Layer

// UserService: Manages user registration and retrieval
// MovieService: Handles adding, retrieving, and searching for movies
// CinemaService: Manages cinema information and searches
// ShowService: Creates and manages show schedules
// BookingService: Handles the booking process, including seat selection and payment

// 3. API Layer

// BookMyShowAPI: Provides a unified interface for all operations

// 4. Key Features Implemented

// User Management: Registration and profile management
// Movie Catalog: Adding and searching for movies
// Cinema Management: Adding cinemas and screens
// Show Scheduling: Creating shows for movies at specific screens
// Seat Management: Handling seat availability and booking
// Booking Process: Creating, confirming, and canceling bookings
// Payment Processing: (Simplified) handling of payments

// 5. Design Patterns Used

// Factory Pattern: For ID generation
// Facade Pattern: BookMyShowAPI provides a simplified interface
// Repository Pattern: Services act as repositories for their respective entities

// 6. Important Considerations

// Concurrency: In a real system, you'd need locking mechanisms to prevent double-booking
// Persistence: This example uses in-memory storage; a real system would use databases
// Authentication/Authorization: Not implemented, but crucial for a production system
// Payment Integration: Simplified; would integrate with payment gateways in production
// Error Handling: Basic error handling is implemented, but would need expansion

// 7. Usage Flow

// User searches for movies
// User selects a movie and checks available shows
// User selects a show and chooses seats
// User creates a booking for the selected seats
// User confirms the booking by making a payment
// User can view or cancel bookings

// This design follows object-oriented principles and provides a solid foundation for building a scalable ticket booking system. For a production system, you'd need to add more robust error handling, authentication, and database integration.