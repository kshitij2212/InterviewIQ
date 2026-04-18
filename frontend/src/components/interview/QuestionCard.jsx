import React, { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'

const SPEEDS = [
  { label: 'Slow', rate: 0.5 },
  { label: 'Normal', rate: 0.85 },
  { label: 'Fast', rate: 1.1 },
]

export default function QuestionCard({ currentQuestion, onQuestionSpeak, ttsEnabled, isSpeaking, onStopSpeaking }) {
  const text = currentQuestion?.question?.text
  const index = currentQuestion?.index
  const [rate, setRate] = useState(0.85)
  const hasSpokenRef = useRef(-1)

  useEffect(() => {
    if (text && onQuestionSpeak && ttsEnabled && hasSpokenRef.current !== index) {
      onQuestionSpeak(text, rate)
      hasSpokenRef.current = index
    }
  }, [text, index, onQuestionSpeak, ttsEnabled, rate])

  const handleRecite = () => {
    if (text && onQuestionSpeak) {
      onQuestionSpeak(text, rate)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      key={currentQuestion?.index}
      className="bg-card rounded-2xl p-8 lg:p-10 border border-border shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden"
    >
      <div className="flex items-center gap-2 mb-8">
        <span className="text-[10px] font-black text-accent tracking-[0.2em] uppercase bg-accent/5 px-2.5 py-1 rounded border border-accent/10">
          ACTIVE QUESTION {(currentQuestion?.index || 0) + 1}
        </span>
        <div className="h-px flex-1 bg-border/60" />

        <div className="flex items-center gap-1 bg-secondary/60 rounded-lg p-1 border border-border/50">
          {SPEEDS.map(s => (
            <button
              key={s.label}
              onClick={() => setRate(s.rate)}
              disabled={isSpeaking}
              className={`text-[10px] font-bold px-2 py-1 rounded-md transition-all ${
                rate === s.rate
                  ? 'bg-accent text-accent-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              onStopSpeaking?.()
            }}
            className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground hover:text-red-500 bg-secondary/50 px-2.5 py-1.5 rounded-lg border border-border/50 hover:border-red-500/30 transition-all uppercase tracking-wide"
            title="Stop reading aloud"
          >
            <VolumeX size={13} />
            Stop
          </button>
          <button
            onClick={handleRecite}
            disabled={isSpeaking}
            className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground hover:text-accent bg-secondary/50 px-2.5 py-1.5 rounded-lg border border-border/50 hover:border-accent/30 transition-all uppercase tracking-wide disabled:opacity-40 disabled:cursor-not-allowed"
            title="Read question aloud"
          >
            <Volume2 size={13} />
            Recite
          </button>
        </div>
      </div>

      <h2 className="text-2xl lg:text-3xl font-extrabold text-foreground leading-tight mb-8 tracking-tight">
        {text}
      </h2>

      <div className="flex flex-wrap gap-2">
        {currentQuestion?.question?.expectedKeywords?.slice(0, 4).map(tag => (
          <span key={tag} className="text-[11px] font-bold text-muted-foreground bg-secondary px-3 py-1.5 rounded-md border border-border hover:border-accent/40 transition-colors">
            {tag.toUpperCase()}
          </span>
        ))}
      </div>
    </motion.div>
  )
}
