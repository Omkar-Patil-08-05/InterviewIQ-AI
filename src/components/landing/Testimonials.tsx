"use client"

import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Star } from "lucide-react"

const testimonials = [
  {
    quote: "The system design AI interviewer was remarkably realistic. It caught flaws in my load balancing explanation that even my peers missed. Landed my L5 offer last week.",
    role: "Senior Backend Engineer",
    company: "FinTech Startup"
  },
  {
    quote: "Being able to write code while the AI watches and provides structural feedback felt just like my actual Meta interview. It completely eliminated my interview anxiety.",
    role: "Frontend Developer",
    company: "E-Commerce Giant"
  },
  {
    quote: "The resume intelligence is magic. It identified a gap in my microservices experience and specifically drilled me on it during the mock. I was perfectly prepared.",
    role: "Full Stack Engineer",
    company: "SaaS Platform"
  }
]

export function Testimonials() {
  return (
    <section className="py-24 relative max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Loved by Engineers</h2>
        <p className="text-muted-foreground text-lg">Real results from professionals who used InterviewIQ to level up.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Card className="h-full bg-white/5 border-white/10 hover:border-primary/30 transition-colors">
              <CardContent className="p-8 flex flex-col h-full">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <blockquote className="text-gray-300 text-lg leading-relaxed flex-grow mb-6">
                  "{t.quote}"
                </blockquote>
                <div>
                  <div className="font-semibold text-white">{t.role}</div>
                  <div className="text-sm text-muted-foreground">{t.company}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
