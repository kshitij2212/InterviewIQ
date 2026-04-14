import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  ChevronLeft, Share2, Download, Play, CheckCircle2, 
  Target, Zap, MessageSquare, AlertCircle, Sparkles, 
  ArrowUpRight, BarChart3, TrendingUp, Award, Search,
  Filter, MoreHorizontal, User, FastForward
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { interviewApi } from '../api/interview'
import { Button } from '../components/ui/Button'
import Header from '../components/landing/Header'
import ScoreCard from '../components/interview/ScoreCard'
import FeedbackCard from '../components/interview/FeedbackCard'
import { useAuthStore } from '../store/authStore'

export default function ResultsPage() {
  const { isAuthenticated } = useAuthStore()
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  const handleExport = () => {
    window.print()
  }

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    async function fetchResults() {
      try {
        const { data: res } = await interviewApi.getInterviewSession(id)
        setData(res.data)
        setLoading(false)
      } catch (err) {
        console.error(err)
        navigate('/dashboard')
      }
    }
    fetchResults()
  }, [id, isAuthenticated, navigate])

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-accent/20 border-t-accent rounded-full animate-spin shadow-xl shadow-accent/10" />
    </div>
  )

  const { interview, answers } = data

  const totalAnswers = answers.length
  const averageScore = totalAnswers > 0 
    ? (answers.reduce((acc, curr) => acc + (curr.score || 0), 0) / totalAnswers).toFixed(1)
    : 0

  const avgTechnical = totalAnswers > 0
    ? Math.round(answers.reduce((acc, curr) => acc + (curr.breakdown?.content || 0), 0) / totalAnswers * 10)
    : 0
  
  const avgCommunication = totalAnswers > 0
    ? Math.round(answers.reduce((acc, curr) => acc + (curr.breakdown?.communication || 0), 0) / totalAnswers * 10)
    : 0

  const avgKeywords = totalAnswers > 0
    ? Math.round(answers.reduce((acc, curr) => acc + (curr.breakdown?.keywords || 0), 0) / totalAnswers * 10)
    : 0

  const avgConfidence = Math.min(100, Math.round((averageScore * 10) + 5))

  const scoreNum = parseFloat(averageScore)
  const perfStatus = 
    scoreNum >= 9 ? { label: 'Industry Standard', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' } :
    scoreNum >= 7 ? { label: 'Strong Candidate', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' } :
    scoreNum >= 5 ? { label: 'Needs Refinement', color: 'bg-amber-50 text-amber-600 border-amber-100' } :
    { label: 'Initial Phase', color: 'bg-slate-50 text-slate-500 border-slate-100' }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-accent/10">
      <style>{`
        @media print {
          .print\\:hidden, header, button, .no-print { display: none !important; }
          body { background: white !important; }
          main { padding-top: 0 !important; }
          .bg-white { border: 1px solid #e2e8f0 !important; }
        }
      `}</style>
      <Header />
      
      <main className="pt-24 pb-20 px-6 mx-auto max-w-7xl">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 text-pretty">
          <div>
            <div className="flex items-center gap-2 text-accent font-bold text-[10px] tracking-[0.2em] uppercase mb-2">
               <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
               Performance Overview
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900">
               Insights : <span className="text-accent uppercase">{interview.role}</span>
            </h1>
            <p className="text-muted-foreground mt-2 font-medium flex items-center gap-2 text-sm">
               Session Analytics • Completed {new Date(interview.updatedAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center gap-3 print:hidden">
             <Button 
                onClick={handleExport}
                variant="outline" 
                className="border-slate-200 text-slate-600 bg-white hover:bg-slate-50 gap-2 h-11 px-6 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all"
             >
                <Share2 className="w-4 h-4" /> Export Report
             </Button>
             <Button 
                onClick={() => navigate('/interview/setup')}
                className="bg-accent text-white hover:bg-accent/90 gap-2 h-11 px-8 rounded-xl font-bold uppercase text-[10px] tracking-widest shadow-xl shadow-accent/20 transition-all hover:scale-105 active:scale-95"
             >
                <Zap className="w-4 h-4" /> New Interview
             </Button>
          </div>
        </div>

        <ScoreCard 
          averageScore={averageScore} 
          perfStatus={perfStatus}
          avgTechnical={avgTechnical}
          avgCommunication={avgCommunication}
          avgKeywords={avgKeywords}
          avgConfidence={avgConfidence}
        />

        <div className="mb-20">
           <div className="flex items-center justify-between mb-10 px-2">
              <div>
                 <h2 className="text-2xl font-black tracking-tighter text-slate-900 uppercase">Assessment Deep Dive</h2>
                 <p className="text-[10px] text-muted-foreground font-black mt-1 uppercase tracking-[0.2em] opacity-40">Granular Answer Analysis</p>
              </div>
           </div>

           <div className="space-y-6">
              {answers.map((ans, idx) => (
                <FeedbackCard key={ans.id || idx} answer={ans} index={idx} />
              ))}
           </div>
        </div>

        <div className="bg-slate-900 rounded-[3rem] p-12 lg:p-16 text-center relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-80 h-80 bg-accent/20 rounded-full blur-[100px] pointer-events-none" />
           <Award className="w-16 h-16 text-accent mx-auto mb-8" />
           <h2 className="text-3xl font-black tracking-tighter text-white mb-6 uppercase">The Intelligence Verdict</h2>
           <p className="text-lg text-slate-400 font-medium leading-relaxed italic max-w-2xl mx-auto mb-10">
             "{interview.overallFeedback?.suggestion || "Based on your current performance metrics, you show high proficiency in content accuracy but could benefit from more concise delivery."}"
           </p>
           <Button onClick={() => navigate('/interview/setup')} size="lg" className="h-16 px-12 rounded-[1.5rem] bg-white text-slate-900 hover:bg-slate-50 font-black uppercase tracking-widest text-xs shadow-xl transition-all hover:scale-105 active:scale-95">
              Refine Strategy
           </Button>
        </div>

      </main>
    </div>
  )
}

