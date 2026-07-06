"use client"

import { motion } from "framer-motion"
import { FileText, Briefcase, MessagesSquare, Code2, Layers } from "lucide-react"

interface ComponentBreakdownProps {
  scores: {
    resume: number;
    ats: number;
    interview: number;
    coding: number;
    skill: number;
  }
}

export function ComponentBreakdown({ scores }: ComponentBreakdownProps) {
  const components = [
    { label: "Resume Quality", score: scores.resume, icon: <FileText className="w-4 h-4" />, color: "bg-blue-500" },
    { label: "Average ATS Score", score: scores.ats, icon: <Briefcase className="w-4 h-4" />, color: "bg-purple-500" },
    { label: "Interview Performance", score: scores.interview, icon: <MessagesSquare className="w-4 h-4" />, color: "bg-green-500" },
    { label: "Coding Performance", score: scores.coding, icon: <Code2 className="w-4 h-4" />, color: "bg-orange-500" },
    { label: "Skill Coverage", score: scores.skill, icon: <Layers className="w-4 h-4" />, color: "bg-pink-500" },
  ]

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h3 className="font-semibold mb-6 flex items-center gap-2">
        <Layers className="w-4 h-4 text-primary" /> Component Breakdown (20% Each)
      </h3>
      <div className="space-y-6">
        {components.map((c, i) => (
          <div key={c.label}>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-muted-foreground">
                  {c.icon}
                </div>
                {c.label}
              </div>
              <span className="text-sm font-bold">{c.score}%</span>
            </div>
            <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${c.score}%` }}
                transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                className={`h-full ${c.color} rounded-full`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
