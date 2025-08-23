// Shared authentication types

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
  avatar?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
  message?: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetResponse {
  success: boolean;
  message: string;
  error?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  preferences?: {
    currency: 'USD' | 'INR' | 'EUR' | 'GBP';
    travelStyle: 'budget' | 'midrange' | 'luxury';
    notifications: boolean;
  };
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  avatar?: string;
  preferences?: UserProfile['preferences'];
}
