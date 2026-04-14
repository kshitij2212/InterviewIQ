import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { interviewApi } from '../api/interview'
import InterviewCard from '../components/interview/InterviewCard'
import { BarChart2, Loader2 } from 'lucide-react'

export default function HistoryPage() {
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  const [interviews, setInterviews] = useState([])
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    if (!isAuthenticated) { navigate('/'); return }
    interviewApi.getHistory({ limit: 50 })
      .then(res => setInterviews(res.data.data.interviews || []))
      .catch(err => console.error('Failed to load history', err))
      .finally(() => setLoading(false))
  }, [isAuthenticated, navigate])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 text-accent animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen px-8 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-slate-900 uppercase">Interview History</h1>
          <p className="text-sm text-muted-foreground mt-1">{interviews.length} total sessions</p>
        </div>
        <button
          onClick={() => navigate('/interview/setup')}
          className="flex items-center gap-2 rounded-2xl bg-accent px-6 h-11 text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-accent/20 transition-all active:scale-95 hover:bg-accent/90"
        >
          + New Interview
        </button>
      </div>

      {interviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-16 h-16 bg-accent/5 rounded-[2rem] flex items-center justify-center mb-6 border border-accent/10">
            <BarChart2 className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-xl font-black tracking-tighter text-slate-900 uppercase mb-3">No Sessions Yet</h2>
          <p className="text-muted-foreground text-sm max-w-sm mb-8">
            Complete your first mock interview to see your history here.
          </p>
          <button
            onClick={() => navigate('/interview/setup')}
            className="bg-accent text-white h-12 px-8 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-accent/20 hover:bg-accent/90 transition-all"
          >
            Start First Interview
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">All Practice Sessions</h3>
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
                  <th className="px-8 py-5 text-center">Duration</th>
                  <th className="px-8 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {interviews.map(session => (
                  <InterviewCard key={session._id} session={session} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
