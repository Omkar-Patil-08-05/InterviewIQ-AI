import { AnalyticsData } from "@/types/analytics"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Code2 } from "lucide-react"

export default function LanguageAnalytics({ data }: { data: AnalyticsData }) {
  
  return (
    <Card className="bg-white/5 border-white/10 shadow-xl h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Code2 className="w-5 h-5 text-cyan-500" />
          Language Proficiency
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6">
        {data.languageStats.map((lang) => (
          <div key={lang.language} className="bg-black/40 p-4 rounded-xl border border-white/5">
             <div className="flex justify-between items-center mb-3">
               <h4 className="font-bold text-foreground capitalize">{lang.language}</h4>
               <span className="text-xs bg-white/10 px-2 py-1 rounded text-muted-foreground">{lang.count} Submissions</span>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Success</p>
                   <p className="text-sm font-semibold text-green-400">{lang.successRate}%</p>
                </div>
                <div>
                   <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">AI Score</p>
                   <p className="text-sm font-semibold text-purple-400">{lang.avgScore}/100</p>
                </div>
                <div>
                   <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Runtime</p>
                   <p className="text-sm font-semibold text-yellow-400">{lang.avgRuntime}ms</p>
                </div>
                <div>
                   <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Memory</p>
                   <p className="text-sm font-semibold text-orange-400">{lang.avgMemory}MB</p>
                </div>
             </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
