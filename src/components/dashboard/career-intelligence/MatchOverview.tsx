import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Zap, BarChart2, CheckCircle2, User, BookOpen } from "lucide-react"

export default function MatchOverview({ analysis }: { analysis: any }) {
  
  const metrics = [
    { label: "Technical Match", value: analysis.technicalSkillMatch?.score || 0, icon: <Zap className="w-4 h-4 text-blue-500"/> },
    { label: "Soft Skill Match", value: analysis.softSkillMatch?.score || 0, icon: <User className="w-4 h-4 text-green-500"/> },
    { label: "Experience Match", value: analysis.experienceMatch?.score || 0, icon: <BarChart2 className="w-4 h-4 text-purple-500"/> },
    { label: "Education Match", value: analysis.educationMatch?.score || 0, icon: <BookOpen className="w-4 h-4 text-orange-500"/> },
    { label: "Keyword Match", value: analysis.keywordMatch?.score || 0, icon: <Target className="w-4 h-4 text-red-500"/> },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      <Card className="bg-white/5 border-white/10 shadow-xl flex flex-col justify-center items-center text-center p-6">
        <h3 className="text-muted-foreground font-semibold mb-2 uppercase tracking-wider">Overall ATS Score</h3>
        <div className="relative">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle cx="64" cy="64" r="56" className="stroke-white/10" strokeWidth="12" fill="none" />
            <circle 
              cx="64" cy="64" r="56" 
              className={`stroke-green-500 transition-all duration-1000 ease-out`} 
              strokeWidth="12" fill="none" 
              strokeDasharray="351.86" 
              strokeDashoffset={351.86 - (351.86 * analysis.atsMatchScore) / 100} 
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-4xl font-bold text-white">{analysis.atsMatchScore}</span>
            <span className="text-xs text-muted-foreground">/ 100</span>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          {analysis.atsMatchScore >= 80 ? "Excellent Match! You are highly likely to pass ATS screening." 
          : analysis.atsMatchScore >= 60 ? "Good Match, but missing some key requirements." 
          : "Low Match. Significant resume tailoring required."}
        </p>
      </Card>

      <div className="space-y-4">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center gap-4">
            <div className="p-2 bg-black/40 rounded-lg">{m.icon}</div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold">{m.label}</span>
                <span className="text-sm font-bold">{m.value}%</span>
              </div>
              <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${m.value >= 80 ? 'bg-green-500' : m.value >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                  style={{ width: `${m.value}%` }} 
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
