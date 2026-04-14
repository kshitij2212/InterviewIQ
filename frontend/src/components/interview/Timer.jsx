import React from 'react'
import { Clock } from 'lucide-react'

export default function Timer({ timeLeft }) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className={`flex items-center gap-3 px-5 py-2 rounded-lg border transition-all ${
      timeLeft < 30 ? 'bg-red-500/10 border-red-500/50 text-red-500 animate-pulse' : 'bg-secondary/60 border-border text-foreground font-bold shadow-sm'
    }`}>
      <Clock className={`w-4 h-4 ${timeLeft < 30 ? 'text-red-500' : 'text-accent'}`} />
      <span className="text-sm tracking-tighter tabular-nums">{formatTime(timeLeft)}</span>
    </div>
  )
}
