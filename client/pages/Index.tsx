import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, DollarSign, Clock, Star, Compass, Plane, Sparkles, Globe, Users } from "lucide-react";
import { AnimatedPage, FadeIn, SlideIn, ScaleIn } from "@/components/AnimatedPage";
import { AnimatedLoading } from "@/components/AnimatedLoading";

interface TravelFormData {
  city: string;
  budget: number[];
  days: number[];
  difficulty: string;
}

export default function Index() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [formData, setFormData] = useState<TravelFormData>({
    city: "",
    budget: [1000],
    days: [3],
    difficulty: ""
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.city || !formData.difficulty) {
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/' } } });
      return;
    }

    setIsGenerating(true);
    // Simulate API call - in real app, this would call your backend
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Navigate to results page with form data
    const searchParams = new URLSearchParams({
      city: formData.city,
      budget: formData.budget[0].toString(),
      days: formData.days[0].toString(),
      difficulty: formData.difficulty
    });
    navigate(`/results?${searchParams.toString()}`);
  };

  const difficultyOptions = [
    { value: "easy", label: "Easy", description: "Relaxed pace, fewer activities" },
    { value: "medium", label: "Medium", description: "Balanced sightseeing and dining" },
    { value: "hard", label: "Hard", description: "Packed schedule, maximum exploration" }
  ];

  return (
    <AnimatedPage className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <FadeIn delay={100}>
        <header className="bg-white/80 backdrop-blur-md border-b border-blue-100/50 sticky top-0 z-50 transition-all duration-500">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 group">
                <div className="bg-primary rounded-lg p-2 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <Compass className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  WanderAI
                </h1>
              </div>
              <nav className="hidden md:flex items-center space-x-6">
                <Link to="/explore" className="text-gray-600 hover:text-primary transition-all duration-300 hover:scale-105">Explore</Link>
                <Link to="/my-trips" className="text-gray-600 hover:text-primary transition-all duration-300 hover:scale-105">My Trips</Link>
                <Link to="/about" className="text-gray-600 hover:text-primary transition-all duration-300 hover:scale-105">About</Link>
                {isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    {user?.role === 'admin' && (
                      <Link to="/admin">
                        <Button variant="outline" size="sm" className="bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100 transition-all duration-300 hover:scale-105">
                          Admin Panel
                        </Button>
                      </Link>
                    )}
                    <span className="text-sm text-gray-600">Hi, {user?.name}!</span>
                    <Button variant="outline" size="sm" onClick={logout} className="transition-all duration-300 hover:scale-105">
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Link to="/login">
                    <Button variant="outline" size="sm" className="transition-all duration-300 hover:scale-105">Sign In</Button>
                  </Link>
                )}
              </nav>
            </div>
          </div>
        </header>
      </FadeIn>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10" />
        <div className="container mx-auto px-4 relative">
          <FadeIn delay={200}>
            <div className="max-w-4xl mx-auto text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
                <h2 className="text-5xl md:text-6xl font-bold text-gray-900">
                  Your Perfect Trip
                  <span className="block bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent animate-fade-in">
                    Planned by AI
                  </span>
                </h2>
                <Globe className="w-8 h-8 text-blue-500 animate-float" />
              </div>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-fade-in animate-delay-300">
                Get personalized day-by-day itineraries crafted just for you. 
                Tell us your destination, budget, and travel style, and we'll create the perfect adventure.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 animate-fade-in animate-delay-500">
                <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>AI-Powered Planning</span>
                </div>
                <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span>Interactive Maps</span>
                </div>
                <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <span>Budget-Aware</span>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Main Form */}
          <SlideIn delay={400} direction="up">
            <Card className="max-w-2xl mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm transform hover:scale-[1.02] transition-all duration-500">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-semibold text-gray-900 flex items-center justify-center gap-2">
                  <Plane className="w-6 h-6 text-blue-600" />
                  Plan Your Adventure
                </CardTitle>
                <p className="text-gray-600">Fill in your travel preferences to get started</p>
              </CardHeader>
              <CardContent className="space-y-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Destination */}
                  <FadeIn delay={500}>
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-lg font-medium flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-500" />
                        Where do you want to go?
                      </Label>
                      <Input
                        id="city"
                        type="text"
                        placeholder="e.g., Paris, Tokyo, New York"
                        value={formData.city}
                        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                        className="text-lg h-12 border-2 border-gray-200 focus:border-primary transition-all duration-300 hover:border-blue-300 focus:border-blue-500"
                      />
                    </div>
                  </FadeIn>

                  {/* Budget */}
                  <FadeIn delay={600}>
                    <div className="space-y-4">
                      <Label className="text-lg font-medium flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-500" />
                        What's your budget?
                      </Label>
                      <div className="px-4">
                        <Slider
                          value={formData.budget}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}
                          max={10000}
                          min={100}
                          step={100}
                          className="mb-4"
                        />
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>$100</span>
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 animate-bounce-in">
                            ${formData.budget[0]}
                          </Badge>
                          <span>$10,000+</span>
                        </div>
                      </div>
                    </div>
                  </FadeIn>

                  {/* Duration */}
                  <FadeIn delay={700}>
                    <div className="space-y-4">
                      <Label className="text-lg font-medium flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-purple-500" />
                        How many days?
                      </Label>
                      <div className="px-4">
                        <Slider
                          value={formData.days}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, days: value }))}
                          max={14}
                          min={1}
                          step={1}
                          className="mb-4"
                        />
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>1 day</span>
                          <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200 animate-bounce-in">
                            {formData.days[0]} {formData.days[0] === 1 ? 'day' : 'days'}
                          </Badge>
                          <span>14 days</span>
                        </div>
                      </div>
                    </div>
                  </FadeIn>

                  {/* Difficulty/Pace */}
                  <FadeIn delay={800}>
                    <div className="space-y-3">
                      <Label className="text-lg font-medium flex items-center gap-2">
                        <Clock className="w-5 h-5 text-orange-500" />
                        What's your travel pace?
                      </Label>
                      <Select value={formData.difficulty} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}>
                        <SelectTrigger className="h-12 text-lg border-2 border-gray-200 transition-all duration-300 hover:border-blue-300 focus:border-blue-500">
                          <SelectValue placeholder="Choose your travel style" />
                        </SelectTrigger>
                        <SelectContent>
                          {difficultyOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value} className="py-3">
                              <div>
                                <div className="font-medium">{option.label}</div>
                                <div className="text-sm text-gray-500">{option.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </FadeIn>

                  {/* Submit Button */}
                  <FadeIn delay={900}>
                    <Button
                      type="submit"
                      disabled={!formData.city || !formData.difficulty || isGenerating}
                      className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg transition-all duration-200"
                    >
                      {isGenerating ? (
                        <div className="flex items-center gap-3">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                          Crafting Your Perfect Trip...
                        </div>
                      ) : isAuthenticated ? (
                        <div className="flex items-center gap-3">
                          <Plane className="w-5 h-5" />
                          Generate My Itinerary
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <Plane className="w-5 h-5" />
                          Sign In to Generate Itinerary
                        </div>
                      )}
                    </Button>
                  </FadeIn>
                </form>
              </CardContent>
            </Card>
          </SlideIn>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <FadeIn delay={1000}>
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose WanderAI?</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our AI creates personalized itineraries that match your style, budget, and interests
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <SlideIn delay={1100} direction="up">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-blue-600" />
                    </div>
                    <h4 className="text-xl font-semibold mb-3">Day-by-Day Planning</h4>
                    <p className="text-gray-600">
                      Get detailed schedules with morning, afternoon, and evening activities perfectly balanced
                    </p>
                  </CardContent>
                </Card>
              </SlideIn>

              <SlideIn delay={1200} direction="up">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <DollarSign className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="text-xl font-semibold mb-3">Budget-Smart</h4>
                    <p className="text-gray-600">
                      Every recommendation stays within your budget, with options for free and low-cost activities
                    </p>
                  </CardContent>
                </Card>
              </SlideIn>

              <SlideIn delay={1300} direction="up">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <MapPin className="w-8 h-8 text-purple-600" />
                    </div>
                    <h4 className="text-xl font-semibold mb-3">Local Insights</h4>
                    <p className="text-gray-600">
                      Discover hidden gems, local dining spots, and cultural tips from our AI knowledge base
                    </p>
                  </CardContent>
                </Card>
              </SlideIn>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="bg-primary rounded-lg p-2">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">WanderAI</span>
            </div>
            <div className="text-gray-400 text-center md:text-right">
              <p>&copy; 2024 WanderAI. Crafting perfect trips with AI.</p>
            </div>
          </div>
        </div>
      </footer>
    </AnimatedPage>
  );
}
