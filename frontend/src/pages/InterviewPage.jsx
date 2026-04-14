import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  Mic, StopCircle, RotateCcw, Send, ChevronLeft, ChevronRight, 
  Settings, Clock, AlertCircle, CheckCircle2, Info, Lightbulb, 
  Brain, User, Ghost, Loader2, MoreVertical, XCircle, FastForward,
  Sparkles, Waves, Volume2, VolumeX
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { interviewApi } from '../api/interview'
import { Button } from '../components/ui/Button'
import Timer from '../components/interview/Timer'
import QuestionCard from '../components/interview/QuestionCard'
import AnswerRecorder from '../components/interview/AnswerRecorder'
import { useAuthStore } from '../store/authStore'

const QUESTION_TIME_LIMIT = 120 

export default function InterviewPage() {
  const { isAuthenticated } = useAuthStore()
  const { id } = useParams()
  const navigate = useNavigate()

  const [bootstrapping, setBootstrapping] = useState(true)
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [interviewData, setInterviewData] = useState(null)
  const [sessionStarted, setSessionStarted] = useState(false)
  const [ttsEnabled, setTtsEnabled] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const [status, setStatus] = useState('idle')
  const [transcript, setTranscript] = useState('')
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT)
  
  const timerRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const autoSubmitPendingRef = useRef(false)

  const speak = (text, rate = 0.85) => {
    if (!text || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = rate

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    
    const attemptSpeak = () => {
      const voices = window.speechSynthesis.getVoices()
      if (voices.length === 0) return false

      // On Mac/Chrome, "Google US English" is the robotic one. 
      // "Samantha" or any voice NOT containing "Google" is usually the better system voice.
      const preferredVoice = 
        voices.find(v => v.name.includes('Samantha') && v.lang.startsWith('en')) ||
        voices.find(v => v.name.includes('Siri') && v.lang.startsWith('en')) ||
        voices.find(v => v.name.includes('Alex') && v.lang.startsWith('en')) ||
        voices.find(v => v.name.includes('Natural') && v.lang.startsWith('en')) ||
        // If we must use Google, try to avoid the base US one if others exist
        voices.find(v => v.lang.startsWith('en-US') && !v.name.includes('Google')) ||
        voices.find(v => v.lang.startsWith('en-US')) ||
        voices[0]

      if (preferredVoice) {
        utterance.voice = preferredVoice
      }
      
      window.speechSynthesis.speak(utterance)
      return true
    }

    if (!attemptSpeak()) {
      // If voices aren't loaded yet, wait for them
      window.speechSynthesis.onvoiceschanged = () => {
        attemptSpeak()
        window.speechSynthesis.onvoiceschanged = null // Only once
      }
    }
  }


  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
      return
    }
    refreshSessionState()
  }, [id, isAuthenticated, navigate])

  async function refreshSessionState(isSubsequent = false) {
    try {
      setLoading(true)
      const { data } = await interviewApi.getInterviewSession(id)
      setInterviewData(data.data)
      
      const qIndex = data.data.currentQuestion?.index
      if (qIndex !== undefined) {
        const storageKey = `interview_${id}_q_${qIndex}_startTime`
        const existingStartTime = localStorage.getItem(storageKey)
        
        let initialTimeLeft = QUESTION_TIME_LIMIT
        if (existingStartTime) {
          const elapsedSeconds = Math.floor((Date.now() - parseInt(existingStartTime, 10)) / 1000)
          initialTimeLeft = Math.max(0, QUESTION_TIME_LIMIT - elapsedSeconds)
        }
        setTimeLeft(initialTimeLeft)

        if (isSubsequent && !existingStartTime) {
          localStorage.setItem(storageKey, Date.now().toString())
        }
      } else {
        setTimeLeft(QUESTION_TIME_LIMIT)
      }
      
      setBootstrapping(false)
    } catch (err) {
      console.error(err)
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!bootstrapping && sessionStarted && timeLeft > 0 && !analyzing) {
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
  }, [bootstrapping, sessionStarted, timeLeft, analyzing])

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
      const { data } = await interviewApi.submitAnswer(id, {
        status: 'skipped',
        duration: QUESTION_TIME_LIMIT - timeLeft
      })

      if (data?.data?.isLastQuestion) {
        await interviewApi.complete(id)
        navigate(`/interview/${id}/results`)
      } else {
        await refreshSessionState(true)
        setStatus('idle')
        setTranscript('')
      }
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
        await refreshSessionState(true)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setAnalyzing(false)
    }
  }

  const handleEndSession = async () => {
    try {
      setAnalyzing(true)
      await interviewApi.submitAnswer(id, {
        transcript: transcript,
        duration: QUESTION_TIME_LIMIT - timeLeft,
        status: transcript ? 'submitted' : 'skipped'
      })
      await interviewApi.complete(id)
      navigate(`/interview/${id}/results`)
    } catch (err) {
      console.error(err)
      navigate('/dashboard')
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
  const handleStartSession = (enableAudio) => {
    const qIndex = currentQuestion?.index
    if (qIndex !== undefined) {
      const storageKey = `interview_${id}_q_${qIndex}_startTime`
      if (!localStorage.getItem(storageKey)) {
        localStorage.setItem(storageKey, Date.now().toString())
      }
    }
    setTtsEnabled(enableAudio)
    if (enableAudio) {
      speak(currentQuestion?.question?.text)
    }
    setSessionStarted(true)
  }

  if (!sessionStarted) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 px-4 text-center">
        <h1 className="text-3xl font-extrabold tracking-tighter text-foreground">Ready to begin?</h1>
        <p className="text-muted-foreground text-sm max-w-md">Would you like the AI interviewer to read the questions aloud automatically?</p>
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button
            onClick={() => handleStartSession(true)}
            className="flex items-center justify-center gap-2 bg-accent text-accent-foreground font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-accent/90 transition-all uppercase tracking-widest text-sm"
          >
            <Volume2 size={18} /> Yes, Read Aloud
          </button>
          <button
            onClick={() => handleStartSession(false)}
            className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground font-bold px-8 py-4 rounded-xl border border-border shadow-sm hover:bg-secondary/80 transition-all uppercase tracking-widest text-sm"
          >
            <VolumeX size={18} /> No, I'll Read
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-accent/30 text-foreground overflow-x-hidden">
      
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border h-16 flex items-center px-6">
        <div className="mx-auto w-full max-w-7xl flex items-center justify-between">
          <div className="text-xl font-extrabold tracking-tighter cursor-default uppercase">
             INTERVIEW<span className="text-accent">IQ</span>
          </div>
          
          <div className="flex items-center gap-4">
               <Timer timeLeft={timeLeft} />
               
               <Button 
                size="sm"
                className="bg-red-500 hover:bg-red-600 text-white font-bold h-10 px-8 rounded-lg uppercase tracking-widest text-[10px] shadow-lg shadow-red-500/20"
                onClick={handleEndSession}
               >
                 End Session
               </Button>
          </div>
        </div>
      </header>

      <main className="mt-16 flex-1 max-w-7xl mx-auto w-full p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        
        <div className="flex flex-col gap-8">
          
          <QuestionCard 
            currentQuestion={currentQuestion} 
            onQuestionSpeak={speak} 
            ttsEnabled={ttsEnabled} 
            isSpeaking={isSpeaking} 
            onStopSpeaking={() => setIsSpeaking(false)}
          />

          <AnswerRecorder 
            status={status} 
            transcript={transcript} 
            analyzing={analyzing} 
            handleStartRecording={handleStartRecording}
            handleStopRecording={handleStopRecording}
            handleSkipQuestion={handleSkipQuestion}
            finalizeAnswer={finalizeAnswer}
            setTranscript={setTranscript}
            setStatus={setStatus}
          />

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

        <aside className="hidden lg:flex flex-col gap-6 sticky top-24 self-start max-h-[calc(100vh-120px)]">
          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm shrink-0">
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

          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm flex flex-col min-h-0 overflow-hidden">
             <h3 className="font-black text-[10px] tracking-widest text-accent mb-8 uppercase shrink-0">Session Timeline</h3>
             <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-8 relative after:absolute after:top-0 after:bottom-0 after:left-[9px] after:w-px after:bg-border">
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
                        stepStatus === 'curr' ? 'bg-accent border-accent text-white shadow-lg shadow-accent/20' :
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
