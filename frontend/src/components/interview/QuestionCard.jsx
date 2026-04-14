import React from 'react'
import { motion } from 'framer-motion'

export default function QuestionCard({ currentQuestion }) {
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
      </div>

      <h2 className="text-2xl lg:text-3xl font-extrabold text-foreground leading-tight mb-8 tracking-tight">
        {currentQuestion?.question?.text}
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
