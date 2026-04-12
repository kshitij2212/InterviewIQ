import { Link } from 'react-router-dom'

export default function DashboardFooter() {
  return (
    <footer className="mt-20 border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="flex-1">
             <Link to="/" className="text-lg font-black tracking-tighter hover:opacity-80 transition-opacity uppercase text-slate-900 leading-none">
                INTERVIEW<span className="text-accent">IQ</span>
             </Link>
          </div>

          <div className="flex-none text-center">
             <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
               © 2026 • THE FUTURE OF CAREER INTELLIGENCE
             </p>
          </div>

          <div className="flex-1 flex justify-end items-center gap-8">
             <Link to="/help" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-accent transition-colors">Help</Link>
             <Link to="/settings" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-accent transition-colors">Privacy</Link>
             <Link to="/settings" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-accent transition-colors">Terms</Link>
          </div>

        </div>
      </div>
    </footer>
  )
}
