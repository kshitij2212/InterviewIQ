import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Loader2, User } from 'lucide-react'
import Header from '../components/landing/Header'
import Footer from '../components/landing/Footer'
import { Button } from '../components/ui/Button'
import { useAuthStore } from '../store/authStore'
import axiosInstance from '../utils/axiosInstance'

export default function RegisterPage() {
  const setAuth = useAuthStore(s => s.setAuth)
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const update = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await axiosInstance.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
      })
      setAuth(data.data.user, data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-indigo-50/30 to-white">
      <Header />
      <div className="h-16" />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md mx-auto">
          <div className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur-xl p-10 shadow-2xl shadow-gray-400/20 mb-20">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Create an account</h1>
              <p className="mt-2 text-sm text-gray-500">Start your free trial and boost interview prep</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1.5">Full name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={update}
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm placeholder:text-muted-foreground/40 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1.5">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={update}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm placeholder:text-muted-foreground/40 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 shadow-sm"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-gray-800">Password</label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={update}
                    placeholder="Choose a strong password"
                    className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-11 text-sm placeholder:text-muted-foreground/40 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
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
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create account'}
              </Button>

              <p className="text-center text-sm text-gray-500">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-accent hover:underline">Sign in</Link>
              </p>
            </form>
          </div>
        </div>
      </main>

      <Footer />
      <div className="h-16" />
    </div>
  )
}
