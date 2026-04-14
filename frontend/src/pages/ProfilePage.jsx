import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { User, Mail, Edit2, Check, Loader2, Shield } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProfilePage() {
  const { user, isAuthenticated, updateName } = useAuthStore()
  const navigate = useNavigate()

  const [editingName, setEditingName] = useState(false)
  const [tempName, setTempName]       = useState('')
  const [saving, setSaving]           = useState(false)
  const [saved, setSaved]             = useState(false)

  useEffect(() => {
    if (!isAuthenticated) navigate('/')
  }, [isAuthenticated, navigate])

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  const startEdit = () => {
    setTempName(user?.name || '')
    setEditingName(true)
    setSaved(false)
  }

  const handleSave = async () => {
    if (!tempName.trim() || tempName === user?.name) { setEditingName(false); return }
    setSaving(true)
    await updateName(tempName.trim())
    setSaving(false)
    setEditingName(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="min-h-screen px-8 py-10 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tighter text-slate-900 uppercase">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account details</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 p-8 shadow-sm mb-6">
        <div className="flex items-center gap-6 mb-8">
          <div className="h-20 w-20 rounded-xl overflow-hidden border-2 border-accent/10 shadow-xl shrink-0">
            {user?.avatar
              ? <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
              : <div className="h-full w-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-2xl uppercase">{initials}</div>
            }
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Display Name</p>
            <AnimatePresence mode="wait">
              {editingName ? (
                <motion.div
                  key="edit"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="flex items-center gap-2"
                >
                  <input
                    autoFocus
                    value={tempName}
                    onChange={e => setTempName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditingName(false) }}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-accent/20 w-48"
                  />
                  <button onClick={handleSave} disabled={saving} className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
                    {saving ? <Loader2 size={14} className="text-white animate-spin" /> : <Check size={14} className="text-white" />}
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="view"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-xl font-black text-slate-900 tracking-tight">{user?.name || 'User'}</span>
                  <button onClick={startEdit} className="text-slate-300 hover:text-accent transition-colors">
                    <Edit2 size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            {saved && <p className="text-xs text-emerald-500 font-semibold mt-1">✓ Name updated</p>}
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="h-9 w-9 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
              <Mail size={16} className="text-indigo-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Email</p>
              <p className="text-sm font-semibold text-slate-800 truncate">{user?.email || '—'}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="h-9 w-9 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
              <Shield size={16} className="text-violet-500" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Auth Method</p>
              <p className="text-sm font-semibold text-slate-800 capitalize">
                {user?.googleId ? 'Google OAuth' : 'Email & Password'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="h-9 w-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              <User size={16} className="text-emerald-500" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Member Since</p>
              <p className="text-sm font-semibold text-slate-800">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
