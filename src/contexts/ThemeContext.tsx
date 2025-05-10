import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { ThemeSettings, UpdateSettingsOptions, Mode } from '@/types/theme'
import themeConfig from '@/configs/themeConfig'
import primaryColorConfig from '@/configs/primaryColorConfig'

// Settings context props type
type ThemeContextProps = {
  settings: ThemeSettings
  updateSettings: (settings: Partial<ThemeSettings>, options?: UpdateSettingsOptions) => void
  resetSettings: () => void
}

// Props type for the provider
type ThemeProviderProps = {
  children: ReactNode
  defaultSettings?: ThemeSettings
}

// Create the context
export const ThemeContext = createContext<ThemeContextProps | null>(null)

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Theme provider component
export const ThemeProvider = ({ children, defaultSettings }: ThemeProviderProps) => {
  // Initial settings
  const initialSettings: ThemeSettings = {
    mode: themeConfig.mode,
    skin: themeConfig.skin,
    semiDark: themeConfig.semiDark,
    layout: themeConfig.layout,
    primaryColor: themeConfig.primaryColor
  }

  // Get settings from localStorage or use initial settings
  const getStoredSettings = (): ThemeSettings => {
    const storedSettings = localStorage.getItem(themeConfig.settingsCookieName)
    if (storedSettings) {
      try {
        return JSON.parse(storedSettings)
      } catch (error) {
        console.error('Error parsing stored settings:', error)
      }
    }
    return defaultSettings || initialSettings
  }

  // State for settings
  const [settings, setSettings] = useState<ThemeSettings>(getStoredSettings)

  // Function to update settings
  const updateSettings = (newSettings: Partial<ThemeSettings>, options?: UpdateSettingsOptions) => {
    const { updateStorage = true } = options || {}

    setSettings(prevSettings => {
      const updatedSettings = { ...prevSettings, ...newSettings }
      
      // Update localStorage if needed
      if (updateStorage) {
        localStorage.setItem(themeConfig.settingsCookieName, JSON.stringify(updatedSettings))
      }

      return updatedSettings
    })
  }

  // Function to reset settings to initial values
  const resetSettings = () => {
    localStorage.removeItem(themeConfig.settingsCookieName)
    setSettings(initialSettings)
  }

  // Apply theme settings to document
  useEffect(() => {
    const applyTheme = () => {
      const { mode, semiDark, primaryColor } = settings
      const root = document.documentElement
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      
      // Determine if dark mode should be applied
      const isDarkMode = 
        mode === 'dark' || 
        (mode === 'system' && prefersDark)
      
      // Apply dark/light mode
      if (isDarkMode) {
        root.classList.add('dark')
        root.classList.remove('light')
      } else {
        root.classList.add('light')
        root.classList.remove('dark')
      }

      // Apply semi-dark mode for sidebar
      if (semiDark && !isDarkMode) {
        root.setAttribute('data-sidebar-dark', 'true')
      } else {
        root.removeAttribute('data-sidebar-dark')
      }

      // Apply primary color
      const primaryColorObj = primaryColorConfig.find(color => color.main === primaryColor) || primaryColorConfig[0]
      
      // Set CSS variables for primary color
      root.style.setProperty('--primary-light', primaryColorObj.light)
      root.style.setProperty('--primary', primaryColorObj.main)
      root.style.setProperty('--primary-dark', primaryColorObj.dark)
      
      // Convert hex to RGB for opacity variants
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result
          ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16)
            }
          : null
      }
      
      const primaryRgb = hexToRgb(primaryColorObj.main)
      if (primaryRgb) {
        root.style.setProperty('--primary-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`)
      }
    }

    applyTheme()

    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (settings.mode === 'system') {
        applyTheme()
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [settings])

  // Context value
  const contextValue = useMemo(() => ({
    settings,
    updateSettings,
    resetSettings
  }), [settings])

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}
