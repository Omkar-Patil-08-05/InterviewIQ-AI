"use client"

import { useRef, useState } from "react"
import { AnalyticsData } from "@/types/analytics"
import { motion } from "framer-motion"
import { Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
// PDF export uses native window.print()
// Components we will create next
import OverallStats from "@/components/dashboard/coding/OverallStats"
import dynamic from "next/dynamic"

const ChartsTabs = dynamic(() => import("@/components/dashboard/coding/ChartsTabs"), { 
  ssr: false, 
  loading: () => <div className="h-[400px] bg-white/5 animate-pulse rounded-xl border border-white/10" /> 
})
import Heatmap from "@/components/dashboard/coding/Heatmap"
import LanguageAnalytics from "@/components/dashboard/coding/LanguageAnalytics"
import AIInsights from "@/components/dashboard/coding/AIInsights"
import SubmissionHistory from "@/components/dashboard/coding/SubmissionHistory"
import StreakTracker from "@/components/dashboard/coding/StreakTracker"
import Achievements from "@/components/dashboard/coding/Achievements"
import CompanyReadiness from "@/components/dashboard/coding/CompanyReadiness"
import Leaderboard from "@/components/dashboard/coding/Leaderboard"
import CodingGoals from "@/components/dashboard/coding/CodingGoals"
import PersonalBests from "@/components/dashboard/coding/PersonalBests"

interface Props {
  data: AnalyticsData
}

export default function CodingAnalyticsClient({ data }: Props) {
  const dashboardRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState(false)

  const exportPDF = () => {
    // Using the native browser print API is much more robust for modern CSS
    window.print()
  }

  const exportCSV = () => {
    const headers = ["Question", "Language", "Status", "Runtime (ms)", "Memory (MB)", "Time Complexity", "Space Complexity", "Date"]
    const rows = data.attempts.map(a => [
      a.question.questionText.replace(/,/g, ""), 
      a.language, 
      a.executionStatus || "Unknown", 
      a.runtimeMs.toString(), 
      a.memoryMb.toString(), 
      a.timeComplexity || "", 
      a.spaceComplexity || "", 
      new Date(a.createdAt).toLocaleString()
    ])
    
    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "Submissions.csv"
    link.click()
  }

  if (data.attempts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in">
        <h2 className="text-2xl font-bold text-foreground mb-2">No Coding Data Yet</h2>
        <p className="text-muted-foreground mb-6">Complete a mock interview with a coding challenge to see your analytics here.</p>
        <Button onClick={() => window.location.href='/dashboard/setup'}>Start Interview</Button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Advanced Coding Analytics</h1>
          <p className="text-muted-foreground mt-1 text-lg">
            Deep insights into coding performance for <span className="text-primary font-bold">{data.user?.name}</span>.
          </p>
          <p className="text-xs text-muted-foreground mt-1 hidden print:block">
            {data.user?.email} • Generated on {new Date().toISOString().split('T')[0]}
          </p>
        </div>
        <div className="flex gap-3 print:hidden">
          <Button variant="outline" onClick={exportCSV} className="gap-2 bg-white/5 border-white/10 hover:bg-white/10">
            <FileText className="w-4 h-4" /> Export CSV
          </Button>
          <Button onClick={exportPDF} disabled={isExporting} className="gap-2">
            <Download className="w-4 h-4" /> {isExporting ? "Generating..." : "Export PDF"}
          </Button>
        </div>
      </div>

      <div ref={dashboardRef} className="space-y-8 bg-black">
        {/* Row 1: Overall Stats & Streak */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3">
            <OverallStats data={data} />
          </div>
          <div className="xl:col-span-1">
            <StreakTracker data={data} />
          </div>
        </div>

        {/* Row 2: Heatmap, Goals, Bests */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3">
            <Heatmap data={data} />
          </div>
          <div className="xl:col-span-1 flex flex-col gap-6">
            <div className="flex-1">
              <CodingGoals data={data} />
            </div>
            <div className="flex-1">
              <PersonalBests data={data} />
            </div>
          </div>
        </div>

        {/* Row 2.5: Achievements (Full Width) */}
        <div className="grid grid-cols-1 gap-6">
          <Achievements data={data} />
        </div>

        {/* Row 3: Interactive Charts */}
        <ChartsTabs data={data} />

        {/* Row 4: AI Insights & Company Readiness */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AIInsights data={data} />
          <CompanyReadiness data={data} />
        </div>

        {/* Row 5: Language Analytics & Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LanguageAnalytics data={data} />
          <Leaderboard data={data} />
        </div>

        {/* Row 6: Advanced Submission History */}
        <SubmissionHistory data={data} />
      </div>
    </div>
  )
}
