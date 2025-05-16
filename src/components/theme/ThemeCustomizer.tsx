import { useState, useRef, useEffect } from 'react'
import { useTheme } from '@/providers/ThemeProvider'
import primaryColorConfig from '@/configs/primaryColorConfig'

// Component for theme customization
const ThemeCustomizer = () => {
  // Get theme settings and functions from context
  const { mode, setMode, isDark, toggleTheme, settings, updateSettings } = useTheme()
  
  // State for customizer visibility
  const [isOpen, setIsOpen] = useState(false)
  
  // Toggle customizer visibility
  const toggleCustomizer = () => {
    setIsOpen(!isOpen)
  }
  
  // Function to update primary color
  const updatePrimaryColor = (color: string) => {
    // Apply primary color
    const primaryColorObj = primaryColorConfig.find(item => item.main === color) || primaryColorConfig[0]
    
    // Set CSS variables for primary color
    const root = document.documentElement
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
    
    // Set additional CSS variables used by Vuexy theme
    root.style.setProperty('--primary-50', adjustColorBrightness(primaryColorObj.main, 0.95))
    root.style.setProperty('--primary-100', adjustColorBrightness(primaryColorObj.main, 0.9))
    root.style.setProperty('--primary-200', adjustColorBrightness(primaryColorObj.main, 0.75))
    root.style.setProperty('--primary-300', adjustColorBrightness(primaryColorObj.main, 0.6))
    root.style.setProperty('--primary-400', adjustColorBrightness(primaryColorObj.main, 0.4))
    root.style.setProperty('--primary-500', primaryColorObj.main)
    root.style.setProperty('--primary-600', adjustColorBrightness(primaryColorObj.main, -0.2))
    root.style.setProperty('--primary-700', adjustColorBrightness(primaryColorObj.main, -0.4))
    root.style.setProperty('--primary-800', adjustColorBrightness(primaryColorObj.main, -0.6))
    root.style.setProperty('--primary-900', adjustColorBrightness(primaryColorObj.main, -0.8))
    
    // Apply to all elements that need the primary color
    document.querySelectorAll('.bg-primary').forEach(element => {
      const el = element as HTMLElement
      el.style.backgroundColor = primaryColorObj.main
    })
    
    document.querySelectorAll('.text-primary').forEach(element => {
      const el = element as HTMLElement
      el.style.color = primaryColorObj.main
    })
    
    document.querySelectorAll('.border-primary').forEach(element => {
      const el = element as HTMLElement
      el.style.borderColor = primaryColorObj.main
    })
    
    // Apply to additional Vuexy-specific classes and standard button classes
    document.querySelectorAll('.btn-primary, [class*="bg-primary"], .bg-primary-500').forEach(element => {
      const el = element as HTMLElement
      el.style.backgroundColor = primaryColorObj.main
      el.style.borderColor = primaryColorObj.main
    })
    
    // Apply to orange/yellow buttons that should use primary color
    document.querySelectorAll('[class*="bg-orange"], [class*="bg-yellow"], [class*="bg-amber"]').forEach(element => {
      // Check if this is a button or action element that should use primary color
      if (element.classList.contains('action-btn') || 
          element.closest('button') || 
          element.getAttribute('role') === 'button' ||
          element.tagName.toLowerCase() === 'button') {
        const el = element as HTMLElement
        el.style.backgroundColor = primaryColorObj.main
        el.style.borderColor = primaryColorObj.main
      }
    })
    
    document.querySelectorAll('.active-primary').forEach(element => {
      const el = element as HTMLElement
      el.style.backgroundColor = primaryColorObj.main
      el.style.color = '#fff'
    })
    
    document.querySelectorAll('.hover-primary').forEach(element => {
      const el = element as HTMLElement
      const handleMouseEnter = () => {
        el.style.backgroundColor = primaryColorObj.main
        el.style.color = '#fff'
      }
      const handleMouseLeave = () => {
        el.style.backgroundColor = ''
        el.style.color = ''
      }
      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    })
    
    // Update SVG fill colors where needed
    document.querySelectorAll('.svg-primary').forEach(element => {
      const el = element as SVGElement | HTMLElement
      const svgElements = el.querySelectorAll('path, circle, rect, polygon, line')
      svgElements.forEach(svgElement => {
        const svgEl = svgElement as SVGElement
        svgEl.setAttribute('fill', primaryColorObj.main)
      })
    })
    
    // Apply to MUI-specific elements (for Vuexy compatibility)
    document.querySelectorAll('.MuiSwitch-colorPrimary.Mui-checked').forEach(element => {
      const el = element as HTMLElement
      el.style.color = primaryColorObj.main
    })
    
    document.querySelectorAll('.MuiCheckbox-colorPrimary.Mui-checked').forEach(element => {
      const el = element as HTMLElement
      el.style.color = primaryColorObj.main
    })
    
    document.querySelectorAll('.MuiRadio-colorPrimary.Mui-checked').forEach(element => {
      const el = element as HTMLElement
      el.style.color = primaryColorObj.main
    })
    
    // Save to localStorage
    localStorage.setItem('primary-color', color)
  }
  
  // Helper function to adjust color brightness
  const adjustColorBrightness = (hex: string, factor: number) => {
    // Convert hex to RGB
    let r = parseInt(hex.substring(1, 3), 16)
    let g = parseInt(hex.substring(3, 5), 16)
    let b = parseInt(hex.substring(5, 7), 16)
    
    if (factor > 0) {
      // Lighten
      r = Math.min(255, Math.round(r + (255 - r) * factor))
      g = Math.min(255, Math.round(g + (255 - g) * factor))
      b = Math.min(255, Math.round(b + (255 - b) * factor))
    } else {
      // Darken
      factor = Math.abs(factor)
      r = Math.max(0, Math.round(r * (1 - factor)))
      g = Math.max(0, Math.round(g * (1 - factor)))
      b = Math.max(0, Math.round(b * (1 - factor)))
    }
    
    // Convert back to hex
    const rHex = r.toString(16)
    const gHex = g.toString(16)
    const bHex = b.toString(16)
    
    // Ensure each color component is two characters
    const rPadded = rHex.length === 1 ? '0' + rHex : rHex
    const gPadded = gHex.length === 1 ? '0' + gHex : gHex
    const bPadded = bHex.length === 1 ? '0' + bHex : bHex
    
    return `#${rPadded}${gPadded}${bPadded}`
  }
  
  // Function to toggle semi-dark mode
  const toggleSemiDark = () => {
    const root = document.documentElement
    const currentSemiDark = root.hasAttribute('data-sidebar-dark')
    
    // Update the theme settings in the context
    const newSemiDark = !currentSemiDark
    updateSettings({ semiDark: newSemiDark })
    
    // Also update the DOM and localStorage for backward compatibility
    if (currentSemiDark) {
      root.removeAttribute('data-sidebar-dark')
      localStorage.setItem('semi-dark', 'false')
    } else {
      root.setAttribute('data-sidebar-dark', 'true')
      localStorage.setItem('semi-dark', 'true')
    }
  }
  
  // Initialize settings from localStorage
  useEffect(() => {
    // Apply primary color from localStorage
    const savedColor = localStorage.getItem('primary-color')
    if (savedColor) {
      updatePrimaryColor(savedColor)
    }
    
    // Apply semi-dark mode from localStorage
    const semiDark = localStorage.getItem('semi-dark')
    if (semiDark === 'true' && !isDark) {
      document.documentElement.setAttribute('data-sidebar-dark', 'true')
    }
  }, [])

  return (
    <div 
      className={`fixed right-0 top-1/4 z-50 transition-all duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-[calc(100%-3rem)]'}`}
      data-theme-customizer="root"
    >
      {/* Customizer toggle button */}
      <div 
        className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-l-md bg-primary text-white shadow-md"
        onClick={toggleCustomizer}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </div>

      {/* Customizer panel */}
      <div className={`w-64 bg-card text-card-foreground shadow-xl rounded-l-md ${isOpen ? 'block' : 'hidden'}`}>
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Theme Settings</h3>
            <button 
              className="text-muted-foreground hover:text-foreground"
              onClick={toggleCustomizer}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
          {/* Theme Mode Selection */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-3">Mode</h4>
            <div className="grid grid-cols-3 gap-2">
              <button
                className={`flex flex-col items-center justify-center p-2 rounded-md ${mode === 'light' ? 'bg-primary/10 border-primary border' : 'bg-muted hover:bg-muted/80'}`}
                onClick={() => setMode('light')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1">
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
                <span className="text-xs">Light</span>
              </button>
              <button
                className={`flex flex-col items-center justify-center p-2 rounded-md ${mode === 'dark' ? 'bg-primary/10 border-primary border' : 'bg-muted hover:bg-muted/80'}`}
                onClick={() => setMode('dark')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
                <span className="text-xs">Dark</span>
              </button>
              <button
                className={`flex flex-col items-center justify-center p-2 rounded-md ${mode === 'system' ? 'bg-primary/10 border-primary border' : 'bg-muted hover:bg-muted/80'}`}
                onClick={() => setMode('system')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
                <span className="text-xs">System</span>
              </button>
            </div>
          </div>

          {/* Semi-Dark Mode Toggle */}
          {(mode === 'light' || (mode === 'system' && !isDark)) && (
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Semi Dark Sidebar</h4>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={document.documentElement.hasAttribute('data-sidebar-dark')}
                    onChange={toggleSemiDark}
                  />
                  <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          )}

          {/* Primary Color Selection */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-3">Primary Color</h4>
            <div className="grid grid-cols-5 gap-2">
              {primaryColorConfig.map((color) => {
                // Check if this is the current primary color
                const isPrimary = document.documentElement.style.getPropertyValue('--primary') === color.main || 
                                 (document.documentElement.style.getPropertyValue('--primary') === '' && 
                                  color.main === primaryColorConfig[0].main);
                
                return (
                  <button
                    key={color.name}
                    className={`w-full h-10 rounded-md ${isPrimary ? 'ring-2 ring-offset-2' : ''}`}
                    style={{ 
                      backgroundColor: color.main,
                      boxShadow: isPrimary ? `0 0 0 2px ${color.main}` : 'none'
                    }}
                    onClick={() => updatePrimaryColor(color.main)}
                    aria-label={`Select ${color.name} as primary color`}
                  />
                );
              })}
            </div>
          </div>

          {/* Reset Button */}
          <button 
            className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            onClick={() => {
              // Reset theme settings
              setMode('system');
              document.documentElement.removeAttribute('data-sidebar-dark');
              updatePrimaryColor(primaryColorConfig[0].main);
              localStorage.removeItem('theme-mode');
              localStorage.removeItem('semi-dark');
              localStorage.removeItem('primary-color');
            }}
          >
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  )
}

export default ThemeCustomizer
