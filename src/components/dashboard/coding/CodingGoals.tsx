import { AnalyticsData } from "@/types/analytics"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target } from "lucide-react"

export default function CodingGoals({ data }: { data: AnalyticsData }) {
  const dailyGoal = 2;
  const weeklyGoal = 10;
  const monthlyGoal = 40;

  const today = new Date().toISOString().split('T')[0];
  const thisWeekStart = new Date();
  thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
  const thisMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const dailyCount = data.attempts.filter(a => new Date(a.createdAt).toISOString().split('T')[0] === today && a.executionStatus === 'Passed').length;
  
  const weeklyCount = data.attempts.filter(a => new Date(a.createdAt) >= thisWeekStart && a.executionStatus === 'Passed').length;
  
  const monthlyCount = data.attempts.filter(a => new Date(a.createdAt) >= thisMonthStart && a.executionStatus === 'Passed').length;

  const dailyPct = Math.min(100, Math.round((dailyCount / dailyGoal) * 100));
  const weeklyPct = Math.min(100, Math.round((weeklyCount / weeklyGoal) * 100));
  const monthlyPct = Math.min(100, Math.round((monthlyCount / monthlyGoal) * 100));

  return (
    <Card className="bg-white/5 border-white/10 shadow-xl h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Target className="w-5 h-5 text-green-500" />
          Coding Goals
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-6 mt-2">
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-semibold text-foreground">Daily Goal</span>
            <span className="text-muted-foreground">{dailyCount} / {dailyGoal}</span>
          </div>
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: `${dailyPct}%` }} />
          </div>
          {dailyCount >= dailyGoal && <p className="text-xs text-green-400 mt-1">Goal completed!</p>}
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-semibold text-foreground">Weekly Goal</span>
            <span className="text-muted-foreground">{weeklyCount} / {weeklyGoal}</span>
          </div>
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${weeklyPct}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-semibold text-foreground">Monthly Goal</span>
            <span className="text-muted-foreground">{monthlyCount} / {monthlyGoal}</span>
          </div>
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 transition-all duration-1000" style={{ width: `${monthlyPct}%` }} />
          </div>
        </div>

      </CardContent>
    </Card>
  )
}
