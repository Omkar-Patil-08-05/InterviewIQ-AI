"use client"

import { motion } from "framer-motion"
import { Target, ArrowUpRight, TrendingUp } from "lucide-react"

interface TopScoreSectionProps {
  score: number;
  lastUpdated: Date;
}

export function TopScoreSection({ score, lastUpdated }: TopScoreSectionProps) {
  const getStatus = (s: number) => {
    if (s >= 85) return { label: "Excellent", color: "text-green-500", bg: "bg-green-500/10" };
    if (s >= 70) return { label: "Very Good", color: "text-blue-500", bg: "bg-blue-500/10" };
    if (s >= 50) return { label: "Needs Improvement", color: "text-yellow-500", bg: "bg-yellow-500/10" };
    return { label: "Critical Improvement Needed", color: "text-red-500", bg: "bg-red-500/10" };
  };

  const status = getStatus(score);
  const circumference = 2 * Math.PI * 60; // r=60
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 justify-between">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
      
      <div className="relative z-10 flex-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Target className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Career Readiness Score</h2>
        </div>
        <p className="text-muted-foreground max-w-md">
          A comprehensive analysis of your resume quality, interview performance, ATS match rate, and coding capabilities.
        </p>
        
        <div className="mt-6 flex items-center gap-4">
          <div className={`px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 ${status.bg} ${status.color}`}>
            {status.label}
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            <span>Updated {new Date(lastUpdated).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center w-48 h-48">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="60"
            className="stroke-muted/20"
            strokeWidth="12"
            fill="transparent"
          />
          <motion.circle
            cx="96"
            cy="96"
            r="60"
            className="stroke-primary"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="text-4xl font-bold tracking-tighter"
          >
            {score}
          </motion.span>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest mt-1">/ 100</span>
        </div>
      </div>
    </div>
  )
}
