"use client"

import { Lightbulb, Zap, AlertTriangle, Target as TargetIcon } from "lucide-react"

interface AIInsightsProps {
  strengths: string[];
  weaknesses: string[];
  weeklyGoals: string[];
  careerInsights: string;
}

export function AIInsights({ strengths, weaknesses, weeklyGoals, careerInsights }: AIInsightsProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-primary/20 to-blue-600/20 border border-primary/30 rounded-2xl p-6">
        <h3 className="font-semibold text-lg flex items-center gap-2 mb-3 text-primary-foreground">
          <Lightbulb className="w-5 h-5" /> Executive Summary
        </h3>
        <p className="text-foreground/90 leading-relaxed">{careerInsights}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-green-500" /> Core Strengths
          </h3>
          <ul className="space-y-3">
            {strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" /> Improvement Areas
          </h3>
          <ul className="space-y-3">
            {weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 shrink-0" />
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <TargetIcon className="w-4 h-4 text-primary" /> Personalized Weekly Goals
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {weeklyGoals.map((g, i) => (
            <div key={i} className="bg-black/20 rounded-lg p-3 border border-white/5 flex items-start gap-3">
              <div className="w-6 h-6 rounded bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                {i + 1}
              </div>
              <span className="text-sm text-foreground/80">{g}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
