import { useState, useMemo, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Code2, Database, Layers, Server, Smartphone,
  Brain, BarChart2, Users, MessageSquare,
  TrendingUp, AlignLeft, ArrowRight, Lightbulb, ChevronRight, Home, Loader2, Sparkles
} from 'lucide-react'
import { interviewApi } from '../api/interview'
import Header from '../components/landing/Header'
import Footer from '../components/landing/Footer'
import { Button } from '../components/ui/Button'


const ROLE_META = {
  frontend:     { icon: Code2,         sub: 'React, Vue, Angular' },
  backend:      { icon: Server,        sub: 'Node, Django, Spring' },
  fullstack:    { icon: Layers,        sub: 'End-to-end development' },
  devops:       { icon: Database,      sub: 'CI/CD, Cloud, Infra' },
  mobile:       { icon: Smartphone,    sub: 'iOS, Android, RN' },
  ai_ml:        { icon: Brain,         sub: 'Models & Pipelines' },
  data_science: { icon: BarChart2,     sub: 'Analytics & Insights' },
  hr:           { icon: Users,         sub: 'People & Culture' },
  general:      { icon: MessageSquare, sub: 'Mixed Topics' },
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

const ESTIMATED_TIMES = { 5: 10, 8: 15, 10: 20 }

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
  python:         'Data language',
  spark:          'Big data processing',
  hadoop:         'Distributed storage',
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

function RoleCard({ roleId, selected, onSelect }) {
  const meta   = ROLE_META[roleId] || { icon: Brain, sub: 'Specialized Role' }
  const Icon   = meta.icon
  const active = selected === roleId
  return (
    <button
      onClick={() => onSelect(roleId)}
      className={`
        relative w-full text-left rounded-xl border-2 p-4 transition-all duration-150
        ${active
          ? 'border-accent bg-accent/5 shadow-sm'
          : 'border-border bg-white hover:border-accent/40 hover:bg-accent/5'}
      `}
    >
      {active && (
        <div className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent">
          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
      <div className={`mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg ${active ? 'bg-accent/10' : 'bg-muted'}`}>
        <Icon size={16} className={active ? 'text-accent' : 'text-muted-foreground'} />
      </div>
      <p className={`text-sm font-semibold leading-tight ${active ? 'text-foreground' : 'text-foreground/80'}`}>
        {prettyRole(roleId)}
      </p>
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

function RadioList({ options, selected, onSelect, renderLabel }) {
  return (
    <div className="space-y-2">
      {options.map(opt => {
        const active = selected === opt
        return (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className={`
              flex w-full items-center justify-between rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all
              ${active
                ? 'border-accent bg-white text-foreground'
                : 'border-border bg-white text-muted-foreground hover:border-accent/40'}
            `}
          >
            <span>{renderLabel ? renderLabel(opt) : opt}</span>
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

  const [bootstrapping, setBootstrapping] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const [remoteConfig, setRemoteConfig] = useState({
    roles: {},
    levels: [],
    interviewTypes: [],
    questionOptions: []
  })

  const [selectedRole,  setSelectedRole]  = useState('')
  const [selectedSpec,  setSelectedSpec]  = useState(null)
  const [selectedType,  setSelectedType]  = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [selectedCount, setSelectedCount] = useState(0)

  useEffect(() => {
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
  }, [])

  const currentSpecs     = remoteConfig.roles[selectedRole] || null
  const hasSpecialization = currentSpecs !== null

  function handleRoleChange(role) {
    setSelectedRole(role)
    setSelectedSpec(remoteConfig.roles[role]?.[0] || null)
  }

  const summary = useMemo(() => {
    if (bootstrapping || !selectedRole) return {}
    const rows = {
      'Target Role': prettyRole(selectedRole),
    }
    if (hasSpecialization && selectedSpec) {
      rows['Specialization'] = prettySpec(selectedSpec)
    }
    rows['Type']      = TYPE_META[selectedType]?.label || selectedType
    rows['Level']     = LEVEL_META[selectedLevel]?.label || selectedLevel
    rows['Questions'] = `${selectedCount} Questions`
    return rows
  }, [selectedRole, selectedSpec, selectedType, selectedLevel, selectedCount, hasSpecialization, bootstrapping])

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
      <Header />
      <div className="h-16" />

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

        {error && (
          <div className="mb-8 rounded-xl border border-red-200/60 bg-red-50/60 backdrop-blur-sm px-4 py-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">

          <div className="space-y-10">

            <section>
              <SectionHeader icon={Layers} title="Target Role" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.keys(remoteConfig.roles).map(r => (
                  <RoleCard key={r} roleId={r} selected={selectedRole} onSelect={handleRoleChange} />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                  onSelect={setSelectedLevel}
                  renderLabel={l => (
                    <span className="flex items-center gap-2">
                      {LEVEL_META[l]?.label || prettyRole(l)}
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                        {LEVEL_META[l]?.badge || 'Standard'}
                      </span>
                    </span>
                  )}
                />
              </section>
            </div>

            <section>
              <SectionHeader icon={AlignLeft} title="Question Quantity" />
              <div className="flex gap-4">
                {remoteConfig.questionOptions.map(n => (
                  <button
                    key={n}
                    onClick={() => setSelectedCount(n)}
                    className={`
                      flex flex-col items-center flex-1 rounded-xl border-2 px-8 py-5 transition-all
                      ${selectedCount === n
                        ? 'border-accent bg-white text-accent shadow-sm'
                        : 'border-border bg-white text-muted-foreground hover:border-accent/40'}
                    `}
                  >
                    <span className="text-2xl font-bold">{n}</span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">~{ESTIMATED_TIMES[n] || (n * 4)} min</span>
                  </button>
                ))}
              </div>
            </section>

          </div>

          <div className="space-y-6 lg:sticky lg:top-24">

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

              <div className="bg-white px-6 pb-6 pt-4">
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

      <Footer />
    </div>
  )
}