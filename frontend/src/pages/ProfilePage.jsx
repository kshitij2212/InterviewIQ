import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { User, Mail, Edit2, Check, Loader2, Shield, Calendar, Award, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { paymentApi } from '../api/payment'
import { toast } from 'react-hot-toast'
import { loadRazorpay } from '../utils/razorpayLoader'

export default function ProfilePage() {
  const { user, isAuthenticated, updateName, fetchUser } = useAuthStore()
  const navigate = useNavigate()

  const [editingName, setEditingName] = useState(false)
  const [tempName, setTempName]       = useState('')
  const [saving, setSaving]           = useState(false)
  const [saved, setSaved]             = useState(false)
  const [upgrading, setUpgrading]     = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
    } else {
      fetchUser?.()
    }
  }, [isAuthenticated, navigate, fetchUser])

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

  const handleUpgrade = async () => {
    try {
      setUpgrading(true)
      const res = await loadRazorpay()
      if (!res) {
        toast.error('Failed to load payment gateway. Please check your connection.')
        return
      }

      const token = localStorage.getItem('token')
      const { data } = await paymentApi.createOrder(token)
      const order = data.data

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'InterviewIQ Pro',
        description: '30 Days Unlimited Practice',
        order_id: order.id,
        handler: async (response) => {
          try {
            toast.loading('Verifying payment...')
            await paymentApi.verifyPayment(response, token)
            await fetchUser?.() // Sync profile
            toast.dismiss()
            toast.success('Welcome to Pro! Practice unlimitedly now.')
          } catch (err) {
            toast.dismiss()
            toast.error('Payment verification failed. Please contact support.')
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: { color: '#4F46E5' },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      toast.error('Failed to initiate payment. Please try again.')
    } finally {
      setUpgrading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background px-6 py-10 lg:py-16">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-black tracking-tighter text-slate-900 uppercase">
            Profile <span className="text-accent">Settings</span>
          </h1>
          <p className="text-sm text-muted-foreground font-medium mt-1">Manage your identity and authentication details</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8">
          
          <div className="bg-white rounded-3xl border border-slate-200/60 p-8 lg:p-10 shadow-xl shadow-slate-200/20">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
              
              <div className="relative group">
                <div className="h-16 w-16 rounded-2xl overflow-hidden border-2 border-accent/10 shadow-xl shadow-accent/5 shrink-0 bg-white">
                  {user?.avatar && user.avatar !== 'undefined' ? (
                    <img src={user.avatar} alt={user.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-indigo-50 to-indigo-100/50 text-indigo-700 flex items-center justify-center font-black text-2xl uppercase tracking-tighter">
                      {initials}
                    </div>
                  )}
                </div>
                <div className="absolute -inset-2 rounded-2xl border border-accent/20 -z-10 transition-transform duration-500 blur-sm group-hover:scale-105 opacity-0 group-hover:opacity-100"></div>
                <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-lg bg-emerald-500 border-2 border-white flex items-center justify-center shadow-lg" title="Active Status">
                  <Check size={10} className="text-white font-black" />
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left mt-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-2">Display Name</p>
                <AnimatePresence mode="wait">
                  {editingName ? (
                    <motion.div
                      key="edit"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-col sm:flex-row items-center gap-3"
                    >
                      <input
                        autoFocus
                        value={tempName}
                        onChange={e => setTempName(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditingName(false) }}
                        className="bg-slate-50 border-2 border-accent/30 rounded-lg px-3 py-1.5 text-base font-black text-slate-900 focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent w-full sm:w-64 transition-all"
                      />
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button onClick={handleSave} disabled={saving} className="flex-1 sm:flex-none h-10 px-4 rounded-lg bg-accent text-white font-black text-[10px] uppercase tracking-widest hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 active:scale-95 flex items-center justify-center">
                          {saving ? <Loader2 size={14} className="animate-spin" /> : 'Save'}
                        </button>
                        <button onClick={() => setEditingName(false)} className="h-10 w-10 rounded-lg bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-all flex items-center justify-center">
                          <span className="font-bold text-lg leading-none">×</span>
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="view"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col sm:flex-row items-center gap-4"
                    >
                      <h2 className="text-base lg:text-lg font-black text-slate-900 tracking-tighter truncate max-w-full">
                        {user?.name || 'User'}
                      </h2>
                      <button 
                        onClick={startEdit} 
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-accent hover:text-white hover:border-accent transition-all shadow-sm active:scale-95 shrink-0"
                      >
                        <Edit2 size={10} /> Edit
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
                {saved && <p className="text-xs text-emerald-500 font-bold mt-3 bg-emerald-50 inline-block px-3 py-1 rounded-md">✓ Name successfully updated</p>}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Account Details</h3>
              
              <div className="flex items-center gap-5 p-5 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-slate-50 transition-colors group">
                <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Mail size={20} className="text-indigo-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Email Address</p>
                  <p className="text-base font-bold text-slate-800 truncate">{user?.email || '—'}</p>
                </div>
              </div>

              <div className="flex items-center gap-5 p-5 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-slate-50 transition-colors group">
                <div className="h-12 w-12 rounded-xl bg-violet-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Shield size={20} className="text-violet-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Authentication Method</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-800 capitalize">
                      {user?.googleId ? 'Google Account' : 'Email & Password'}
                    </p>
                    {user?.googleId && <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">Verified Secure</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-5 p-5 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-slate-50 transition-colors group">
                <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Calendar size={20} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Member Since</p>
                  <p className="text-sm font-bold text-slate-800">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Join Date unavailable'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-3xl p-8 text-white shadow-xl shadow-indigo-900/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Award size={100} />
              </div>
              <div className="relative z-10">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200 mb-2">Current Plan</h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-black uppercase tracking-tighter">{user?.planType || 'Free'}</span>
                </div>
                
                {user?.planType !== 'pro' && (
                  <button 
                    onClick={handleUpgrade} 
                    disabled={upgrading}
                    className="w-full bg-white text-indigo-900 font-black text-xs uppercase tracking-widest py-3 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {upgrading ? <Loader2 size={14} className="animate-spin" /> : 'Upgrade to Pro'}
                  </button>
                )}
                {user?.planType === 'pro' && (
                  <div className="bg-white/10 rounded-xl px-4 py-3 flex items-center gap-3 border border-white/20">
                    <Zap size={16} className="text-yellow-400" />
                    <span className="text-xs font-bold text-indigo-50">Unlimited Access Active</span>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}
