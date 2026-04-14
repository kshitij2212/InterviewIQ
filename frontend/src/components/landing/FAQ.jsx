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
    question: "Is InterviewIQ suitable for beginners?",
    answer: "Yes. You can start with entry-level interviews, and the system will generate questions based on your selected role, level, and specialization. As you improve, you can switch to higher difficulty levels."
  },
  {
    question: "How does the interview system work?",
    answer: "Once you start an interview, a set of questions is generated based on your role and level. You answer them one by one, and each response is evaluated instantly with a score and detailed feedback."
  },
  {
    question: "How accurate is the AI feedback?",
    answer: "The AI evaluates your answers based on expected keywords, content quality, and communication. It provides strengths, improvement areas, and a breakdown score so you know exactly where to improve."
  },
  {
    question: "Can I skip questions or submit later?",
    answer: "Yes. You can skip questions or submit incomplete answers. However, only submitted answers are considered for scoring and final feedback."
  },
  {
    question: "What happens after I complete an interview?",
    answer: "You get an overall score along with combined feedback from all your answers, including key strengths and areas to improve."
  },
  {
    question: "Are there different types of interviews available?",
    answer: "Yes! You can choose between Technical (Coding & System Design) and HR (Behavioral & Culture Fit) interviews. You can further tailor sessions by selecting your target role (e.g., Frontend, Backend, AI/ML) and difficulty level (Fresher, Junior, or Senior)."
  },
  {
    question: "Can I review my past interview sessions?",
    answer: "Absolutely. All your completed mock interviews—including the questions, your answers, and the detailed AI feedback—are saved in your history so you can track your progress over time."
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
