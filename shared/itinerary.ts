// Shared types for itinerary API

export interface TravelFormData {
  city: string;
  budget: number;
  days: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Activity {
  id: string;
  name: string;
  type: 'attraction' | 'dining' | 'activity' | 'transport' | 'hotel';
  time: string;
  duration: string;
  cost: number; // Always in INR
  costUSD?: number; // Optional USD equivalent
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

export interface Hotel {
  id: string;
  name: string;
  type: 'budget' | 'midrange' | 'luxury';
  pricePerNight: number; // In INR
  pricePerNightUSD?: number; // Optional USD equivalent
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

export interface DayItinerary {
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
  hotel?: Hotel; // Hotel for this night
}

export interface ItineraryData {
  destination: string;
  destinationCountry: string;
  totalDays: number;
  totalBudget: number; // In INR
  totalBudgetUSD?: number; // Optional USD equivalent
  difficulty: string;
  currency: 'INR' | 'USD' | 'EUR' | 'GBP';
  exchangeRate?: number; // Rate used for conversion
  days: DayItinerary[];
  hotels: Hotel[]; // All hotels for the trip
  totalHotelCost: number; // In INR
  totalActivityCost: number; // In INR
  tips: string[];
  bestTimeToVisit: string;
  weatherInfo: string;
  localCurrency: string;
  aiInsights?: string;
  emergencyContacts: {
    police: string;
    medical: string;
    embassy?: string;
  };
}

export interface ItineraryApiResponse {
  success: boolean;
  data?: ItineraryData;
  error?: string;
  details?: any;
}

export interface CityInfo {
  name: string;
  country: string;
  currency: string;
  timeZone: string;
  popularAttractions: string[];
  averageCosts: {
    budget: { min: number; max: number };
    midRange: { min: number; max: number };
    luxury: { min: number; max: number };
  };
  bestTimeToVisit: string;
  safetyRating: number;
}

export interface CityInfoApiResponse {
  success: boolean;
  data?: CityInfo;
  error?: string;
}
