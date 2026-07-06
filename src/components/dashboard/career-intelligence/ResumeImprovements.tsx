import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileEdit, Lightbulb, Zap, ArrowUpCircle } from "lucide-react"

export default function ResumeImprovements({ analysis }: { analysis: any }) {
  const improvements = analysis.resumeImprovements?.suggestions || [];

  return (
    <Card className="bg-white/5 border-white/10 shadow-xl h-full flex flex-col">
      <CardHeader className="pb-4 border-b border-white/5">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-yellow-400">
          <FileEdit className="w-5 h-5" />
          Resume Improvements
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-4 pt-4 custom-scrollbar pr-2">
        {improvements.length > 0 ? improvements.map((item: any, i: number) => (
          <div key={i} className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-2 relative overflow-hidden group hover:border-white/20 transition-all">
            <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500/50 group-hover:bg-yellow-400 transition-colors" />
            <div className="flex items-start justify-between gap-4">
              <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                {item.category}
              </h4>
              <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded bg-white/10 ${item.impact.toLowerCase() === 'high' ? 'text-green-400' : 'text-blue-400'}`}>
                {item.impact} Impact
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.suggestion}</p>
          </div>
        )) : (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-2 opacity-50">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
            <p className="text-sm">Your resume is perfectly optimized!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function CheckCircle2(props: any) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg> }
