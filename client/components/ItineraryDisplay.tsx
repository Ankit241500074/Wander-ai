import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, DollarSign, Star, Utensils, Camera, Download, Share2, Hotel as HotelIcon, Wifi, Car, Coffee, Brain, Sparkles, Globe, Calendar, Users } from "lucide-react";
import { ExportDialog } from "./ExportDialog";
import { formatCurrency } from "@/utils/currency";
import { ItineraryData } from "@shared/itinerary";
import { useEffect, useState } from "react";

interface ItineraryDisplayProps {
  itinerary: ItineraryData;
  onExport?: () => void;
  onShare?: () => void;
}

export function ItineraryDisplay({ itinerary, onExport, onShare }: ItineraryDisplayProps) {
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setAnimateIn(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'attraction': return <Camera className="w-4 h-4" />;
      case 'dining': return <Utensils className="w-4 h-4" />;
      case 'activity': return <Star className="w-4 h-4" />;
      case 'transport': return <MapPin className="w-4 h-4" />;
      case 'hotel': return <HotelIcon className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getTimeOfDayColor = (timeOfDay: string) => {
    switch (timeOfDay) {
      case 'morning': return 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200';
      case 'afternoon': return 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200';
      case 'evening': return 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200';
      default: return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200';
    }
  };

  return (
    <div className={`max-w-5xl mx-auto space-y-8 transition-all duration-1000 ease-out ${
      animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      {/* Enhanced Header with Animation */}
      <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white border-0 shadow-2xl transform hover:scale-[1.02] transition-all duration-500">
        <CardContent className="p-8 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Globe className="w-8 h-8 text-yellow-300 animate-pulse" />
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                    {itinerary.destination} Adventure
                  </h1>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-blue-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span className="text-lg font-medium">{itinerary.totalDays} days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    <span className="text-lg font-medium">{formatCurrency(itinerary.totalBudget, 'INR')} budget</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span className="text-lg font-medium">{itinerary.difficulty} pace</span>
                  </div>
                </div>
                {itinerary.hotels && itinerary.hotels.length > 0 && (
                  <div className="flex items-center gap-2 text-blue-200">
                    <HotelIcon className="w-5 h-5" />
                    <span className="text-sm">
                      Includes accommodation: {formatCurrency(itinerary.totalHotelCost || 0, 'INR')} total
                    </span>
                  </div>
                )}
              </div>
              <ExportDialog itinerary={itinerary}>
                <Button 
                  variant="secondary" 
                  className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Export & Share
                </Button>
              </ExportDialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Travel Insights - Enhanced with Animation */}
      {itinerary.aiInsights && (
        <Card className="border-0 shadow-xl bg-gradient-to-r from-purple-50 via-blue-50 to-cyan-50 transform hover:scale-[1.01] transition-all duration-500">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                <Brain className="w-6 h-6 text-purple-200" />
              </div>
              <div className="flex items-center gap-2">
                <span>AI Travel Insights</span>
                <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="bg-white/70 backdrop-blur-sm border border-purple-200 rounded-xl p-6 shadow-inner">
              <div className="prose prose-lg max-w-none text-gray-800">
                <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed font-medium">
                  {itinerary.aiInsights}
                </pre>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-center gap-3 text-sm text-purple-600 bg-white/50 rounded-full px-4 py-2 w-fit mx-auto">
              <Brain className="w-4 h-4" />
              <span className="font-medium">Powered by Google Gemini AI</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Daily Itineraries with Staggered Animation */}
      {itinerary.days.map((day, dayIndex) => (
        <Card 
          key={day.day} 
          className={`border-0 shadow-xl transform transition-all duration-700 ease-out ${
            animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: `${dayIndex * 200}ms` }}
        >
          <CardHeader className="bg-gradient-to-r from-gray-50 via-blue-50 to-cyan-50 border-b relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-400 rounded-full translate-x-10 -translate-y-10"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {day.day}
                    </div>
                    <div>
                      <CardTitle className="text-3xl font-bold text-gray-900">
                        Day {day.day}
                      </CardTitle>
                      <p className="text-gray-600 text-lg">{day.date}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 text-lg max-w-2xl">{day.summary}</p>
                  {day.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {day.highlights.map((highlight, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-300 px-3 py-1 text-sm font-medium transform hover:scale-105 transition-all duration-300"
                        >
                          <Star className="w-3 h-3 mr-1 fill-yellow-500" />
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 px-4 py-2 text-lg font-semibold shadow-md">
                    {formatCurrency(day.totalCost, 'INR')}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Enhanced Time Periods with Better Visuals */}
            {Object.entries(day.activities).map(([timeOfDay, activities], timeIndex) => (
              <div 
                key={timeOfDay} 
                className={`p-8 border-b last:border-b-0 ${getTimeOfDayColor(timeOfDay)} transition-all duration-500 hover:shadow-inner`}
              >
                <h4 className="text-xl font-bold mb-6 capitalize flex items-center gap-3 text-gray-800">
                  <div className="p-2 bg-white/50 rounded-full">
                    <Clock className="w-6 h-6" />
                  </div>
                  {timeOfDay}
                </h4>
                <div className="space-y-6">
                  {activities.map((activity, activityIndex) => (
                    <div 
                      key={activity.id} 
                      className="bg-white rounded-xl p-6 border shadow-lg transform hover:scale-[1.02] transition-all duration-300 hover:shadow-xl"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div>
                            <h5 className="font-bold text-xl text-gray-900 mb-1">{activity.name}</h5>
                            {activity.rating > 0 && (
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`w-4 h-4 ${
                                        i < Math.floor(activity.rating) 
                                          ? 'fill-yellow-400 text-yellow-400' 
                                          : 'text-gray-300'
                                      }`} 
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-600 font-medium">
                                  {activity.rating} rating
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <div className="flex items-center gap-2 text-gray-600 bg-gray-100 rounded-full px-3 py-1">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">{activity.time} • {activity.duration}</span>
                          </div>
                          {activity.cost > 0 && (
                            <div className="flex items-center gap-2 text-green-700 bg-green-100 rounded-full px-3 py-1">
                              <DollarSign className="w-4 h-4" />
                              <span className="font-bold">{formatCurrency(activity.cost, 'INR')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4 text-lg leading-relaxed">{activity.description}</p>
                      <div className="flex items-center gap-2 text-gray-600 mb-4 bg-gray-50 rounded-lg px-3 py-2">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">{activity.address}</span>
                      </div>
                      {activity.tips && (
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 transform hover:scale-[1.01] transition-all duration-300">
                          <p className="text-blue-800 font-medium">
                            <span className="text-blue-600 mr-2">💡</span>
                            <strong>Pro Tip:</strong> {activity.tips}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Enhanced Hotels Section */}
      {itinerary.hotels && itinerary.hotels.length > 0 && (
        <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 to-cyan-50 transform hover:scale-[1.01] transition-all duration-500">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                <HotelIcon className="w-6 h-6" />
              </div>
              Your Accommodation
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-8">
              {itinerary.hotels.map((hotel) => (
                <div key={hotel.id || Math.random().toString()} className="bg-white rounded-xl p-8 border shadow-lg transform hover:scale-[1.02] transition-all duration-300">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{hotel.name || 'Hotel'}</h3>
                        <div className="flex items-center gap-3 mb-3">
                          <Badge 
                            variant={hotel.type === 'luxury' ? 'default' : hotel.type === 'midrange' ? 'secondary' : 'outline'}
                            className="px-4 py-2 text-sm font-semibold"
                          >
                            {hotel.type || 'standard'}
                          </Badge>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-5 h-5 ${
                                  i < Math.floor(hotel.rating || 4.0) 
                                    ? 'fill-yellow-400 text-yellow-400' 
                                    : 'text-gray-300'
                                }`} 
                              />
                            ))}
                            <span className="ml-2 text-lg font-bold text-gray-700">{hotel.rating || 4.0}</span>
                          </div>
                        </div>
                        <p className="text-gray-600 text-lg mb-3">{hotel.description || 'Comfortable accommodation'}</p>
                        <div className="flex items-center gap-2 text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                          <MapPin className="w-4 h-4 text-blue-500" />
                          <span className="font-medium">{hotel.address || 'City Center'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right mt-6 lg:mt-0 space-y-3">
                      <div className="text-3xl font-bold text-gray-900">
                        {formatCurrency(hotel.pricePerNight || 0, 'INR')}
                      </div>
                      <div className="text-gray-600">per night</div>
                      <div className="text-xl font-bold text-green-700 bg-green-100 rounded-lg px-4 py-2">
                        {formatCurrency(hotel.totalCost || 0, 'INR')} total
                      </div>
                      <div className="text-sm text-gray-500">{hotel.totalNights || 0} nights</div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 pt-6 border-t">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-4 text-lg">Amenities</h4>
                      <div className="flex flex-wrap gap-2">
                        {(hotel.amenities || []).map((amenity, index) => (
                          <Badge key={index} variant="outline" className="bg-white/80 px-3 py-2 text-sm">
                            {amenity}
                          </Badge>
                        ))}
                        {(!hotel.amenities || hotel.amenities.length === 0) && (
                          <span className="text-sm text-gray-500">Basic amenities included</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900 mb-4 text-lg">Stay Details</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span><strong>Check-in:</strong> {hotel.checkIn || 'TBD'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span><strong>Check-out:</strong> {hotel.checkOut || 'TBD'}</span>
                        </div>
                        {hotel.contact?.phone && (
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4">📞</span>
                            <span><strong>Phone:</strong> {hotel.contact.phone}</span>
                          </div>
                        )}
                        {hotel.contact?.email && (
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4">✉️</span>
                            <span><strong>Email:</strong> {hotel.contact.email}</span>
                          </div>
                        )}
                        {hotel.contact?.website && (
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4">🌐</span>
                            <span><strong>Website:</strong> {hotel.contact.website}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Travel Tips */}
      {itinerary.tips.length > 0 && (
        <Card className="border-0 shadow-xl bg-gradient-to-r from-amber-50 to-orange-50 transform hover:scale-[1.01] transition-all duration-500">
          <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                <Sparkles className="w-6 h-6" />
              </div>
              Essential Travel Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {itinerary.tips.map((tip, index) => (
                <div 
                  key={index} 
                  className="bg-white/80 backdrop-blur-sm border border-amber-200 rounded-xl p-6 shadow-lg transform hover:scale-[1.02] transition-all duration-300"
                >
                  <p className="text-amber-800 text-lg leading-relaxed font-medium">{tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Travel Information */}
      <Card className="border-0 shadow-xl bg-gradient-to-r from-slate-50 to-gray-50 transform hover:scale-[1.01] transition-all duration-500">
        <CardHeader className="bg-gradient-to-r from-slate-600 to-gray-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <Globe className="w-6 h-6" />
            </div>
            Travel Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 text-xl mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-500" />
                Destination Details
              </h4>
              <div className="space-y-3 text-lg">
                <div className="flex items-center gap-3 bg-white/60 rounded-lg px-4 py-3">
                  <span className="font-bold text-gray-700">Country:</span>
                  <span className="text-gray-800">{itinerary.destinationCountry || 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-3 bg-white/60 rounded-lg px-4 py-3">
                  <span className="font-bold text-gray-700">Best Time to Visit:</span>
                  <span className="text-gray-800">{itinerary.bestTimeToVisit || 'Year-round'}</span>
                </div>
                <div className="flex items-center gap-3 bg-white/60 rounded-lg px-4 py-3">
                  <span className="font-bold text-gray-700">Local Currency:</span>
                  <span className="text-gray-800">{itinerary.localCurrency || 'Local currency'}</span>
                </div>
                <div className="flex items-center gap-3 bg-white/60 rounded-lg px-4 py-3">
                  <span className="font-bold text-gray-700">Weather:</span>
                  <span className="text-gray-800">{itinerary.weatherInfo || 'Check local forecast'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 text-xl mb-4 flex items-center gap-2">
                <span className="w-5 h-5">🚨</span>
                Emergency Contacts
              </h4>
              <div className="space-y-3 text-lg">
                <div className="flex items-center gap-3 bg-white/60 rounded-lg px-4 py-3">
                  <span className="font-bold text-gray-700">Police:</span>
                  <span className="text-gray-800">{itinerary.emergencyContacts?.police || 'Local emergency services'}</span>
                </div>
                <div className="flex items-center gap-3 bg-white/60 rounded-lg px-4 py-3">
                  <span className="font-bold text-gray-700">Medical:</span>
                  <span className="text-gray-800">{itinerary.emergencyContacts?.medical || 'Local emergency services'}</span>
                </div>
                {itinerary.emergencyContacts?.embassy && (
                  <div className="flex items-center gap-3 bg-white/60 rounded-lg px-4 py-3">
                    <span className="font-bold text-gray-700">Embassy:</span>
                    <span className="text-gray-800">{itinerary.emergencyContacts.embassy}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6 shadow-inner">
            <h4 className="font-bold text-blue-900 text-xl mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              Budget Breakdown
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center bg-white/60 rounded-lg p-4 transform hover:scale-105 transition-all duration-300">
                <div className="font-bold text-blue-800 text-lg mb-2">Activities</div>
                <div className="text-blue-700 text-2xl font-bold">{formatCurrency(itinerary.totalActivityCost || 0, 'INR')}</div>
              </div>
              <div className="text-center bg-white/60 rounded-lg p-4 transform hover:scale-105 transition-all duration-300">
                <div className="font-bold text-blue-800 text-lg mb-2">Accommodation</div>
                <div className="text-blue-700 text-2xl font-bold">{formatCurrency(itinerary.totalHotelCost || 0, 'INR')}</div>
              </div>
              <div className="text-center bg-white/60 rounded-lg p-4 transform hover:scale-105 transition-all duration-300">
                <div className="font-bold text-blue-800 text-lg mb-2">Total Budget</div>
                <div className="text-blue-700 text-3xl font-bold">{formatCurrency(itinerary.totalBudget, 'INR')}</div>
              </div>
            </div>
            {itinerary.exchangeRate && (
              <div className="mt-4 text-center text-sm text-blue-600 bg-white/60 rounded-lg px-4 py-2 w-fit mx-auto">
                Exchange rate: 1 USD = ₹{itinerary.exchangeRate}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
