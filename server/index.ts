import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { generateItineraryHandler, getCityInfoHandler } from "./routes/itinerary";
import {
  loginHandler,
  signupHandler,
  verifyTokenHandler,
  getUsersHandler,
  authenticateToken,
  requireAdmin
} from "./routes/auth";
import { healthCheckHandler, apiConfigHandler } from "./routes/apiHealth";
import { testGoogleMapsHandler } from "./routes/testGoogleMaps";

export function createServer() {
  const app = express();

  // Debug environment variables
  console.log('Environment Variables Status:');
  console.log('- GOOGLE_MAPS_API_KEY:', process.env.GOOGLE_MAPS_API_KEY ? '✅ Configured' : '❌ Not configured');
  console.log('- DEEPSEEK_API_KEY:', process.env.DEEPSEEK_API_KEY ? '✅ Configured' : '❌ Not configured');
  console.log('- NODE_ENV:', process.env.NODE_ENV || 'development');

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Health check route (should be first)
  app.get("/api/health", healthCheckHandler);

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/env-test", (_req, res) => {
    res.json({
      googleMapsConfigured: !!process.env.GOOGLE_MAPS_API_KEY,
      deepseekConfigured: !!process.env.DEEPSEEK_API_KEY,
      googleMapsKeyLength: process.env.GOOGLE_MAPS_API_KEY?.length || 0,
      deepseekKeyLength: process.env.DEEPSEEK_API_KEY?.length || 0,
      nodeEnv: process.env.NODE_ENV || 'development'
    });
  });

  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/auth/login", loginHandler);
  app.post("/api/auth/signup", signupHandler);
  app.get("/api/auth/verify", verifyTokenHandler);
  app.get("/api/auth/users", authenticateToken, requireAdmin, getUsersHandler);

  // API Configuration
  app.get("/api/config", authenticateToken, requireAdmin, apiConfigHandler);
  app.get("/api/test-google-maps", testGoogleMapsHandler);

  // Travel planning API routes
  app.post("/api/itinerary/generate", authenticateToken, generateItineraryHandler);
  
  // Simplified city info route to avoid path-to-regexp issues
  app.get("/api/city-info", (req, res) => {
    const city = req.query.city as string;
    if (!city) {
      return res.status(400).json({
        success: false,
        error: "City query parameter is required"
      });
    }
    
    try {
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
  });

  // 404 handler for unmatched API routes
  app.use("/api/*", (req, res) => {
    res.status(404).json({
      success: false,
      error: "API endpoint not found",
      path: req.path
    });
  });

  // Global error handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Global error handler caught:', err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
  });

  return app;
}
