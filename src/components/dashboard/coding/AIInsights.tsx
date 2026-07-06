import { AnalyticsData } from "@/types/analytics"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BrainCircuit, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react"

export default function AIInsights({ data }: { data: AnalyticsData }) {
  
  // Aggregate Insights
  const allMistakes: string[] = [];
  const allTips: string[] = [];
  
  data.attempts.forEach(a => {
    const rev = a.aiReview as any;
    if (rev) {
      if (Array.isArray(rev.edgeCasesMissed)) allMistakes.push(...rev.edgeCasesMissed);
      if (Array.isArray(rev.bestPracticesFeedback)) allTips.push(...rev.bestPracticesFeedback);
      if (Array.isArray(rev.securitySuggestions)) allTips.push(...rev.securitySuggestions);
    }
  });

  // Simple frequency counter
  const getTop = (arr: string[], limit = 3) => {
    const counts: Record<string, number> = {};
    arr.forEach(item => {
      counts[item] = (counts[item] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a,b) => b[1] - a[1])
      .slice(0, limit)
      .map(e => e[0]);
  }

  const topMistakes = getTop(allMistakes, 3);
  const topTips = getTop(allTips, 3);

  return (
    <Card className="bg-white/5 border-white/10 shadow-xl flex flex-col h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-purple-500" />
          AI Review Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 flex-1">
        
        <div>
          <h4 className="text-sm font-semibold flex items-center gap-2 text-red-400 mb-3">
            <AlertTriangle className="w-4 h-4" /> Common Edge Cases Missed
          </h4>
          {topMistakes.length > 0 ? (
            <ul className="space-y-2">
              {topMistakes.map((m, i) => (
                <li key={i} className="text-sm text-muted-foreground bg-black/40 p-2 rounded border border-white/5 line-clamp-2">
                  • {m}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground italic">No recurring mistakes detected. Great job!</p>
          )}
        </div>

        <div>
          <h4 className="text-sm font-semibold flex items-center gap-2 text-yellow-400 mb-3">
            <Lightbulb className="w-4 h-4" /> Recommended Improvements
          </h4>
          {topTips.length > 0 ? (
            <ul className="space-y-2">
              {topTips.map((t, i) => (
                <li key={i} className="text-sm text-muted-foreground bg-black/40 p-2 rounded border border-white/5 line-clamp-2">
                  • {t}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground italic">No tips available yet.</p>
          )}
        </div>

        <div>
           <h4 className="text-sm font-semibold flex items-center gap-2 text-blue-400 mb-3">
            <TrendingUp className="w-4 h-4" /> AI Performance Trend
          </h4>
          <p className="text-sm text-muted-foreground">
            {data.avgAiScore > 85 ? "You are consistently writing highly optimized, readable code. Focus on solving hard tier problems to push your limits." 
            : data.avgAiScore > 60 ? "Your code is functional, but there is room for improvement in time/space optimization and best practices. Read the AI feedback on your recent submissions."
            : "Focus on getting the code to run successfully first, then use the AI reviewer to understand structural improvements."}
          </p>
        </div>

      </CardContent>
    </Card>
  )
}
