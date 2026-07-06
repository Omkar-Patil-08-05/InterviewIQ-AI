"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Scale, TrendingUp, TrendingDown, Minus } from "lucide-react"

export default function ComparisonMode({ data }: { data: any }) {
  const { evaluation } = data
  const historical = evaluation?.historicalData

  if (!historical) {
    return (
      <Card className="bg-white/5 border-white/10 shadow-2xl overflow-hidden h-full">
        <CardContent className="p-12 text-center flex flex-col items-center justify-center">
          <Scale className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-foreground mb-2">No Historical Data Available</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Comparison mode requires at least one previous recruiter evaluation snapshot to show growth trends over time. 
            Check back later as the candidate continues to use the platform.
          </p>
        </CardContent>
      </Card>
    )
  }

  const current = {
    rating: evaluation.overallRating,
    confidence: evaluation.confidenceLevel,
    recommendation: evaluation.recommendation
  }

  const past = {
    rating: historical.overallRating,
    confidence: historical.confidenceLevel,
    recommendation: historical.recommendation,
    date: new Date(historical.date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
  }

  const getTrend = (curr: number, prev: number) => {
    if (curr > prev) return <TrendingUp className="w-4 h-4 text-green-500" />
    if (curr < prev) return <TrendingDown className="w-4 h-4 text-red-500" />
    return <Minus className="w-4 h-4 text-muted-foreground" />
  }

  const getDiff = (curr: number, prev: number) => {
    const diff = (curr - prev).toFixed(1)
    if (curr > prev) return <span className="text-green-500 text-xs font-bold">+{diff}</span>
    if (curr < prev) return <span className="text-red-500 text-xs font-bold">{diff}</span>
    return <span className="text-muted-foreground text-xs font-bold">0.0</span>
  }

  return (
    <Card className="bg-white/5 border-white/10 shadow-2xl overflow-hidden">
      <CardHeader className="bg-primary/5 border-b border-white/5 pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-3">
          <Scale className="w-6 h-6 text-primary" />
          Historical Comparison Mode
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Comparing the candidate's current evaluation against their baseline snapshot from {past.date}.
        </p>
      </CardHeader>
      <CardContent className="p-6">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          <div className="p-4 bg-black/40 rounded-xl border border-white/5 flex flex-col items-center text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-3">Overall Rating</p>
            <div className="flex items-center gap-4 justify-center w-full">
              <div>
                <p className="text-[10px] text-muted-foreground mb-1">{past.date}</p>
                <div className="text-xl font-bold text-muted-foreground">{past.rating}</div>
              </div>
              <div className="flex flex-col items-center">
                {getTrend(current.rating, past.rating)}
                {getDiff(current.rating, past.rating)}
              </div>
              <div>
                <p className="text-[10px] text-primary mb-1">Current</p>
                <div className="text-xl font-black text-foreground">{current.rating}</div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-black/40 rounded-xl border border-white/5 flex flex-col items-center text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-3">Hiring Confidence</p>
            <div className="flex items-center gap-4 justify-center w-full">
              <div>
                <p className="text-[10px] text-muted-foreground mb-1">{past.date}</p>
                <div className="text-xl font-bold text-muted-foreground">{past.confidence}%</div>
              </div>
              <div className="flex flex-col items-center">
                {getTrend(current.confidence, past.confidence)}
                {getDiff(current.confidence, past.confidence)}
              </div>
              <div>
                <p className="text-[10px] text-primary mb-1">Current</p>
                <div className="text-xl font-black text-foreground">{current.confidence}%</div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-black/40 rounded-xl border border-white/5 flex flex-col items-center text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-3">Recommendation</p>
            <div className="flex items-center justify-between w-full px-4">
              <div className="text-sm font-medium text-muted-foreground">{past.recommendation}</div>
              <TrendingUp className="w-4 h-4 text-primary opacity-50 mx-2" />
              <div className="text-sm font-black text-foreground">{current.recommendation}</div>
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 p-4 rounded-xl border border-white/5">
            <h4 className="text-sm font-bold mb-4 text-foreground border-b border-white/10 pb-2">Past Snapshot ({past.date})</h4>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">Strengths</p>
                <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
                  {historical.strengths?.map((s:string, i:number) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">Risks</p>
                <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
                  {historical.risks?.map((r:string, i:number) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-primary/20">
            <h4 className="text-sm font-bold mb-4 text-primary border-b border-primary/20 pb-2">Current Evaluation</h4>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-2 text-green-400">Strengths</p>
                <ul className="list-disc pl-4 text-sm text-foreground space-y-1">
                  {evaluation.strengths?.slice(0,3).map((s:string, i:number) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-2 text-red-400">Risks</p>
                <ul className="list-disc pl-4 text-sm text-foreground space-y-1">
                  {evaluation.risks?.slice(0,3).map((r:string, i:number) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}
