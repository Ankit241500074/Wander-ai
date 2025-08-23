import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Compass, Eye, EyeOff, Mail, Lock, User, ArrowLeft, Check, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SignupRequest } from '@shared/auth';

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'Contains uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'Contains lowercase letter', test: (p) => /[a-z]/.test(p) },
  { label: 'Contains a number', test: (p) => /\d/.test(p) },
];

export default function Signup() {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();
  
  const [formData, setFormData] = useState<SignupRequest>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [touchedFields, setTouchedFields] = useState<Set<keyof SignupRequest>>(new Set());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!acceptTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

    // Check password requirements
    const unmetRequirements = passwordRequirements.filter(req => !req.test(formData.password));
    if (unmetRequirements.length > 0) {
      setError('Password does not meet all requirements');
      return;
    }

    const result = await signup(formData);

    if (result.success) {
      navigate('/', { replace: true });
    } else {
      setError(result.error || 'Signup failed. Please try again.');
    }
  };

  const handleInputChange = (field: keyof SignupRequest) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (error) setError(''); // Clear error when user starts typing
  };

  const handleBlur = (field: keyof SignupRequest) => () => {
    setTouchedFields(prev => new Set(prev).add(field));
  };

  const isFieldTouched = (field: keyof SignupRequest) => touchedFields.has(field);
  const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;

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
          <p className="text-gray-600">Create your account to start planning amazing trips</p>
        </div>

        {/* Signup Form */}
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-semibold text-gray-900">
              Create Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  onBlur={handleBlur('name')}
                  className="h-11 border-2 border-gray-200 focus:border-primary"
                  required
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    onBlur={handleBlur('email')}
                    className={`h-11 border-2 focus:border-primary pr-11 ${
                      isFieldTouched('email') && formData.email
                        ? isEmailValid(formData.email)
                          ? 'border-green-300'
                          : 'border-red-300'
                        : 'border-gray-200'
                    }`}
                    required
                  />
                  {isFieldTouched('email') && formData.email && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {isEmailValid(formData.email) ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <X className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
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
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    onBlur={handleBlur('password')}
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
                
                {/* Password Requirements */}
                {formData.password && (
                  <div className="space-y-2 p-3 bg-gray-50 rounded-md">
                    <p className="text-xs font-medium text-gray-700">Password requirements:</p>
                    <div className="grid grid-cols-1 gap-1">
                      {passwordRequirements.map((requirement, index) => {
                        const isMet = requirement.test(formData.password);
                        return (
                          <div key={index} className="flex items-center gap-2 text-xs">
                            {isMet ? (
                              <Check className="w-3 h-3 text-green-500" />
                            ) : (
                              <X className="w-3 h-3 text-red-500" />
                            )}
                            <span className={isMet ? 'text-green-700' : 'text-red-600'}>
                              {requirement.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gray-500" />
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    className={`h-11 border-2 focus:border-primary pr-11 ${
                      isFieldTouched('confirmPassword') && formData.confirmPassword
                        ? passwordsMatch
                          ? 'border-green-300'
                          : 'border-red-300'
                        : 'border-gray-200'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {isFieldTouched('confirmPassword') && formData.confirmPassword && !passwordsMatch && (
                  <p className="text-xs text-red-600">Passwords do not match</p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{' '}
                    <Link to="/terms" className="text-primary hover:text-primary/80 underline">
                      Terms and Conditions
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-primary hover:text-primary/80 underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
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
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
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

              {/* Sign In Link */}
              <div className="text-center">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
