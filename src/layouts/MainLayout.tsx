import { useCallback, useEffect, useState } from 'react'
import '../App.css'
import { Outlet } from 'react-router'
import Sidebar from './components/Sidebar'
import Header from './components/Header'

export default function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia('(min-width: 768px)').matches)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)')
    const handleBreakpointChange = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches)
      if (event.matches) setIsMobileMenuOpen(false)
    }

    mediaQuery.addEventListener('change', handleBreakpointChange)
    return () => mediaQuery.removeEventListener('change', handleBreakpointChange)
  }, [])

  const handleSidebarToggle = useCallback(() => {
    if (isDesktop) {
      setSidebarCollapsed((collapsed) => !collapsed)
      return
    }
    setIsMobileMenuOpen((isOpen) => !isOpen)
  }, [isDesktop])

  return (
    <div className='min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 
    dark:from-slate-900 dark:via-slate-800 dark:to-slate-900'>
      <div className='flex h-screen overflow-hidden'>
        {isMobileMenuOpen && !isDesktop && (
          <div 
            onClick={() => setIsMobileMenuOpen(false)}
            className="
              fixed inset-0 z-40 
              bg-slate-900/40 backdrop-blur-sm 
              md:hidden 
              animate-in fade-in duration-300
            "
          />
        )}
        <Sidebar collapsed={sidebarCollapsed}
          isMobileMenuOpen={isMobileMenuOpen}
          isDesktop={isDesktop}
        />
        <div className='main-layout flex-1 flex flex-col overflow-hidden'>
          <Header onToggle={handleSidebarToggle} collapsed={sidebarCollapsed}/>
          <main className='flex-1 overflow-y-auto bg-transparent md:px-3 lg:px-6 md:py-2 lg:py-4'>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
