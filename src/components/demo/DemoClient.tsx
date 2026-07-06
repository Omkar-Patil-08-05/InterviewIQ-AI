"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { PublicNavbar, NavbarUser } from "@/components/landing/PublicNavbar"
import { FinalCTA } from "@/components/landing/FinalCTA"
import { MockDashboard, MockResumeProcessor, MockAIChat, MockCodingEditor, MockRadarChart } from "./DemoInteractiveComponents"

interface DemoClientProps {
  user: NavbarUser | null
}

export function DemoClient({ user }: DemoClientProps) {
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95])

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30">
      {/* Background glowing effects */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <PublicNavbar user={user} />

      <main className="relative z-10">
        {/* Hero */}
        <motion.div style={{ opacity, scale }} className="text-center space-y-6 pt-32 pb-24 max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-4">
            Interactive Product Tour
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter">
            Inside <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary">InterviewIQ</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Take a deep dive into our platform. See how AI-driven interviews, real-time coding environments, and granular analytics transform your interview prep.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto px-6 space-y-32 pb-32">
          {/* Section 1: Dashboard */}
          <Section 
            title="Unified Dashboard Overview"
            description="Track your performance across all sessions in one unified view. See your average scores, time practicing, and top strengths at a glance. Identify trends and focus your prep where it matters most."
            visual={<MockDashboard />}
          />

          {/* Section 2: Resume Intelligence */}
          <Section 
            title="Resume Intelligence & Gap Analysis"
            description="Upload your PDF resume and let our AI instantly parse it. We analyze your experience, identify your core competencies, and tailor every mock interview question strictly to your background."
            visual={<MockResumeProcessor />}
            reverse
          />

          {/* Section 3: AI Interview */}
          <Section 
            title="Immersive AI Interview Personas"
            description="Chat with an AI interviewer modeled after top tech recruiters. It asks dynamic, adaptive follow-up questions and evaluates your behavioral and technical responses in real-time."
            visual={<MockAIChat />}
          />

          {/* Section 4: Coding Workspace */}
          <Section 
            title="Integrated Live Coding Engine"
            description="Don't just talk about code—write it. Our built-in Monaco editor supports syntax highlighting and runs your solutions against an AI structural reviewer to analyze time and space complexity instantly."
            visual={<MockCodingEditor />}
            reverse
          />

          {/* Section 5: AI Reports */}
          <Section 
            title="Deep Performance Reports"
            description="After every session, receive a comprehensive scorecard. We break down your performance across multiple vectors—Technical, Communication, Culture Fit—and give you a definitive hiring recommendation."
            visual={<MockRadarChart />}
          />
        </div>

        <FinalCTA hasUser={!!user} />
      </main>
    </div>
  )
}

function Section({ 
  title, description, visual, reverse = false 
}: { 
  title: string, description: string, visual: React.ReactNode, reverse?: boolean 
}) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-150px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 lg:gap-24`}
    >
      <div className="flex-1 space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
      <div className="flex-1 w-full max-w-[500px] flex justify-center">
        {visual}
      </div>
    </motion.section>
  )
}
