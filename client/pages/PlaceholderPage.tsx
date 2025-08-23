import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Compass, Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
  features?: string[];
}

export default function PlaceholderPage({ 
  title, 
  description, 
  features = [] 
}: PlaceholderPageProps) {
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-8">
              <div className="bg-orange-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Construction className="w-10 h-10 text-orange-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
                {title}
              </CardTitle>
              <p className="text-lg text-gray-600 max-w-lg mx-auto">
                {description}
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              {features.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Coming Soon:</h3>
                  <div className="grid gap-3 text-left max-w-md mx-auto">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                <p className="text-gray-600">
                  This feature is currently in development. Continue prompting to help us build this page!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/">
                    <Button size="lg" className="w-full sm:w-auto">
                      Start Planning a Trip
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Request This Feature
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
