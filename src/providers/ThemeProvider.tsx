
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { ThemeSettings, UpdateSettingsOptions, Mode } from '@/types/theme'
import themeConfig from '@/configs/themeConfig'
import primaryColorConfig from '@/configs/primaryColorConfig'

// Settings context props type
type ThemeContextProps = {
  settings: ThemeSettings
  updateSettings: (settings: Partial<ThemeSettings>, options?: UpdateSettingsOptions) => void
  resetSettings: () => void
  // Add these missing properties for compatibility with existing components
  mode: Mode
  setMode: (mode: Mode) => void
  isDark: boolean
  toggleTheme: () => void
  primaryColor: string
  setPrimaryColor: (color: string) => void
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
  const [primaryColor, setPrimaryColorState] = useState<string>(settings.primaryColor || themeConfig.primaryColor)

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

    // If primary color is updated, update the state
    if (newSettings.primaryColor) {
      setPrimaryColorState(newSettings.primaryColor)
    }
  }

  // Function to reset settings to initial values
  const resetSettings = () => {
    localStorage.removeItem(themeConfig.settingsCookieName)
    setSettings(initialSettings)
    setPrimaryColorState(initialSettings.primaryColor || themeConfig.primaryColor)
  }

  // Current mode getter
  const mode = useMemo(() => settings.mode || 'system', [settings.mode])
  
  // Mode setter that updates settings
  const setMode = (newMode: Mode) => {
    updateSettings({ mode: newMode })
  }

  // Dark mode status based on current settings and system preference
  const isDark = useMemo(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return mode === 'dark' || (mode === 'system' && prefersDark)
  }, [mode])

  // Toggle between light and dark mode
  const toggleTheme = () => {
    const newMode = isDark ? 'light' : 'dark'
    setMode(newMode)
  }

  // Set primary color
  const setPrimaryColor = (color: string) => {
    updateSettings({ primaryColor: color })
    setPrimaryColorState(color)
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
      
      // Set CSS variables for primary color - ensuring this works correctly in both light and dark modes
      root.style.setProperty('--primary', primaryColorObj.main)
      root.style.setProperty('--primary-light', primaryColorObj.light)
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
          : { r: 0, g: 0, b: 0 }
      }
      
      const primaryRgb = hexToRgb(primaryColorObj.main)
      root.style.setProperty('--primary-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`)
      
      // Additional CSS variable for the button background to ensure proper color application
      root.style.setProperty('--button-primary-bg', primaryColorObj.main)
      
      // Additional styling for specific components
      const styleSheet = document.createElement('style')
      styleSheet.id = 'primary-color-styles'
      
      // Remove any existing style element for primary color
      const existingStyle = document.getElementById('primary-color-styles')
      if (existingStyle) {
        existingStyle.remove()
      }
      
      styleSheet.innerHTML = `
        .bg-primary, .hover\\:bg-primary:hover, .focus\\:bg-primary:focus {
          background-color: ${primaryColorObj.main} !important;
        }
        .text-primary, .hover\\:text-primary:hover {
          color: ${primaryColorObj.main} !important;
        }
        .border-primary, .focus\\:border-primary:focus {
          border-color: ${primaryColorObj.main} !important;
        }
        .bg-primary-light, .hover\\:bg-primary-light:hover {
          background-color: ${primaryColorObj.light} !important;
        }
        .text-primary-light, .hover\\:text-primary-light:hover {
          color: ${primaryColorObj.light} !important;
        }
        .bg-primary-dark, .hover\\:bg-primary-dark:hover {
          background-color: ${primaryColorObj.dark} !important;
        }
        .text-primary-dark, .hover\\:text-primary-dark:hover {
          color: ${primaryColorObj.dark} !important;
        }
        .ring-primary, .focus\\:ring-primary:focus {
          --tw-ring-color: ${primaryColorObj.main} !important;
        }
        
        /* All buttons with any variant that should use primary color */
        .btn-primary, 
        .btn, 
        button[class*="bg-primary"],
        [role="button"][class*="bg-primary"],
        .button-primary {
          background-color: ${primaryColorObj.main} !important;
          border-color: ${primaryColorObj.main} !important;
        }
        
        /* Button hover states */
        .btn-primary:hover, 
        .btn:hover, 
        button[class*="bg-primary"]:hover,
        [role="button"][class*="bg-primary"]:hover,
        .button-primary:hover {
          background-color: ${primaryColorObj.dark} !important;
          border-color: ${primaryColorObj.dark} !important;
        }
        
        /* shadcn Button with default variant */
        button[class*="bg-primary"], 
        .button[class*="bg-primary"], 
        a[class*="bg-primary"] {
          background-color: ${primaryColorObj.main} !important;
        }
        
        button[class*="bg-primary"]:hover, 
        .button[class*="bg-primary"]:hover, 
        a[class*="bg-primary"]:hover {
          background-color: ${primaryColorObj.dark} !important;
        }
      `
      
      document.head.appendChild(styleSheet)
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
    resetSettings,
    // Add these properties for component compatibility
    mode,
    setMode,
    isDark,
    toggleTheme,
    primaryColor,
    setPrimaryColor
  }), [settings, mode, isDark, primaryColor])

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider
