import { motion } from 'framer-motion'
import Header from '../components/landing/Header'
import Footer from '../components/landing/Footer'

export default function TermsPage() {
  const sections = [
    {
      title: 'Acceptance of Terms',
      content: 'By accessing or using InterviewIQ, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our services. We reserve the right to modify these terms at any time.'
    },
    {
      title: 'User Eligibility & Accounts',
      content: 'To use InterviewIQ, you must be at least 18 years old or the age of legal majority in your jurisdiction. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.'
    },
    {
      title: 'Use of Services & Pro Features',
      content: 'InterviewIQ provides AI-driven interview simulation tools. Certain advanced roles, difficulty levels, and session lengths are restricted to "Pro" tier subscribers. You agree not to misuse our services or attempt to circumvent feature gating.'
    },
    {
      title: 'Intellectual Property',
      content: 'All content, features, and functionality on InterviewIQ, including text, graphics, logos, and AI-generated insights, are the exclusive property of InterviewIQ and its licensors. You may not reproduce or distribute any part of the service without permission.'
    },
    {
      title: 'Limitation of Liability',
      content: 'InterviewIQ is provided "as is" without any warranties. We are not liable for any damages arising out of your use of the service or for the success or failure of your actual job interviews. The AI feedback is for preparation purposes only.'
    },
    {
      title: 'Termination',
      content: 'We reserve the right to suspend or terminate your account at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users or our business interests.'
    }
  ]

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/20">
      <Header />
      
      <main className="pt-32 pb-20 px-6">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-slate-900 uppercase">
              Terms of <span className="text-accent">Service</span>
            </h1>
            <p className="text-muted-foreground mb-12 font-medium">
              Last updated: April 20, 2026 • Please read these terms carefully.
            </p>

            <div className="space-y-12">
              {sections.map((section, index) => (
                <motion.section
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-3 text-slate-800 transition-colors group-hover:text-accent">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/5 text-accent text-sm font-black transition-colors group-hover:bg-accent group-hover:text-white">
                      {index + 1}
                    </span>
                    {section.title}
                  </h2>
                  <div className="pl-11 border-l border-slate-100 ml-4 group-hover:border-accent/30 transition-colors">
                    <p className="text-slate-600 leading-relaxed font-medium">
                      {section.content}
                    </p>
                  </div>
                </motion.section>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-20 p-8 rounded-3xl bg-slate-50 border border-slate-100 text-center"
            >
              <h3 className="font-bold text-slate-900 mb-2">Questions regarding our terms?</h3>
              <p className="text-sm text-slate-500 mb-6">If you have any questions or concerns, please reach out to us.</p>
              <a 
                href="mailto:kshitijsaxenaofficial@gmail.com" 
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-accent transition-all hover:shadow-lg hover:shadow-accent/20 active:scale-95"
              >
                Contact Support Team
              </a>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
