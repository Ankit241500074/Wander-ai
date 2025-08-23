// Google Maps API Service for real location data integration

interface GooglePlaceDetails {
  place_id: string;
  name: string;
  types: string[];
  rating?: number;
  price_level?: number;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  opening_hours?: {
    open_now: boolean;
    weekday_text: string[];
  };
  website?: string;
  formatted_phone_number?: string;
  business_status?: string;
}

interface GooglePlacesSearchResult {
  results: GooglePlaceDetails[];
  status: string;
  next_page_token?: string;
}

interface GoogleGeocodeResult {
  results: Array<{
    formatted_address: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
    types: string[];
    address_components: Array<{
      long_name: string;
      short_name: string;
      types: string[];
    }>;
  }>;
  status: string;
}

export class GoogleMapsService {
  private apiKey: string;
  private baseUrl = 'https://maps.googleapis.com/maps/api';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Get city coordinates
  async getCityCoordinates(city: string): Promise<{ lat: number; lng: number; country: string } | null> {
    try {
      console.log(`Getting coordinates for city: ${city}`);

      const url = `${this.baseUrl}/geocode/json?address=${encodeURIComponent(city)}&key=${this.apiKey}`;
      console.log('Google Maps geocode URL:', url);

      const response = await fetch(url);

      if (!response.ok) {
        console.error(`Google Maps geocode HTTP error! status: ${response.status}`);
        return null;
      }

      const data: GoogleGeocodeResult = await response.json();
      console.log('Google Maps geocode response:', data);

      if (data.status === 'REQUEST_DENIED') {
        console.error('Google Maps API access denied. Please check API key permissions and enabled APIs.');
        console.error('Required APIs: Geocoding API, Places API, Maps JavaScript API');
        return null;
      }

      if (data.status === 'OVER_QUERY_LIMIT') {
        console.error('Google Maps API quota exceeded');
        return null;
      }

      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0];

        // Extract country from address components
        const countryComponent = result.address_components.find(
          component => component.types.includes('country')
        );

        const coordinates = {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
          country: countryComponent?.long_name || 'Unknown'
        };

        console.log('Successfully got coordinates:', coordinates);
        return coordinates;
      } else {
        console.warn('Google Maps geocode failed:', data.status);
        return null;
      }

    } catch (error) {
      console.error('Error getting city coordinates:', error);
      return null;
    }
  }

  // Search for tourist attractions
  async searchAttractions(lat: number, lng: number, radius: number = 5000): Promise<GooglePlaceDetails[]> {
    try {
      const types = ['tourist_attraction', 'museum', 'art_gallery', 'church', 'park'];
      const response = await fetch(
        `${this.baseUrl}/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${types.join('|')}&key=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: GooglePlacesSearchResult = await response.json();
      
      if (data.status === 'OK') {
        return data.results.filter(place => place.rating && place.rating >= 4.0).slice(0, 10);
      }
      
      return [];
    } catch (error) {
      console.error('Error searching attractions:', error);
      return [];
    }
  }

  // Search for restaurants
  async searchRestaurants(lat: number, lng: number, radius: number = 3000): Promise<GooglePlaceDetails[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=restaurant&key=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: GooglePlacesSearchResult = await response.json();
      
      if (data.status === 'OK') {
        return data.results.filter(place => place.rating && place.rating >= 4.0).slice(0, 8);
      }
      
      return [];
    } catch (error) {
      console.error('Error searching restaurants:', error);
      return [];
    }
  }

  // Search for hotels
  async searchHotels(lat: number, lng: number, radius: number = 5000): Promise<GooglePlaceDetails[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=lodging&key=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: GooglePlacesSearchResult = await response.json();
      
      if (data.status === 'OK') {
        return data.results.filter(place => place.rating && place.rating >= 3.5).slice(0, 5);
      }
      
      return [];
    } catch (error) {
      console.error('Error searching hotels:', error);
      return [];
    }
  }

  // Get place details
  async getPlaceDetails(placeId: string): Promise<GooglePlaceDetails | null> {
    try {
      const fields = [
        'name', 'rating', 'formatted_address', 'geometry', 'price_level',
        'opening_hours', 'website', 'formatted_phone_number', 'photos', 'types'
      ].join(',');
      
      const response = await fetch(
        `${this.baseUrl}/place/details/json?place_id=${placeId}&fields=${fields}&key=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'OK') {
        return data.result;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting place details:', error);
      return null;
    }
  }

  // Get place photo URL
  getPhotoUrl(photoReference: string, maxWidth: number = 400): string {
    return `${this.baseUrl}/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${this.apiKey}`;
  }

  // Convert Google price level to our price categories
  getPriceCategory(priceLevel?: number): 'budget' | 'midrange' | 'luxury' {
    if (!priceLevel) return 'budget';
    
    switch (priceLevel) {
      case 1: return 'budget';
      case 2: return 'budget';
      case 3: return 'midrange';
      case 4: return 'luxury';
      default: return 'budget';
    }
  }

  // Convert Google place types to our activity types
  getActivityType(types: string[]): 'attraction' | 'dining' | 'activity' | 'hotel' {
    if (types.includes('restaurant') || types.includes('meal_takeaway') || types.includes('food')) {
      return 'dining';
    }
    if (types.includes('lodging')) {
      return 'hotel';
    }
    if (types.includes('tourist_attraction') || types.includes('museum') || types.includes('art_gallery')) {
      return 'attraction';
    }
    return 'activity';
  }

  // Estimate cost based on price level and type
  estimateCostINR(priceLevel?: number, activityType: string = 'attraction'): number {
    const baseCosts = {
      attraction: [0, 250, 500, 1000, 2000], // Free, Low, Medium, High, Premium
      dining: [0, 500, 1200, 2500, 5000],
      activity: [0, 300, 800, 1500, 3000],
      hotel: [0, 2000, 5000, 12000, 25000] // Per night
    };

    const costs = baseCosts[activityType as keyof typeof baseCosts] || baseCosts.attraction;
    const index = priceLevel || 0;
    return costs[Math.min(index, costs.length - 1)];
  }

  // Test Google Maps API connectivity
  async testConnection(): Promise<boolean> {
    try {
      console.log('Testing Google Maps API connection...');
      const testResponse = await this.getCityCoordinates('Mumbai');
      const isWorking = testResponse !== null;
      console.log(`Google Maps API test: ${isWorking ? 'SUCCESS' : 'FAILED'}`);
      return isWorking;
    } catch (error) {
      console.error('Google Maps API test error:', error);
      return false;
    }
  }
}

// Export configured service instance
const apiKey = process.env.GOOGLE_MAPS_API_KEY;

export const googleMapsService = apiKey ? new GoogleMapsService(apiKey) : null;

// Check if Google Maps is available
export const isGoogleMapsAvailable = (): boolean => {
  const hasKey = !!apiKey;
  if (hasKey) {
    console.log('Google Maps API key is configured');
  } else {
    console.log('Google Maps API key is not configured');
  }
  return hasKey;
};

// Test Google Maps connection
export const testGoogleMapsConnection = async (): Promise<boolean> => {
  if (!googleMapsService) {
    console.log('Google Maps service not available - no API key');
    return false;
  }

  try {
    console.log('Testing Google Maps connection...');
    const testResponse = await googleMapsService.getCityCoordinates('Mumbai');
    const isWorking = testResponse !== null;
    console.log('Google Maps connection test result:', isWorking);
    return isWorking;
  } catch (error) {
    console.error('Google Maps connection test failed:', error);
    return false;
  }
};
