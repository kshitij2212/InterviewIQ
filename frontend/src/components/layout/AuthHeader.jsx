import React from 'react'
import { Menu, Sparkles } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

export default function AuthHeader({ onOpenSidebar }) {
  const user = useAuthStore(s => s.user)
  
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-100 z-30 px-6 flex items-center justify-between no-print">
      <div className="flex items-center gap-4">
        <button 
          onClick={onOpenSidebar}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500"
        >
          <Menu size={20} />
        </button>
        <div className="text-lg font-black tracking-tighter uppercase">
          INTERVIEW<span className="text-accent">IQ</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="h-9 w-9 rounded-lg overflow-hidden flex items-center justify-center font-bold text-xs uppercase border border-gray-200 shadow-sm bg-white">
          {user?.avatar && user.avatar !== 'undefined'
            ? <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
            : <div className="h-full w-full bg-indigo-50 text-indigo-700 flex items-center justify-center">{initials}</div>
          }
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-600">{user?.name || 'Interviewee'}</span>
        </div>
        
      </div>
    </header>
  )
}
