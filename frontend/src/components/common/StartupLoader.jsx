import { useEffect, useState } from 'react';

const POLL_INTERVAL_MS = 4000;

export default function StartupLoader({ onReady }) {
  const [phase, setPhase] = useState(0);
  const [fills, setFills] = useState([0, 0, 0]);
  const [serverReady, setServerReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let prog = 0;
    const interval = setInterval(() => {
      prog += 2;
      if (prog <= 100) setFills([prog, 0, 0]);
      if (prog === 102) setPhase(1);
      if (prog > 110 && prog <= 210) setFills([100, prog - 110, 0]);
      if (prog === 212) setPhase(2);
      if (prog > 220 && prog <= 320) setFills([100, 100, prog - 220]);
      if (prog >= 320) { setFills([100, 100, 100]); clearInterval(interval); }
    }, 60);
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
      } else if (fills[2] === 100) {
        onReady();
      }
    }
  }, [serverReady, isVisible, fills, onReady]);

  const isDone = serverReady && fills[2] === 100;

  const steps = [
    { text: 'Initializing your session', sub: 'Spinning up AI engine...' },
    { text: 'Loading question bank', sub: 'Fetching curated interview sets...' },
    { text: 'Almost ready!', sub: 'Finalizing your workspace...' },
  ];

  if (!isVisible) return null;

  const chipStyle = (i) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    fontSize: 11,
    padding: '4px 10px',
    borderRadius: 999,
    transition: 'all .4s',
    color: phase >= i ? '#1E75EB' : '#94a3b8',
    background: phase >= i ? '#EFF6FF' : '#f8fafc',
    border: `1px solid ${phase >= i ? '#bfdbfe' : '#e2e8f0'}`,
  });

  return (
    <div style={styles.overlay}>

      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <div style={styles.card}>

        <div style={styles.accentBar} />

        <div style={styles.brandRow}>
          <div style={styles.iconBox}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <span style={styles.brand}>InterviewIQ</span>
        </div>

        <div style={styles.orbWrap}>
          <div style={{ ...styles.ring, animationDelay: '0s' }} />
          <div style={{ ...styles.ring, animationDelay: '0.7s' }} />
          <div style={{ ...styles.ring, animationDelay: '1.4s' }} />
          <div style={styles.orb}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </div>
        </div>

        <div>
          <p style={styles.title}>
            {isDone ? "You're all set!" : steps[Math.min(phase, 2)].text}
          </p>
          <p style={styles.subtitle}>
            {isDone ? 'Redirecting to your interview...' : steps[Math.min(phase, 2)].sub}
          </p>
        </div>

        <div style={styles.chips}>
          {['AI Engine', 'Question Bank', 'Ready'].map((label, i) => (
            <div key={i} style={chipStyle(i)}>
              <span>{fills[i] === 100 ? '✓' : phase === i ? '✦' : '○'}</span>
              {label}
            </div>
          ))}
        </div>

        <div style={styles.segments}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={styles.segTrack}>
              <div style={{ ...styles.segFill, width: `${fills[i]}%` }} />
            </div>
          ))}
        </div>

        <div style={styles.noticeBox}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1E75EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span style={styles.noticeText}>
            Render's free server is waking up. This only happens once — <strong>future visits load instantly.</strong>
          </span>
        </div>

        <style>{`
          @keyframes ripple { 0% { transform: scale(.6); opacity: .5; } 100% { transform: scale(1.7); opacity: 0; } }
          @keyframes float1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(30px,-40px) scale(1.08); } }
          @keyframes float2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-25px,35px) scale(0.94); } }
          @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        `}</style>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    zIndex: 9999,
    fontFamily: "'Inter', sans-serif",
    overflow: 'hidden',
  },

  blob1: {
    position: 'absolute',
    top: '-20%',
    left: '-10%',
    width: '50%',
    height: '50%',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(30,117,235,0.18), transparent 70%)',
    filter: 'blur(80px)',
    pointerEvents: 'none',
    animation: 'float1 8s ease-in-out infinite',
  },
  blob2: {
    position: 'absolute',
    bottom: '-20%',
    right: '-10%',
    width: '50%',
    height: '50%',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(96,165,250,0.15), transparent 70%)',
    filter: 'blur(80px)',
    pointerEvents: 'none',
    animation: 'float2 10s ease-in-out infinite',
  },

  card: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.1rem',
    padding: '2.8rem 3rem',
    borderRadius: 20,
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05), 0 10px 20px rgba(0,0,0,0.08), 0 30px 50px rgba(0,0,0,0.10)',
    maxWidth: 400,
    width: '90%',
    textAlign: 'center',
    overflow: 'hidden',
  },
  accentBar: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 3,
    background: 'linear-gradient(90deg, #1E75EB, #60a5fa, #1E75EB)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 2s linear infinite',
  },
  brandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  iconBox: {
    width: 32, height: 32,
    borderRadius: 10,
    background: '#1E75EB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    fontSize: 11,
    fontWeight: 500,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '.14em',
  },
  orbWrap: {
    position: 'relative',
    width: 80, height: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    border: '2px solid #1E75EB',
    opacity: 0.25,
    animation: 'ripple 2s ease-out infinite',
  },
  orb: {
    width: 44, height: 44,
    borderRadius: '50%',
    background: '#1E75EB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    margin: '0 0 4px',
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#0B1120',
  },
  subtitle: {
    margin: 0,
    fontSize: '.82rem',
    color: '#64748B',
  },
  chips: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  segments: {
    width: '100%',
    display: 'flex',
    gap: 4,
  },
  segTrack: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    background: '#e2e8f0',
    overflow: 'hidden',
  },
  segFill: {
    height: '100%',
    background: '#1E75EB',
    borderRadius: 2,
    transition: 'width .6s ease',
  },
  noticeBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 7,
    background: '#EFF6FF',
    border: '1px solid #bfdbfe',
    borderRadius: 10,
    padding: '10px 14px',
    textAlign: 'left',
    width: '100%',
    boxSizing: 'border-box',
  },
  noticeText: {
    fontSize: '.72rem',
    color: '#1E40AF',
    lineHeight: 1.5,
  }
};