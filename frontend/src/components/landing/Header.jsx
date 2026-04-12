import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Button } from '../ui/Button'

const NAV_ITEMS = ['Features', 'How It Works', 'Testimonials', 'Pricing']

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-background/60 backdrop-blur-xl border-b border-border/60 shadow-[0_1px_24px_hsl(var(--background)/0.8)]'
            : 'bg-background/80 backdrop-blur-md border-b border-border'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

          {/* Logo — text only, no icon */}
          <a href="/">
            <span className="text-xl font-extrabold tracking-tighter">
              INTERVIEW<span className="text-accent">IQ</span>
            </span>
          </a>

          {/* Desktop nav — plain links, original size */}
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_ITEMS.map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setActive(item)}
                className={`text-sm transition-colors duration-200 ${
                  active === item
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-4 md:flex">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              Sign In
            </Button>
            <Button
              size="sm"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Get Started
            </Button>
          </div>

          {/* Hamburger */}
          <button
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary/60 text-muted-foreground transition-colors hover:text-foreground md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? 'close' : 'open'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed left-4 right-4 top-[4.5rem] z-40 rounded-2xl border border-border bg-background/95 p-4 shadow-2xl backdrop-blur-xl md:hidden"
          >
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item, i) => (
                <motion.a
                  key={item}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => { setActive(item); setOpen(false) }}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {item}
                </motion.a>
              ))}
            </nav>

            <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
              <Button variant="outline" size="sm" className="w-full justify-center">
                Sign In
              </Button>
              <Button
                size="sm"
                className="w-full justify-center bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Get Started
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}