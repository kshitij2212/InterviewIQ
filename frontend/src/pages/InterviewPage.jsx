import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  Mic, StopCircle, RotateCcw, Send, ChevronLeft, ChevronRight, 
  Settings, Clock, AlertCircle, CheckCircle2, Info, Lightbulb, 
  Brain, User, Ghost, Loader2, MoreVertical, XCircle, FastForward,
  Sparkles, Waves
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { interviewApi } from '../api/interview'
import { Button } from '../components/ui/Button'

const QUESTION_TIME_LIMIT = 120 

export default function InterviewPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [bootstrapping, setBootstrapping] = useState(true)
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [interviewData, setInterviewData] = useState(null)
  
  const [status, setStatus] = useState('idle')
  const [transcript, setTranscript] = useState('')
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT)
  
  const timerRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const autoSubmitPendingRef = useRef(false)

  useEffect(() => {
    refreshSessionState()
  }, [id])

  async function refreshSessionState() {
    try {
      setLoading(true)
      const { data } = await interviewApi.getInterviewSession(id)
      setInterviewData(data.data)
      setTimeLeft(QUESTION_TIME_LIMIT)
      setBootstrapping(false)
    } catch (err) {
      console.error(err)
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!bootstrapping && timeLeft > 0 && !analyzing) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeOut()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [bootstrapping, timeLeft, analyzing])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        await performTranscription(audioBlob)
        stream.getTracks().forEach(t => t.stop())
      }

      mediaRecorder.start()
      setStatus('recording')
      setTranscript('')
    } catch (err) {
      console.error('Mic Access Denied:', err)
      alert('Microphone access is required for the interview.')
    }
  }

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && status === 'recording') {
      mediaRecorderRef.current.stop()
      setStatus('processing')
    }
  }

  const performTranscription = async (blob) => {
    try {
      const { data } = await interviewApi.transcribe(blob)
      const text = data.data.transcript
      setTranscript(text)
      
      if (autoSubmitPendingRef.current) {
        autoSubmitPendingRef.current = false
        await finalizeAnswer(text)
      } else {
        setStatus('reviewing')
      }
    } catch (err) {
      console.error(err)
      setTranscript("Warning: High latency detected. Please retry recording.")
      setStatus('reviewing')
      autoSubmitPendingRef.current = false
    }
  }

  const handleTimeOut = () => {
    if (status === 'recording') {
      autoSubmitPendingRef.current = true
      handleStopRecording()
    } else if (status === 'reviewing' && transcript) {
      finalizeAnswer(transcript)
    } else {
      handleSkipQuestion()
    }
  }

  const handleSkipQuestion = async () => {
    setAnalyzing(true)
    try {
      await interviewApi.submitAnswer(id, {
        status: 'skipped',
        duration: QUESTION_TIME_LIMIT - timeLeft
      })
      await refreshSessionState()
      setStatus('idle')
      setTranscript('')
    } catch (err) {
      console.error(err)
    } finally {
      setAnalyzing(false)
    }
  }

  const finalizeAnswer = async (textToSubmit) => {
    const finalTranscript = textToSubmit || transcript
    if (!finalTranscript && status !== 'idle') return

    setAnalyzing(true)
    try {
      const { data } = await interviewApi.submitAnswer(id, {
        transcript: finalTranscript,
        duration: QUESTION_TIME_LIMIT - timeLeft,
        status: finalTranscript ? 'submitted' : 'skipped'
      })
      
      if (data.data.isLastQuestion) {
        await interviewApi.complete(id)
        navigate(`/interview/${id}/results`) 
      } else {
        setTranscript('')
        setStatus('idle')
        await refreshSessionState()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setAnalyzing(false)
    }
  }

  if (bootstrapping) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-accent animate-spin" />
      </div>
    )
  }

  const { interview, answers, currentQuestion } = interviewData

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-accent/30 text-foreground overflow-x-hidden">
      
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border h-16 flex items-center px-6">
        <div className="mx-auto w-full max-w-7xl flex items-center justify-between">
          <Link to="/" className="text-xl font-extrabold tracking-tighter hover:opacity-80 transition-opacity uppercase">
             INTERVIEW<span className="text-accent">IQ</span>
          </Link>
          
          <div className="flex items-center gap-4">
               <div className={`flex items-center gap-3 px-5 py-2 rounded-lg border transition-all ${
                 timeLeft < 30 ? 'bg-red-500/10 border-red-500/50 text-red-500 animate-pulse' : 'bg-secondary/60 border-border text-foreground font-bold shadow-sm'
               }`}>
                 <Clock className={`w-4 h-4 ${timeLeft < 30 ? 'text-red-500' : 'text-accent'}`} />
                 <span className="text-sm tracking-tighter tabular-nums">{formatTime(timeLeft)}</span>
               </div>
               
               <Button 
                size="sm"
                className="bg-red-500 hover:bg-red-600 text-white font-bold h-10 px-8 rounded-lg uppercase tracking-widest text-[10px] shadow-lg shadow-red-500/20"
                onClick={() => navigate('/dashboard')}
               >
                 End Session
               </Button>
          </div>
        </div>
      </header>

      <main className="mt-16 flex-1 max-w-7xl mx-auto w-full p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        
        <div className="flex flex-col gap-8">
          
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
              {currentQuestion?.question.text}
            </h2>

            <div className="flex flex-wrap gap-2">
              {currentQuestion?.question.expectedKeywords?.slice(0, 4).map(tag => (
                <span key={tag} className="text-[11px] font-bold text-muted-foreground bg-secondary px-3 py-1.5 rounded-md border border-border hover:border-accent/40 transition-colors">
                  {tag.toUpperCase()}
                </span>
              ))}
            </div>
          </motion.div>

          <div className="bg-card rounded-3xl p-8 lg:p-12 border border-border shadow-sm flex flex-col items-center justify-center min-h-[420px] relative">
            <AnimatePresence mode="wait">
              {status === 'idle' && !transcript && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center text-center"
                >
                  <button 
                    onClick={handleStartRecording}
                    className="w-24 h-24 rounded-3xl bg-accent flex items-center justify-center shadow-xl shadow-accent/30 hover:scale-105 active:scale-95 transition-all group"
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

          <div className="flex justify-center">
             <div className="flex items-center gap-2">
              {[...Array(interview.questionIds.length)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    i === currentQuestion?.index ? 'w-8 bg-accent shadow-[0_0_12px_rgba(var(--accent-rgb),0.5)]' : 
                    i < currentQuestion?.index ? 'bg-indigo-300' : 'bg-muted border border-border'
                  }`} 
                />
              ))}
            </div>
          </div>

        </div>

        <aside className="hidden lg:flex flex-col gap-6">
          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
            <h3 className="font-black text-[10px] tracking-widest uppercase text-muted-foreground mb-6">Session Completion</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-black text-foreground tracking-tighter">{(currentQuestion?.index || 0) + 1}</span>
              <span className="text-lg text-muted-foreground font-black">/ {interview.questionIds.length}</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-2">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(((currentQuestion?.index || 0) + 1) / interview.questionIds.length) * 100}%` }}
                className="h-full bg-accent" 
              />
            </div>
          </div>

          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm flex flex-col flex-1">
             <h3 className="font-black text-[10px] tracking-widest text-accent mb-8 uppercase">Session Timeline</h3>
             <div className="space-y-8 relative after:absolute after:top-0 after:bottom-0 after:left-[9px] after:w-px after:bg-border">
               {interview.questionIds.map((qId, i) => {
                 const answer = answers.find(a => {
                   const aId = typeof a.questionId === 'object' ? a.questionId._id : a.questionId
                   return aId === qId
                 })
                 const stepStatus = i < (currentQuestion?.index || 0) ? 'done' : i === (currentQuestion?.index || 0) ? 'curr' : 'next'
                 
                 return (
                   <div key={qId} className="flex gap-4 relative z-10">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                        stepStatus === 'done' ? 'bg-emerald-500 border-emerald-500 text-white' :
                        stepStatus === 'curr' ? 'bg-accent border-accent text-white shadow-lg shadow-accent/20 border-accent' :
                        'bg-background border-border text-muted-foreground'
                      }`}>
                         {stepStatus === 'done' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span className="text-[10px] font-black">{i + 1}</span>}
                      </div>
                      <div className="flex-1">
                        <p className={`text-xs font-black uppercase mb-1 ${stepStatus === 'next' ? 'text-muted-foreground/40' : 'text-foreground'}`}>
                          {stepStatus === 'done' ? `Score: ${answer?.score ?? 0}/10` : stepStatus === 'curr' ? 'Processing' : `Step ${i + 1}`}
                        </p>
                        <p className={`text-[10px] font-bold tracking-widest uppercase ${stepStatus === 'done' ? 'text-emerald-500' : stepStatus === 'curr' ? 'text-accent' : 'text-muted-foreground/40'}`}>
                          {stepStatus === 'done' ? (answer?.status || 'SUBMITTED') : stepStatus === 'curr' ? 'Active Q' : 'Queued'}
                        </p>
                      </div>
                   </div>
                 )
               })}
             </div>
          </div>
        </aside>
      </main>
      
      <AnimatePresence>
        {analyzing && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="relative mb-12">
               <motion.div 
                animate={{ scale: [1, 1.2, 1], rotate: 360 }} 
                transition={{ duration: 4, repeat: Infinity }}
                className="w-32 h-32 rounded-full border-2 border-dashed border-accent/20" 
               />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-3xl bg-accent shadow-[0_0_40px_rgba(var(--accent-rgb),0.4)] flex items-center justify-center">
                    <Brain className="w-8 h-8 text-white animate-pulse" />
                  </div>
               </div>
            </div>
            <h3 className="text-3xl font-black tracking-tighter mb-4 uppercase">System Syncing...</h3>
            <p className="text-muted-foreground max-sm font-medium">Please wait while InterviewIQ analyzes your response and prepares the next assessment module.</p>
            
            <div className="mt-12 w-full max-w-[200px] h-1 bg-secondary rounded-full overflow-hidden">
               <motion.div 
                animate={{ x: ['-100%', '100%'] }} 
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="w-1/2 h-full bg-accent" 
               />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
