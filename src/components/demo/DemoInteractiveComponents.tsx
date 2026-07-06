"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertTriangle, Bot, Play, SearchCode } from "lucide-react"
import dynamic from "next/dynamic"
const PerformanceRadarChart = dynamic(() => import("@/components/charts/RadarChartComponent").then(mod => mod.PerformanceRadarChart), { 
  ssr: false,
  loading: () => <div className="h-[250px] w-full bg-white/5 animate-pulse rounded-full" />
})

// Mock Dashboard
export function MockDashboard() {
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(0)
  const [hours, setHours] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      let s = 0, c = 0, h = 0
      const interval = setInterval(() => {
        if (s < 88) setScore(s += 2)
        if (c < 14) setCompleted(c += 1)
        if (h < 7) setHours(h += 1)
        if (s >= 88 && c >= 14 && h >= 7) clearInterval(interval)
      }, 50)
      return () => clearInterval(interval)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="grid grid-cols-2 gap-4 w-full h-full p-4">
      {[
        { label: "Avg Score", value: `${score}/100`, color: "text-green-400" },
        { label: "Completed", value: completed, color: "text-blue-400" },
        { label: "Time", value: `${hours}h 30m`, color: "text-purple-400" },
        { label: "Strengths", value: "System Design", color: "text-orange-400" }
      ].map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          viewport={{ once: true }}
        >
          <Card className="bg-black/40 border-white/10 h-full flex flex-col justify-center shadow-2xl backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-semibold">{stat.label}</div>
              <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

// Mock Resume Processor
export function MockResumeProcessor() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(s => (s < 3 ? s + 1 : 0))
    }, 3000) // Loop animation every 9 seconds
    return () => clearInterval(timer)
  }, [])

  return (
    <Card className="bg-[#0f1115] border-white/10 w-full overflow-hidden shadow-2xl relative">
      <CardHeader className="bg-black/40 border-b border-white/5 pb-4">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span className="font-mono text-gray-300">portfolio_resume_final.pdf</span>
          {step === 0 && <span className="text-blue-400 animate-pulse text-xs">Uploading...</span>}
          {step === 1 && <span className="text-purple-400 animate-pulse text-xs">Extracting...</span>}
          {step >= 2 && <span className="text-emerald-400 flex items-center gap-1 text-xs"><CheckCircle2 className="w-4 h-4" /> Parsed</span>}
        </CardTitle>
      </CardHeader>
      
      <div className="p-6 space-y-6 h-[280px]">
        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-emerald-400"
            animate={{ width: step === 0 ? "33%" : step === 1 ? "66%" : "100%" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </div>

        <AnimatePresence mode="popLayout">
          {step >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div>
                <h4 className="text-xs text-muted-foreground mb-3 uppercase tracking-wider font-semibold">Detected Skills</h4>
                <div className="flex gap-2 flex-wrap">
                  {['React', 'Node.js', 'PostgreSQL', 'AWS'].map((skill, i) => (
                    <motion.span 
                      key={skill}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 * i }}
                      className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium shadow-inner"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/10"
              >
                <h4 className="text-xs text-orange-400 mb-1 uppercase tracking-wider flex items-center gap-1 font-semibold">
                  <AlertTriangle className="w-3 h-3" /> Gap Analysis
                </h4>
                <p className="text-sm text-gray-300">No evidence of Redis or caching strategies found in recent roles.</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  )
}

// Mock AI Chat
export function MockAIChat() {
  const [messages, setMessages] = useState<{role: string, text: string}[]>([])
  
  useEffect(() => {
    const sequence = async () => {
      setMessages([])
      await new Promise(r => setTimeout(r, 1000))
      setMessages([{ role: 'ai', text: "Welcome! Let's discuss your experience with React state management." }])
      
      await new Promise(r => setTimeout(r, 2000))
      setMessages(m => [...m, { role: 'user', text: "Sure, I primarily use React Context and Zustand." }])
      
      await new Promise(r => setTimeout(r, 1000))
      setMessages(m => [...m, { role: 'ai', text: "typing" }])
      
      await new Promise(r => setTimeout(r, 1500))
      setMessages(m => {
        const nm = [...m]
        nm[nm.length - 1] = { role: 'ai', text: "Interesting. When would you choose Zustand over standard Context API for performance?" }
        return nm
      })
    }
    
    sequence()
    const interval = setInterval(sequence, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="bg-[#0f1115] border-white/10 w-full shadow-2xl h-[320px] flex flex-col">
      <div className="p-4 border-b border-white/5 flex gap-3 items-center bg-black/40">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <Bot className="w-5 h-5 text-primary" />
        </div>
        <div>
          <div className="text-sm font-bold text-gray-100">Senior Staff Engineer</div>
          <div className="text-xs text-primary flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Listening...
          </div>
        </div>
      </div>
      <div className="p-4 flex-1 overflow-hidden space-y-4 relative flex flex-col justify-end pb-6">
        <AnimatePresence mode="popLayout">
          {messages.map((m, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'ml-auto justify-end' : ''}`}
            >
              {m.role === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center mt-1 border border-primary/30">
                  <Bot className="w-3.5 h-3.5 text-primary" />
                </div>
              )}
              <div className={`p-3 text-sm shadow-md ${m.role === 'user' 
                ? 'bg-blue-600 border border-blue-500 rounded-2xl rounded-tr-sm text-white' 
                : 'bg-white/10 border border-white/10 rounded-2xl rounded-tl-sm text-gray-200'}`}>
                {m.text === 'typing' ? (
                  <span className="flex gap-1 items-center h-5">
                    <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.4 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full"/>
                    <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.2 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full"/>
                    <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.4 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full"/>
                  </span>
                ) : m.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Card>
  )
}

// Mock Coding Editor
export function MockCodingEditor() {
  const [isRunning, setIsRunning] = useState(false)
  
  useEffect(() => {
    const loop = () => {
      setIsRunning(true)
      setTimeout(() => setIsRunning(false), 2000)
    }
    const interval = setInterval(loop, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-[#1e1e1e] rounded-xl border border-white/10 w-full overflow-hidden shadow-2xl h-[320px] flex flex-col">
      <div className="flex justify-between items-center bg-[#2d2d2d] p-2.5 border-b border-black">
        <div className="flex gap-2 items-center px-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          <span className="ml-3 text-xs text-gray-400 font-mono tracking-wide">solution.js</span>
        </div>
        <Button size="sm" className="h-6 text-xs bg-[#4CAF50] hover:bg-[#45a049] text-white border-none gap-1.5 px-3 rounded shadow">
          {isRunning ? <SearchCode className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3 fill-current" />} 
          {isRunning ? "Analyzing" : "Run"}
        </Button>
      </div>
      <div className="p-4 text-[13px] font-mono leading-relaxed text-gray-300 flex-1 bg-[#1e1e1e]">
        <div className="flex"><span className="w-8 text-gray-600 select-none">1</span><span className="text-[#c678dd]">function</span> <span className="text-[#61afef]">twoSum</span>(nums, target) {'{'}</div>
        <div className="flex"><span className="w-8 text-gray-600 select-none">2</span><span className="pl-4 text-[#5c6370] italic">{"// Using a hash map for O(n) complexity"}</span></div>
        <div className="flex"><span className="w-8 text-gray-600 select-none">3</span><span className="pl-4 text-[#c678dd]">const</span> <span className="text-[#e5c07b]">map</span> <span className="text-[#56b6c2]">=</span> <span className="text-[#c678dd]">new</span> <span className="text-[#e5c07b]">Map</span>();</div>
        <div className="flex"><span className="w-8 text-gray-600 select-none">4</span><span className="pl-4 text-[#c678dd]">for</span> (<span className="text-[#c678dd]">let</span> i <span className="text-[#56b6c2]">=</span> <span className="text-[#d19a66]">0</span>; i <span className="text-[#56b6c2]">&lt;</span> nums.<span className="text-[#e06c75]">length</span>; i<span className="text-[#56b6c2]">++</span>) {'{'}</div>
        <div className="flex"><span className="w-8 text-gray-600 select-none">5</span><span className="pl-8 text-[#5c6370]">...</span></div>
        <div className="flex"><span className="w-8 text-gray-600 select-none">6</span><span className="pl-4">{'}'}</span></div>
        <div className="flex"><span className="w-8 text-gray-600 select-none">7</span>{'}'}</div>
      </div>
      <div className="bg-[#111] border-t border-[#333] p-3 h-[50px] flex items-center">
        <AnimatePresence mode="wait">
          {!isRunning ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs font-mono text-[#98c379] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4"/> AI Analysis: O(N) Time, O(N) Space. Optimal approach.
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs font-mono text-[#61afef] flex items-center gap-2">
               Running static analysis and test cases...
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Mock Radar Chart
export function MockRadarChart() {
  const [key, setKey] = useState(0)

  // Re-render chart periodically to trigger its entrance animation
  useEffect(() => {
    const interval = setInterval(() => {
      setKey(k => k + 1)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="bg-black/40 border-white/10 p-4 h-[320px] w-full flex flex-col shadow-2xl backdrop-blur-sm">
       <h3 className="text-sm font-semibold mb-2 text-center text-gray-200">Performance Vectors</h3>
       <div className="flex-1 min-h-0 w-full" key={key}>
         <PerformanceRadarChart data={[
           { subject: 'Technical', score: 90, fullMark: 100 },
           { subject: 'Communication', score: 85, fullMark: 100 },
           { subject: 'Problem Solving', score: 95, fullMark: 100 },
           { subject: 'Experience', score: 80, fullMark: 100 },
           { subject: 'Culture Fit', score: 88, fullMark: 100 },
         ]} />
       </div>
    </Card>
  )
}
