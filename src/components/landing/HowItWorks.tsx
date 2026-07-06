"use client"

import { motion } from "framer-motion"
import { FileUp, UserCircle, MessageSquare, BrainCircuit, LineChart } from "lucide-react"

const steps = [
  {
    icon: <FileUp className="w-5 h-5" />,
    title: "Upload Resume",
    description: "Start by uploading your latest PDF resume."
  },
  {
    icon: <UserCircle className="w-5 h-5" />,
    title: "Generate Profile",
    description: "AI extracts your skills, experience, and gaps."
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: "Take Mock Interview",
    description: "Engage in a realistic AI voice/text session."
  },
  {
    icon: <BrainCircuit className="w-5 h-5" />,
    title: "Receive AI Feedback",
    description: "Get instant structural and technical review."
  },
  {
    icon: <LineChart className="w-5 h-5" />,
    title: "Track Progress",
    description: "Watch your hireability score grow over time."
  }
]

export function HowItWorks() {
  return (
    <section className="py-24 relative bg-black/20 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">How It Works</h2>
          <p className="text-muted-foreground">From upload to offer in 5 simple steps.</p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2" />
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-2xl bg-background border border-white/10 flex items-center justify-center mb-6 relative z-10 group-hover:border-primary/50 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all">
                  <div className="text-muted-foreground group-hover:text-primary transition-colors">
                    {step.icon}
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
