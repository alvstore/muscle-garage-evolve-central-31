import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '@/providers/ThemeProvider'
import ThemeToggle from '@/components/theme/ThemeToggle'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Building2, ChevronDown, ChevronLeft, ChevronRight, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { adminNavSections } from '@/data/adminNavigation'
import { NavItem as AdminNavItem, Permission } from '@/types/navigation'
import { cn } from '@/lib/utils'
import { useBranch } from '@/hooks/use-branch'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

// Navigation item type for our sidebar
interface SidebarNavItem {
  title: string
  path: string
  icon: React.ReactNode
  children?: SidebarNavItem[]
  permission?: Permission
}

const Sidebar = (): JSX.Element => {
  const location = useLocation()
  const navigate = useNavigate()
  const { mode, setMode, isDark, settings } = useTheme()
  const { logout, user } = useAuth()
  const { branches, currentBranch, switchBranch } = useBranch()
  const [collapsed, setCollapsed] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [branchMenuOpen, setBranchMenuOpen] = useState(false)
  
  // Handle logout
  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }
  
  // Track active menu item explicitly
  const [activeMenuItem, setActiveMenuItem] = useState<string>(location.pathname);
  
  // Update active menu item when location changes
  useEffect(() => {
    setActiveMenuItem(location.pathname);
  }, [location.pathname]);
  
  // State to track expanded sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  
  // Initialize expanded sections based on active path
  useEffect(() => {
    // Find which parent menu should be expanded based on current path
    const newExpandedSections = { ...expandedSections };
    
    // Check each nav section to see if it has an active item
    adminNavSections.forEach(section => {
      const hasActiveItem = section.items.some(item => 
        activeMenuItem === item.href || 
        (activeMenuItem.startsWith(item.href) && 
         (activeMenuItem.length === item.href.length || activeMenuItem[item.href.length] === '/'))
      );
      
      if (hasActiveItem) {
        newExpandedSections[section.name] = true;
      }
    });
    
    setExpandedSections(newExpandedSections);
  }, [activeMenuItem]);
  
  // Toggle section expansion
  const toggleSection = (title: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }))
  }
  
  // Check if path is active
  const isActive = (path: string) => {
    // For exact matches
    if (path === activeMenuItem) return true;
    
    // For child paths
    if (path !== '/' && 
        activeMenuItem.startsWith(path) && 
        (activeMenuItem.length === path.length || activeMenuItem[path.length] === '/')) {
      return true;
    }
    
    return false;
  }

  // Toggle sidebar collapse
  const toggleCollapse = () => {
    setCollapsed(!collapsed)
  }
  
  // Check if user has permission
  const hasPermission = (permission?: Permission) => {
    if (!permission) return true
    // In a real app, you would check against user permissions
    // For now, we'll return true to show all menu items
    return true
  }

  // Determine sidebar background color based on semi-dark setting and theme mode
  const sidebarBgColor = settings.semiDark
    ? isDark 
      ? 'bg-[#283046] border-r border-[#3b4253]' // Dark mode with semi-dark enabled - matching Vuexy
      : 'bg-[#283046] border-r border-[#3b4253]' // Light mode with semi-dark enabled (dark sidebar)
    : isDark
      ? 'bg-[#283046] border-r border-[#3b4253]' // Dark mode with semi-dark disabled - matching Vuexy
      : 'bg-white border-r border-border'; // Light mode with semi-dark disabled (white sidebar)

  // Determine text color based on semi-dark setting and theme mode
  const textColor = settings.semiDark
    ? isDark 
      ? 'text-foreground' // Dark mode with semi-dark enabled
      : 'text-gray-200' // Light mode with semi-dark enabled (light text on dark sidebar)
    : isDark
      ? 'text-foreground' // Dark mode with semi-dark disabled
      : 'text-gray-700'; // Light mode with semi-dark disabled (dark text on white sidebar)

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-20 h-full flex flex-col transition-all duration-300",
        collapsed ? 'w-20' : 'w-64',
        sidebarBgColor,
        textColor
      )}
    >
      {/* Sidebar header */}
      <div className={cn(
        "flex items-center justify-between h-16 px-4 border-b",
        settings.semiDark 
          ? isDark 
            ? "border-border" 
            : "border-[#3a4a76]" 
          : "border-border"
      )}>
        <Link to="/" className="flex items-center">
          {!collapsed ? (
            <div className="flex items-center">
              <svg width="32" height="22" viewBox="0 0 55 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary-500">
                <path d="M9.41568 35.4771C4.72529 35.4771 1.00098 31.7528 1.00098 27.0624V9.41485C1.00098 4.72446 4.72529 1.00015 9.41568 1.00015H45.5839C50.2743 1.00015 53.9986 4.72446 53.9986 9.41485V27.0624C53.9986 31.7528 50.2743 35.4771 45.5839 35.4771H9.41568Z" fill="currentColor" stroke={settings.semiDark ? (isDark ? "white" : "black") : "white"} strokeWidth="1.5"/>
                <path d="M25.0723 13.1176L25.0723 22.3137" stroke={settings.semiDark ? (isDark ? "white" : "black") : "white"} strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M30.9248 13.1176L30.9248 22.3137" stroke={settings.semiDark ? (isDark ? "white" : "black") : "white"} strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M25.0723 13.1176C25.0723 13.1176 25.0723 9.41485 27.9986 9.41485C30.9248 9.41485 30.9248 13.1176 30.9248 13.1176" stroke={settings.semiDark ? (isDark ? "white" : "black") : "white"} strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M25.0723 22.3137C25.0723 22.3137 25.0723 26.0165 27.9986 26.0165C30.9248 26.0165 30.9248 22.3137 30.9248 22.3137" stroke={settings.semiDark ? (isDark ? "white" : "black") : "white"} strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className={cn(
                "text-xl font-semibold ml-2",
                settings.semiDark ? textColor : "text-white"
              )}>Muscle Garage</span>
            </div>
          ) : (
            <svg width="32" height="22" viewBox="0 0 55 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary-500">
              <path d="M9.41568 35.4771C4.72529 35.4771 1.00098 31.7528 1.00098 27.0624V9.41485C1.00098 4.72446 4.72529 1.00015 9.41568 1.00015H45.5839C50.2743 1.00015 53.9986 4.72446 53.9986 9.41485V27.0624C53.9986 31.7528 50.2743 35.4771 45.5839 35.4771H9.41568Z" fill="currentColor" stroke={settings.semiDark ? (isDark ? "white" : "black") : "white"} strokeWidth="1.5"/>
              <path d="M25.0723 13.1176L25.0723 22.3137" stroke={settings.semiDark ? (isDark ? "white" : "black") : "white"} strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M30.9248 13.1176L30.9248 22.3137" stroke={settings.semiDark ? (isDark ? "white" : "black") : "white"} strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M25.0723 13.1176C25.0723 13.1176 25.0723 9.41485 27.9986 9.41485C30.9248 9.41485 30.9248 13.1176 30.9248 13.1176" stroke={settings.semiDark ? (isDark ? "white" : "black") : "white"} strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M25.0723 22.3137C25.0723 22.3137 25.0723 26.0165 27.9986 26.0165C30.9248 26.0165 30.9248 22.3137 30.9248 22.3137" stroke={settings.semiDark ? (isDark ? "white" : "black") : "white"} strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          )}
        </Link>
        <button 
          onClick={toggleCollapse}
          className={cn(
            "p-1 rounded-md",
            settings.semiDark 
              ? "hover:bg-muted text-muted-foreground" 
              : "hover:bg-[#3a4a76] text-gray-300"
          )}
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </button>
      </div>
      
      {/* Branch selector */}
      <div className={cn(
        "px-4 py-3 border-b",
        settings.semiDark 
          ? isDark 
            ? "border-[#3b4253]" 
            : "border-[#3b4253]" 
          : "border-border"
      )}>
        {!collapsed ? (
          <DropdownMenu open={branchMenuOpen} onOpenChange={setBranchMenuOpen}>
            <DropdownMenuTrigger asChild>
              <div className={cn(
                "flex items-center justify-between rounded-md px-3 py-2 cursor-pointer",
                settings.semiDark 
                  ? isDark 
                    ? "bg-[#343d55]" 
                    : "bg-[#343d55]" 
                  : "bg-muted"
              )}>
                <div className="flex items-center">
                  <Building2 size={18} className={cn(
                    "mr-2",
                    settings.semiDark ? "text-gray-300" : "text-gray-500"
                  )} />
                  <div className="flex flex-col">
                    <span className={cn(
                      "text-xs font-medium",
                      settings.semiDark ? "text-gray-400" : "text-gray-500"
                    )}>{currentBranch?.name?.split(' ')[0] || 'Muscle'}</span>
                    <span className={cn(
                      "text-sm font-semibold",
                      settings.semiDark ? "text-gray-200" : "text-gray-700"
                    )}>{currentBranch?.name?.split(' ').slice(1).join(' ') || 'Garage Motera'}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-xs bg-primary-500 text-white px-2 py-0.5 rounded font-medium">Current</span>
                  <ChevronDown size={16} className={cn(
                    "ml-1",
                    settings.semiDark ? "text-gray-300" : "text-gray-500"
                  )} />
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 mt-1">
              {branches.map(branch => (
                <DropdownMenuItem 
                  key={branch.id} 
                  className={cn(
                    "flex items-center py-2",
                    currentBranch?.id === branch.id ? "bg-primary/10" : ""
                  )}
                  onClick={() => {
                    switchBranch(branch.id);
                    setBranchMenuOpen(false);
                  }}
                >
                  <Building2 size={16} className="mr-2 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{branch.name}</span>
                    <span className="text-xs text-muted-foreground">{branch.city || 'No location'}</span>
                  </div>
                  {currentBranch?.id === branch.id && (
                    <span className="ml-auto text-xs bg-primary text-white px-2 py-0.5 rounded">Current</span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex justify-center cursor-pointer" onClick={() => setBranchMenuOpen(true)}>
            <Building2 size={20} className={cn(
              settings.semiDark ? "text-gray-300" : "text-gray-500"
            )} />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-2">
        <ul className="space-y-0.5 px-3">
          {adminNavSections.map((section, sectionIndex) => {
            // Skip sections user doesn't have permission for
            const sectionHasPermission = section.items.some(item => hasPermission(item.permission));
            if (!sectionHasPermission) return null;
            
            const isExpanded = expandedSections[section.name];
            const hasActiveItem = section.items.some(item => isActive(item.href));
            
            // Determine background colors based on semi-dark setting and theme mode
            const activeBgColor = settings.semiDark 
              ? isDark 
                ? 'bg-muted' 
                : 'bg-[#394b79]' 
              : isDark 
                ? 'bg-muted' 
                : 'bg-gray-100';
                
            const hoverBgColor = settings.semiDark 
              ? isDark 
                ? 'hover:bg-muted' 
                : 'hover:bg-[#394b79]' 
              : isDark 
                ? 'hover:bg-muted' 
                : 'hover:bg-gray-100';
                
            const navTextColor = settings.semiDark 
              ? isDark 
                ? 'text-muted-foreground' 
                : 'text-gray-200' 
              : isDark 
                ? 'text-muted-foreground' 
                : 'text-gray-700';
            
            return (
              <li key={sectionIndex} className="mb-1">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleSection(section.name)}
                    className={cn(
                      "flex flex-1 items-center px-4 py-2.5 rounded-md transition-colors duration-200",
                      hasActiveItem ? activeBgColor : hoverBgColor
                    )}
                  >
                    <span className={cn("mr-2.5 text-[1.25rem] opacity-70", navTextColor)}>
                      {section.items[0].icon}
                    </span>
                    {!collapsed && (
                      <span className={cn("flex-1 text-[0.875rem] font-normal text-left", navTextColor)}>
                        {section.name}
                      </span>
                    )}
                  </button>
                  
                  {!collapsed && (
                    <button
                      onClick={() => toggleSection(section.name)}
                      className={cn(
                        "p-1 rounded-md ml-1", 
                        hoverBgColor,
                        navTextColor
                      )}
                    >
                      <ChevronDown 
                        size={16} 
                        className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>
                  )}
                </div>
                
                {/* Section items */}
                {!collapsed && isExpanded && (
                  <ul className="mt-0.5 ml-7 space-y-0.5">
                    {section.items.map((item, itemIndex) => {
                      // Skip items user doesn't have permission for
                      if (!hasPermission(item.permission)) return null;
                      
                      const isItemActive = isActive(item.href);
                      
                      return (
                        <li key={itemIndex}>
                          <Link
                            to={item.href}
                            onClick={() => setActiveMenuItem(item.href)}
                            className={cn(
                              "flex items-center px-4 py-2 rounded-md transition-colors duration-200",
                              isItemActive 
                                ? 'bg-primary-500 text-white font-medium' 
                                : settings.semiDark 
                                  ? isDark
                                    ? 'text-muted-foreground hover:bg-muted'
                                    : 'text-gray-200 hover:bg-[#394b79]'
                                  : isDark
                                    ? 'text-muted-foreground hover:bg-muted'
                                    : 'text-gray-700 hover:bg-gray-100'
                            )}
                          >
                            <span className="text-[0.8125rem] font-normal">{item.label}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Sidebar footer */}
      <div className="p-4 border-t border-[#3a4a76]">
        <div className="flex items-center justify-between">
          <button
            onClick={handleLogout}
            className="flex items-center text-gray-300 hover:text-primary-500"
            disabled={isLoggingOut}
          >
            <LogOut size={18} className="mr-2 opacity-70" />
            {!collapsed && <span className="text-[0.875rem]">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>}
          </button>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
