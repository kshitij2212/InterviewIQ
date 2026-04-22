import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useInterviewStore } from '../store/interviewStore'
import {
  Brain, Plus, Upload, BarChart2, Bookmark,
  TrendingUp, Flame, Trophy, Calendar,
  ChevronRight, Sparkles, AlertCircle, CheckCircle2,
  Loader2, Clock, X
} from 'lucide-react'
import { interviewApi } from '../api/interview'
import InterviewCard from '../components/interview/InterviewCard'
import { motion, AnimatePresence } from 'framer-motion'

const DAILY_GOAL = 3

function getGreeting() {
  const hour = new Date().getHours()
  if (hour >= 4 && hour < 12) return 'Good morning'
  if (hour >= 12 && hour < 17) return 'Good afternoon'
  if (hour >= 17 && hour < 21) return 'Good evening'
  return 'Working late'
}

function calculateStreak(interviews) {
  if (!interviews || interviews.length === 0) return 0
  
  const dates = [...new Set(interviews.map(i => 
    new Date(i.createdAt).toLocaleDateString('en-CA')
  ))].sort().reverse()

  const today = new Date().toLocaleDateString('en-CA')
  const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('en-CA')

  if (dates[0] !== today && dates[0] !== yesterday) return 0

  let streak = 0
  let expectedDate = dates[0]
  
  for (const date of dates) {
    if (date === expectedDate) {
      streak++
      const prevDate = new Date(new Date(expectedDate).getTime() - 86400000)
      expectedDate = prevDate.toLocaleDateString('en-CA')
    } else {
      break
    }
  }
  
  return streak
}



export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [interviews, setInterviews] = useState([])
  const [showGoalPopup, setShowGoalPopup] = useState(false)
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
      return
    }

    async function loadHistory() {
      try {
        setLoading(true)
        const { data } = await interviewApi.getHistory({ limit: 30 })
        const fetchedInterviews = data.data.interviews || []
        setInterviews(fetchedInterviews)
        
        const today = new Date().setHours(0,0,0,0)
        const countToday = fetchedInterviews.filter(i => new Date(i.createdAt).getTime() > today).length
        
        if (countToday > 0 && countToday < DAILY_GOAL && user?.planType !== 'pro') {
            setTimeout(() => setShowGoalPopup(true), 1500)
        }
      } catch (err) {
        console.error('Failed to load history', err)
      } finally {
        setLoading(false)
      }
    }
    loadHistory()
  }, [isAuthenticated, navigate])

  const firstName = user?.name?.split(' ')[0] ?? 'there'
  const hasHistory = interviews.length > 0

  const totalInterviews = interviews.length
  const avgScore = totalInterviews > 0 
    ? (interviews.reduce((acc, curr) => acc + (curr.overallScore || 0), 0) / totalInterviews).toFixed(1)
    : 0

  const bestInterview = interviews.reduce((prev, current) => ((prev.overallScore || 0) > (current.overallScore || 0)) ? prev : current, { overallScore: 0, role: 'N/A' })
  
  const todayStart = new Date().setHours(0,0,0,0)
  const sessionsToday = interviews.filter(i => new Date(i.createdAt).getTime() > todayStart).length
  const goalLeft = Math.max(0, DAILY_GOAL - sessionsToday)

  const streak = calculateStreak(interviews)

  const stats = [
    { label: 'Total sessions', value: totalInterviews, sub: 'Total practice cycles', icon: Calendar, color: 'text-indigo-500', bg: 'bg-indigo-50/80', delay: 0.1 },
    { label: 'Average score', value: avgScore, sub: 'Across skills', icon: TrendingUp, color: 'text-violet-500', bg: 'bg-violet-50/80', delay: 0.2 },
    { label: 'Best role', value: (bestInterview.overallScore || 0).toFixed(1), sub: bestInterview.role, icon: Trophy, color: 'text-emerald-500', bg: 'bg-emerald-50/80', delay: 0.3 },
    { label: 'Practice day', value: streak, sub: 'Current streak', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50/80', delay: 0.4 },
  ]

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
       <div className="w-16 h-16 border-4 border-accent/10 border-t-accent rounded-full animate-spin shadow-xl shadow-accent/10" />
    </div>
  )

  const lastSession = interviews[0]

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">

      <AnimatePresence>
        {showGoalPopup && (
          <motion.div 
            initial={{ y: 100, opacity: 0, x: '-50%' }}
            animate={{ y: 0, opacity: 1, x: '-50%' }}
            exit={{ y: 50, opacity: 0, x: '-50%' }}
            className="fixed bottom-12 left-1/2 z-[100] w-[90%] max-w-sm bg-white p-7 rounded-3xl border border-accent/20 shadow-[0_30px_100px_-20px_rgba(99,102,241,0.25)] backdrop-blur-3xl"
          >
             <button onClick={() => setShowGoalPopup(false)} className="absolute top-4 right-4 text-slate-300 hover:text-slate-500 transition-colors">
                <X className="w-5 h-5" />
             </button>
             <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
                   <Flame className="w-6 h-6 text-white" />
                </div>
                <div>
                   <h4 className="font-black uppercase text-[10px] tracking-widest text-accent">Daily Momentum</h4>
                   <p className="text-sm font-black text-slate-900">{sessionsToday} of {DAILY_GOAL} sessions done</p>
                </div>
             </div>
             <p className="text-[12px] font-bold leading-relaxed text-slate-500 mb-6 italic">
                You've completed <span className="text-slate-900">{sessionsToday} sessions</span> today! Only <span className="text-accent font-black tracking-tight">{goalLeft} more</span> to reach your daily peak potential.
             </p>
             <button 
                onClick={() => navigate('/interview/setup')}
                className="w-full bg-accent text-white py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-accent/90 transition-all active:scale-95 shadow-xl shadow-accent/20"
             >
                Finish Today's Goal
             </button>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="mx-auto max-w-7xl px-6 py-10 space-y-10">
        {!hasHistory ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-accent/5 rounded-2xl flex items-center justify-center mb-8 border border-accent/10">
               <Brain className="w-10 h-10 text-accent" />
            </div>
            <h2 className="text-3xl font-black tracking-tighter text-slate-900 mb-4 uppercase">Initialize Your Career</h2>
            <p className="text-muted-foreground font-medium max-w-md mb-10 leading-relaxed">
               You haven't completed any sessions yet. Mock interviews are the fastest way to refine your delivery and master technical keywords.
            </p>
            <button 
                onClick={() => navigate('/interview/setup')}
                className="bg-accent text-white h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-accent/20 transition-all hover:scale-105 active:scale-95"
            >
               Build Your First Session
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="h-16 w-16 rounded-2xl overflow-hidden border-2 border-accent/10 shadow-xl shadow-accent/5 shrink-0 bg-white flex items-center justify-center">
                   {user?.avatar && user.avatar !== 'undefined' ? (
                     <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                   ) : (
                     <div className="h-full w-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-xl uppercase tracking-tighter">
                        {user?.name ? user.name.split(' ').map(n=>n[0]).join('').slice(0,2) : 'U'}
                     </div>
                   )}
                </div>
                <div>
                  <div className="mb-2">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-tighter ${user?.planType === 'pro' ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                      {user?.planType === 'pro' ? 'PRO MEMBER' : 'FREE ACCOUNT'}
                    </span>
                  </div>
                  <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">
                    {getGreeting()}, <span className="text-accent">{firstName}</span>
                  </h1>
                  <p className="mt-1 text-muted-foreground font-medium text-sm">
                    Welcome back to your career intelligence center.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                    onClick={() => navigate('/interview/setup')}
                    className="flex items-center gap-2 rounded-2xl bg-accent px-8 h-12 text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-accent/20 transition-all active:scale-95"
                >
                  <Plus className="h-4 w-4" /> Start New Interview
                </button>
              </div>
            </div>

            <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map(({ label, value, sub, icon: Icon, color, bg }) => (
                <div key={label} className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
                    <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${bg}`}>
                      <Icon className={`h-5 w-5 ${color}`} />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-slate-900 tracking-tighter">{value}</div>
                  <div className="mt-1 text-[10px] font-black uppercase tracking-widest text-slate-400 opacity-60 truncate">{sub}</div>
                </div>
              ))}
            </section>

            <div className="rounded-2xl border border-slate-200/60 bg-white shadow-sm overflow-hidden">
               <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">Recent Practice Cycles</h3>
                  <BarChart2 className="w-5 h-5 text-slate-200" />
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <tr>
                          <th className="px-8 py-5">Target Role</th>
                          <th className="px-8 py-5">Expertise Level</th>
                          <th className="px-8 py-5 text-center">Proficiency</th>
                          <th className="px-8 py-5">Date & Time</th>
                          <th className="px-8 py-5 text-center">Duration Lasted</th>
                          <th className="px-8 py-5 text-right">Action</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {interviews.map((session) => (
                           <InterviewCard key={session._id} session={session} />
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}