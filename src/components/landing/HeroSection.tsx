"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export function HeroSection({ hasUser }: { hasUser: boolean }) {
  const router = useRouter()

  const handleStartInterview = () => {
    if (hasUser) {
      router.push("/dashboard")
    } else {
      router.push("/sign-up")
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-6 pt-32 pb-24 relative z-10 flex flex-col items-center justify-center min-h-[85vh]">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // smooth spring-like easing
        className="text-center max-w-4xl mx-auto"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-muted-foreground mb-8 hover:bg-white/10 transition-colors shadow-lg"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
          </span>
          Next-gen AI Interview Prep
        </motion.div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-8 leading-[1.05]">
          Master your next <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-primary to-purple-500 animate-gradient-x">
            technical interview.
          </span>
        </h1>
        
        <p className="text-lg md:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto">
          Realistic, AI-driven mock interviews tailored to your resume. Get real-time feedback, track your progress, and land your dream tech job with confidence.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              size="lg" 
              onClick={handleStartInterview}
              className="w-full sm:w-auto gap-3 h-14 px-10 text-lg bg-primary hover:bg-primary/90 text-white rounded-full shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:shadow-[0_0_60px_rgba(59,130,246,0.6)] transition-all group border border-primary/50"
            >
              Start Free Interview 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => router.push('/demo')}
              className="w-full sm:w-auto h-14 px-10 text-lg rounded-full glass-panel hover:bg-white/10 border-white/20 transition-all shadow-lg"
            >
              View Interactive Demo
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </main>
  )
}
