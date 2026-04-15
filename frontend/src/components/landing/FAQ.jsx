import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const faqs = [
  {
    question: "What technology stack powers InterviewIQ?",
    answer: "InterviewIQ is built using a modern stack: React with Vite for a lightning-fast frontend, Node.js and Express for the robust backend, and MongoDB for scalable data management. Our AI features are powered by state-of-the-art Large Language Models via the Groq SDK."
  },
  {
    question: "How does the AI evaluate my technical responses?",
    answer: "Our system analyzes your answers for technical accuracy, key terminology, and conceptual depth. It compares your response against industry benchmarks and provides a score along with a suggested 'Ideal Answer' to help you bridge knowledge gaps."
  },
  {
    question: "Does InterviewIQ support specialized technical roles?",
    answer: "Yes, you can practice for specific roles including Frontend, Backend, Fullstack, AI/ML, DevOps, and Mobile Development. Each track features specialized questions that reflect current industry standards."
  },
  {
    question: "Can I practice System Design interviews?",
    answer: "Absolutely, we have dedicated System Design modules where the AI challenges you with scaling, high availability, and architectural trade-off questions specifically tailored for senior-level candidates."
  },
  {
    question: "How does the Text-to-Speech (TTS) feature enhance practice?",
    answer: "To simulate a real interview environment, our integrated TTS feature allows the AI to 'speak' questions to you. You can adjust the playback speed and voice settings to match your comfort level, making the session more immersive."
  },
  {
    question: "Is my session data and interview history secure?",
    answer: "Data privacy is our priority. Your interview sessions and profile data are encrypted and stored securely. We use industry-standard security protocols to ensure your practice remains private and accessible only to you."
  },
  {
    question: "How often is the interview content updated?",
    answer: "Our question engine is dynamic and context-aware. Instead of a static bank, it generates questions based on real-time industry trends and the specific role and level you select, ensuring you're always practicing with relevant material."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <p className="text-lg text-gray-600">
            Still have questions? Reach us at <a href="mailto:support@interviewiq.com" className="text-primary hover:underline font-medium">support@interviewiq.com</a>
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div 
                key={index}
                className={cn(
                  "border rounded-xl overflow-hidden transition-all duration-300",
                  isOpen 
                    ? "border-primary/50 bg-primary/5 shadow-sm" 
                    : "border-gray-200 bg-white hover:border-gray-300"
                )}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className={cn(
                    "text-lg font-medium transition-colors",
                    isOpen ? "text-primary" : "text-gray-900"
                  )}>
                    {faq.question}
                  </span>
                  <ChevronDown className={cn(
                    "w-5 h-5 transition-transform duration-300 flex-shrink-0",
                    isOpen ? "rotate-180 text-primary" : "text-gray-400"
                  )} />
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
