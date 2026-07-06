"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "Do I need to download any software?",
    answer: "No. The entire experience, including the interactive coding workspace, runs directly in your browser. There is nothing to install."
  },
  {
    question: "How accurate is the AI feedback?",
    answer: "Our AI models are specifically fine-tuned on thousands of real technical interview rubrics from top-tier tech companies. The feedback closely mimics what an actual hiring committee would note regarding your structural approach, time complexity, and communication clarity."
  },
  {
    question: "Can I practice system design questions?",
    answer: "Yes. Our AI handles conversational system design interviews, asking follow-up questions about scalability, tradeoffs, and architectural decisions based on your initial responses."
  },
  {
    question: "Is my resume data kept private?",
    answer: "Absolutely. Your resume is parsed strictly for generating your mock interview context. We do not sell or share your personal data with third parties."
  },
  {
    question: "Does it support multiple programming languages?",
    answer: "Yes, our Monaco-powered coding workspace supports syntax highlighting and AI analysis for over 15 popular programming languages including Python, JavaScript, Java, C++, and Go."
  }
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-24 max-w-3xl mx-auto px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-white/10 bg-white/[0.02] rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-expanded={openIndex === i}
            >
              <span className="font-medium text-lg text-gray-200">{faq.question}</span>
              <ChevronDown 
                className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} 
              />
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="px-6 pb-4 text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  )
}
