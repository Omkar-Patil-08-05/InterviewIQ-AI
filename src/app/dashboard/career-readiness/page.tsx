import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { CareerReadinessService } from "@/lib/services/career-readiness.service"
import { TopScoreSection } from "./components/TopScoreSection"
import { ComponentBreakdown } from "./components/ComponentBreakdown"
import { CompanyReadinessGrid } from "./components/CompanyReadinessGrid"
import nextDynamic from "next/dynamic"
const SkillRadar = nextDynamic(() => import('./components/SkillRadar').then(mod => mod.SkillRadar))
import { AIInsights } from "./components/AIInsights"
import { ImprovementTimeline } from "./components/ImprovementTimeline"
import { RecruiterPreview } from "./components/RecruiterPreview"
import { Target } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function CareerReadinessPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/sign-in")
  }

  // Fetch or generate the massive career readiness report
  const rawCache = await CareerReadinessService.getOrGenerateReadiness(user.id)
  const readinessCache = rawCache ? JSON.parse(JSON.stringify(rawCache)) : null;

  if (!readinessCache) {
    return (
      <div className="flex-1 p-8 pt-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Career Readiness Hub</h1>
        <p className="text-muted-foreground">Not enough data to generate your career readiness profile. Try uploading a resume and completing an interview first.</p>
      </div>
    )
  }

  const componentScores = readinessCache.componentScores as any;
  const companyReadiness = readinessCache.companyReadiness as any;
  const skillRadar = readinessCache.skillRadar as any;
  const timeline = readinessCache.improvementTimeline as any;
  const recruiterPreview = readinessCache.recruiterPreview as any;

  return (
    <div className="flex-1 overflow-y-auto bg-background p-4 md:p-8 pt-6 pb-20">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Target className="w-8 h-8 text-primary" />
              Career Readiness Hub
            </h1>
            <p className="text-muted-foreground mt-1">
              Your centralized hiring-readiness intelligence dashboard.
            </p>
          </div>
          <RecruiterPreview data={recruiterPreview} />
        </div>

        {/* Top Score Section */}
        <TopScoreSection score={readinessCache.overallScore} lastUpdated={readinessCache.updatedAt} />

        {/* 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1 space-y-8">
            <ComponentBreakdown scores={componentScores} />
            <SkillRadar data={skillRadar} />
          </div>

          <div className="lg:col-span-2 space-y-8">
            <AIInsights 
              strengths={readinessCache.strengths}
              weaknesses={readinessCache.weaknesses}
              weeklyGoals={readinessCache.weeklyGoals}
              careerInsights={readinessCache.careerInsights}
            />
          </div>

        </div>

        {/* Full Width Sections */}
        <div className="space-y-8">
          <CompanyReadinessGrid companies={companyReadiness} />
          <ImprovementTimeline timeline={timeline} />
        </div>

      </div>
    </div>
  )
}
