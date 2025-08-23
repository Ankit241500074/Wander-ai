import React from 'react';
import { Loader2, Sparkles, Globe, MapPin } from 'lucide-react';

interface AnimatedLoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'travel' | 'spinner' | 'dots';
}

export const AnimatedLoading: React.FC<AnimatedLoadingProps> = ({ 
  message = "Loading...", 
  size = 'md',
  variant = 'default'
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const renderLoader = () => {
    switch (variant) {
      case 'travel':
        return (
          <div className="relative">
            <div className={`${sizeClasses[size]} animate-spin`}>
              <Globe className="w-full h-full text-blue-600" />
            </div>
            <div className="absolute inset-0 animate-ping">
              <MapPin className={`${sizeClasses[size]} text-purple-600 opacity-75`} />
            </div>
          </div>
        );
      
      case 'spinner':
        return (
          <div className="relative">
            <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
            <div className="absolute inset-0 animate-pulse">
              <div className={`${sizeClasses[size]} border-2 border-blue-200 border-t-blue-600 rounded-full`}></div>
            </div>
          </div>
        );
      
      case 'dots':
        return (
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        );
      
      default:
        return (
          <div className="relative">
            <div className={`${sizeClasses[size]} animate-spin`}>
              <Loader2 className="w-full h-full text-blue-600" />
            </div>
            <div className="absolute inset-0 animate-ping">
              <Sparkles className={`${sizeClasses[size]} text-purple-600 opacity-75`} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      {renderLoader()}
      {message && (
        <div className={`text-center ${textSizes[size]} text-gray-600 animate-pulse`}>
          <span className="inline-block animate-fade-in">{message}</span>
        </div>
      )}
    </div>
  );
};

// Full-screen loading overlay
export const FullScreenLoading: React.FC<{ message?: string }> = ({ message = "Loading your adventure..." }) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center z-50">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="w-20 h-20 animate-spin">
            <Globe className="w-full h-full text-blue-600" />
          </div>
          <div className="absolute inset-0 animate-ping">
            <MapPin className="w-20 h-20 text-purple-600 opacity-75" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-800 animate-fade-in">
            {message}
          </h2>
          <p className="text-gray-600 animate-fade-in animate-delay-200">
            Preparing your perfect travel experience...
          </p>
        </div>
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-3 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-3 bg-cyan-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

// Skeleton loading component
export const SkeletonLoader: React.FC<{ 
  className?: string;
  lines?: number;
  height?: string;
}> = ({ 
  className = "", 
  lines = 3, 
  height = "h-4" 
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`${height} bg-gray-200 rounded animate-shimmer`}
          style={{ animationDelay: `${index * 100}ms` }}
        ></div>
      ))}
    </div>
  );
};

// Card skeleton loader
export const CardSkeleton: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`bg-white rounded-xl p-6 shadow-lg ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full animate-shimmer"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded animate-shimmer"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3 animate-shimmer"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-shimmer"></div>
          <div className="h-4 bg-gray-200 rounded w-4/5 animate-shimmer"></div>
          <div className="h-4 bg-gray-200 rounded w-3/5 animate-shimmer"></div>
        </div>
        <div className="flex space-x-2">
          <div className="h-6 bg-gray-200 rounded-full w-16 animate-shimmer"></div>
          <div className="h-6 bg-gray-200 rounded-full w-20 animate-shimmer"></div>
        </div>
      </div>
    </div>
  );
};

// Progress bar with animation
export const AnimatedProgressBar: React.FC<{ 
  progress: number; 
  className?: string;
  showPercentage?: boolean;
}> = ({ 
  progress, 
  className = "",
  showPercentage = true 
}) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">Progress</span>
        {showPercentage && (
          <span className="text-sm font-medium text-gray-700">{progress}%</span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};
