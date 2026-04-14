import React from 'react'
import { Clock, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function scoreStyle(score) {
  if (score >= 9) return 'bg-emerald-50 text-emerald-600'
  if (score >= 8) return 'bg-indigo-50 text-indigo-600'
  if (score >= 5) return 'bg-violet-50 text-violet-600'
  return 'bg-slate-50 text-slate-500'
}

function getDuration(start, end) {
  if (!start || !end) return '-'
  const diff = new Date(end) - new Date(start)
  if (diff < 0) return '-'
  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return '< 1m'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}m ${secs}s`
}

export default function InterviewCard({ session }) {
  const navigate = useNavigate()

  return (
    <tr className="group hover:bg-slate-50/50 transition-colors">
      <td className="px-8 py-6">
         <div className="font-black text-sm text-slate-900 uppercase tracking-tight">{session.role}</div>
      </td>
      <td className="px-8 py-6">
         <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest bg-slate-100/50 px-2.5 py-1 rounded inline-block border border-slate-200/50">
            {session.level}
         </div>
      </td>
      <td className="px-8 py-6 text-center">
         <div className={`inline-flex items-center px-4 py-2 rounded-xl font-black text-xs ${scoreStyle(session.overallScore)}`}>
            {(session.overallScore || 0).toFixed(1)} / 10
         </div>
      </td>
      <td className="px-8 py-6">
         <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-700">
               {new Date(session.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
               <Clock className="w-3 h-3" />
               {new Date(session.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
         </div>
      </td>
      <td className="px-8 py-6 text-center">
         <span className="text-xs font-bold text-slate-500 bg-slate-100/50 px-3 py-1.5 rounded-lg border border-slate-200/50 tracking-tighter">
            {getDuration(session.createdAt, session.updatedAt)}
         </span>
      </td>
      <td className="px-8 py-6 text-right">
         <button 
            onClick={() => navigate(`/interview/${session._id}/results`)}
            className="p-3 rounded-2xl text-slate-300 hover:text-accent hover:bg-accent/5 transition-all group-hover:translate-x-1"
         >
            <ChevronRight className="w-5 h-5" />
         </button>
      </td>
    </tr>
  )
}
