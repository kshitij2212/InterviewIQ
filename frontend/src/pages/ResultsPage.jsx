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

export default function ResultsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  const handleExport = () => {
    window.print()
  }

  useEffect(() => {
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
  }, [id])

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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          
          <div className="lg:col-span-4 bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm flex flex-col items-center">
             <h3 className="w-full text-[10px] font-black tracking-widest text-slate-400 uppercase mb-8">Composite Score</h3>
             <div className="relative flex items-center justify-center mb-8">
                <svg className="w-48 h-48 -rotate-90">
                  <circle className="text-slate-100" strokeWidth="12" stroke="currentColor" fill="transparent" r="85" cx="96" cy="96" />
                  <motion.circle 
                    initial={{ strokeDashoffset: 534 }}
                    animate={{ strokeDashoffset: 534 - (534 * (averageScore * 10)) / 100 }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="text-accent" strokeWidth="12" strokeDasharray="534" strokeLinecap="round" stroke="currentColor" fill="transparent" r="85" cx="96" cy="96" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <span className="text-6xl font-black text-slate-900 tracking-tighter">{averageScore}</span>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">avg score</span>
                </div>
             </div>
             <div className={`w-full ${perfStatus.color} px-4 py-2 rounded-xl text-center text-[10px] font-black uppercase tracking-widest border`}>
                Performance: {perfStatus.label}
             </div>
          </div>

          <div className="lg:col-span-8 bg-white rounded-[2.5rem] p-10 border border-slate-200/60 shadow-sm">
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h3 className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Intelligence Infographic</h3>
                  <p className="text-xs text-muted-foreground mt-1 font-bold">Comprehensive Cross-Metric Analysis</p>
               </div>
               <BarChart3 className="w-5 h-5 text-accent/30" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {[
                 { label: 'Technical Accuracy', val: avgTechnical, color: 'text-accent', bg: 'bg-accent/5', icon: Sparkles },
                 { label: 'Communication', val: avgCommunication, color: 'text-indigo-500', bg: 'bg-indigo-50', icon: MessageSquare },
                 { label: 'Keyword Velocity', val: avgKeywords, color: 'text-emerald-500', bg: 'bg-emerald-50', icon: Zap },
                 { label: 'Confidence Index', val: avgConfidence, color: 'text-amber-500', bg: 'bg-amber-50', icon: TrendingUp },
               ].map(stat => {
                 const Icon = stat.icon
                 const verdict = stat.val >= 90 ? 'Expert' : stat.val >= 70 ? 'Proficient' : stat.val >= 50 ? 'Developing' : 'Initial'
                 
                 return (
                    <div key={stat.label} className="p-5 rounded-3xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 transition-all group overflow-hidden relative">
                       <div className="flex items-center justify-between mb-4">
                          <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                             <Icon className="w-4 h-4" />
                          </div>
                          <div className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${
                            verdict === 'Expert' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                            verdict === 'Proficient' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' :
                            'bg-slate-100 border-slate-200 text-slate-400'
                          }`}>
                             {verdict}
                          </div>
                       </div>
                       
                       <div className="space-y-3">
                          <div className="flex items-baseline justify-between">
                             <span className="text-[11px] font-black uppercase text-slate-400 tracking-tight">{stat.label}</span>
                             <span className={`text-lg font-black tracking-tighter ${stat.color}`}>{stat.val}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-200/40 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }} 
                               animate={{ width: `${stat.val}%` }} 
                               transition={{ duration: 1, ease: "easeOut" }}
                               className={`h-full ${stat.color.replace('text', 'bg')} shadow-[0_0_10px_rgba(var(--accent-rgb),0.2)]`} 
                             />
                          </div>
                       </div>
                    </div>
                 )
               })}
            </div>
          </div>
        </div>

        <div className="mb-20">
           <div className="flex items-center justify-between mb-10 px-2">
              <div>
                 <h2 className="text-2xl font-black tracking-tighter text-slate-900 uppercase">Assessment Deep Dive</h2>
                 <p className="text-[10px] text-muted-foreground font-black mt-1 uppercase tracking-[0.2em] opacity-40">Granular Answer Analysis</p>
              </div>
           </div>

           <div className="space-y-6">
              {answers.map((ans, idx) => (
                <QuestionItem key={ans.id || idx} answer={ans} index={idx} />
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

function QuestionItem({ answer, index }) {
  const [isOpen, setIsOpen] = useState(index === 0)
  
  const questionTitle = answer.questionId?.text || answer.questionText || "Active Assessment Question"
  const transcript = answer.transcript || "Skipped: No response recorded for this module."
  const strengths = answer.feedback?.strengths || []
  const improvements = answer.feedback?.improvements || []
  const isSubmitted = answer.status === 'submitted'

  return (
    <div className={`bg-white rounded-[2rem] border transition-all duration-300 ${isOpen ? 'border-accent/30 shadow-xl shadow-accent/5' : 'border-slate-200/60 shadow-sm hover:border-slate-300'}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-6 lg:p-8 flex items-center justify-between gap-6 focus:outline-none"
      >
        <div className="flex items-center gap-6 flex-1 min-w-0">
           <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all font-black text-xs ${
             isOpen ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-slate-100 text-slate-400'
           }`}>
             {String(index + 1).padStart(2, '0')}
           </div>
           <div className="flex-1 min-w-0">
             <h4 className={`text-lg font-extrabold tracking-tight transition-colors duration-300 truncate ${isOpen ? 'text-slate-900' : 'text-slate-500'}`}>
               {questionTitle}
             </h4>
             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 px-2 py-0.5 rounded-md">
                STATUS : {answer.status.toUpperCase()}
             </span>
           </div>
        </div>
        
        <div className="flex items-center gap-4">
           {isSubmitted && (
             <div className={`flex flex-col items-end px-4 py-2 rounded-xl font-black text-xs border ${
               answer.score >= 8 ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 
               answer.score >= 5 ? 'bg-amber-50 border-amber-100 text-amber-600' :
               'bg-slate-50 border-slate-100 text-slate-400'
             }`}>
                <span className="text-[8px] opacity-40 uppercase mb-0.5 tracking-widest">SCORE</span>
                {answer.score !== null ? `${answer.score}/10` : '0/10'}
             </div>
           )}
           <ChevronLeft className={`w-5 h-5 text-slate-300 transition-transform duration-300 ${isOpen ? 'rotate-90' : '-rotate-90'}`} />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-8 pb-8 space-y-6"
          >
            <div className="h-px bg-slate-50" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
               <div className="space-y-4">
                  <h5 className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                     <User className="w-3 h-3" /> Transcribed Response
                  </h5>
                  <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 text-sm leading-relaxed text-slate-600 font-semibold italic">
                    "{transcript}"
                  </div>
               </div>

               {isSubmitted && (
                 <div className="space-y-4">
                    <h5 className="text-[9px] font-black uppercase tracking-widest text-accent flex items-center gap-2">
                       <Sparkles className="w-3.5 h-3.5" /> Performance AI Critique
                    </h5>
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-3">
                       {strengths.map((s, i) => (
                         <div key={i} className="flex items-start gap-3">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <p className="text-[12px] font-bold text-slate-700 leading-snug">{s}</p>
                         </div>
                       ))}
                       {improvements.map((imp, i) => (
                         <div key={i} className="flex items-start gap-3">
                            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-[12px] font-bold text-slate-700 leading-snug">{imp}</p>
                         </div>
                       ))}
                       {strengths.length === 0 && improvements.length === 0 && (
                         <p className="text-xs text-slate-400 italic">No specific critique generated for this assessment.</p>
                       )}
                    </div>
                 </div>
               )}
            </div>

            {isSubmitted && (answer.feedback?.suggestion || answer.questionId?.bestResponse) && (
              <div className="bg-accent/5 rounded-2xl p-6 border border-accent/10 relative overflow-hidden">
                 <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center">
                       <Sparkles className="w-4 h-4 text-accent" />
                    </div>
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-accent">AI Personalized Suggestion</h5>
                 </div>
                 <p className="text-[13px] font-semibold leading-relaxed text-slate-700 italic opacity-90">
                    "{answer.feedback?.suggestion || answer.questionId?.bestResponse}"
                 </p>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
               {(answer.questionId?.expectedKeywords || []).map(tag => (
                 <span key={tag} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-bold text-slate-400 tracking-widest uppercase">
                   #{tag}
                 </span>
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
