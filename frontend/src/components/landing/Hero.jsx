import { motion } from 'framer-motion'
import { ArrowRight, MessageSquare, Play, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'
import { useAuthStore } from '../../store/authStore'
import YouTube from '../../assets/youtube.png'
import linkedIn from '../../assets/linkedIn.png'
import airbnb from '../../assets/airbnb.png'
import spotify from '../../assets/spotify.png'
import meta from '../../assets/meta.png'
import apple from '../../assets/apple.png'
import dashboardMockup from '../../assets/mac.png'

const COMPANY_LOGOS = [
  {
    name: 'Google',
    color: '#4285F4',
    svg: (
      <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      </svg>
    )
  },
  {
    name: 'Meta',
    color: '#0082FB',
    svg: (
      <img src={meta} alt="Meta" />
    )
  },
  {
    name: 'Spotify',
    color: '#1DB954',
    svg: (
      <img src={spotify} alt="Spotify" />
    )
  },
  {
    name: 'Apple',
    color: '#555555',
    svg: (
      <img src={apple} alt="Apple" />
    )
  },
  {
    name: 'Airbnb',
    color: '#FF5A5F',
    svg: (
      <img src={airbnb} alt="Airbnb" />
    )
  },
  {
    name: 'Microsoft',
    color: '#00A4EF',
    svg: (
      <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="22" height="22" fill="#F35325"/>
        <rect x="25" y="1" width="22" height="22" fill="#81BC06"/>
        <rect x="1" y="25" width="22" height="22" fill="#05A6F0"/>
        <rect x="25" y="25" width="22" height="22" fill="#FFBA08"/>
      </svg>
    )
  },
  {
    name: 'YouTube',
    color: '#FF0000',
    svg: (
      <img src={YouTube} alt="YouTube" />
    )
  },
  {
    name: 'LinkedIn',
    color: '#0A66C2',
    svg: (
      <img src={linkedIn} alt="LinkedIn" />
    )
  },
]

export default function Hero() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()

  const handleStartTrial = () => {
    if (isAuthenticated) {
      navigate('/dashboard')
    } else {
      navigate('/login')
    }
  }

  return (
    <section className="relative overflow-hidden pt-32 pb-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm">
            <Zap className="h-4 w-4 text-accent" />
            <span>AI-Powered Interview Preparation</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-balance md:text-6xl lg:text-7xl">
            Ace Your Interview
            <span className="text-accent"> Land Your Dream Job</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground text-pretty md:text-xl">
            Practice with AI-powered mock interviews, get instant feedback, and land your dream job at top tech companies.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button 
                size="lg" 
                onClick={handleStartTrial}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="mt-20">
            <p className="mb-8 text-center text-sm font-medium text-muted-foreground uppercase tracking-widest">
              Trusted by engineers at
            </p>

            <div className="relative left-1/2 -translate-x-1/2 w-screen overflow-hidden">
              <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

              <motion.div
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
                className="flex whitespace-nowrap items-center py-4 gap-0"
                style={{ width: 'max-content' }}
              >
                {[...COMPANY_LOGOS, ...COMPANY_LOGOS].map((company, i) => (
                  <div
                    key={i}
                    className="inline-flex items-center gap-3 px-10 group/logo cursor-default"
                  >
                    <div
                      className="h-10 w-10 flex-shrink-0 transition-transform duration-300 group-hover/logo:scale-110"
                    >
                      {company.svg}
                    </div>
                    <span
                      className="text-lg font-bold tracking-tight text-muted-foreground/50 transition-colors duration-300"
                      style={{ '--brand': company.color }}
                      onMouseEnter={e => e.currentTarget.style.color = company.color}
                      onMouseLeave={e => e.currentTarget.style.color = ''}
                    >
                      {company.name}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}