import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthResponse, LoginRequest, SignupRequest } from '@shared/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User };

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  signup: (userData: SignupRequest) => Promise<AuthResponse>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token on app load and validate it
  useEffect(() => {
    const validateStoredToken = async () => {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');

      if (token && userData) {
        try {
          const user = JSON.parse(userData);

          // Validate token by making a test request
          const response = await fetch('/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            console.log('Stored token is valid, restoring session');
            dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } });
          } else {
            console.log('Stored token is invalid, clearing session');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
          }
        } catch (error) {
          console.log('Error validating stored token, clearing session');
          // Invalid stored data, clear it
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
        }
      }
    };

    validateStoredToken();
  }, []);

  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const result: AuthResponse = await response.json();

      if (result.success && result.user && result.token) {
        localStorage.setItem('auth_token', result.token);
        localStorage.setItem('user_data', JSON.stringify(result.user));
        dispatch({ 
          type: 'AUTH_SUCCESS', 
          payload: { user: result.user, token: result.token } 
        });
      } else {
        dispatch({ type: 'AUTH_FAILURE' });
      }

      return result;
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE' });
      return {
        success: false,
        error: 'Network error. Please try again.',
      };
    }
  };

  const signup = async (userData: SignupRequest): Promise<AuthResponse> => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result: AuthResponse = await response.json();

      if (result.success && result.user && result.token) {
        localStorage.setItem('auth_token', result.token);
        localStorage.setItem('user_data', JSON.stringify(result.user));
        dispatch({ 
          type: 'AUTH_SUCCESS', 
          payload: { user: result.user, token: result.token } 
        });
      } else {
        dispatch({ type: 'AUTH_FAILURE' });
      }

      return result;
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE' });
      return {
        success: false,
        error: 'Network error. Please try again.',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (user: User) => {
    localStorage.setItem('user_data', JSON.stringify(user));
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
