import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Activity, Server, ShieldCheck } from 'lucide-react';

const POLL_INTERVAL_MS = 4000;

const loadingSteps = [
  { text: "Waking up server", icon: Server },
  { text: "Initializing AI engine", icon: Sparkles },
  { text: "Establishing secure connection", icon: ShieldCheck },
  { text: "Preparing workspace", icon: Activity },
];

export default function StartupLoader({ onReady }) {
  const [progress, setProgress] = useState(0);
  const [serverReady, setServerReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (serverReady) return;
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % loadingSteps.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [serverReady]);

  useEffect(() => {
    let prog = 0;
    const interval = setInterval(() => {
      prog += (90 - prog) * 0.05;
      if (prog > 89.5) prog = 90;
      setProgress(prog);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      try {
        const rawUrl = import.meta.env.VITE_API_URL;
        if (!rawUrl || rawUrl === 'undefined') {
           setServerReady(true);
           return;
        }
        const baseUrl = rawUrl || 'http://localhost:4000/api/v1';
        const rootUrl = baseUrl.replace('/api/v1', '/');
        
        if (rootUrl && rootUrl !== 'undefined/') {
           await fetch(rootUrl, { mode: 'no-cors' });
        }
        if (!cancelled) {
          setServerReady(true);
        }
      } catch (err) {
        if (!cancelled) setTimeout(check, POLL_INTERVAL_MS);
      }
    };
    check();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (serverReady) {
      if (!isVisible) {
        onReady();
      } else {
        setProgress(100);
        setStepIndex(loadingSteps.length - 1);
        const timer = setTimeout(() => {
          onReady();
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [serverReady, isVisible, onReady]);

  if (!isVisible) return null;

  const CurrentIcon = loadingSteps[stepIndex].icon;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/40 to-white z-[9999] overflow-hidden font-sans"
    >
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-200/30 blur-[100px] pointer-events-none" 
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-300/20 blur-[100px] pointer-events-none" 
      />

      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative flex flex-col items-center px-8 py-12 rounded-[2.5rem] bg-white/60 backdrop-blur-3xl shadow-[0_20px_60px_-15px_rgba(37,99,235,0.15)] border border-white/80 max-w-[420px] w-[90%] text-center overflow-hidden group"
      >

        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-70 group-hover:opacity-100 transition-opacity">
          <motion.div 
            className="absolute inset-0 bg-white/60"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-[1.5px] border-blue-200/40 border-t-accent"
          />

          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
            className="absolute inset-3 rounded-full border border-blue-200/50 border-b-blue-500"
          />

          <motion.div 
            animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-8 rounded-full bg-gradient-to-tr from-blue-400 to-accent shadow-[0_0_30px_rgba(37,99,235,0.4)] flex items-center justify-center"
          >
             <Sparkles className="w-5 h-5 text-white absolute" />
          </motion.div>
        </div>

        <div className="mb-6">
          <span className="text-2xl font-extrabold tracking-tighter uppercase text-slate-800 drop-shadow-sm">
            INTERVIEW<span className="text-accent">IQ</span>
          </span>
        </div>

        <div className="h-16 flex flex-col items-center justify-center mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={stepIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="flex items-center gap-2 text-slate-800 font-bold text-lg tracking-tight">
                <CurrentIcon className="w-5 h-5 text-accent" />
                <span>{loadingSteps[stepIndex].text}</span>
              </div>
              <p className="text-slate-500 text-sm font-medium">Starting in less than 1 minute...</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="w-full h-[6px] bg-slate-100 rounded-full overflow-hidden mb-6 relative shadow-inner">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-accent rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-slate-400/80 text-[13px] font-medium px-2">
          Render free-tier servers sleep when idle. Hang tight, This loading only happens once!
        </p>

      </motion.div>
    </motion.div>
  );
}