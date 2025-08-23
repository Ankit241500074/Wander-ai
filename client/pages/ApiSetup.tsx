import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  Compass,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

export default function ApiSetup() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <button className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="bg-primary rounded-lg p-2">
                  <Compass className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    API Setup Guide
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Current Status:</strong> Google Maps API key is configured but needs additional API permissions enabled.
          </AlertDescription>
        </Alert>

        {/* Google Maps Setup */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Google Maps API Setup (Required)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Your Google Maps API key is configured but requires enabling specific APIs for full functionality.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">Required APIs to Enable:</h4>
              <ul className="space-y-1 text-sm text-yellow-700">
                <li>• <strong>Geocoding API</strong> - For converting city names to coordinates</li>
                <li>• <strong>Places API</strong> - For finding restaurants, hotels, and attractions</li>
                <li>• <strong>Maps JavaScript API</strong> - For interactive maps (optional)</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Setup Steps:</h4>
              <ol className="space-y-2 text-sm">
                <li className="flex gap-3">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">1</span>
                  <div>
                    <strong>Go to Google Cloud Console</strong>
                    <br />
                    <a 
                      href="https://console.cloud.google.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                    >
                      Open Google Cloud Console <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">2</span>
                  <div>
                    <strong>Select your project</strong>
                    <br />
                    Choose an existing project or create a new one
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">3</span>
                  <div>
                    <strong>Enable Required APIs</strong>
                    <br />
                    Go to "APIs & Services" → "Library" and enable:
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>• Geocoding API</li>
                      <li>• Places API</li>
                      <li>• Maps JavaScript API</li>
                    </ul>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">4</span>
                  <div>
                    <strong>Verify API Key</strong>
                    <br />
                    Go to "APIs & Services" → "Credentials" and check your API key restrictions
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">5</span>
                  <div>
                    <strong>Test the Integration</strong>
                    <br />
                    <Link to="/test-api" className="text-blue-600 hover:text-blue-800">
                      Use our test page to verify everything is working
                    </Link>
                  </div>
                </li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Other APIs */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Optional API Integrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              These APIs are optional but will enhance the travel planning experience:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium mb-2">OpenWeather API</h4>
                <p className="text-sm text-gray-600 mb-2">Weather forecasts for travel planning</p>
                <a 
                  href="https://openweathermap.org/api" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center gap-1"
                >
                  Get API Key <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium mb-2">Exchange Rate API</h4>
                <p className="text-sm text-gray-600 mb-2">Real-time currency conversion</p>
                <a 
                  href="https://exchangerate-api.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center gap-1"
                >
                  Get API Key <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium mb-2">Amadeus API</h4>
                <p className="text-sm text-gray-600 mb-2">Comprehensive travel data</p>
                <a 
                  href="https://developers.amadeus.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center gap-1"
                >
                  Get API Key <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium mb-2">Booking.com API</h4>
                <p className="text-sm text-gray-600 mb-2">Hotel availability and pricing</p>
                <a
                  href="https://developers.booking.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center gap-1"
                >
                  Apply for Access <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                <h4 className="font-medium mb-2 text-purple-800">Google Gemini AI</h4>
                <p className="text-sm text-purple-700 mb-2">AI-powered itinerary generation and personalized recommendations</p>
                <a
                  href="https://aistudio.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-800 text-sm inline-flex items-center gap-1"
                >
                  Get API Key <ExternalLink className="w-3 h-3" />
                </a>
                <div className="mt-2 text-xs text-purple-600">
                  🌟 Recommended for enhanced travel experiences
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Functionality */}
        <Card>
          <CardHeader>
            <CardTitle>Current Functionality</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>✅ Authentication system working</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>✅ Admin panel functional</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>✅ Itinerary generation with mock data</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>✅ INR currency support</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>✅ Hotel integration</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>✅ Google Maps integration ACTIVE (real landmarks with coordinates)</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>✅ AI-powered itinerary enhancement (OpenRouter + DeepSeek active)</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-blue-500" />
                <span>🗺️ Real landmark data with Google Places ratings and photos</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">
                <strong>✅ Status:</strong> The application is now running with REAL API integration! Google Maps provides
                authentic landmarks with coordinates, ratings, and photos. OpenRouter + DeepSeek AI provides cultural
                insights and personalized recommendations for an enhanced travel planning experience.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
