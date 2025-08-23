import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Map, 
  User, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Settings,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  requiresAuth?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Home', path: '/', icon: <Home className="w-5 h-5" /> },
  { label: 'Explore', path: '/explore', icon: <Map className="w-5 h-5" /> },
  { label: 'My Trips', path: '/my-trips', icon: <Map className="w-5 h-5" />, requiresAuth: true },
  { label: 'About', path: '/about', icon: <Sparkles className="w-5 h-5" /> },
];

export const AnimatedNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu on route change
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
      isScrolled 
        ? 'bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group transition-all duration-300 hover:scale-105"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className={`font-bold text-xl transition-all duration-300 ${
              isScrolled ? 'text-gray-900' : 'text-white'
            }`}>
              Stellar Zone
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              if (item.requiresAuth && !user) return null;
              
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 group ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 scale-105'
                      : isScrolled
                      ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                      : 'text-white hover:text-blue-200 hover:bg-white/10'
                  }`}
                >
                  <span className={`transition-all duration-300 group-hover:scale-110 ${
                    isActive ? 'text-blue-600' : ''
                  }`}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {user.email?.split('@')[0] || 'User'}
                  </span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="transition-all duration-300 hover:scale-105 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`transition-all duration-300 hover:scale-105 ${
                      isScrolled 
                        ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50' 
                        : 'text-white hover:text-blue-200 hover:bg-white/10'
                    }`}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg transition-all duration-300 ${
              isScrolled 
                ? 'text-gray-700 hover:bg-gray-100' 
                : 'text-white hover:bg-white/10'
            }`}
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-500 ease-out overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 space-y-2">
            {navItems.map((item) => {
              if (item.requiresAuth && !user) return null;
              
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className={isActive ? 'text-blue-600' : 'text-gray-500'}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
            
            {/* Mobile Auth */}
            {user ? (
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <div className="px-4 py-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {user.email?.split('@')[0] || 'User'}
                    </span>
                  </div>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="w-full justify-center transition-all duration-300 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link to="/login" className="block">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-center text-gray-700 hover:bg-gray-100"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link to="/signup" className="block">
                  <Button
                    size="sm"
                    className="w-full justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
