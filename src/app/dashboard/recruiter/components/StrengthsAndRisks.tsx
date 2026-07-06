"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, AlertTriangle, ShieldCheck, ShieldAlert } from "lucide-react"

export default function StrengthsAndRisks({ data }: { data: any }) {
  const { evaluation } = data
  if (!evaluation) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Strengths */}
      <Card className="bg-gradient-to-br from-green-500/5 to-transparent border-green-500/20 shadow-xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-500/10 rounded-lg shrink-0">
              <ShieldCheck className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Candidate Strengths</h3>
          </div>
          <div className="space-y-4">
            {evaluation.strengths?.map((strength: string, i: number) => (
              <div key={i} className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">{strength}</p>
              </div>
            ))}
            {(!evaluation.strengths || evaluation.strengths.length === 0) && (
              <p className="text-sm text-muted-foreground italic">No prominent strengths identified.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Risks */}
      <Card className="bg-gradient-to-br from-red-500/5 to-transparent border-red-500/20 shadow-xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-500/10 rounded-lg shrink-0">
              <ShieldAlert className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Recruitment Risks</h3>
          </div>
          <div className="space-y-4">
            {evaluation.risks?.map((risk: string, i: number) => (
              <div key={i} className="flex gap-3 items-start">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">{risk}</p>
              </div>
            ))}
            {(!evaluation.risks || evaluation.risks.length === 0) && (
              <p className="text-sm text-muted-foreground italic">No prominent risks identified.</p>
            )}
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
