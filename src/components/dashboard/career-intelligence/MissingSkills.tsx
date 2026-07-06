import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Target, HelpCircle, XCircle } from "lucide-react"

export default function MissingSkills({ analysis }: { analysis: any }) {
  const missing = analysis.missingSkills || { critical: [], important: [], optional: [] };

  return (
    <Card className="bg-white/5 border-white/10 shadow-xl h-full flex flex-col">
      <CardHeader className="pb-4 border-b border-white/5">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-red-400">
          <XCircle className="w-5 h-5" />
          Missing Skills Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-6 pt-4 custom-scrollbar pr-2">
        
        <div>
          <h4 className="flex items-center gap-2 text-sm font-semibold text-red-500 mb-3 uppercase tracking-wider">
            <AlertCircle className="w-4 h-4" /> Critical Gap (Must Have)
          </h4>
          <div className="flex flex-wrap gap-2">
            {missing.critical?.length > 0 ? missing.critical.map((skill: string, i: number) => (
              <span key={i} className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-xs font-medium">
                {skill}
              </span>
            )) : <span className="text-sm text-muted-foreground italic">No critical skills missing!</span>}
          </div>
        </div>

        <div>
          <h4 className="flex items-center gap-2 text-sm font-semibold text-yellow-500 mb-3 uppercase tracking-wider">
            <Target className="w-4 h-4" /> Important (Should Have)
          </h4>
          <div className="flex flex-wrap gap-2">
            {missing.important?.length > 0 ? missing.important.map((skill: string, i: number) => (
              <span key={i} className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1 rounded-full text-xs font-medium">
                {skill}
              </span>
            )) : <span className="text-sm text-muted-foreground italic">No important skills missing.</span>}
          </div>
        </div>

        <div>
          <h4 className="flex items-center gap-2 text-sm font-semibold text-blue-400 mb-3 uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" /> Optional (Nice to Have)
          </h4>
          <div className="flex flex-wrap gap-2">
            {missing.optional?.length > 0 ? missing.optional.map((skill: string, i: number) => (
              <span key={i} className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-medium">
                {skill}
              </span>
            )) : <span className="text-sm text-muted-foreground italic">No optional skills missing.</span>}
          </div>
        </div>

      </CardContent>
    </Card>
  )
}
