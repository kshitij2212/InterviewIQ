import { useState } from 'react'
import Sidebar from './Sidebar'
import AuthHeader from './AuthHeader'

export default function AppLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <div className={`
        flex-1 min-w-0 flex flex-col min-h-screen transition-all duration-300
        ${isSidebarOpen ? 'lg:ml-60' : 'ml-0'}
      `}>
        {!isSidebarOpen && (
          <AuthHeader onOpenSidebar={() => setIsSidebarOpen(true)} />
        )}
        
        <main className={`
          flex-1 p-0 transition-all
          ${!isSidebarOpen ? 'pt-16' : ''}
        `}>
          {children}
        </main>
      </div>
    </div>
  )
}
