import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Compass,
  RefreshCw,
  ExternalLink,
  Code,
  Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ApiStatus {
  success: boolean;
  status: 'healthy' | 'degraded' | 'error';
  apis: { [key: string]: boolean };
  message: string;
  timestamp: string;
}

interface ApiConfig {
  success: boolean;
  configured: number;
  total: number;
  percentage: number;
  apis: { [key: string]: boolean };
  recommendations: {
    priority: Array<{ api: string; reason: string }>;
    setup: string[];
  };
}

export default function ApiStatus() {
  const { user } = useAuth();
  const [status, setStatus] = useState<ApiStatus | null>(null);
  const [config, setConfig] = useState<ApiConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApiStatus();
    if (user?.role === 'admin') {
      fetchApiConfig();
    }
  }, [user]);

  const fetchApiStatus = async () => {
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      setStatus(data);
    } catch (err) {
      setError('Failed to fetch API status');
    }
  };

  const fetchApiConfig = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/config', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      }
    } catch (err) {
      console.error('Failed to fetch API config:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshStatus = () => {
    setIsLoading(true);
    fetchApiStatus();
    if (user?.role === 'admin') {
      fetchApiConfig();
    } else {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (enabled: boolean) => {
    return enabled ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  const getStatusBadge = (enabled: boolean) => {
    return (
      <Badge variant={enabled ? 'default' : 'destructive'} className="ml-2">
        {enabled ? 'Configured' : 'Not Configured'}
      </Badge>
    );
  };

  const apiDescriptions: { [key: string]: { name: string; description: string; website: string } } = {
    amadeus: {
      name: 'Amadeus Travel API',
      description: 'Comprehensive travel data including attractions, activities, and flight information',
      website: 'https://developers.amadeus.com/'
    },
    googlemaps: {
      name: 'Google Maps API',
      description: 'Real landmarks with coordinates, ratings, and photos - ACTIVELY INTEGRATED for authentic travel planning',
      website: 'https://developers.google.com/maps'
    },
    booking: {
      name: 'Booking.com API',
      description: 'Hotel availability, prices, and reservation capabilities',
      website: 'https://developers.booking.com/'
    },
    tripadvisor: {
      name: 'TripAdvisor API',
      description: 'Reviews, ratings, and travel content from millions of travelers',
      website: 'https://developer-tripadvisor.com/'
    },
    openweather: {
      name: 'OpenWeather API',
      description: 'Weather forecasts and current conditions for travel planning',
      website: 'https://openweathermap.org/api'
    },
    exchangerate: {
      name: 'Exchange Rate API',
      description: 'Real-time currency conversion and exchange rates',
      website: 'https://exchangerate-api.com/'
    },
    gemini: {
      name: 'Google Gemini AI',
      description: 'AI-powered itinerary generation and personalized travel recommendations',
      website: 'https://aistudio.google.com/'
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading API Status</h2>
            <p className="text-gray-600">Checking API integrations...</p>
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
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="bg-primary rounded-lg p-2">
                  <Compass className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    API Status
                  </h1>
                </div>
              </div>
            </div>
            <Button onClick={refreshStatus} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Status Overview */}
        {status && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {status.status === 'healthy' ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : status.status === 'degraded' ? (
                  <AlertCircle className="w-6 h-6 text-yellow-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500" />
                )}
                System Status: {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{status.message}</p>
              <div className="text-sm text-gray-500">
                Last checked: {new Date(status.timestamp).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        )}

        {/* API Configuration (Admin Only) */}
        {user?.role === 'admin' && config && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                API Configuration Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{config.configured}</div>
                  <div className="text-sm text-gray-600">Configured</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-400">{config.total - config.configured}</div>
                  <div className="text-sm text-gray-600">Not Configured</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{config.percentage}%</div>
                  <div className="text-sm text-gray-600">Complete</div>
                </div>
              </div>

              <div className="bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${config.percentage}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* API Services List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              API Integrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {status && Object.entries(status.apis).map(([apiKey, enabled]) => {
                const apiInfo = apiDescriptions[apiKey];
                if (!apiInfo) return null;

                return (
                  <div key={apiKey} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(enabled)}
                      <div>
                        <h3 className="font-medium text-gray-900">{apiInfo.name}</h3>
                        <p className="text-sm text-gray-600">{apiInfo.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(enabled)}
                      <Button variant="ghost" size="sm" asChild>
                        <a href={apiInfo.website} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Setup Instructions (Admin Only) */}
        {user?.role === 'admin' && config && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Setup Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Priority APIs</h4>
                  <div className="space-y-2">
                    {config.recommendations.priority.map((item, index) => (
                      <div key={index} className="text-sm">
                        <div className="font-medium text-gray-900">{apiDescriptions[item.api]?.name}</div>
                        <div className="text-gray-600">{item.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Setup Steps</h4>
                  <ol className="space-y-1 text-sm text-gray-600">
                    {config.recommendations.setup.map((step, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="font-medium">{index + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Environment Variables</h4>
                <div className="text-sm text-blue-800 font-mono space-y-1">
                  <div>AMADEUS_API_KEY=your_amadeus_key</div>
                  <div>GOOGLE_MAPS_API_KEY=your_google_key</div>
                  <div>BOOKING_API_KEY=your_booking_key</div>
                  <div>OPENWEATHER_API_KEY=your_weather_key</div>
                  <div>EXCHANGE_RATE_API_KEY=your_exchange_key</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
