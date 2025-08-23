import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { ItineraryDisplay } from "@/components/ItineraryDisplay";
import { ExportDialog } from "@/components/ExportDialog";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Download, Share2, Compass } from "lucide-react";
import { useItinerary } from "@/hooks/useItinerary";
import { ItineraryData } from "@shared/itinerary";


export default function Results() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState<ItineraryData | null>(null);
  const { generateItinerary, isLoading, error } = useItinerary();

  useEffect(() => {
    const loadItinerary = async () => {
      const city = searchParams.get('city');
      const budget = searchParams.get('budget');
      const days = searchParams.get('days');
      const difficulty = searchParams.get('difficulty');

      console.log('Loading itinerary with params:', { city, budget, days, difficulty });

      if (city && budget && days && difficulty) {
        const formData = {
          city,
          budget: parseInt(budget),
          days: parseInt(days),
          difficulty: difficulty as 'easy' | 'medium' | 'hard'
        };

        try {
          const result = await generateItinerary(formData);
          if (result) {
            setItinerary(result);
          }
        } catch (err) {
          console.error('Failed to load itinerary:', err);

          // Check if it's an authentication error
          const errorMessage = err instanceof Error ? err.message : String(err);
          if (errorMessage.includes('Authentication') || errorMessage.includes('expired') || errorMessage.includes('sign in')) {
            console.log('Authentication error detected, redirecting to login');
            navigate('/login', {
              state: {
                from: { pathname: `/results?${searchParams.toString()}` },
                message: 'Your session has expired. Please sign in to continue.'
              }
            });
          }
        }
      } else {
        console.warn('Missing required parameters for itinerary generation');
      }
    };

    loadItinerary();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Crafting Your Perfect Trip</h2>
            <p className="text-gray-600">
              Our AI is analyzing thousands of attractions, restaurants, and activities to create your personalized itinerary...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <Card className="max-w-lg mx-auto">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-4">{error}</p>

            {error.includes('Authentication') && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-left">
                <p className="text-sm text-blue-800">
                  <strong>Authentication Issue:</strong> Please sign in again to generate itineraries.
                </p>
              </div>
            )}

            {error.includes('Network error') && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-left">
                <p className="text-sm text-yellow-800">
                  <strong>Network Issue:</strong> Please check your internet connection and try again.
                </p>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <Link to="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No itinerary found</h2>
            <p className="text-gray-600 mb-4">We couldn't generate your itinerary. Please try again.</p>
            <Link to="/">
              <Button>Back to Planner</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Planner
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="bg-primary rounded-lg p-2">
                  <Compass className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  WanderAI
                </h1>
              </div>
            </div>
            <ExportDialog itinerary={itinerary}>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Export & Share
              </Button>
            </ExportDialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <ErrorBoundary>
          <ItineraryDisplay itinerary={itinerary} />
        </ErrorBoundary>
      </main>
    </div>
  );
}
