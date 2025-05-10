
import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import themeConfig from '@/configs/themeConfig';
import primaryColorConfig from '@/configs/primaryColorConfig';

// Theme types
type ThemeMode = 'light' | 'dark' | 'system';
type ThemeSkin = 'default' | 'bordered';

// Theme settings type
interface ThemeSettings {
  mode: ThemeMode;
  skin: ThemeSkin;
  semiDark: boolean;
  primaryColor: string;
}

// Theme context type
interface ThemeContextType {
  // Legacy properties for backward compatibility
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  isDark: boolean;
  toggleTheme: () => void;
  systemTheme: 'light' | 'dark';
  
  // New Vuexy-style properties
  settings: ThemeSettings;
  updateSettings: (settings: Partial<ThemeSettings>) => void;
  resetSettings: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeMode;
}

export const ThemeProvider = ({ 
  children, 
  defaultTheme = themeConfig.mode as ThemeMode
}: ThemeProviderProps) => {
  // Get system theme
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light';
  });
  
  // Initialize settings from localStorage or defaults
  const [settings, setSettings] = useState<ThemeSettings>(() => {
    try {
      const savedSettings = localStorage.getItem(themeConfig.settingsCookieName);
      if (savedSettings) {
        return JSON.parse(savedSettings);
      }
    } catch (error) {
      console.error('Error loading theme settings:', error);
    }
    
    // Default settings
    return {
      mode: defaultTheme,
      skin: themeConfig.skin as ThemeSkin,
      semiDark: themeConfig.semiDark,
      primaryColor: themeConfig.primaryColor
    };
  });
  
  // Legacy mode state for backward compatibility
  const [mode, setMode] = useState<ThemeMode>(settings.mode);
  
  // Computed dark mode value
  const isDark = settings.mode === 'dark' || (settings.mode === 'system' && systemTheme === 'dark');
  
  // Update settings
  const updateSettings = (newSettings: Partial<ThemeSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem(themeConfig.settingsCookieName, JSON.stringify(updated));
      
      // Update legacy mode state if mode changes
      if (newSettings.mode && newSettings.mode !== prev.mode) {
        setMode(newSettings.mode);
      }
      
      return updated;
    });
  };
  
  // Reset settings to defaults
  const resetSettings = () => {
    const defaultSettings: ThemeSettings = {
      mode: themeConfig.mode as ThemeMode,
      skin: themeConfig.skin as ThemeSkin,
      semiDark: themeConfig.semiDark,
      primaryColor: themeConfig.primaryColor
    };
    
    localStorage.removeItem(themeConfig.settingsCookieName);
    setSettings(defaultSettings);
    setMode(defaultSettings.mode);
  };
  
  // Legacy toggle theme function for backward compatibility
  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    updateSettings({ mode: newMode });
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
  
  // Apply theme settings to document
  useEffect(() => {
    // Apply dark/light mode
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    
    // Apply semi-dark mode for sidebar
    if (settings.semiDark && !isDark) {
      document.documentElement.setAttribute('data-sidebar-dark', 'true');
    } else {
      document.documentElement.removeAttribute('data-sidebar-dark');
    }
    
    // Apply primary color
    const primaryColorObj = primaryColorConfig.find(color => color.main === settings.primaryColor) || primaryColorConfig[0];
    
    // Set CSS variables for primary color
    const root = document.documentElement;
    root.style.setProperty('--primary-light', primaryColorObj.light);
    root.style.setProperty('--primary', primaryColorObj.main);
    root.style.setProperty('--primary-dark', primaryColorObj.dark);
    
    // Convert hex to RGB for opacity variants
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          }
        : null;
    };
    
    const primaryRgb = hexToRgb(primaryColorObj.main);
    if (primaryRgb) {
      root.style.setProperty('--primary-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
    }
    
    // For legacy code compatibility
    localStorage.setItem('theme-mode', settings.mode);
  }, [settings, isDark]);
  
  // Context value
  const value = useMemo(() => ({
    // Legacy properties
    mode: settings.mode,
    setMode: (newMode: ThemeMode) => updateSettings({ mode: newMode }),
    isDark,
    toggleTheme,
    systemTheme,
    
    // New Vuexy-style properties
    settings,
    updateSettings,
    resetSettings
  }), [settings, isDark, systemTheme]);
  
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
