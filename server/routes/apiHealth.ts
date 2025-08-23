import { RequestHandler } from "express";
import { travelAPIService } from "../services/travelApiService";

export const healthCheckHandler: RequestHandler = async (req, res) => {
  try {
    const apiHealth = await travelAPIService.checkAPIHealth();
    
    const overallHealth = Object.values(apiHealth).some(status => status);
    
    res.json({
      success: true,
      status: overallHealth ? 'healthy' : 'degraded',
      apis: apiHealth,
      message: overallHealth 
        ? 'API integrations are configured' 
        : 'No external APIs configured - using mock data',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      success: false,
      status: 'error',
      message: 'Health check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const apiConfigHandler: RequestHandler = async (req, res) => {
  try {
    // Return configuration status without exposing keys
    const config = {
      amadeus: !!process.env.AMADEUS_API_KEY,
      googlemaps: !!process.env.GOOGLE_MAPS_API_KEY,
      deepseek: !!process.env.DEEPSEEK_API_KEY,
      booking: !!process.env.BOOKING_API_KEY,
      tripadvisor: !!process.env.TRIPADVISOR_API_KEY,
      openweather: !!process.env.OPENWEATHER_API_KEY,
      exchangerate: !!process.env.EXCHANGE_RATE_API_KEY
    };

    // Add Google Maps specific status
    const googleMapsStatus = {
      configured: config.googlemaps,
      note: config.googlemaps
        ? 'API key configured - check required APIs are enabled'
        : 'API key not configured'
    };

    // Add DeepSeek AI specific status
    const deepseekStatus = {
      configured: config.deepseek,
      note: config.deepseek
        ? 'API key configured - AI insights enabled'
        : 'API key not configured - using fallback insights'
    };

    const configuredCount = Object.values(config).filter(Boolean).length;
    const totalCount = Object.keys(config).length;

    res.json({
      success: true,
      configured: configuredCount,
      total: totalCount,
      percentage: Math.round((configuredCount / totalCount) * 100),
      apis: config,
      googleMaps: googleMapsStatus,
      deepseek: deepseekStatus,
      recommendations: {
        priority: [
          { api: 'googlemaps', reason: 'Essential for location data and maps' },
          { api: 'deepseek', reason: 'AI-powered travel insights and recommendations' },
          { api: 'openweather', reason: 'Important for travel planning' },
          { api: 'amadeus', reason: 'Comprehensive travel data' }
        ],
        setup: [
          'Set environment variables in your .env file or Netlify dashboard',
          'For Google Maps: Enable Geocoding API, Places API, Maps JavaScript API',
          'For DeepSeek: Use OpenRouter API key for AI insights',
          'Restart the server after adding new API keys',
          'Check API quotas and rate limits',
          'Test endpoints individually'
        ],
        googleMapsSetup: [
          '1. Go to Google Cloud Console (console.cloud.google.com)',
          '2. Create or select a project',
          '3. Enable these APIs: Geocoding API, Places API, Maps JavaScript API',
          '4. Create credentials (API Key)',
          '5. Restrict API key to your domain/IP for security',
          '6. Set the GOOGLE_MAPS_API_KEY environment variable'
        ],
        deepseekSetup: [
          '1. Go to OpenRouter (openrouter.ai)',
          '2. Sign up and get an API key',
          '3. Set the DEEPSEEK_API_KEY environment variable',
          '4. This enables AI-generated travel insights and recommendations'
        ]
      }
    });
  } catch (error) {
    console.error('API config error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get API configuration'
    });
  }
};
