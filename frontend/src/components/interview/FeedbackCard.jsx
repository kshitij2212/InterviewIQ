import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, CheckCircle2, AlertCircle, Sparkles, User } from 'lucide-react'

export default function FeedbackCard({ answer, index }) {
  const [isOpen, setIsOpen] = useState(index === 0)
  
  const questionTitle = answer.questionId?.text || answer.questionText || "Active Assessment Question"
  const transcript = answer.transcript || "Skipped: No response recorded for this module."
  const strengths = answer.feedback?.strengths || []
  const improvements = answer.feedback?.improvements || []
  const isSubmitted = answer.status === 'submitted'

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-300 ${isOpen ? 'border-accent/30 shadow-xl shadow-accent/5' : 'border-slate-200/60 shadow-sm hover:border-slate-300'}`}>
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

            {isSubmitted && answer.feedback?.suggestion && (
              <div className="bg-accent/5 rounded-2xl p-6 border border-accent/10 relative overflow-hidden mb-4">
                 <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center">
                       <Sparkles className="w-4 h-4 text-accent" />
                    </div>
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-accent">AI Personalized Suggestion</h5>
                 </div>
                 <p className="text-[13px] font-semibold leading-relaxed text-slate-700 italic opacity-90">
                    "{answer.feedback.suggestion}"
                 </p>
              </div>
            )}

            {answer.questionId?.bestResponse && (
              <div className="bg-emerald-500/5 rounded-2xl p-6 border border-emerald-500/10 relative overflow-hidden">
                 <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                       <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Ideal 10/10 Answer</h5>
                 </div>
                 <p className="text-[13px] font-semibold leading-relaxed text-slate-700 italic opacity-90">
                    "{answer.questionId.bestResponse}"
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
