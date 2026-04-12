import { motion } from 'framer-motion'
import { ArrowRight, MessageSquare, Play, Zap } from 'lucide-react'
import { Button } from '../ui/Button'
import YouTube from '../../assets/youtube.png'
import linkedIn from '../../assets/linkedIn.png'
import airbnb from '../../assets/airbnb.png'
import spotify from '../../assets/spotify.png'
import meta from '../../assets/meta.png'
import apple from '../../assets/apple.png'

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
            <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto">
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              <Play className="mr-2 h-4 w-4" />
              Watch Demo
            </Button>
          </div>

          {/* Marquee */}
          <div className="mt-20">
            <p className="mb-8 text-center text-sm font-medium text-muted-foreground uppercase tracking-widest">
              Trusted by engineers at
            </p>

            {/* Wider marquee — full viewport width, break out of container */}
            <div className="relative left-1/2 -translate-x-1/2 w-screen overflow-hidden">
              {/* Fade edges */}
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
                    {/* Logo icon — full color, no grayscale */}
                    <div
                      className="h-10 w-10 flex-shrink-0 transition-transform duration-300 group-hover/logo:scale-110"
                    >
                      {company.svg}
                    </div>
                    {/* Company name — muted by default, brand color on hover */}
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

        {/* Mac Screen Mockup */}
        <div className="relative mx-auto mt-16 max-w-5xl">
          <div className="rounded-xl border border-border bg-card p-2 shadow-2xl shadow-accent/10">
            <div className="flex items-center gap-2 rounded-t-lg bg-secondary px-4 py-3">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <div className="ml-4 flex-1">
                <div className="mx-auto max-w-md rounded-md bg-background/50 px-4 py-1.5 text-center text-xs text-muted-foreground">
                  app.interviewiq.ai
                </div>
              </div>
            </div>

            <div className="rounded-b-lg bg-background p-6">
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-1">
                  <div className="rounded-lg border border-border bg-card p-4">
                    <h3 className="mb-3 text-sm font-semibold">Interview Progress</h3>
                    <div className="space-y-3">
                      {[['Arrays & Strings', 85], ['System Design', 60], ['Behavioral', 90]].map(([label, val]) => (
                        <div key={label}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-muted-foreground">{label}</span>
                            <span className="text-accent">{val}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-secondary">
                            <div className="h-2 rounded-full bg-accent" style={{ width: `${val}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-4">
                    <h3 className="mb-3 text-sm font-semibold">Upcoming Sessions</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="h-2 w-2 rounded-full bg-accent" />
                        Mock Interview - 2pm
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="h-2 w-2 rounded-full bg-accent/50" />
                        Code Review - 4pm
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 lg:col-span-2">
                  <div className="rounded-lg border border-border bg-card p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-semibold">AI Mock Interview</h3>
                      <span className="rounded-full bg-accent/20 px-3 py-1 text-xs text-accent">In Progress</span>
                    </div>
                    <div className="space-y-4">
                      <div className="rounded-lg bg-secondary p-4">
                        <p className="mb-2 text-sm font-medium">Question 3 of 5</p>
                        <p className="text-muted-foreground text-sm">Design a system that can handle 1 million concurrent users for a real-time chat application. Consider scalability, latency, and fault tolerance.</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center border border-accent/30">
                          <span className="text-accent font-bold text-sm">AI</span>
                        </div>
                        <div className="flex-1">
                          <div className="mb-1 text-sm font-medium">AI Interviewer</div>
                          <div className="text-sm text-muted-foreground">Take your time to think through this problem...</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-accent text-accent-foreground">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Respond
                        </Button>
                        <Button size="sm" variant="outline">Skip</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -left-4 -bottom-4 -z-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute -right-4 -top-4 -z-10 h-72 w-72 rounded-full bg-accent/5 blur-3xl" />
        </div>
      </div>
    </section>
  )
}