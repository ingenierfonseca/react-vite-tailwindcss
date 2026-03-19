import { useState } from 'react'
import '../App.css'
import Header from '../components/Layout/Header'
import Sidebar from '../components/Layout/Sidebar'
import { Outlet } from 'react-router'

export default function MainLayout() {
  const [sidebarCollased, setSidebarCollapsed] = useState(false)
  const [currentPage, setCurrentPage] = useState("dashboard")
  return (
    <div className='min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 
    dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500'>
      <div className='flex h-screen overflow-hidden'>
        <Sidebar collapsed={sidebarCollased}
          currentPage={currentPage} onPageChange={setCurrentPage}/>
        <div className='flex-1 flex flex-col overflow-hidden'>
          <Header onToggle={()=> setSidebarCollapsed(prev => !prev)}/>
          <main className='flex-1 overflow-y-auto bg-transparent p-6 space-y-6'>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}