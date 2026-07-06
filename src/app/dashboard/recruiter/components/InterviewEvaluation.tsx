"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, CheckCircle2 } from "lucide-react"

export default function InterviewEvaluation({ data }: { data: any }) {
  const { interviews } = data

  const total = interviews.length
  const avgScore = total > 0 ? (interviews.reduce((a:number, c:any)=>a+c.overallScore, 0) / total).toFixed(1) : '0.0'
  
  // Aggregate mock metrics from the radar chart JSON if present, otherwise fallback
  let commScore = 'N/A'
  let techScore = 'N/A'
  let probScore = 'N/A'

  if (total > 0 && interviews[0].performanceMetrics) {
    try {
      const pm = interviews[0].performanceMetrics as any[]
      const getScore = (name: string) => pm.find(p => p.subject === name)?.score || 'N/A'
      commScore = getScore('Communication')
      techScore = getScore('Technical Knowledge')
      probScore = getScore('Problem Solving')
    } catch(e) {}
  }

  const rec = total > 0 ? interviews[0].hiringRecommendation : 'N/A'

  return (
    <Card className="bg-white/5 border-white/10 shadow-xl overflow-hidden h-full">
      <CardHeader className="pb-4 border-b border-white/5">
        <CardTitle className="text-lg font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-pink-400" /> Interview Evaluation
          </div>
          <div className="flex items-center gap-2">
             <span className="text-xs text-muted-foreground uppercase tracking-wider">Avg Score</span>
             <span className={`text-2xl font-black ${Number(avgScore) >= 8.5 ? 'text-green-500' : Number(avgScore) >= 7 ? 'text-yellow-500' : 'text-red-500'}`}>{avgScore}<span className="text-sm text-muted-foreground">/10</span></span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
           <Metric label="Interviews Completed" value={total.toString()} />
           <Metric label="Communication" value={commScore.toString()} />
           <Metric label="Tech Knowledge" value={techScore.toString()} />
           <Metric label="Problem Solving" value={probScore.toString()} />
           <Metric label="Interview Trend" value={total > 1 ? 'Improving' : 'Stable'} />
           <Metric label="Latest AI Decision" value={rec} />
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
         {value !== '0' && value !== '0.0' && value !== 'N/A' ? (
            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
         ) : null}
         <span className="text-sm font-bold text-foreground truncate">{value}</span>
      </div>
    </div>
  )
}
