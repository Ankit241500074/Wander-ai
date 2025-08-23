import React, { useEffect, useState, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnimation } from '@/contexts/AnimationContext';

interface AnimatedPageProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const AnimatedPage: React.FC<AnimatedPageProps> = ({ 
  children, 
  className = "", 
  delay = 0 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const location = useLocation();
  const { pageLoaded } = useAnimation();

  useEffect(() => {
    // Reset animation state on route change
    setIsVisible(false);
    setIsExiting(false);

    // Trigger entrance animation
    const entranceTimer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => {
      clearTimeout(entranceTimer);
    };
  }, [location.pathname, delay]);

  useEffect(() => {
    // Handle page exit animation
    const handleBeforeUnload = () => {
      setIsExiting(true);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <div
      className={`min-h-screen transition-all duration-700 ease-out ${
        isVisible && pageLoaded
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-8 scale-95'
      } ${
        isExiting
          ? 'opacity-0 translate-y-4 scale-98'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

// Enhanced version with staggered children animation
export const AnimatedPageWithStagger: React.FC<AnimatedPageProps> = ({ 
  children, 
  className = "", 
  delay = 0 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const { pageLoaded } = useAnimation();

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [location.pathname, delay]);

  return (
    <div
      className={`min-h-screen transition-all duration-1000 ease-out ${
        isVisible && pageLoaded
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      <div
        className={`transition-all duration-700 ease-out ${
          isVisible && pageLoaded
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4'
        }`}
        style={{ transitionDelay: '200ms' }}
      >
        {children}
      </div>
    </div>
  );
};

// Fade-in animation component
export const FadeIn: React.FC<{ 
  children: ReactNode; 
  delay?: number; 
  duration?: number;
  className?: string;
}> = ({ 
  children, 
  delay = 0, 
  duration = 500,
  className = ""
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

// Slide-in animation component
export const SlideIn: React.FC<{ 
  children: ReactNode; 
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  duration?: number;
  className?: string;
}> = ({ 
  children, 
  direction = 'up', 
  delay = 0,
  duration = 500,
  className = ""
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const getTransform = () => {
    switch (direction) {
      case 'left': return 'translateX(-50px)';
      case 'right': return 'translateX(50px)';
      case 'down': return 'translateY(50px)';
      default: return 'translateY(-50px)';
    }
  };

  return (
    <div
      className={`transition-all ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate(0, 0)' : getTransform(),
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

// Scale animation component
export const ScaleIn: React.FC<{ 
  children: ReactNode; 
  delay?: number;
  duration?: number;
  className?: string;
}> = ({ 
  children, 
  delay = 0,
  duration = 500,
  className = ""
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.9)',
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};
