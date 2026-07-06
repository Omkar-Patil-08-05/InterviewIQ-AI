"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Bot, Code2, LineChart, FileText, Briefcase, BarChart3 } from "lucide-react"

const features = [
  {
    icon: <Bot className="w-6 h-6 text-primary" />,
    title: "Realistic AI Personas",
    description: "Interview with AI trained on thousands of real technical interviews from top tech companies.",
    bg: "bg-primary/20",
    border: "hover:border-primary/50",
    shadow: "hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]"
  },
  {
    icon: <FileText className="w-6 h-6 text-emerald-400" />,
    title: "Resume Intelligence",
    description: "Upload your PDF. We instantly parse your experience and tailor every question to your background.",
    bg: "bg-emerald-500/20",
    border: "hover:border-emerald-500/50",
    shadow: "hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]"
  },
  {
    icon: <Code2 className="w-6 h-6 text-orange-400" />,
    title: "Live Coding Workspace",
    description: "Write and execute real code in our integrated Monaco editor during your technical rounds.",
    bg: "bg-orange-500/20",
    border: "hover:border-orange-500/50",
    shadow: "hover:shadow-[0_0_30px_rgba(249,115,22,0.15)]"
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-rose-400" />,
    title: "Deep AI Reports",
    description: "Get a comprehensive scorecard with hiring recommendations and granular performance vectors.",
    bg: "bg-rose-500/20",
    border: "hover:border-rose-500/50",
    shadow: "hover:shadow-[0_0_30px_rgba(244,63,94,0.15)]"
  },
  {
    icon: <Briefcase className="w-6 h-6 text-indigo-400" />,
    title: "Company Specific",
    description: "Practice for Google, Amazon, Meta, or top Indian IT firms with tailored interview templates.",
    bg: "bg-indigo-500/20",
    border: "hover:border-indigo-500/50",
    shadow: "hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]"
  },
  {
    icon: <LineChart className="w-6 h-6 text-purple-400" />,
    title: "Progress Tracking",
    description: "Visualize your improvement over time with detailed analytics and category breakdowns.",
    bg: "bg-purple-500/20",
    border: "hover:border-purple-500/50",
    shadow: "hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]"
  }
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
}

export function FeatureShowcase() {
  return (
    <section className="py-24 relative max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary">succeed.</span></h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A complete end-to-end platform designed to simulate real-world technical interviews with unmatched realism.
        </p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {features.map((feature, i) => (
          <motion.div key={i} variants={item}>
            <Card className={`h-full bg-white/5 border-white/10 transition-all duration-300 group cursor-default ${feature.border} ${feature.shadow}`}>
              <CardHeader>
                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-400 group-hover:text-gray-300 transition-colors">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
