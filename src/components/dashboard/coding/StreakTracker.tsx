import { AnalyticsData } from "@/types/analytics"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame, Trophy } from "lucide-react"

export default function StreakTracker({ data }: { data: AnalyticsData }) {
  const goal = 7;
  const progress = Math.min((data.currentStreak / goal) * 100, 100);

  return (
    <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/10 border-orange-500/30 shadow-2xl h-full flex flex-col justify-between">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-orange-400">
          <Flame className="w-5 h-5 fill-orange-500 text-orange-500" />
          Coding Streak
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 flex-1 flex flex-col justify-end">
        <div className="flex justify-between items-end mb-6">
          <div>
            <p className="text-sm text-orange-200/70 mb-1 uppercase tracking-wider font-semibold">Current</p>
            <h2 className="text-5xl font-black text-orange-400 drop-shadow-lg flex items-baseline gap-1.5">{data.currentStreak} <span className="text-xl text-orange-400/50">Days</span></h2>
          </div>
          <div className="text-right">
            <p className="text-xs text-orange-200/50 mb-1 uppercase tracking-wider font-semibold flex items-center gap-1 justify-end">
               <Trophy className="w-3 h-3"/> Longest
            </p>
            <h3 className="text-2xl font-bold text-orange-300/80">{data.longestStreak}</h3>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-orange-200/60 font-semibold">
            <span>Weekly Goal</span>
            <span>{data.currentStreak} / {goal} Days</span>
          </div>
          <div className="h-3 bg-black/40 rounded-full overflow-hidden border border-orange-500/20">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
