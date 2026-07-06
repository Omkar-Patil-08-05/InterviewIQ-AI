import { AnalyticsData } from "@/types/analytics"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Medal, Zap, Target, Brain, Crown, Star } from "lucide-react"

export default function Achievements({ data }: { data: AnalyticsData }) {
  
  const achievementsList = [
    { id: 'first_sub', name: "First Submission", desc: "Attempt your first problem", icon: <Target />, color: "text-blue-500", bg: "bg-blue-500/10" },
    { id: 'first_acc', name: "First Accepted", desc: "Get your first code accepted", icon: <CheckCircle2Icon />, color: "text-green-500", bg: "bg-green-500/10" },
    { id: 'prob_10', name: "10 Problems", desc: "Solve 10 problems", icon: <Medal />, color: "text-purple-500", bg: "bg-purple-500/10" },
    { id: 'prob_50', name: "50 Problems", desc: "Solve 50 problems", icon: <Medal />, color: "text-purple-600", bg: "bg-purple-600/10" },
    { id: 'prob_100', name: "100 Problems", desc: "Solve 100 problems", icon: <Medal />, color: "text-purple-700", bg: "bg-purple-700/10" },
    { id: 'runtime_master', name: "Runtime Master", desc: "Average runtime under 50ms", icon: <Zap />, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { id: 'memory_optimizer', name: "Memory Optimizer", desc: "Average memory under 10MB", icon: <Zap />, color: "text-yellow-600", bg: "bg-yellow-600/10" },
    { id: 'consistent', name: "Consistency", desc: "Achieve a 7-day streak", icon: <FlameIcon />, color: "text-orange-500", bg: "bg-orange-500/10" },
    { id: 'consistent_30', name: "Consistency Champion", desc: "Achieve a 30-day streak", icon: <FlameIcon />, color: "text-orange-600", bg: "bg-orange-600/10" },
    { id: 'ai_expert', name: "AI Expert", desc: "Average AI score over 90", icon: <Brain />, color: "text-pink-500", bg: "bg-pink-500/10" },
    { id: 'python_expert', name: "Python Expert", desc: "10+ Python problems (80%+ success)", icon: <Crown />, color: "text-blue-400", bg: "bg-blue-400/10" },
    { id: 'js_expert', name: "JavaScript Expert", desc: "10+ JS problems (80%+ success)", icon: <Crown />, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { id: 'cpp_expert', name: "C++ Expert", desc: "10+ C++ problems (80%+ success)", icon: <Crown />, color: "text-indigo-400", bg: "bg-indigo-400/10" },
  ]

  const unlocked = achievementsList.filter(a => data.unlockedAchievements?.includes(a.id))
  const locked = achievementsList.filter(a => !data.unlockedAchievements?.includes(a.id))

  return (
    <Card className="bg-white/5 border-white/10 shadow-xl h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-500" />
          Achievements ({unlocked.length}/{achievementsList.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {unlocked.map(a => (
            <div key={a.id} className="flex gap-4 items-center p-3 rounded-lg border border-white/10 bg-white/5">
              <div className={`p-2 rounded-full ${a.bg} ${a.color} shrink-0`}>
                {a.icon}
              </div>
              <div className="flex-1 overflow-hidden">
                <h4 className="font-semibold text-sm text-foreground truncate">{a.name}</h4>
                <p className="text-xs text-muted-foreground truncate">{a.desc}</p>
              </div>
              <div className="ml-auto shrink-0">
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              </div>
            </div>
          ))}
          {locked.map(a => (
            <div key={a.id} className="flex gap-4 items-center p-3 rounded-lg border border-white/5 bg-black/40 opacity-50 grayscale">
              <div className={`p-2 rounded-full ${a.bg} ${a.color} shrink-0`}>
                {a.icon}
              </div>
              <div className="flex-1 overflow-hidden">
                <h4 className="font-semibold text-sm text-foreground truncate">{a.name}</h4>
                <p className="text-xs text-muted-foreground truncate">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function CheckCircle2Icon() { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg> }
function FlameIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg> }
