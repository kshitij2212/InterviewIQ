import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, Check, Loader2 } from 'lucide-react'
import { Button } from '../ui/Button'
import { useAuthStore } from '../../store/authStore'
import { useInterviewStore } from '../../store/interviewStore'
import { Link, useNavigate, useLocation } from 'react-router-dom'

const LANDING_NAV = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
]

const APP_NAV = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Interview', to: '/interview/setup' },
  { label: 'Resources', to: '/resources' },
  { label: 'Settings', to: '/settings' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const [editingName, setEditingName] = useState(false)
  const [tempName, setTempName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const inputRef = useRef(null)

  const user = useAuthStore(s => s.user)
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const logout = useAuthStore(s => s.logout)
  const updateName = useAuthStore(s => s.updateName)
  const navigate = useNavigate()
  const location = useLocation()

  const interviewStatus = useInterviewStore(s => s.status)
  const isInterviewActive = interviewStatus === 'active'

  const handleNavClick = (e, to) => {
    if (isInterviewActive) {
      const confirmLeave = window.confirm('Your interview is in progress. Leaving this page will discard your results. Are you sure you want to leave?')
      if (!confirmLeave) {
        e.preventDefault()
        return
      }
    }
    if (to) {
        setOpen(false)
        navigate(to)
    }
  }

  const startEditing = (e) => {
     e.preventDefault()
     e.stopPropagation()
     setTempName(user?.name || '')
     setEditingName(true)
  }

  const saveName = async () => {
     if (!tempName.trim() || tempName === user?.name) {
        setEditingName(false)
        return
     }
     setIsSaving(true)
     const success = await updateName(tempName.trim())
     setIsSaving(false)
     setEditingName(false)
  }

  useEffect(() => {
    if (editingName && inputRef.current) {
       inputRef.current.focus()
    }
  }, [editingName])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const path = location.pathname.split('/')?.[1] || ''
    const map = {
      '': 'Dashboard',
      dashboard: 'Dashboard',
      interview: 'Interview',
      resources: 'Resources',
      settings: 'Settings',
    }
    setActive(map[path] || '')
  }, [location.pathname])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-background/60 backdrop-blur-xl border-b border-border/60 shadow-[0_1px_24px_hsl(var(--background)/0.8)]'
            : 'bg-background/80 backdrop-blur-md border-b border-border'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

          <Link to="/" onClick={(e) => handleNavClick(e)}>
            <span className="text-xl font-extrabold tracking-tighter uppercase">
              INTERVIEW<span className="text-accent">IQ</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {isAuthenticated
              ? APP_NAV.map(({ label, to }) => (
                  <Link
                    key={label}
                    to={to}
                    onClick={() => setActive(label)}
                    className={`text-sm transition-colors duration-200 ${
                      active === label
                        ? 'text-foreground font-medium'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {label}
                  </Link>
                ))
              : LANDING_NAV.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {label}
                  </a>
                ))
            }
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full overflow-hidden flex items-center justify-center font-bold text-xs uppercase tracking-tighter border border-border shadow-sm bg-indigo-50/50 group-hover:border-accent transition-colors">
                     {user?.avatar ? (
                       <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                     ) : (
                       <div className="h-full w-full bg-indigo-100 text-indigo-700 flex items-center justify-center">
                          {user?.name ? user.name.split(' ').map(n=>n[0]).join('').slice(0,2) : 'U'}
                       </div>
                     )}
                  </div>
                  
                  <div className="relative group">
                    <AnimatePresence mode="wait">
                       {!editingName ? (
                          <motion.span 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={startEditing}
                            className="text-sm font-bold text-slate-800 cursor-pointer hover:text-accent border-b border-dashed border-slate-300 hover:border-accent transition-all pb-0.5"
                          >
                             {user?.name || 'User'}
                          </motion.span>
                       ) : (
                          <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex items-center gap-2"
                          >
                             <input 
                                ref={inputRef}
                                type="text"
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                onBlur={saveName}
                                onKeyDown={(e) => {
                                   if (e.key === 'Enter') saveName()
                                   if (e.key === 'Escape') setEditingName(false)
                                }}
                                className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/20 w-32"
                             />
                             {isSaving ? (
                                <Loader2 className="w-4 h-4 text-accent animate-spin" />
                             ) : (
                                <Check className="w-3.5 h-3.5 text-emerald-50" />
                             )}
                          </motion.div>
                       )}
                    </AnimatePresence>
                  </div>
                </div>
                <button onClick={() => { logout(); navigate('/') }} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors">Logout</button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    size="sm"
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary/60 text-muted-foreground transition-colors hover:text-foreground md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? 'close' : 'open'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed left-4 right-4 top-[4.5rem] z-40 rounded-2xl border border-border bg-background/95 p-4 shadow-2xl backdrop-blur-xl md:hidden"
          >
            <nav className="flex flex-col gap-1">
              {(isAuthenticated ? APP_NAV : LANDING_NAV).map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}
                >
                  {isAuthenticated ? (
                    <Link
                      to={item.to}
                      onClick={() => { setActive(item.label); setOpen(false) }}
                      className="rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground block"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground block"
                    >
                      {item.label}
                    </a>
                  )}
                </motion.div>
              ))}
            </nav>

            <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={() => setOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full justify-center">My Dashboard</Button>
                  </Link>
                    <button onClick={() => { logout(); setOpen(false); navigate('/') }} className="w-full rounded-md bg-secondary/60 py-2 text-sm">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full justify-center">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setOpen(false)}>
                    <Button
                      size="sm"
                      className="w-full justify-center bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}