import { ItineraryData } from '@shared/itinerary';

export const createTestItinerary = (): ItineraryData => {
  return {
    destination: "Mumbai",
    destinationCountry: "India",
    totalDays: 2,
    totalBudget: 8325, // In INR
    totalBudgetUSD: 100,
    difficulty: "medium",
    currency: "INR",
    exchangeRate: 83.25,
    days: [
      {
        day: 1,
        date: "January 15, 2024",
        totalCost: 3000,
        summary: "Explore Mumbai's iconic landmarks and local culture",
        highlights: ["Gateway of India", "Marine Drive", "Local Street Food"],
        activities: {
          morning: [{
            id: "m1",
            name: "Gateway of India",
            type: "attraction",
            time: "9:00 AM",
            duration: "2 hours",
            cost: 0,
            rating: 4.5,
            description: "Iconic arch monument overlooking the Arabian Sea",
            address: "Apollo Bandar, Colaba, Mumbai",
            tips: "Best time for photos is early morning"
          }],
          afternoon: [{
            id: "a1",
            name: "Chhatrapati Shivaji Maharaj Vastu Sangrahalaya",
            type: "attraction", 
            time: "2:00 PM",
            duration: "2.5 hours",
            cost: 500,
            rating: 4.6,
            description: "Former Prince of Wales Museum with art and artifacts",
            address: "159-161, Mahatma Gandhi Road, Mumbai"
          }],
          evening: [{
            id: "e1",
            name: "Marine Drive Evening Walk",
            type: "activity",
            time: "7:00 PM", 
            duration: "1.5 hours",
            cost: 0,
            rating: 4.7,
            description: "Scenic promenade along the coast, perfect for sunset",
            address: "Marine Drive, Mumbai",
            tips: "Great spot to watch the sunset"
          }]
        },
        hotel: {
          id: "hotel1",
          name: "Mumbai Heritage Hotel",
          type: "midrange",
          pricePerNight: 5000,
          pricePerNightUSD: 60,
          rating: 4.2,
          amenities: ["Free WiFi", "Restaurant", "Room Service", "AC"],
          description: "Comfortable mid-range hotel in central Mumbai",
          address: "Colaba, Mumbai",
          imageUrl: "https://example.com/hotel.jpg",
          checkIn: "January 15, 2024",
          checkOut: "January 16, 2024", 
          totalNights: 1,
          totalCost: 5000,
          contact: {
            phone: "+91-22-2202-5555",
            email: "reservations@mumbaiheritage.com",
            website: "www.mumbaiheritage.com"
          }
        }
      }
    ],
    hotels: [{
      id: "hotel1",
      name: "Mumbai Heritage Hotel", 
      type: "midrange",
      pricePerNight: 5000,
      pricePerNightUSD: 60,
      rating: 4.2,
      amenities: ["Free WiFi", "Restaurant", "Room Service", "AC"],
      description: "Comfortable mid-range hotel in central Mumbai",
      address: "Colaba, Mumbai",
      checkIn: "January 15, 2024",
      checkOut: "January 16, 2024",
      totalNights: 1,
      totalCost: 5000,
      contact: {
        phone: "+91-22-2202-5555",
        email: "reservations@mumbaiheritage.com", 
        website: "www.mumbaiheritage.com"
      }
    }],
    totalHotelCost: 5000,
    totalActivityCost: 500,
    tips: [
      "Mumbai local trains are the fastest way to get around",
      "Try authentic street food at Chowpatty Beach",
      "Carry an umbrella during monsoon season",
      "Book movie tickets in advance for IMAX experiences"
    ],
    bestTimeToVisit: "October to February (cool and dry)",
    weatherInfo: "Pleasant weather expected, 22°C - 28°C",
    localCurrency: "INR",
    emergencyContacts: {
      police: "100",
      medical: "108",
      embassy: "Contact respective embassies in Mumbai"
    }
  };
};

// Test itinerary with missing optional properties
export const createMinimalItinerary = (): Partial<ItineraryData> => {
  return {
    destination: "Test City",
    totalDays: 1,
    totalBudget: 1000,
    difficulty: "easy",
    days: [{
      day: 1,
      date: "Today",
      totalCost: 500,
      summary: "Test day",
      highlights: ["Test highlight"],
      activities: {
        morning: [{
          id: "test1",
          name: "Test Activity",
          type: "attraction",
          time: "9:00 AM",
          duration: "1 hour", 
          cost: 100,
          rating: 4.0,
          description: "Test description",
          address: "Test address"
        }],
        afternoon: [],
        evening: []
      }
    }],
    tips: ["Test tip"]
  };
};
