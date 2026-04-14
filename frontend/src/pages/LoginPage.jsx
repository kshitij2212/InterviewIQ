import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import Header from '../components/landing/Header'
import Footer from '../components/landing/Footer'
import { Button } from '../components/ui/Button'
import { useAuthStore } from '../store/authStore'
import axiosInstance from '../utils/axiosInstance'
import { authApi } from '../api/auth'

export default function LoginPage() {
  const setAuth = useAuthStore(s => s.setAuth)
  const navigate = useNavigate()

  const [form, setForm]             = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')
  const [gsiReady, setGsiReady]     = useState(false)

  const gsiButtonRef  = useRef(null)
  const initialized   = useRef(false)

  const update = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await axiosInstance.post('/auth/login', form)
      setAuth(data.data.user, data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (window.google) return
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    if (initialized.current) return

    const interval = setInterval(() => {
      if (!window.google || !gsiButtonRef.current) return
      clearInterval(interval)
      initialized.current = true

      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
      if (!clientId) { setError('Google client ID is not configured'); return }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (resp) => {
          const idToken = resp?.credential
          if (!idToken) return
          try {
            const { data } = await authApi.googleAuth(idToken)
            const { token, data: payload } = data
            setAuth(payload.user, token)
            navigate('/dashboard')
          } catch (err) {
            setError(err.response?.data?.message || 'Google sign-in failed')
          }
        }
      })

      window.google.accounts.id.renderButton(gsiButtonRef.current, {
        theme:  'outline',
        size:   'large',
        width:  '400',
        text:   'continue_with',
        shape:  'rectangular',
      })

      setGsiReady(true)
    }, 100)

    return () => clearInterval(interval)
  }, [setAuth, navigate])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-indigo-50/30 to-white">
      <div className="fixed top-0 left-1/4 w-96 h-96 rounded-full bg-indigo-200/30 blur-3xl -z-10" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 rounded-full bg-violet-200/20 blur-3xl -z-10" />

      <Header />
      <div className="h-16" />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md mx-auto">
          <div className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur-xl p-10 shadow-2xl shadow-gray-400/20 mb-20">

            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
              <p className="mt-2 text-sm text-gray-500">Sign in to continue your interview prep</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1.5">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    name="email" type="email" required
                    value={form.email} onChange={update}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm placeholder:text-muted-foreground/40 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-800 mb-1.5 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    name="password" type={showPassword ? 'text' : 'password'} required
                    value={form.password} onChange={update}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-11 text-sm placeholder:text-muted-foreground/40 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 shadow-sm"
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-200/60 bg-red-50/60 backdrop-blur-sm px-4 py-3 text-sm text-red-500">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full flex items-center justify-center gap-2">
                {loading
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <><span>Sign in</span><ArrowRight className="h-4 w-4" /></>
                }
              </Button>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-200/60" />
                <span className="text-xs text-gray-400">or</span>
                <div className="h-px flex-1 bg-gray-200/60" />
              </div>

              <div className="relative w-full">
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-3 rounded-xl border border-border bg-white py-3 px-4 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:border-gray-300 focus:outline-none"
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <div
                  ref={gsiButtonRef}
                  className="absolute inset-0 overflow-hidden [&>div]:w-full [&>div]:h-full [&>div>div]:w-full [&>div>div]:h-full [&>iframe]:w-full [&>iframe]:h-full"
                  style={{ opacity: 0 }}
                />
              </div>

              <p className="text-center text-sm text-gray-500">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-accent hover:underline">Create one free</Link>
              </p>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}