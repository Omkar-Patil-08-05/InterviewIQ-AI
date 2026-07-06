import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2 } from "lucide-react"

export default function CompanyReadinessJD({ analysis }: { analysis: any }) {
  const readiness = analysis.companyReadiness || [];

  return (
    <Card className="bg-white/5 border-white/10 shadow-xl h-full flex flex-col">
      <CardHeader className="pb-4 border-b border-white/5">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-cyan-400">
          <Building2 className="w-5 h-5" />
          Top Tech Readiness
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto pt-4 custom-scrollbar pr-2 space-y-4">
        {readiness.length > 0 ? readiness.map((company: any, i: number) => {
          let color = "bg-red-500";
          if (company.score >= 80) color = "bg-green-500";
          else if (company.score >= 60) color = "bg-yellow-500";
          else if (company.score >= 40) color = "bg-orange-500";

          return (
            <div key={i} className="space-y-1 group" title={`${company.reason}\n${company.improvements}`}>
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-foreground group-hover:text-cyan-400 transition-colors">{company.company}</span>
                <span className="text-muted-foreground">{company.score}%</span>
              </div>
              <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                <div 
                  className={`h-full ${color} rounded-full transition-all duration-1000`} 
                  style={{ width: `${company.score}%` }} 
                />
              </div>
            </div>
          )
        }) : (
          <p className="text-sm text-muted-foreground italic text-center mt-8">No readiness data generated.</p>
        )}
      </CardContent>
    </Card>
  )
}
