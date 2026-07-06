import { AnalyticsData } from "@/types/analytics"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2 } from "lucide-react"

export default function CompanyReadiness({ data }: { data: AnalyticsData }) {
  
  // Calculate a mock but deterministic readiness score based on user metrics
  // Base score heavily weighted on AI score and problems solved.
  
  const baseScore = (data.avgAiScore * 0.5) + (Math.min(data.totalProblemsSolved, 100) * 0.5);
  
  const companies = [
    { name: "Google", weight: 0.8 },
    { name: "Meta", weight: 0.85 },
    { name: "Amazon", weight: 0.9 },
    { name: "Microsoft", weight: 0.9 },
    { name: "Apple", weight: 0.85 },
    { name: "Netflix", weight: 0.75 },
    { name: "Adobe", weight: 1.0 },
    { name: "Flipkart", weight: 1.1 },
    { name: "Infosys", weight: 1.5 },
    { name: "TCS", weight: 1.5 },
  ];

  const readiness = companies.map(c => {
    let score = Math.round(baseScore * c.weight);
    if (score > 100) score = 100;
    
    let color = "bg-red-500";
    if (score > 85) color = "bg-green-500";
    else if (score > 60) color = "bg-yellow-500";
    else if (score > 40) color = "bg-orange-500";
    
    return { ...c, score, color };
  }).sort((a,b) => b.score - a.score);

  return (
    <Card className="bg-white/5 border-white/10 shadow-xl h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Building2 className="w-5 h-5 text-indigo-500" />
          Company Readiness
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
        {readiness.map((company) => (
          <div key={company.name} className="space-y-1">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-foreground">{company.name}</span>
              <span className="text-muted-foreground">{company.score}%</span>
            </div>
            <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
              <div 
                className={`h-full ${company.color} rounded-full transition-all duration-1000`} 
                style={{ width: `${company.score}%` }} 
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
