"use client"

import { motion } from "framer-motion"
import { Check, X } from "lucide-react"

const comparisons = [
  { feature: "AI Structural Feedback", us: true, them: false },
  { feature: "Live Coding Workspace", us: true, them: false },
  { feature: "Company Specific Personas", us: true, them: false },
  { feature: "Resume Intelligence", us: true, them: false },
  { feature: "Granular Performance Reports", us: true, them: false },
  { feature: "Basic Q&A Tracking", us: true, them: true },
]

export function ComparisonTable() {
  return (
    <section className="py-24 relative bg-background">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Why InterviewIQ?</h2>
          <p className="text-muted-foreground text-lg">We don't just ask questions. We simulate the entire interview.</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-white/10 overflow-hidden bg-white/[0.02]"
        >
          <div className="grid grid-cols-3 bg-white/5 border-b border-white/10">
            <div className="p-6 font-semibold text-gray-300">Features</div>
            <div className="p-6 font-bold text-center text-primary bg-primary/10">InterviewIQ</div>
            <div className="p-6 font-semibold text-center text-gray-500">Traditional Prep</div>
          </div>
          
          <div className="divide-y divide-white/5">
            {comparisons.map((row, i) => (
              <div key={i} className="grid grid-cols-3 hover:bg-white/[0.02] transition-colors">
                <div className="p-6 flex items-center text-sm md:text-base text-gray-300">
                  {row.feature}
                </div>
                <div className="p-6 flex items-center justify-center bg-primary/5">
                  {row.us ? <Check className="w-6 h-6 text-emerald-400" /> : <X className="w-6 h-6 text-red-500/50" />}
                </div>
                <div className="p-6 flex items-center justify-center">
                  {row.them ? <Check className="w-6 h-6 text-emerald-400" /> : <X className="w-6 h-6 text-gray-700" />}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
