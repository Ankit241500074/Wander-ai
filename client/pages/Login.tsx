import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Compass, Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginRequest } from '@shared/auth';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();
  
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Get the intended destination or default to home
  const from = location.state?.from?.pathname || '/';
  const redirectMessage = location.state?.message;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    const result = await login(formData);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }
  };

  const handleInputChange = (field: keyof LoginRequest) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (error) setError(''); // Clear error when user starts typing
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-primary rounded-lg p-3">
              <Compass className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              WanderAI
            </h1>
          </div>
          <p className="text-gray-600">Welcome back! Sign in to your account</p>
        </div>

        {/* Login Form */}
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-semibold text-gray-900">
              Sign In
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {redirectMessage && (
                <Alert className="border-orange-200 bg-orange-50">
                  <AlertDescription className="text-orange-800">{redirectMessage}</AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  className="h-11 border-2 border-gray-200 focus:border-primary"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gray-500" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    className="h-11 border-2 border-gray-200 focus:border-primary pr-11"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link 
                    to="/signup" 
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Sign up for free
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="mt-6 border border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <p className="text-sm text-amber-800 font-medium mb-2">Demo Credentials:</p>
            <div className="text-xs text-amber-700 space-y-1">
              <div><strong>User:</strong> user@wanderai.com / password123</div>
              <div><strong>Admin:</strong> admin@wanderai.com / admin123</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
