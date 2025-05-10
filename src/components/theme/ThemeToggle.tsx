import React from 'react'
import { useTheme } from '@/providers/ThemeProvider'

interface ThemeToggleProps {
  className?: string
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { settings, updateSettings } = useTheme()
  
  const toggleTheme = () => {
    const newMode = settings.mode === 'light' ? 'dark' : 'light'
    updateSettings({ mode: newMode })
  }

  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted transition-colors relative ${className}`}
      aria-label={`Switch to ${settings.mode === 'dark' ? 'light' : 'dark'} mode`}
    >
      {/* Sun icon for dark mode (shown when in dark mode) */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="22" 
        height="22" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className={`absolute transition-opacity duration-300 ${settings.mode === 'dark' ? 'opacity-100' : 'opacity-0'}`}
      >
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>

      {/* Moon icon for light mode (shown when in light mode) */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="22" 
        height="22" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className={`absolute transition-opacity duration-300 ${settings.mode === 'dark' ? 'opacity-0' : 'opacity-100'}`}
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    </button>
  )
}

export default ThemeToggle
