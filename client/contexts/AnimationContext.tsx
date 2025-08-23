import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AnimationContextType {
  isAnimating: boolean;
  setAnimating: (animating: boolean) => void;
  pageLoaded: boolean;
  triggerPageAnimation: () => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};

interface AnimationProviderProps {
  children: ReactNode;
}

export const AnimationProvider: React.FC<AnimationProviderProps> = ({ children }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    // Trigger initial page load animation
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const setAnimating = (animating: boolean) => {
    setIsAnimating(animating);
  };

  const triggerPageAnimation = () => {
    setPageLoaded(false);
    setTimeout(() => setPageLoaded(true), 100);
  };

  return (
    <AnimationContext.Provider value={{
      isAnimating,
      setAnimating,
      pageLoaded,
      triggerPageAnimation
    }}>
      {children}
    </AnimationContext.Provider>
  );
};
