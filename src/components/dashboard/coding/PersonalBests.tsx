import { AnalyticsData } from "@/types/analytics"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Clock, Database, Flame, CheckCircle, Code2 } from "lucide-react"

export default function PersonalBests({ data }: { data: AnalyticsData }) {
  const fastestRuntime = data.attempts.filter(a => a.executionStatus === 'Passed' && a.runtimeMs > 0)
    .sort((a, b) => a.runtimeMs - b.runtimeMs)[0];

  const lowestMemory = data.attempts.filter(a => a.executionStatus === 'Passed' && a.memoryMb > 0)
    .sort((a, b) => a.memoryMb - b.memoryMb)[0];

  const mostActiveDay = data.dailyActivity.sort((a, b) => b.count - a.count)[0];

  return (
    <Card className="bg-white/5 border-white/10 shadow-xl h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Personal Bests
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 grid grid-cols-2 gap-4 mt-2">
        
        <div className="bg-white/5 p-3 rounded-lg border border-white/10">
          <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1"><Clock className="w-3 h-3" /> Fastest Code</div>
          <div className="font-mono text-lg text-green-400 truncate">{fastestRuntime ? `${fastestRuntime.runtimeMs}ms` : 'N/A'}</div>
          {fastestRuntime && <div className="text-[10px] text-muted-foreground truncate">{fastestRuntime.language}</div>}
        </div>

        <div className="bg-white/5 p-3 rounded-lg border border-white/10">
          <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1"><Database className="w-3 h-3" /> Lowest Memory</div>
          <div className="font-mono text-lg text-blue-400 truncate">{lowestMemory ? `${lowestMemory.memoryMb}MB` : 'N/A'}</div>
          {lowestMemory && <div className="text-[10px] text-muted-foreground truncate">{lowestMemory.language}</div>}
        </div>

        <div className="bg-white/5 p-3 rounded-lg border border-white/10">
          <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1"><Flame className="w-3 h-3" /> Longest Streak</div>
          <div className="font-mono text-lg text-orange-400 flex items-baseline gap-1 truncate">{data.longestStreak} <span className="text-xs">Days</span></div>
        </div>

        <div className="bg-white/5 p-3 rounded-lg border border-white/10">
          <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1"><CheckCircle className="w-3 h-3" /> Best Language</div>
          <div className="font-mono text-lg text-purple-400 truncate" title={data.favoriteLanguage}>{data.favoriteLanguage}</div>
          <div className="text-[10px] text-muted-foreground truncate">
            {data.languageStats.find(l => l.language === data.favoriteLanguage)?.successRate || 0}% Success
          </div>
        </div>

      </CardContent>
    </Card>
  )
}
