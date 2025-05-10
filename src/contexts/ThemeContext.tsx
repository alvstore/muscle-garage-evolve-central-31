
import React, { createContext, useState, useEffect } from 'react';
import primaryColorConfig from '@/configs/primaryColorConfig';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextProps {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  primaryColor: primaryColorConfig[0].main,
  setPrimaryColor: () => {},
  mode: 'system',
  setMode: () => {},
  isDark: false,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [primaryColor, setPrimaryColor] = useState<string>(primaryColorConfig[0].main);
  const [mode, setMode] = useState<ThemeMode>('system');
  const [isDark, setIsDark] = useState<boolean>(false);

  // Function to set theme based on system preference
  const setThemeFromSystemPreference = () => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(prefersDark);
    document.documentElement.classList.toggle('dark', prefersDark);
  };

  // Initialize theme on component mount
  useEffect(() => {
    // Check for saved theme preference
    const savedMode = localStorage.getItem('theme-mode') as ThemeMode;
    const savedColor = localStorage.getItem('primary-color');
    
    if (savedMode) {
      setMode(savedMode);
    }
    
    if (savedColor) {
      setPrimaryColor(savedColor);
    }
    
    // Apply theme
    applyTheme(savedMode || mode);
  }, []);

  // Apply theme
  const applyTheme = (newMode: ThemeMode) => {
    if (newMode === 'system') {
      setThemeFromSystemPreference();
      // Listen for system preference changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setThemeFromSystemPreference);
    } else {
      const isDarkMode = newMode === 'dark';
      setIsDark(isDarkMode);
      document.documentElement.classList.toggle('dark', isDarkMode);
      // Remove listener if we're not using system preference
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', setThemeFromSystemPreference);
    }
    
    // Save preference
    localStorage.setItem('theme-mode', newMode);
  };

  const toggleTheme = () => {
    const newMode = isDark ? 'light' : 'dark';
    setMode(newMode);
    applyTheme(newMode);
  };

  // Apply primary color
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    localStorage.setItem('primary-color', primaryColor);
  }, [primaryColor]);

  // Watch for mode changes
  useEffect(() => {
    applyTheme(mode);
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ 
      primaryColor, 
      setPrimaryColor, 
      mode,
      setMode,
      isDark,
      toggleTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
