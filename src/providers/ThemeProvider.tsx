
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeMode = 'light' | 'dark' | 'semi-dark';
type PrimaryColor = 'blue' | 'purple' | 'orange' | 'red' | 'teal';

interface ThemeContextType {
  mode: ThemeMode;
  primaryColor: PrimaryColor;
  setMode: (mode: ThemeMode) => void;
  setPrimaryColor: (color: PrimaryColor) => void;
  isDark: boolean;
  isSemiDark: boolean;
  toggleTheme: () => void;
  systemTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeMode;
  defaultPrimaryColor?: PrimaryColor;
}

export const ThemeProvider = ({ 
  children, 
  defaultTheme = 'light',
  defaultPrimaryColor = 'blue'
}: ThemeProviderProps) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem('theme-mode');
    return (savedMode as ThemeMode) || defaultTheme;
  });
  
  const [primaryColor, setPrimaryColor] = useState<PrimaryColor>(() => {
    const savedColor = localStorage.getItem('primary-color');
    return (savedColor as PrimaryColor) || defaultPrimaryColor;
  });
  
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light';
  });
  
  // Computed dark mode value
  const isDark = mode === 'dark';
  const isSemiDark = mode === 'semi-dark';
  
  // Toggle between light and dark
  const toggleTheme = () => {
    setMode(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'semi-dark';
      return 'light';
    });
  };
  
  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  // Update document class and localStorage when mode changes
  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
    
    document.documentElement.classList.remove('dark', 'semi-dark');
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else if (isSemiDark) {
      document.documentElement.classList.add('semi-dark');
    }
  }, [mode, isDark, isSemiDark]);
  
  // Update primary color
  useEffect(() => {
    localStorage.setItem('primary-color', primaryColor);
    
    document.documentElement.classList.remove(
      'theme-blue', 
      'theme-purple', 
      'theme-orange', 
      'theme-red', 
      'theme-teal'
    );
    
    document.documentElement.classList.add(`theme-${primaryColor}`);
  }, [primaryColor]);
  
  const value = {
    mode,
    primaryColor,
    setMode,
    setPrimaryColor,
    isDark,
    isSemiDark,
    toggleTheme,
    systemTheme
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};
