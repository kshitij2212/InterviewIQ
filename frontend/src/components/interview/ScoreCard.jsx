import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, MessageSquare, Zap, TrendingUp, BarChart3 } from 'lucide-react'

export default function ScoreCard({
  averageScore,
  perfStatus,
  avgTechnical,
  avgCommunication,
  avgKeywords,
  avgConfidence
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
      <div className="lg:col-span-4 bg-white rounded-2xl p-8 border border-slate-200/60 shadow-sm flex flex-col items-center">
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

      <div className="lg:col-span-8 bg-white rounded-2xl p-10 border border-slate-200/60 shadow-sm">
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
                <div key={stat.label} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 transition-all group overflow-hidden relative">
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
  )
}
