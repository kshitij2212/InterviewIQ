import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '../components/landing/Header'
import Footer from '../components/landing/Footer'
import { Search, Rocket, Lock, CreditCard, LifeBuoy, ArrowRight, X } from 'lucide-react'

const categories = [
  {
    icon: <Rocket className="w-6 h-6" />,
    title: 'Getting Started',
    description: 'Learn the basics of using InterviewIQ and setting up your first mock interview.',
    links: ['Account Setup', 'Choosing a Role', 'Difficulty Levels']
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: 'Privacy & Security',
    description: 'How we handle your data, encryption, and account protection policies.',
    links: ['Data Processing', 'Account Security', 'Password Reset']
  },
  {
    icon: <CreditCard className="w-6 h-6" />,
    title: 'Billing & Plans',
    description: 'Information about our Pro tier, subscriptions, and payment methods.',
    links: ['Pro Features', 'Manage Subscription', 'Refund Policy']
  },
  {
    icon: <LifeBuoy className="w-6 h-6" />,
    title: 'Technical Support',
    description: 'Troubleshooting guide for voice recognition and platform issues.',
    links: ['Voice Setup', 'Browser Support', 'Report a Bug']
  }
]

export default function HelpPage() {
  const [query, setQuery] = useState('')
  const [liveChatOpen, setLiveChatOpen] = useState(false)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return categories

    return categories
      .map(cat => ({
        ...cat,
        links: cat.links.filter(link => link.toLowerCase().includes(q))
      }))
      .filter(
        cat =>
          cat.title.toLowerCase().includes(q) ||
          cat.description.toLowerCase().includes(q) ||
          cat.links.length > 0
      )
  }, [query])

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/20">
      <Header />

      <main className="pt-32 pb-20 px-6">
        <div className="mx-auto max-w-5xl">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-slate-900 uppercase">
              How can we <span className="text-accent">help?</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto font-medium">
              Search our help center or browse categories below to find answers to your questions.
            </p>

            <div className="mt-8 max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search for articles, guides, and more..."
                aria-label="Search help articles"
                className="w-full pl-12 pr-10 py-4 rounded-2xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all font-medium"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
            <AnimatePresence mode="popLayout">
              {filtered.length > 0 ? (
                filtered.map((cat, i) => (
                  <motion.div
                    key={cat.title}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="group p-8 rounded-3xl bg-white border border-slate-100 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5 transition-all"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-accent/5 text-accent flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-all">
                      {cat.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900">{cat.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">
                      {cat.description}
                    </p>
                    <ul className="space-y-3">
                      {cat.links.map(link => (
                        <li key={link}>
                          <button
                            onClick={() => console.log(`Navigate to: ${link}`)}
                            className="flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-accent transition-colors w-full text-left"
                          >
                            <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
                            {link}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="col-span-2 text-center py-20 text-slate-400"
                >
                  <Search className="w-10 h-10 mx-auto mb-4 opacity-30" />
                  <p className="font-semibold text-slate-500">No results for "{query}"</p>
                  <p className="text-sm mt-1">Try a different keyword or browse categories above.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="p-12 rounded-[2.5rem] bg-slate-50 border border-slate-100 text-slate-900 text-center relative overflow-hidden group shadow-sm hover:shadow-md transition-all"
          >
            <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <h2 className="text-3xl font-black tracking-tighter mb-4 uppercase">
                Still Have Questions?
              </h2>
              <p className="text-slate-500 mb-8 max-w-md mx-auto font-medium">
                Our support team is available 24/7 to help you with any issues you might be facing.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                
                   <a href="mailto:kshitijsaxenaofficial@gmail.com"
                  className="px-8 py-4 rounded-xl bg-slate-900 text-white font-black text-sm hover:bg-accent transition-all active:scale-95 shadow-lg shadow-accent/5"
                >
                  Email Support
                </a>
                <button
                  onClick={() => setLiveChatOpen(true)}
                  className="px-8 py-4 rounded-xl bg-white text-slate-900 font-black text-sm hover:bg-slate-50 transition-all border border-slate-200 active:scale-95 shadow-sm"
                >
                  Live Chat
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />

      <AnimatePresence>
        {liveChatOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLiveChatOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />

            <motion.div
              key="chat-panel"
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="fixed bottom-6 right-6 z-50 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
            >
              <div className="bg-slate-50 border-b border-slate-100 px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-slate-900 font-black text-sm">Live Chat</p>
                  <p className="text-slate-500 text-xs mt-0.5 font-medium">Typically replies in minutes</p>
                </div>
                <button
                  onClick={() => setLiveChatOpen(false)}
                  aria-label="Close chat"
                  className="text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 text-center">
                <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto mb-3">
                  <LifeBuoy className="w-6 h-6" />
                </div>
                <p className="text-slate-700 font-semibold text-sm mb-1">Support is offline</p>
                <p className="text-slate-400 text-xs mb-5 leading-relaxed">
                  Feature is in Testing Mode
                </p>
                
                  < a href="mailto:kshitijsaxenaofficial@gmail.com"
                  className="block w-full py-3 rounded-xl bg-slate-200 text-slate-400 font-black text-sm text-center cursor-not-allowed relative group"
                  onClick={e => e.preventDefault()}
                  aria-disabled="true"
                >
                  Start Chat
                  <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Feature in Testing
                  </span>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}