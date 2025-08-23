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
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

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

  // API Health and Configuration
  app.get("/api/health", healthCheckHandler);
  app.get("/api/config", authenticateToken, requireAdmin, apiConfigHandler);
  app.get("/api/test-google-maps", testGoogleMapsHandler);

  // Travel planning API routes
  app.post("/api/itinerary/generate", authenticateToken, generateItineraryHandler);
  app.get("/api/city/:city", getCityInfoHandler);

  return app;
}
