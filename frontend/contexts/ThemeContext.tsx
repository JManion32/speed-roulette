// frontend/context/ThemeContext.tsx
import { createContext, useState, useContext, ReactNode } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  isFlashing: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isFlashing, setIsFlashing] = useState(false);
  
  const toggleDarkMode = () => {
    setIsFlashing(true);
    setTimeout(() => {
      setIsDarkMode(!isDarkMode);
      setTimeout(() => {
        setIsFlashing(false);
      }, 50);
    }, 150);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, isFlashing, toggleDarkMode }}>
      <div 
        className={`min-h-screen relative transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
      >
        {/* Flash overlay */}
        {isFlashing && (
          <div className="absolute inset-0 bg-white bg-opacity-30 z-50 transition-opacity duration-100"></div>
        )}
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

// Custom hook to use the theme
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}