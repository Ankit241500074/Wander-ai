import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface TestResult {
  status: 'success' | 'error' | 'loading';
  message: string;
  data?: any;
}

export default function TestApi() {
  const [city, setCity] = useState('Mumbai');
  const [results, setResults] = useState<{ [key: string]: TestResult }>({});

  const testHealthCheck = async () => {
    setResults(prev => ({ ...prev, health: { status: 'loading', message: 'Checking API health...' } }));
    
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      
      setResults(prev => ({ 
        ...prev, 
        health: { 
          status: 'success', 
          message: `Status: ${data.status}`, 
          data 
        } 
      }));
    } catch (error) {
      setResults(prev => ({ 
        ...prev, 
        health: { 
          status: 'error', 
          message: error instanceof Error ? error.message : 'Health check failed' 
        } 
      }));
    }
  };

  const testItineraryGeneration = async () => {
    setResults(prev => ({ ...prev, itinerary: { status: 'loading', message: 'Generating test itinerary...' } }));
    
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/itinerary/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          city,
          budget: 100, // $100 USD
          days: 3,
          difficulty: 'medium'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setResults(prev => ({ 
          ...prev, 
          itinerary: { 
            status: 'success', 
            message: `Successfully generated itinerary for ${city}`, 
            data 
          } 
        }));
      } else {
        throw new Error(data.error || 'Generation failed');
      }
    } catch (error) {
      setResults(prev => ({ 
        ...prev, 
        itinerary: { 
          status: 'error', 
          message: error instanceof Error ? error.message : 'Itinerary generation failed' 
        } 
      }));
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'loading': return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case 'error': return <Badge variant="destructive">Error</Badge>;
      case 'loading': return <Badge variant="secondary">Loading...</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>API Integration Test</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Test the Google Maps API integration and itinerary generation system.
          </p>
          
          <div className="flex gap-4 items-end mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Test City</label>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name"
              />
            </div>
            <Button onClick={testHealthCheck}>
              Test API Health
            </Button>
            <Button onClick={testItineraryGeneration}>
              Test Itinerary Generation
            </Button>
          </div>

          <div className="space-y-4">
            {/* Health Check Results */}
            {results.health && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(results.health.status)}
                      <span className="font-medium">API Health Check</span>
                    </div>
                    {getStatusBadge(results.health.status)}
                  </div>
                  <p className="text-sm text-gray-600">{results.health.message}</p>
                  
                  {results.health.data && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                      <div className="text-sm font-medium mb-2">API Status:</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {Object.entries(results.health.data.apis || {}).map(([api, enabled]) => (
                          <div key={api} className="flex justify-between">
                            <span>{api}:</span>
                            <Badge variant={enabled ? 'default' : 'secondary'} className="text-xs">
                              {enabled ? 'Enabled' : 'Disabled'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Itinerary Generation Results */}
            {results.itinerary && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(results.itinerary.status)}
                      <span className="font-medium">Itinerary Generation</span>
                    </div>
                    {getStatusBadge(results.itinerary.status)}
                  </div>
                  <p className="text-sm text-gray-600">{results.itinerary.message}</p>
                  
                  {results.itinerary.data?.data && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                      <div className="text-sm font-medium mb-2">Generated Itinerary:</div>
                      <div className="text-xs space-y-1">
                        <div><strong>Destination:</strong> {results.itinerary.data.data.destination}</div>
                        <div><strong>Days:</strong> {results.itinerary.data.data.totalDays}</div>
                        <div><strong>Budget:</strong> ₹{results.itinerary.data.data.totalBudget?.toLocaleString()}</div>
                        <div><strong>Hotels:</strong> {results.itinerary.data.data.hotels?.length || 0}</div>
                        <div><strong>Days with Activities:</strong> {results.itinerary.data.data.days?.length || 0}</div>
                        {results.itinerary.data.data.tips && (
                          <div><strong>Tips:</strong> {results.itinerary.data.data.tips.slice(0, 2).join(', ')}</div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expected API Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-2">
            <div><strong>Google Maps API:</strong> ✅ Configured and ready</div>
            <div><strong>Expected behavior:</strong> Real places and hotels from Google Maps</div>
            <div><strong>Fallback:</strong> Mock data if API calls fail</div>
            <div><strong>Currency:</strong> All prices converted to INR</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
