import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useTheme } from '@/providers/ThemeProvider'
import ThemeCustomizer from '@/components/theme/ThemeCustomizer'
import DashboardNavbar from '@/components/layout/DashboardNavbar'
import { useAuth } from '@/hooks/use-auth'

const DashboardLayout = () => {
  const { isDark } = useTheme()
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }
  
  return (
    <div className="flex h-screen bg-[hsl(var(--body-bg))]" data-dashboard-layout="root">
      {/* Sidebar - Wrap in a div without aria-hidden */}
      <div className="sidebar-container">
        <Sidebar />
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden transition-all duration-300 ml-0 md:ml-64">
        {/* Navbar */}
        <DashboardNavbar 
          user={user || { id: '0', name: 'Guest User', email: 'guest@example.com', role: 'member' }} 
          onToggleSidebar={toggleSidebar} 
        />
        
        {/* Main content area */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
      
      {/* Theme customizer */}
      <ThemeCustomizer />
    </div>
  )
}

export default DashboardLayout
