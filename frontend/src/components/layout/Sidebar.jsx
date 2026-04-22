import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Mic2, User, History, LogOut, ChevronLeft } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

const NAV = [
  { label: 'Dashboard',     to: '/dashboard',        icon: LayoutDashboard },
  { label: 'New Interview', to: '/interview/setup',  icon: Mic2 },
  { label: 'History',       to: '/history',          icon: History },
  { label: 'Profile',       to: '/profile',          icon: User },
]

export default function Sidebar({ isOpen, onClose }) {
  const location  = useLocation()
  const navigate  = useNavigate()
  const user      = useAuthStore(s => s.user)
  const logout    = useAuthStore(s => s.logout)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  return (
    <aside className={`
      fixed left-0 top-0 h-screen w-60 flex flex-col bg-white border-r border-gray-100 shadow-sm z-40 transition-transform duration-300 no-print
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>

      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <Link to="/dashboard" className="text-xl font-extrabold tracking-tighter uppercase select-none">
          INTERVIEW<span className="text-accent">IQ</span>
        </Link>
        <button 
          onClick={onClose}
          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
          title="Close Sidebar"
        >
           <ChevronLeft size={20} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map(({ label, to, icon: Icon }) => {
          const active = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to))
          return (
            <Link
              key={label}
              to={to}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                ${active
                  ? 'bg-accent/10 text-accent font-semibold'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}
              `}
            >
              <Icon size={18} className={active ? 'text-accent' : 'text-gray-400'} />
              {label}
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-100 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2 relative group">
          <div className="h-9 w-9 rounded-lg overflow-hidden flex items-center justify-center font-bold text-xs uppercase border border-gray-200 shrink-0">
            {user?.avatar && user.avatar !== 'undefined'
              ? <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
              : <div className="h-full w-full bg-indigo-50 text-indigo-700 flex items-center justify-center">{initials}</div>
            }
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email || ''}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-150"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  )
}
