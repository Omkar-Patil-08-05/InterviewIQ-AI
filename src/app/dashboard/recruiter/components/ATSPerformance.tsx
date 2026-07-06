"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LayoutDashboard, CheckCircle2 } from "lucide-react"

export default function ATSPerformance({ data }: { data: any }) {
  const { jobAnalyses, careerReadiness } = data

  const total = jobAnalyses.length
  const atsScores = jobAnalyses.map((j: any) => j.atsMatchScore)
  
  const avgAts = total > 0 ? (atsScores.reduce((a:number,b:number)=>a+b,0)/total).toFixed(0) : '0'
  const highest = total > 0 ? Math.max(...atsScores).toFixed(0) : '0'
  const lowest = total > 0 ? Math.min(...atsScores).toFixed(0) : '0'
  
  const companies = [...new Set(jobAnalyses.map((j: any) => j.jobDescription.company))].filter(Boolean)

  let readinessScore = 'N/A'
  if (careerReadiness && careerReadiness.componentScores) {
    const scores = careerReadiness.componentScores as any
    readinessScore = scores.ats ? `${scores.ats}%` : 'N/A'
  }

  return (
    <Card className="bg-white/5 border-white/10 shadow-xl overflow-hidden h-full">
      <CardHeader className="pb-4 border-b border-white/5">
        <CardTitle className="text-lg font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-cyan-400" /> ATS Performance
          </div>
          <div className="flex items-center gap-2">
             <span className="text-xs text-muted-foreground uppercase tracking-wider">Avg Match</span>
             <span className={`text-2xl font-black ${Number(avgAts) >= 75 ? 'text-green-500' : Number(avgAts) >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>{avgAts}%</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
           <Metric label="JDs Analyzed" value={total.toString()} />
           <Metric label="Highest Match" value={`${highest}%`} />
           <Metric label="Lowest Match" value={`${lowest}%`} />
           <Metric label="Companies Target" value={companies.length.toString()} />
           <Metric label="Readiness Score" value={readinessScore} />
           <Metric label="Missing Skills" value={total > 0 ? 'Identified' : 'Unknown'} />
        </div>
      </CardContent>
    </Card>
  )
}

function Metric({ label, value }: { label: string, value: string }) {
  return (
    <div className="bg-black/20 p-3 rounded-lg border border-white/5 flex flex-col justify-center">
      <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-medium">{label}</p>
      <div className="flex items-center gap-2">
         {value !== '0' && value !== '0%' && value !== 'N/A' && value !== 'Unknown' ? (
            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
         ) : null}
         <span className="text-sm font-bold text-foreground truncate">{value}</span>
      </div>
    </div>
  )
}
