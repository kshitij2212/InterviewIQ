import { useState, useMemo, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Code2, Database, Layers, Server, Smartphone,
  Brain, BarChart2, Users, MessageSquare, User, AlertCircle, X,
  TrendingUp, AlignLeft, ArrowRight, Lightbulb, ChevronRight, Home, Loader2, Sparkles,
  Coffee, Cpu, Binary, Braces, Lock
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { interviewApi } from '../api/interview'
import { paymentApi } from '../api/payment'
import { Button } from '../components/ui/Button'
import { useAuthStore } from '../store/authStore'
import { toast } from 'react-hot-toast'


const ROLE_META = {
  frontend:              { icon: Code2,         sub: 'React, Vue, Angular' },
  backend:               { icon: Server,        sub: 'Node, Django, Spring' },
  coding_languages:      { icon: Braces,        sub: 'JS, Java, Python' },
  data_science:          { icon: BarChart2,     sub: 'Analytics & Insights' },
  HR:                    { icon: Users,         sub: 'People & Culture' },
  introduction:          { icon: User,          sub: 'Personal Background' },
  devops:                { icon: Database,      sub: 'CI/CD, Cloud, Infra' },
  mobile:                { icon: Smartphone,    sub: 'iOS, Android, RN' },
  AI_ML:                 { icon: Brain,         sub: 'Models & Pipelines' },
}

const TYPE_META = {
  technical: { label: 'Technical', desc: 'Coding & System Design' },
  hr:        { label: 'HR',        desc: 'Behavioral & Culture Fit' },
}

const LEVEL_META = {
  fresher: { label: 'Fresher', badge: '0–1 yr' },
  junior:  { label: 'Junior',  badge: '1–3 yr' },
  senior:  { label: 'Senior',  badge: '3+ yr'  },
}

const ESTIMATED_TIMES = { 3: 5, 5: 10, 10: 20 }

const SPEC_META = {
  react:          'Frontend library',
  vue:            'Progressive framework',
  angular:        'Full framework',
  svelte:         'Compile-time UI',
  nextjs:         'React + SSR',
  node:           'JS runtime',
  express:        'Node framework',
  django:         'Python framework',
  spring:         'Java framework',
  fastapi:        'Python API',
  nestjs:         'Node + TS',
  aws:            'Amazon Cloud',
  gcp:            'Google Cloud',
  azure:          'Microsoft Cloud',
  kubernetes:     'Container orchestration',
  docker:         'Containerization',
  terraform:      'Infrastructure as code',
  ios:            'Apple platform',
  android:        'Google platform',
  flutter:        'Cross-platform UI',
  react_native:   'Cross-platform RN',
  kotlin:         'Android language',
  swift:          'iOS language',
  tensorflow:     'ML framework',
  pytorch:        'Deep learning',
  scikit_learn:   'ML library',
  nlp:            'Natural language',
  computer_vision:'Image & video AI',
  python:         'AI, Data & Backend',
  javascript:     'Frontend & Node.js',
  java:           'Enterprise & Android',
  'C++':            'Systems & Game Dev',
  ruby:           'Web & Scripting',
  go:             'Cloud & Concurrency',
  spark:          'Big data processing',
  mongodb:        'NoSQL Database',
  sql:            'Structured queries',
  tableau:        'Data visualization',
  power_bi:       'BI & reporting',
}

function prettyRole(r) {
  return r.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function prettySpec(s) {
  return s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function getLabel(str) {
  if (!str) return ''
  return str.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function Stepper({ current }) {
  const steps = ['Setup', 'Interview', 'Evaluation']
  return (
    <div className="flex items-center mb-10">
      {steps.map((s, i) => {
        const n      = i + 1
        const active = n === current
        const done   = n < current
        return (
          <div key={s} className="flex items-center">
            <div className="flex items-center gap-2.5">
              <div className={`
                flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all
                ${active ? 'bg-accent text-white shadow-md shadow-accent/20'
                  : done  ? 'bg-accent/10 text-accent'
                  : 'bg-muted text-muted-foreground'}
              `}>
                {n}
              </div>
              <span className={`text-sm font-medium ${active ? 'text-foreground' : 'text-muted-foreground'}`}>{s}</span>
            </div>
            {i < steps.length - 1 && <div className="mx-4 h-px w-20 bg-border" />}
          </div>
        )
      })}
    </div>
  )
}

function SectionHeader({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10">
        <Icon size={14} className="text-accent" />
      </div>
      <h2 className="text-base font-bold text-foreground">{title}</h2>
    </div>
  )
}

function RoleCard({ roleId, selected, onSelect, isPro }) {
  const PRO_ROLES = ['devops', 'mobile', 'AI_ML']
  const meta      = ROLE_META[roleId] || { icon: Brain, sub: 'Specialized Role' }
  const Icon      = meta.icon
  const active    = selected === roleId
  const isLocked  = PRO_ROLES.includes(roleId) && !isPro

  return (
    <button
      onClick={() => onSelect(roleId)}
      className={`
        relative w-full text-left rounded-xl border-2 p-4 transition-all duration-150
        ${active
          ? 'border-accent bg-accent/5 shadow-sm'
          : 'border-border bg-white hover:border-accent/40 hover:bg-accent/5'}
        ${isLocked ? 'border-dashed opacity-75' : ''}
      `}
    >
      {active && (
        <div className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent">
          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
      {!active && isLocked && (
        <div className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-lg bg-slate-50 border border-slate-200 shadow-sm">
          <Lock size={10} className="text-slate-400" />
        </div>
      )}
      <div className={`mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg ${active ? 'bg-accent/10' : 'bg-muted'}`}>
        <Icon size={16} className={active ? 'text-accent' : 'text-muted-foreground'} />
      </div>
      <div className="flex items-center gap-1.5 ">
        <p className={`text-sm font-semibold leading-tight ${active ? 'text-foreground' : 'text-foreground/80'}`}>
          {prettyRole(roleId)}
        </p>
        {!active && isLocked && (
           <span className="text-[9px] font-black uppercase text-accent bg-accent/5 px-2 py-0.5 rounded leading-none tracking-tighter">Pro Only</span>
        )}
      </div>
      <p className={`text-xs mt-0.5 ${active ? 'text-accent/70' : 'text-muted-foreground'}`}>{meta.sub}</p>
    </button>
  )
}

function SpecCard({ specId, selected, onSelect }) {
  const active = selected === specId
  return (
    <button
      onClick={() => onSelect(specId)}
      className={`
        relative w-full text-left rounded-xl border-2 px-4 py-3 transition-all duration-150
        ${active
          ? 'border-accent bg-accent/5 shadow-sm'
          : 'border-border bg-white hover:border-accent/40 hover:bg-accent/5'}
      `}
    >
      {active && (
        <div className="absolute top-2.5 right-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent">
          <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
      <p className={`text-sm font-semibold leading-tight ${active ? 'text-foreground' : 'text-foreground/80'}`}>
        {prettySpec(specId)}
      </p>
      <p className={`text-xs mt-0.5 ${active ? 'text-accent/70' : 'text-muted-foreground'}`}>
        {SPEC_META[specId] || ''}
      </p>
    </button>
  )
}

function RadioList({ options, selected, onSelect, renderLabel, lockCondition }) {
  return (
    <div className="space-y-2">
      {options.map(opt => {
        const active = selected === opt
        const isLocked = lockCondition?.(opt)
        return (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className={`
              flex w-full items-center justify-between rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all
              ${active
                ? 'border-accent bg-white text-foreground'
                : 'border-border bg-white text-muted-foreground hover:border-accent/40'}
              ${isLocked ? 'opacity-70 cursor-pointer border-dashed' : ''}
            `}
          >
            <div className="flex items-center gap-3">
              <span>{renderLabel ? renderLabel(opt) : opt}</span>
              {isLocked && <Lock size={12} className="text-slate-400" />}
            </div>
            <div className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all ${active ? 'border-accent' : 'border-border'}`}>
              {active && <div className="h-2.5 w-2.5 rounded-full bg-accent" />}
            </div>
          </button>
        )
      })}
    </div>
  )
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/60 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-bold text-foreground">{value}</span>
    </div>
  )
}

export default function InterviewSetupPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated, fetchUser } = useAuthStore()

  const [bootstrapping, setBootstrapping] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)
  const [showProPopup, setShowProPopup] = useState(false)

  const [remoteConfig, setRemoteConfig] = useState({
    roles: {},
    levels: [],
    interviewTypes: [],
    questionOptions: [],
    limitReached: false
  })

  const [selectedRole,  setSelectedRole]  = useState('')
  const [selectedSpec,  setSelectedSpec]  = useState(null)
  const [selectedType,  setSelectedType]  = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [selectedCount, setSelectedCount] = useState(0)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
      return
    }

    interviewApi.getSetupConfig()
      .then(res => {
        const cfg = res.data.data
        setRemoteConfig(cfg)
        const firstRole = Object.keys(cfg.roles)[0]
        setSelectedRole(firstRole)
        setSelectedSpec(cfg.roles[firstRole]?.[0] || null)
        setSelectedType(cfg.interviewTypes[0])
        setSelectedLevel(cfg.levels[1] || cfg.levels[0])
        setSelectedCount(cfg.questionOptions[0])
      })
      .catch(err => {
        setError('Failed to load interview settings. Please try again.')
        console.error(err)
      })
      .finally(() => setBootstrapping(false))
  }, [isAuthenticated, navigate])

  const currentSpecs     = remoteConfig.roles[selectedRole] || null
  const hasSpecialization = currentSpecs !== null
  const isSpecialRole     = selectedRole === 'hr' || selectedRole === 'introduction'

  function handleRoleChange(role) {
    const PRO_ROLES = ['devops', 'mobile', 'AI_ML']
    if (PRO_ROLES.includes(role) && user?.planType !== 'pro') {
      setShowProPopup(true)
      return
    }
    
    setSelectedRole(role)
    setSelectedSpec(remoteConfig.roles[role]?.[0] || null)
    
    if (role === 'hr' || role === 'introduction') {
      setSelectedType('hr')
      setSelectedLevel('fresher')
    } else if (selectedRole === 'hr' || selectedRole === 'introduction') {
      setSelectedType(remoteConfig.interviewTypes[0])
      setSelectedLevel(remoteConfig.levels[1] || remoteConfig.levels[0])
    }
  }

  const summary = useMemo(() => {
    if (bootstrapping || !selectedRole) return {}
    const rows = {
      'Target Role': prettyRole(selectedRole),
    }
    if (hasSpecialization && selectedSpec) {
      rows['Specialization'] = prettySpec(selectedSpec)
    }
    if (!isSpecialRole) {
      rows['Type']      = TYPE_META[selectedType]?.label || selectedType
      rows['Level']     = LEVEL_META[selectedLevel]?.label || selectedLevel
    }
    rows['Questions'] = `${selectedCount} Questions`
    return rows
  }, [selectedRole, selectedSpec, selectedType, selectedLevel, selectedCount, hasSpecialization, isSpecialRole, bootstrapping])

  function startInterview() {
    setError(null)
    setLoading(true)
    const payload = {
      role:          selectedRole,
      interviewType: selectedType,
      level:         selectedLevel,
      totalQuestions: selectedCount,
    }
    if (hasSpecialization && selectedSpec) {
      payload.specialization = selectedSpec
    }
    interviewApi.start(payload)
      .then(res => {
        const id = res.data.data?.interviewId
        if (id) navigate(`/interview/${id}`)
        else navigate('/dashboard')
      })
      .catch(err => {
        console.error(err)
        setError(err.response?.data?.message || 'Failed to start interview. Please try again.')
      })
      .finally(() => setLoading(false))
  }

  async function handleUpgrade() {
    try {
      setLoading(true)
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
            setShowProPopup(false)
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
      setLoading(false)
    }
  }

  if (bootstrapping) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 text-accent animate-spin" />
          <p className="text-muted-foreground font-medium animate-pulse">Initializing setup engine...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence>
        {showProPopup && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white max-w-md w-full rounded-2xl p-10 shadow-2xl relative border border-slate-100"
            >
              <button onClick={() => setShowProPopup(false)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-500 transition-colors">
                 <X className="w-6 h-6" />
              </button>
              <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mb-8 mx-auto border border-amber-100 shadow-inner">
                 <Sparkles className="w-10 h-10 text-amber-500" />
              </div>
              <h3 className="text-2xl font-black text-center tracking-tighter text-slate-900 mb-4 px-4 uppercase">Unlock Unlimited Potential</h3>
              <p className="text-center text-slate-500 font-medium mb-10 leading-relaxed text-sm">
                Upgrade to InterviewIQ Pro to practice without boundaries and receive deep algorithmic insights!
              </p>
              <Button 
                onClick={handleUpgrade} 
                disabled={loading}
                className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-black tracking-widest text-[10px] uppercase shadow-xl shadow-slate-900/20 rounded-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                 {loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Upgrade to Pro — ₹999/mo'}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-6xl px-6 py-12">

        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground flex items-center gap-1.5">
            <Home size={12} />
            <span>Home</span>
          </Link>
          <ChevronRight size={12} />
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight size={12} />
          <span className="text-accent font-semibold">Setup Session</span>
        </div>

        <div className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-2">
            Configure Interview Session
          </h1>
          <p className="text-sm text-muted-foreground">
            Tailor your practice session to match your target role and expertise.
          </p>
        </div>

        <Stepper current={1} />

 

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">

          <div className="space-y-10">

            <section>
              <SectionHeader icon={Layers} title="Target Role" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.keys(remoteConfig.roles).map(roleId => (
                  <RoleCard
                    key={roleId}
                    roleId={roleId}
                    selected={selectedRole}
                    onSelect={handleRoleChange}
                    isPro={user?.planType === 'pro'}
                  />
                ))}
              </div>
            </section>

            {hasSpecialization && (
              <section>
                <SectionHeader icon={Code2} title="Specialization" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {currentSpecs.map(spec => (
                    <SpecCard key={spec} specId={spec} selected={selectedSpec} onSelect={setSelectedSpec} />
                  ))}
                </div>
              </section>
            )}

            {!isSpecialRole && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-2 duration-500">
                <section>
                  <SectionHeader icon={TrendingUp} title="Interview Type" />
                  <RadioList
                    options={remoteConfig.interviewTypes}
                    selected={selectedType}
                    onSelect={setSelectedType}
                    renderLabel={t => (
                      <span className="flex flex-col items-start gap-0.5">
                        <span>{TYPE_META[t]?.label || prettyRole(t)}</span>
                        <span className="text-xs text-muted-foreground font-normal">{TYPE_META[t]?.desc || 'Standard session'}</span>
                      </span>
                    )}
                  />
                </section>

                <section>
                  <SectionHeader icon={Brain} title="Difficulty Level" />
                  <RadioList
                    options={remoteConfig.levels}
                    selected={selectedLevel}
                    onSelect={(l) => {
                      if (l === 'senior' && user?.planType !== 'pro') {
                        setShowProPopup(true)
                      } else {
                        setSelectedLevel(l)
                      }
                    }}
                    lockCondition={(l) => l === 'senior' && user?.planType !== 'pro'}
                    renderLabel={l => (
                      <span className="flex items-center gap-2">
                        {LEVEL_META[l]?.label || prettyRole(l)}
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                          {LEVEL_META[l]?.badge || 'Standard'}
                        </span>
                        {l === 'senior' && user?.planType !== 'pro' && (
                          <span className="text-[9px] font-black uppercase text-accent ml-1 tracking-tighter bg-accent/5 px-2 py-0.5 rounded">PRO ONLY</span>
                        )}
                      </span>
                    )}
                  />
                </section>
              </div>
            )}

            <section>
              <SectionHeader icon={AlignLeft} title="Question Quantity" />
              <div className="flex gap-4">
                {remoteConfig.questionOptions.map(n => {
                  const active = selectedCount === n
                  const isLocked = n === 10 && user?.planType !== 'pro'
                  return (
                    <button
                      key={n}
                      onClick={() => {
                        if (isLocked) setShowProPopup(true)
                        else setSelectedCount(n)
                      }}
                      className={`
                        flex flex-col items-center justify-center flex-1 rounded-2xl border-2 py-3.5 transition-all
                        ${active
                          ? 'border-accent bg-white shadow-sm ring-1 ring-accent/10'
                          : 'border-slate-100 bg-white text-slate-400 hover:border-accent/40 hover:bg-slate-50/50'}
                        ${isLocked ? 'border-dashed opacity-80' : ''}
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`text-2xl font-black tracking-tighter ${active ? 'text-accent' : 'text-slate-600'}`}>
                          {n}
                        </span>
                        {isLocked && <Lock size={12} className="text-slate-300" />}
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-slate-400">
                          ~{ESTIMATED_TIMES[n] || 0} min
                        </span>
                        {isLocked && (
                          <span className="text-[9px] font-black uppercase text-accent mt-1 bg-accent/5 px-2 py-0.5 rounded leading-none tracking-tighter">PRO ONLY</span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </section>

          </div>

          <div className="space-y-6 lg:sticky lg:top-24 max-h-[calc(100vh-120px)] overflow-y-auto pr-2 custom-scrollbar">

            <div className="rounded-2xl overflow-hidden border border-border shadow-xl shadow-accent/5">
              <div className="bg-accent px-6 py-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-accent-foreground/60 mb-1">Session Summary</p>
                <p className="text-xl font-extrabold text-accent-foreground">Ready for Setup</p>
              </div>

              <div className="bg-white px-6 py-2">
                {Object.entries(summary).map(([label, value]) => (
                  <SummaryRow key={label} label={label} value={value} />
                ))}
              </div>

              <div className="bg-white px-6 pb-6 pt-4 space-y-4">
                <AnimatePresence>
                  {error && !error.toLowerCase().includes('limit') && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, height: 0 }}
                      className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 shadow-sm flex items-start gap-2 overflow-hidden mb-4"
                    >
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <p className="leading-snug">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {remoteConfig.limitReached || error?.toLowerCase().includes('limit') ? (
                  <Button
                    onClick={() => setShowProPopup(true)}
                    className="w-full py-6 font-black uppercase tracking-widest bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/20 transition-all hover:scale-105 active:scale-95"
                  >
                    <Sparkles size={16} className="mr-2 text-amber-500" /> Unlock Pro
                  </Button>
                ) : (
                  <Button
                    onClick={startInterview}
                    disabled={loading}
                    className="w-full py-6 font-bold uppercase tracking-widest shadow-lg shadow-accent/20"
                  >
                    {loading
                      ? <><Loader2 size={16} className="animate-spin mr-2" /> Starting…</>
                      : <>Start Interview <ArrowRight size={16} className="ml-2" /></>
                    }
                  </Button>
                )}
                
                <p className="mt-4 text-center text-xs text-muted-foreground uppercase tracking-wider">
                  Estimated time: {ESTIMATED_TIMES[selectedCount] || (selectedCount * 4)} minutes
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-amber-200/50 bg-amber-50/50 backdrop-blur-sm p-5">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-100/80">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-900 uppercase tracking-widest text-[10px]">Session Intelligence</h4>
                  <p className="mt-1 text-xs leading-relaxed text-amber-800/80">
                    Optimizing <span className="font-bold">{getLabel(selectedLevel) || 'Entry'}</span> level in <span className="font-bold">{getLabel(selectedRole)}</span>. Aim for structured, keyword-rich responses to maximize your efficiency score.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}