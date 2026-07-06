import { AnalyticsData } from "@/types/analytics"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "lucide-react"

export default function Heatmap({ data }: { data: AnalyticsData }) {
  // Generate last 365 days
  const today = new Date()
  const days = Array.from({ length: 364 }).map((_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (363 - i))
    return d.toISOString().split('T')[0]
  })

  const activityMap = new Map<string, number>()
  data.dailyActivity.forEach(a => activityMap.set(a.date, a.count))

  const getColor = (count: number) => {
    if (count === 0) return "bg-white/5 border border-white/5"
    if (count < 2) return "bg-emerald-900 border border-emerald-800"
    if (count < 4) return "bg-emerald-700 border border-emerald-600"
    if (count < 6) return "bg-emerald-500 border border-emerald-400"
    return "bg-emerald-400 border border-emerald-300"
  }

  // Split into weeks for grid
  const weeks = []
  let currentWeek = []
  for (let i = 0; i < days.length; i++) {
    currentWeek.push(days[i])
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }
  if (currentWeek.length > 0) weeks.push(currentWeek)

  return (
    <Card className="bg-white/5 border-white/10 shadow-xl overflow-hidden h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-500" />
          Contribution Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto pb-2 custom-scrollbar">
          <div className="flex gap-1 min-w-max">
            {weeks.map((week, wIndex) => (
              <div key={wIndex} className="flex flex-col gap-1">
                {week.map(day => {
                  const count = activityMap.get(day) || 0;
                  return (
                    <div 
                      key={day}
                      title={`${count} submissions on ${day}`}
                      className={`w-3 h-3 md:w-4 md:h-4 rounded-sm ${getColor(count)} hover:ring-2 hover:ring-white/50 transition-all cursor-crosshair`}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground">
          <span>{data.dailyActivity.reduce((acc, curr) => acc + curr.count, 0)} total submissions in the last year</span>
          <div className="flex items-center gap-1">
            <span>Less</span>
            <div className="w-3 h-3 rounded-sm bg-white/5 border border-white/5"></div>
            <div className="w-3 h-3 rounded-sm bg-emerald-900 border border-emerald-800"></div>
            <div className="w-3 h-3 rounded-sm bg-emerald-700 border border-emerald-600"></div>
            <div className="w-3 h-3 rounded-sm bg-emerald-500 border border-emerald-400"></div>
            <div className="w-3 h-3 rounded-sm bg-emerald-400 border border-emerald-300"></div>
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
