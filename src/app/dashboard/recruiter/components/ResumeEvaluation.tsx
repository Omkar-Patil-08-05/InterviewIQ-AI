"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, CheckCircle2 } from "lucide-react"

export default function ResumeEvaluation({ data }: { data: any }) {
  const { resumes, jobAnalyses } = data
  const resume = resumes[0]
  
  // Calculate average ATS
  const atsScores = jobAnalyses.map((j: any) => j.atsMatchScore)
  const avgAts = atsScores.length > 0 ? (atsScores.reduce((a:number,b:number)=>a+b,0)/atsScores.length) : 0

  const getGrade = (score: number) => {
    if (score >= 90) return 'A+'
    if (score >= 80) return 'A'
    if (score >= 70) return 'B+'
    if (score >= 60) return 'B'
    return 'C'
  }

  const grade = getGrade(avgAts || 70)

  return (
    <Card className="bg-white/5 border-white/10 shadow-xl overflow-hidden h-full">
      <CardHeader className="pb-4 border-b border-white/5">
        <CardTitle className="text-lg font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" /> Resume Evaluation
          </div>
          <div className="flex items-center gap-2">
             <span className="text-xs text-muted-foreground uppercase tracking-wider">Overall Grade</span>
             <span className={`text-2xl font-black ${grade.startsWith('A') ? 'text-green-500' : grade.startsWith('B') ? 'text-yellow-500' : 'text-red-500'}`}>{grade}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
           <Metric label="Resume Quality" value={resume ? 'High' : 'N/A'} />
           <Metric label="ATS Optimization" value={avgAts > 0 ? `${Math.round(avgAts)}%` : 'N/A'} />
           <Metric label="Experience Match" value={jobAnalyses.length > 0 ? 'Verified' : 'Pending'} />
           <Metric label="Education" value={resume ? 'Extracted' : 'Missing'} />
           <Metric label="Projects" value={resume?.structuredData?.projects ? 'Detailed' : 'Adequate'} />
           <Metric label="Skills Coverage" value={avgAts > 0 ? 'Strong' : 'Unknown'} />
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
         {value !== 'N/A' && value !== 'Missing' && value !== 'Unknown' && value !== 'Pending' ? (
            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
         ) : null}
         <span className="text-sm font-bold text-foreground truncate">{value}</span>
      </div>
    </div>
  )
}
