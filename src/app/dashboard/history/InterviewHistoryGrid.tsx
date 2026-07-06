"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Search } from "lucide-react"
import Link from "next/link"

interface InterviewHistoryGridProps {
  interviews: any[]
}

export function InterviewHistoryGrid({ interviews }: InterviewHistoryGridProps) {
  const [search, setSearch] = useState("")

  const filtered = interviews.filter((interview) => {
    if (!search) return true
    const s = search.toLowerCase()
    return (
      interview.role.toLowerCase().includes(s) ||
      interview.difficulty.toLowerCase().includes(s)
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search by role or difficulty..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white/5 border-white/10"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground p-8 border border-white/5 border-dashed rounded-lg">
          No interviews match your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((interview) => {
            const report = interview.interviewReports?.[0]
            return (
              <Card key={interview.id} className="bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium text-foreground">{interview.role}</CardTitle>
                  <div className="text-xs text-muted-foreground bg-black/50 px-2 py-1 rounded">{interview.difficulty}</div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-3xl font-bold text-primary">
                        {report ? Math.round(report.overallScore) : "N/A"}
                        <span className="text-sm text-muted-foreground">/100</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Overall Score</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${
                        report?.hiringRecommendation === "Hire" || report?.hiringRecommendation === "Strong Hire" 
                          ? "text-green-400" 
                          : report?.hiringRecommendation 
                            ? "text-orange-400" 
                            : "text-muted-foreground"
                      }`}>
                        {report?.hiringRecommendation || "Pending"}
                      </div>
                      <p className="text-xs text-muted-foreground">Recommendation</p>
                    </div>
                  </div>
                  
                  <Link href={`/dashboard/reports/${interview.id}`} className="w-full block">
                    <Button variant="ghost" className="w-full justify-between hover:bg-white/5 border border-white/5">
                      View Full Report <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
