import { AnalyticsData } from "@/types/analytics"
import { Card, CardContent } from "@/components/ui/card"
import { Code2, Target, Zap, Server, BrainCircuit, Clock, CheckCircle2, List } from "lucide-react"

export default function OverallStats({ data }: { data: AnalyticsData }) {
  const stats = [
    { label: "Problems Solved", value: `${data.totalProblemsSolved}/${data.totalProblemsAttempted}`, icon: <Target className="w-5 h-5 text-blue-500"/>, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Success Rate", value: `${data.successRate}%`, icon: <CheckCircle2 className="w-5 h-5 text-green-500"/>, color: "text-green-400", bg: "bg-green-500/10" },
    { label: "Avg Runtime", value: `${data.avgRuntime}ms`, icon: <Zap className="w-5 h-5 text-yellow-500"/>, color: "text-yellow-400", bg: "bg-yellow-500/10" },
    { label: "Avg Memory", value: `${data.avgMemory}MB`, icon: <Server className="w-5 h-5 text-orange-500"/>, color: "text-orange-400", bg: "bg-orange-500/10" },
    { label: "Avg AI Score", value: `${data.avgAiScore}/100`, icon: <BrainCircuit className="w-5 h-5 text-purple-500"/>, color: "text-purple-400", bg: "bg-purple-500/10" },
    { label: "Total Time", value: `${Math.floor(data.totalCodingTime / 60)}h ${data.totalCodingTime % 60}m`, icon: <Clock className="w-5 h-5 text-pink-500"/>, color: "text-pink-400", bg: "bg-pink-500/10" },
    { label: "Fav Language", value: data.favoriteLanguage, icon: <Code2 className="w-5 h-5 text-cyan-500"/>, color: "text-cyan-400", bg: "bg-cyan-500/10" },
    { label: "Common Complexity", value: data.commonTimeComplexity, icon: <List className="w-5 h-5 text-emerald-500"/>, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <Card key={i} className="bg-white/5 border-white/10 shadow-lg hover:border-white/20 transition-all duration-300">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{s.label}</p>
              <div className={`p-2 rounded-lg ${s.bg} shrink-0`}>{s.icon}</div>
            </div>
            <h3 className={`text-xl font-bold ${s.color} font-mono truncate w-full`} title={s.value}>{s.value}</h3>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
