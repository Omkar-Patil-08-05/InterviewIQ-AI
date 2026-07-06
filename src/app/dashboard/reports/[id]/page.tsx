import dynamic from "next/dynamic"
const PerformanceRadarChart = dynamic(() => import('@/components/charts/RadarChartComponent').then(mod => mod.PerformanceRadarChart))
import { ProgressBar } from '@/components/charts/ProgressBar'
import { ReportHeader } from '@/components/ReportHeader'
import { CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react'
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"

export default async function ReportPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/sign-in")
  }
  const report = await prisma.interviewReport.findFirst({
    where: { 
      interviewId: params.id,
      interview: { userId: user.id } // Ensures User Isolation
    },
    include: {
      interview: {
        include: {
          user: true
        }
      }
    }
  })

  if (!report) {
    return (
      <div className="bg-background min-h-screen p-8 text-center flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mt-20">Report Not Found</h2>
        <p className="text-muted-foreground mt-2">The interview report could not be found or you do not have permission to view it.</p>
      </div>
    )
  }

  const pmRaw = report.performanceMetrics as Record<string, number> || {}
  const pMetrics = Object.entries(pmRaw).map(([key, value]) => ({
    subject: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
    score: Number(value) || 0,
    fullMark: 100
  }))
  const cReadiness = report.companyReadiness as Record<string, number> || {}

  return (
    <div className="bg-background min-h-screen print:bg-white print:text-black">
      <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto p-4 md:p-8 print:p-0 print:m-0" id="report-container">
         <ReportHeader 
            candidateName={report.interview.user.name} 
            candidateEmail={report.interview.user.email} 
            role={report.interview.role}
            date={report.createdAt}
         />
         
         {/* Executive Summary */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:gap-4 print:grid-cols-3">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 print:bg-white print:border-gray-300 print:shadow-sm">
               <h3 className="text-sm font-medium text-muted-foreground mb-2 print:text-gray-500">Overall Score</h3>
               <div className="text-4xl font-bold text-primary print:text-blue-600">{Math.round(report.overallScore)}<span className="text-lg text-muted-foreground print:text-gray-500">/100</span></div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 print:bg-white print:border-gray-300 print:shadow-sm">
               <h3 className="text-sm font-medium text-muted-foreground mb-2 print:text-gray-500">Recommendation</h3>
               <div className={`text-2xl font-semibold flex items-center gap-2 ${report.hiringRecommendation.includes('Hire') ? 'text-green-400 print:text-green-600' : 'text-orange-400 print:text-orange-600'}`}>
                  <CheckCircle2 className="w-6 h-6" /> {report.hiringRecommendation}
               </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 print:bg-white print:border-gray-300 print:shadow-sm">
               <h3 className="text-sm font-medium text-muted-foreground mb-2 print:text-gray-500">Confidence Level</h3>
               <div className="text-2xl font-semibold text-foreground print:text-black">{report.confidenceLevel}</div>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:gap-4 print:grid-cols-2">
            {/* Radar Chart */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 print:bg-white print:border-gray-300 print:shadow-sm print:break-inside-avoid">
               <h3 className="text-lg font-semibold mb-6 print:text-black">Performance Vectors</h3>
               <PerformanceRadarChart data={pMetrics.length > 0 ? pMetrics : [
                 { subject: 'Technical Knowledge', score: 0, fullMark: 100 },
               ]} />
            </div>

            {/* Progress Bars */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6 print:bg-white print:border-gray-300 print:shadow-sm print:break-inside-avoid">
               <h3 className="text-lg font-semibold mb-6 print:text-black">Company Readiness</h3>
               {Object.keys(cReadiness).length > 0 ? Object.entries(cReadiness).map(([company, value], i) => (
                 <ProgressBar key={company} label={company} value={value as number} colorClass={i % 2 === 0 ? "bg-blue-500" : "bg-green-500"} />
               )) : (
                 <p className="text-muted-foreground text-sm">No company readiness data available.</p>
               )}
            </div>
         </div>

         {/* Strengths & Weaknesses */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:gap-4 print:grid-cols-2">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 print:bg-white print:border-gray-300 print:shadow-sm print:break-inside-avoid">
               <h3 className="text-lg font-semibold mb-4 text-green-400 print:text-green-600 flex items-center gap-2">
                 <TrendingUp className="w-5 h-5" /> Top Strengths
               </h3>
               <ul className="space-y-3 text-sm text-muted-foreground print:text-gray-700">
                 {report.strengths.length > 0 ? report.strengths.map((s, i) => (
                   <li key={i} className="flex gap-3"><span className="text-green-500">•</span> {s}</li>
                 )) : (
                   <li>No recorded strengths.</li>
                 )}
               </ul>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 print:bg-white print:border-gray-300 print:shadow-sm print:break-inside-avoid">
               <h3 className="text-lg font-semibold mb-4 text-orange-400 print:text-orange-600 flex items-center gap-2">
                 <AlertTriangle className="w-5 h-5" /> Areas for Improvement
               </h3>
               <ul className="space-y-3 text-sm text-muted-foreground print:text-gray-700">
                 {report.weaknesses.length > 0 ? report.weaknesses.map((w, i) => (
                   <li key={i} className="flex gap-3"><span className="text-orange-500">•</span> {w}</li>
                 )) : (
                   <li>No recorded areas for improvement.</li>
                 )}
               </ul>
            </div>
         </div>
      </div>
    </div>
  )
}
