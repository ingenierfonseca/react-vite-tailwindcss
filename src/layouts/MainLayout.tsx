import { useState } from 'react'
import '../App.css'
import { Outlet } from 'react-router'
import Sidebar from './components/Sidebar'
import Header from './components/Header'

export default function MainLayout() {
  const [sidebarCollased, setSidebarCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className='min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 
    dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500'>
      <div className='flex h-screen overflow-hidden'>
        {isMobileMenuOpen && (
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
        <Sidebar collapsed={sidebarCollased}
          isMobileMenuOpen={isMobileMenuOpen}
        />
        <div className='flex-1 flex flex-col overflow-hidden'>
          <Header onToggle={()=> {
            setSidebarCollapsed(prev => !prev)
            setIsMobileMenuOpen(prev => !prev)
          }}/>
          <main className='flex-1 overflow-y-auto bg-transparent px-6 py-4'>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}