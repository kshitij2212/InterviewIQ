import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, RotateCcw, Send, Sparkles } from 'lucide-react'
import { Button } from '../ui/Button'

export default function AnswerRecorder({
  status,
  transcript,
  analyzing,
  handleStartRecording,
  handleStopRecording,
  handleSkipQuestion,
  finalizeAnswer,
  setTranscript,
  setStatus
}) {
  return (
    <div className="bg-card rounded-2xl p-8 lg:p-12 border border-border shadow-sm flex flex-col items-center justify-center min-h-[420px] relative">
      <AnimatePresence mode="wait">
        {status === 'idle' && !transcript && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center text-center"
          >
            <button 
              onClick={handleStartRecording}
              className="w-24 h-24 rounded-2xl bg-accent flex items-center justify-center shadow-xl shadow-accent/30 hover:scale-105 active:scale-95 transition-all group"
            >
              <Mic className="w-10 h-10 text-white group-hover:scale-110 transition-transform" />
            </button>
            <p className="mt-8 font-extrabold text-xl">Start Your Response</p>
            <p className="text-xs text-muted-foreground font-medium mt-2">Recording will be transcribed automatically</p>
            
            <button 
              onClick={handleSkipQuestion}
              className="mt-10 px-8 py-3 bg-secondary/80 border border-border text-[10px] font-black text-muted-foreground hover:text-accent hover:border-accent/40 tracking-[0.2em] uppercase transition-all rounded-xl shadow-sm hover:shadow-md active:scale-95 flex items-center gap-2"
            >
              Skip Question
            </button>
          </motion.div>
        )}

        {status === 'recording' && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center w-full"
          >
             <div className="flex items-center gap-3 mb-12 bg-red-500/10 px-4 py-2 rounded-full border border-red-500/20">
               <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.5)]" />
               <span className="text-[10px] font-black tracking-widest text-red-500 uppercase">Live Recording</span>
             </div>

             <div className="flex items-end justify-center gap-2 h-16 mb-12 w-full max-w-[300px]">
                {[...Array(15)].map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ height: [16, Math.random() * 60 + 20, 16] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.05 }}
                    className="w-1.5 bg-accent/40 rounded-full"
                  />
                ))}
             </div>
             
             <button 
              onClick={handleStopRecording}
              className="w-24 h-24 rounded-full bg-background border-4 border-accent relative flex items-center justify-center shadow-lg group hover:scale-105 transition-all"
             >
               <div className="w-8 h-8 rounded-lg bg-red-500" />
             </button>
          </motion.div>
        )}

        {status === 'processing' && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 rounded-full border-4 border-accent/20 border-t-accent animate-spin mb-8" />
            <p className="font-extrabold text-xl tracking-tight">AI Transcription Active</p>
            <p className="text-xs text-muted-foreground mt-2 uppercase tracking-widest font-black">Converting voice to data...</p>
          </motion.div>
        )}

        {status === 'reviewing' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="w-full flex flex-col items-center"
          >
             <div className="w-full max-w-3xl bg-secondary/40 border border-border rounded-2xl p-8 shadow-inner">
               <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black text-muted-foreground tracking-widest uppercase flex items-center gap-2">
                     <Sparkles className="w-3 h-3 text-accent" /> Generated Transcript
                  </span>
                  <span className="text-[10px] font-bold text-accent px-2 py-0.5 bg-accent/5 rounded uppercase tracking-widest">Whisper Optimized</span>
               </div>
               <p className="text-lg leading-relaxed text-foreground/90 font-medium selection:bg-accent/20 italic">
                  "{transcript}"
               </p>
             </div>
             
             <div className="grid grid-cols-2 gap-4 mt-8 w-full max-w-md">
               <Button 
                variant="outline" 
                className="h-14 font-black tracking-widest uppercase gap-3 text-muted-foreground rounded-xl border-border bg-background"
                onClick={() => { setTranscript(''); setStatus('idle'); }}
               >
                 <RotateCcw className="w-4 h-4" />
                 Retry
               </Button>
               <Button 
                className="h-14 font-black tracking-widest uppercase gap-3 rounded-xl bg-accent text-white shadow-lg shadow-accent/20"
                onClick={() => finalizeAnswer()}
                disabled={analyzing}
               >
                 <Send className="w-4 h-4" />
                 Confirm Answer
               </Button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
