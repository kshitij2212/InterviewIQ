import { motion } from 'framer-motion'
import Header from '../components/landing/Header'
import Footer from '../components/landing/Footer'

export default function PrivacyPage() {
  const sections = [
    {
      title: 'Information We Collect',
      content: 'We collect information you provide directly to us, such as when you create an account, participate in an interview, or communicate with us. This may include your name, email address, password, professional background, and interview responses.'
    },
    {
      title: 'How We Use Your Information',
      content: 'We use the information we collect to provide, maintain, and improve our services, including to facilitate AI-driven mock interviews, generate feedback, and personalize your experience. We also use information to communicate with you about products, services, and events.'
    },
    {
      title: 'AI Analysis & Data Processing',
      content: 'Our platform uses artificial intelligence to analyze your interview performance. The data processed includes your voice/text responses and technical keywords. This data is used solely for the purpose of provide you with actionable insights and is not sold to third parties.'
    },
    {
      title: 'Data Security',
      content: 'We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.'
    },
    {
      title: 'Your Choices',
      content: 'You may update or correct your account information at any time by logging into your account or by contacting us. You also have the right to request the deletion of your personal data.'
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
              Privacy <span className="text-accent">Policy</span>
            </h1>
            <p className="text-muted-foreground mb-12 font-medium">
              Last updated: April 20, 2026 • Your trust is our most valuable asset.
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
                      0{index + 1}
                    </span>
                    {section.title}
                  </h2>
                  <div className="pl-11">
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
              <h3 className="font-bold text-slate-900 mb-2">Have questions about your privacy?</h3>
              <p className="text-sm text-slate-500 mb-6">Our team is here to help you understand how we protect your data.</p>
              <a 
                href="mailto:kshitijsaxenaofficial@gmail.com" 
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-accent transition-all hover:shadow-lg hover:shadow-accent/20 active:scale-95"
              >
                Contact Privacy Team
              </a>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
