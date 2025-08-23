import { RequestHandler } from "express";
import { testGoogleMapsConnection, googleMapsService } from "../services/googleMapsService";

export const testGoogleMapsHandler: RequestHandler = async (req, res) => {
  try {
    console.log('Testing Google Maps API connection...');
    
    const isAvailable = !!googleMapsService;
    console.log('Google Maps service available:', isAvailable);
    
    if (!isAvailable) {
      return res.json({
        success: false,
        error: 'Google Maps API key not configured',
        available: false,
        connection: false
      });
    }

    // Test connection
    const connectionTest = await testGoogleMapsConnection();
    console.log('Connection test result:', connectionTest);

    // If connection works, try a sample city lookup
    let sampleData = null;
    if (connectionTest && googleMapsService) {
      try {
        sampleData = await googleMapsService.getCityCoordinates('Mumbai');
        console.log('Sample data for Mumbai:', sampleData);
      } catch (error) {
        console.error('Error getting sample data:', error);
      }
    }

    res.json({
      success: true,
      available: isAvailable,
      connection: connectionTest,
      sampleData,
      message: connectionTest 
        ? 'Google Maps API is working correctly' 
        : 'Google Maps API is configured but not responding'
    });

  } catch (error) {
    console.error('Error testing Google Maps:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      available: false,
      connection: false
    });
  }
};
