import { RequestHandler } from "express";
import { z } from "zod";
import { travelAPIService } from "../services/travelApiService";

// Validation schema
const ItineraryRequestSchema = z.object({
  city: z.string().min(1, "City is required"),
  budget: z.number().min(100, "Budget must be at least $100"),
  days: z.number().min(1).max(14, "Trip must be between 1-14 days"),
  difficulty: z.enum(["easy", "medium", "hard"])
});

interface Activity {
  id: string;
  name: string;
  type: 'attraction' | 'dining' | 'activity' | 'transport' | 'hotel';
  time: string;
  duration: string;
  cost: number; // In INR
  costUSD?: number;
  rating: number;
  description: string;
  address: string;
  tips?: string;
  imageUrl?: string;
  bookingUrl?: string;
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
}

interface Hotel {
  id: string;
  name: string;
  type: 'budget' | 'midrange' | 'luxury';
  pricePerNight: number; // In INR
  pricePerNightUSD?: number;
  rating: number;
  amenities: string[];
  description: string;
  address: string;
  imageUrl?: string;
  bookingUrl?: string;
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  checkIn: string;
  checkOut: string;
  totalNights: number;
  totalCost: number; // In INR
}

interface DayItinerary {
  day: number;
  date: string;
  totalCost: number; // In INR
  summary: string;
  highlights: string[];
  activities: {
    morning: Activity[];
    afternoon: Activity[];
    evening: Activity[];
  };
  hotel?: Hotel;
}

interface ItineraryResponse {
  destination: string;
  destinationCountry: string;
  totalDays: number;
  totalBudget: number; // In INR
  totalBudgetUSD?: number;
  difficulty: string;
  currency: 'INR' | 'USD' | 'EUR' | 'GBP';
  exchangeRate?: number;
  days: DayItinerary[];
  hotels: Hotel[];
  totalHotelCost: number; // In INR
  totalActivityCost: number; // In INR
  tips: string[];
  bestTimeToVisit: string;
  weatherInfo: string;
  localCurrency: string;
  emergencyContacts: {
    police: string;
    medical: string;
    embassy?: string;
  };
}

// Currency conversion rate (USD to INR)
const USD_TO_INR_RATE = 83.25;

// Convert USD amounts to INR
const convertToINR = (usdAmount: number): number => Math.round(usdAmount * USD_TO_INR_RATE);

// Mock data generator - in a real app, this would use AI/LLM APIs
const generateItinerary = (city: string, budgetUSD: number, days: number, difficulty: string): ItineraryResponse => {
  const budget = convertToINR(budgetUSD); // Convert to INR
  const dailyBudget = Math.floor(budget / days);

  // Base activity templates with INR pricing
  const attractionTemplates = [
    { name: "Historic City Center", cost: 0, costUSD: 0, rating: 4.5, type: "Free walking tour" },
    { name: "Main Cathedral/Landmark", cost: convertToINR(15), costUSD: 15, rating: 4.7, type: "Religious/Historic site" },
    { name: "Art Museum", cost: convertToINR(20), costUSD: 20, rating: 4.6, type: "Cultural attraction" },
    { name: "Observation Deck", cost: convertToINR(25), costUSD: 25, rating: 4.8, type: "Scenic viewpoint" },
    { name: "Local Market", cost: 0, costUSD: 0, rating: 4.4, type: "Cultural experience" }
  ];

  const diningTemplates = [
    { name: "Local Café", cost: convertToINR(15), costUSD: 15, rating: 4.3, type: "Casual dining" },
    { name: "Traditional Restaurant", cost: convertToINR(35), costUSD: 35, rating: 4.5, type: "Local cuisine" },
    { name: "Fine Dining", cost: convertToINR(75), costUSD: 75, rating: 4.7, type: "Upscale restaurant" },
    { name: "Street Food Tour", cost: convertToINR(25), costUSD: 25, rating: 4.6, type: "Food experience" }
  ];

  // Hotel templates with INR pricing
  const hotelTemplates = [
    {
      type: "budget" as const,
      names: ["Budget Inn", "Traveler's Lodge", "City Stay"],
      pricePerNight: convertToINR(30),
      pricePerNightUSD: 30,
      amenities: ["Free WiFi", "24/7 Reception", "Basic Breakfast"],
      rating: 3.8
    },
    {
      type: "midrange" as const,
      names: ["Grand Hotel", "Central Plaza", "Heritage Inn"],
      pricePerNight: convertToINR(80),
      pricePerNightUSD: 80,
      amenities: ["Free WiFi", "Restaurant", "Room Service", "Gym", "Pool"],
      rating: 4.3
    },
    {
      type: "luxury" as const,
      names: ["Royal Palace", "Luxury Suites", "Five Star Resort"],
      pricePerNight: convertToINR(200),
      pricePerNightUSD: 200,
      amenities: ["Free WiFi", "Multiple Restaurants", "Spa", "Concierge", "Valet", "Pool", "Gym"],
      rating: 4.8
    }
  ];

  // Determine hotel type based on budget
  const getHotelType = (): "budget" | "midrange" | "luxury" => {
    const dailyBudgetUSD = budgetUSD / days;
    if (dailyBudgetUSD < 100) return "budget";
    if (dailyBudgetUSD < 250) return "midrange";
    return "luxury";
  };

  const hotelType = getHotelType();
  const selectedHotelTemplate = hotelTemplates.find(h => h.type === hotelType) || hotelTemplates[0];

  // Generate hotel for the trip
  const generateHotel = (): Hotel => {
    const hotelName = selectedHotelTemplate.names[Math.floor(Math.random() * selectedHotelTemplate.names.length)];
    const totalNights = days - 1; // Usually one less night than days

    return {
      id: "hotel_1",
      name: `${city} ${hotelName}`,
      type: selectedHotelTemplate.type,
      pricePerNight: selectedHotelTemplate.pricePerNight,
      pricePerNightUSD: selectedHotelTemplate.pricePerNightUSD,
      rating: selectedHotelTemplate.rating,
      amenities: selectedHotelTemplate.amenities,
      description: `A comfortable ${selectedHotelTemplate.type} hotel in the heart of ${city}, perfect for your stay.`,
      address: `${city} City Center`,
      checkIn: new Date(Date.now()).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      checkOut: new Date(Date.now() + (days - 1) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      totalNights,
      totalCost: selectedHotelTemplate.pricePerNight * totalNights,
      contact: {
        phone: "+91-XXX-XXX-XXXX",
        email: `reservations@${hotelName.toLowerCase().replace(/\s+/g, '')}.com`,
        website: `www.${hotelName.toLowerCase().replace(/\s+/g, '')}.com`
      }
    };
  };

  const hotel = generateHotel();

  const generateDay = (dayNum: number): DayItinerary => {
    const activityBudget = (dailyBudget - (hotel.pricePerNight / days)) * (difficulty === "easy" ? 0.7 : difficulty === "medium" ? 0.85 : 1.0);

    return {
      day: dayNum,
      date: new Date(Date.now() + (dayNum - 1) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      totalCost: Math.round(activityBudget),
      summary: `Day ${dayNum} of your ${city} adventure combines cultural exploration with local experiences`,
      highlights: dayNum === 1 ? ["Must-see landmarks", "Local culture"] :
                  dayNum === 2 ? ["Hidden gems", "Culinary delights"] :
                  ["Final experiences", "Memorable moments"],
      activities: {
        morning: [
          {
            id: `m${dayNum}`,
            name: attractionTemplates[dayNum % attractionTemplates.length].name.replace("Main", `${city} Main`),
            type: "attraction" as const,
            time: "9:00 AM",
            duration: difficulty === "easy" ? "1.5 hours" : "2 hours",
            cost: attractionTemplates[dayNum % attractionTemplates.length].cost,
            costUSD: attractionTemplates[dayNum % attractionTemplates.length].costUSD,
            rating: attractionTemplates[dayNum % attractionTemplates.length].rating,
            description: `Explore one of ${city}'s most iconic attractions and immerse yourself in local history and culture.`,
            address: `${city} City Center`,
            tips: difficulty === "hard" ? "Arrive early to avoid crowds and get the best experience." : undefined
          }
        ],
        afternoon: [
          {
            id: `a1${dayNum}`,
            name: attractionTemplates[(dayNum + 1) % attractionTemplates.length].name,
            type: "attraction" as const,
            time: "2:00 PM",
            duration: difficulty === "easy" ? "2 hours" : "2.5 hours",
            cost: attractionTemplates[(dayNum + 1) % attractionTemplates.length].cost,
            costUSD: attractionTemplates[(dayNum + 1) % attractionTemplates.length].costUSD,
            rating: attractionTemplates[(dayNum + 1) % attractionTemplates.length].rating,
            description: `Continue your ${city} exploration with this carefully selected attraction that showcases the city's unique character.`,
            address: `${city} Cultural District`
          },
          {
            id: `a2${dayNum}`,
            name: diningTemplates[dayNum % diningTemplates.length].name,
            type: "dining" as const,
            time: "5:00 PM",
            duration: "1 hour",
            cost: Math.min(diningTemplates[dayNum % diningTemplates.length].cost, activityBudget * 0.4),
            costUSD: diningTemplates[dayNum % diningTemplates.length].costUSD,
            rating: diningTemplates[dayNum % diningTemplates.length].rating,
            description: `Savor authentic ${city} cuisine at this carefully selected local establishment.`,
            address: `${city} Dining District`
          }
        ],
        evening: [
          {
            id: `e${dayNum}`,
            name: dayNum % 2 === 1 ? "Evening Walking Tour" : "Cultural Performance",
            type: "activity" as const,
            time: difficulty === "easy" ? "7:00 PM" : "8:00 PM",
            duration: difficulty === "easy" ? "1 hour" : "1.5 hours",
            cost: Math.round(activityBudget * 0.2),
            rating: 4.5,
            description: `End your day with a memorable ${city} experience that captures the city's evening atmosphere.`,
            address: `${city} Entertainment District`,
            tips: "Perfect way to unwind and reflect on your day's adventures."
          }
        ]
      },
      hotel: dayNum < days ? hotel : undefined // Hotel for all nights except the last day
    };
  };

  const generatedDays = Array.from({ length: days }, (_, i) => generateDay(i + 1));
  const totalActivityCost = generatedDays.reduce((sum, day) => sum + day.totalCost, 0);

  const tips = [
    `Learn basic local phrases - ${city} locals appreciate the effort`,
    "Keep copies of important documents separate from originals",
    "Download offline maps in case of poor internet connection",
    `Research ${city}'s tipping customs and local etiquette`,
    "Book popular attractions in advance to avoid disappointment",
    `Try to use public transportation - it's often the most authentic way to experience ${city}`,
    "All prices are shown in Indian Rupees (INR)",
    "Currency exchange rates are updated daily"
  ];

  // Determine country based on city (simplified mapping)
  const cityCountryMap: { [key: string]: string } = {
    'paris': 'France',
    'london': 'United Kingdom',
    'tokyo': 'Japan',
    'mumbai': 'India',
    'delhi': 'India',
    'bangalore': 'India',
    'new york': 'United States',
    'bangkok': 'Thailand',
    'singapore': 'Singapore',
    'dubai': 'United Arab Emirates'
  };

  const destinationCountry = cityCountryMap[city.toLowerCase()] || 'Unknown';

  return {
    destination: city,
    destinationCountry,
    totalDays: days,
    totalBudget: budget,
    totalBudgetUSD: budgetUSD,
    difficulty,
    currency: 'INR' as const,
    exchangeRate: USD_TO_INR_RATE,
    days: generatedDays,
    hotels: [hotel],
    totalHotelCost: hotel.totalCost,
    totalActivityCost,
    tips: difficulty === "hard" ? tips : tips.slice(0, 6),
    bestTimeToVisit: "Year-round (varies by destination)",
    weatherInfo: "Check local weather forecast before traveling",
    localCurrency: destinationCountry === 'India' ? 'INR' : 'Local currency varies',
    emergencyContacts: {
      police: destinationCountry === 'India' ? '100' : 'Local emergency number',
      medical: destinationCountry === 'India' ? '108' : 'Local emergency number',
      embassy: destinationCountry !== 'India' ? 'Contact Indian Embassy' : undefined
    }
  };
};

export const generateItineraryHandler: RequestHandler = async (req, res) => {
  try {
    console.log('Received itinerary generation request:', req.body);

    const validatedData = ItineraryRequestSchema.parse(req.body);

    console.log('Validated data:', validatedData);
    console.log('Generating itinerary with real API integration for:', validatedData.city);

    // Always ensure we return a valid response
    let finalItinerary: ItineraryResponse | null = null;

    // Try to use enhanced API integration first
    try {
      console.log('Attempting enhanced API generation...');
      const enhancedItinerary = await travelAPIService.generateEnhancedItinerary(
        validatedData.city,
        validatedData.budget,
        validatedData.days,
        validatedData.difficulty
      );

      // If enhanced generation returns valid data, use it
      if (enhancedItinerary && enhancedItinerary.days && enhancedItinerary.days.length > 0) {
        console.log('Successfully generated enhanced itinerary using real APIs');
        finalItinerary = enhancedItinerary;
      } else {
        console.log('Enhanced generation returned empty or invalid data, using fallback');
      }
    } catch (apiError) {
      console.warn('Enhanced API generation failed, falling back to standard generation:', apiError);
    }

    // Fallback to standard generation if enhanced failed
    if (!finalItinerary) {
      console.log('Using standard itinerary generation with mock data');
      try {
        finalItinerary = generateItinerary(
          validatedData.city,
          validatedData.budget,
          validatedData.days,
          validatedData.difficulty
        );
        console.log('Standard generation completed successfully');
      } catch (fallbackError) {
        console.error('Even fallback generation failed:', fallbackError);
        throw new Error('Both enhanced and standard itinerary generation failed');
      }
    }

    if (!finalItinerary) {
      throw new Error('Failed to generate any itinerary');
    }

    console.log('Sending successful response with itinerary');
    res.json({
      success: true,
      data: finalItinerary
    });

  } catch (error) {
    console.error("Error in generateItineraryHandler:", error);

    if (error instanceof z.ZodError) {
      console.log('Validation error:', error.errors);
      res.status(400).json({
        success: false,
        error: "Invalid input data",
        details: error.errors
      });
    } else {
      console.log('Server error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate itinerary"
      });
    }
  }
};

export const getCityInfoHandler: RequestHandler = async (req, res) => {
  try {
    const { city } = req.params;
    
    if (!city) {
      return res.status(400).json({
        success: false,
        error: "City parameter is required"
      });
    }

    // Mock city information - in a real app, this would query a database or external API
    const cityInfo = {
      name: city,
      country: "Unknown", // Would be determined by actual API
      currency: "USD", // Would be determined by actual API
      timeZone: "UTC", // Would be determined by actual API
      popularAttractions: [
        "Historic City Center",
        "Main Cathedral",
        "Art Museum",
        "Local Market"
      ],
      averageCosts: {
        budget: { min: 50, max: 100 },
        midRange: { min: 100, max: 200 },
        luxury: { min: 200, max: 500 }
      },
      bestTimeToVisit: "Year-round",
      safetyRating: 4.2
    };

    res.json({
      success: true,
      data: cityInfo
    });
  } catch (error) {
    console.error("Error fetching city info:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch city information"
    });
  }
};
