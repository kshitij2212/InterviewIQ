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
      navigate('/')
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
    <div className="relative overflow-x-hidden selection:bg-accent/10">
      <style>{`
        @media print {
          .no-print, aside, header, button { display: none !important; }
          body { 
            background: white !important; 
            margin: 0 !important;
            padding: 0 !important;
          }
          main { 
            margin-left: 0 !important; 
            padding: 10mm !important;
            width: 100% !important;
            max-width: 100% !important;
            zoom: 0.85; /* Scale down to fit single page */
          }
          .bg-white { 
            border: 1px solid #e2e8f0 !important; 
            margin-bottom: 0 !important;
            padding: 1.5rem !important;
          }
          .grid { gap: 1rem !important; }
          mb-10, .mb-10 { margin-bottom: 0.5rem !important; }
        }
      `}</style>
      
      <main className="py-12 px-6 mx-auto max-w-7xl">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 text-pretty no-print">
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

        <div className="mb-20 no-print">
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

        <div className="space-y-8 no-print">
           <div className="flex items-center gap-4 mb-2">
              <div className="h-0.5 flex-1 bg-slate-200/60" />
              <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-400 shrink-0">Executive AI Performance Report</h2>
              <div className="h-0.5 flex-1 bg-slate-200/60" />
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                 <div className="bg-white rounded-2xl p-8 border border-slate-200/60 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-12 translate-x-12 blur-3xl group-hover:bg-emerald-500/10 transition-colors" />
                    <div className="flex items-center gap-3 mb-6">
                       <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                       </div>
                       <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">Core Strengths</h3>
                    </div>
                    <ul className="space-y-4">
                       {(interview.overallFeedback?.strengths || []).map((s, i) => (
                         <li key={i} className="flex gap-3 text-sm font-semibold text-slate-600 leading-snug">
                            <span className="text-emerald-500 mt-0.5">•</span> {s}
                         </li>
                       ))}
                       {(!interview.overallFeedback?.strengths?.length) && (
                         <li className="text-xs text-slate-400 italic">No specific strengths highlighted for this session.</li>
                       )}
                    </ul>
                 </div>

                 <div className="bg-white rounded-2xl p-8 border border-slate-200/60 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -translate-y-12 translate-x-12 blur-3xl group-hover:bg-amber-500/10 transition-colors" />
                    <div className="flex items-center gap-3 mb-6">
                       <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                          <AlertCircle className="w-5 h-5 text-amber-600" />
                       </div>
                       <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">Growth Opportunities</h3>
                    </div>
                    <ul className="space-y-4">
                       {(interview.overallFeedback?.improvements || []).map((imp, i) => (
                         <li key={i} className="flex gap-3 text-sm font-semibold text-slate-600 leading-snug">
                            <span className="text-amber-500 mt-0.5">•</span> {imp}
                         </li>
                       ))}
                       {(!interview.overallFeedback?.improvements?.length) && (
                         <li className="text-xs text-slate-400 italic">No specific improvements suggested for this session.</li>
                       )}
                    </ul>
                 </div>
              </div>
              
              <div className="bg-white rounded-2xl p-10 lg:p-12 text-slate-900 relative overflow-hidden shadow-sm border border-slate-200/60 flex flex-col items-center justify-center text-center">
                 <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
                 <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
                 
                 <div className="relative z-10 w-full">
                    <div className="flex items-center justify-center gap-3 mb-8">
                       <div className="w-12 h-12 rounded-2xl bg-accent/5 flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-accent" />
                       </div>
                       <div className="text-left">
                          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-accent">Career Coach Analysis</h3>
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Llama-3.3 Intelligence Report</p>
                       </div>
                    </div>

                    <div className="prose prose-slate max-w-none">
                       <p className="text-lg text-slate-600 font-medium leading-relaxed italic mb-10 text-pretty">
                         "{interview.overallFeedback?.suggestion || "Based on your session metrics, you demonstrate a solid foundation. Focus on structural clarity and technical depth in your upcoming practice cycles."}"
                       </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                       <Button onClick={() => navigate('/interview/setup')} className="h-14 px-10 rounded-xl bg-accent text-white hover:bg-accent/90 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-accent/20 transition-all hover:scale-105 active:scale-95">
                          Launch Next Assessment
                       </Button>
                    </div>
                 </div>
              </div>
           </div>
        </div>

      </main>
    </div>
  )
}

