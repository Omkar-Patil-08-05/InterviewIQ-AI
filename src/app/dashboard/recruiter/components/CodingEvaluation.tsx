"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Code2, CheckCircle2 } from "lucide-react"

export default function CodingEvaluation({ data }: { data: any }) {
  const { coding } = data

  const totalAttempts = coding.length
  const passed = coding.filter((c: any) => c.executionStatus === 'Passed').length
  const successRate = totalAttempts > 0 ? ((passed / totalAttempts) * 100).toFixed(0) : '0'
  
  const avgRuntime = passed > 0 
    ? (coding.filter((c: any) => c.executionStatus === 'Passed').reduce((a:number, c:any)=>a+c.runtimeMs, 0) / passed).toFixed(0)
    : '0'

  const avgMemory = passed > 0 
    ? (coding.filter((c: any) => c.executionStatus === 'Passed').reduce((a:number, c:any)=>a+c.memoryMb, 0) / passed).toFixed(1)
    : '0'

  const languages = [...new Set(coding.map((c: any) => c.language))]

  return (
    <Card className="bg-white/5 border-white/10 shadow-xl overflow-hidden h-full">
      <CardHeader className="pb-4 border-b border-white/5">
        <CardTitle className="text-lg font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-orange-400" /> Coding Evaluation
          </div>
          <div className="flex items-center gap-2">
             <span className="text-xs text-muted-foreground uppercase tracking-wider">Success Rate</span>
             <span className={`text-2xl font-black ${Number(successRate) >= 80 ? 'text-green-500' : Number(successRate) >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>{successRate}%</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
           <Metric label="Problems Attempted" value={totalAttempts.toString()} />
           <Metric label="Problems Solved" value={passed.toString()} />
           <Metric label="Avg Runtime" value={`${avgRuntime}ms`} />
           <Metric label="Avg Memory" value={`${avgMemory}MB`} />
           <Metric label="Languages Used" value={languages.length > 0 ? languages.join(', ') : 'None'} />
           <Metric label="Consistency" value={totalAttempts > 5 ? 'High' : totalAttempts > 0 ? 'Medium' : 'Low'} />
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
         {value !== '0' && value !== '0ms' && value !== '0.0MB' && value !== 'None' && value !== 'Low' ? (
            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
         ) : null}
         <span className="text-sm font-bold text-foreground truncate">{value}</span>
      </div>
    </div>
  )
}
