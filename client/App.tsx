import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AnimationProvider } from "@/contexts/AnimationContext";
import Index from "./pages/Index";
import Results from "./pages/Results";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";
import ApiStatus from "./pages/ApiStatus";
import ApiSetup from "./pages/ApiSetup";
import TestApi from "./pages/TestApi";
import Explore from "./pages/Explore";
import MyTrips from "./pages/MyTrips";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AnimationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/results" element={<Results />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/api-status" element={<ApiStatus />} />
              <Route path="/api-setup" element={<ApiSetup />} />
              <Route path="/test-api" element={<TestApi />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/my-trips" element={<MyTrips />} />
              <Route path="/about" element={<About />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AnimationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
