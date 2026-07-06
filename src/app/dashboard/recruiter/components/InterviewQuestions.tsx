"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle, MessagesSquare } from "lucide-react"

export default function InterviewQuestions({ data }: { data: any }) {
  const { evaluation } = data
  if (!evaluation || !evaluation.customQuestions) return null;

  return (
    <Card className="bg-white/5 border-white/10 shadow-2xl overflow-hidden mt-8">
      <CardHeader className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-b border-white/5 pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg shrink-0">
            <MessagesSquare className="w-6 h-6 text-purple-400" />
          </div>
          Recruiter Probing Questions
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          AI-generated questions tailored to investigate this candidate's specific weaknesses, resume claims, and past interview performance.
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {evaluation.customQuestions?.map((q: any, i: number) => (
            <div key={i} className="flex gap-4 items-start p-4 bg-black/40 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold shrink-0 mt-0.5">
                {i + 1}
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground leading-relaxed">{q.question}</h4>
                <div className="flex gap-2 items-start text-xs text-muted-foreground bg-white/5 p-2 rounded-md">
                  <HelpCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-orange-400" />
                  <p className="leading-relaxed"><strong>Why Ask:</strong> {q.reason}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
