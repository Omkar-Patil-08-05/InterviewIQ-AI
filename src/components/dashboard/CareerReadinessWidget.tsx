import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Zap, Building2, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import prisma from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"

export default async function CareerReadinessWidget() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null;

  // Find the most recent analysis
  const latestAnalysis = await prisma.jobAnalysis.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      resume: true,
      jobDescription: true
    }
  })

  if (!latestAnalysis) {
    return (
      <Card className="bg-black/20 border-white/10">
        <CardContent className="p-6 text-center text-sm text-muted-foreground flex flex-col items-center justify-center min-h-[150px]">
          <Target className="w-8 h-8 mb-3 opacity-20" />
          <p>No Career Intelligence data yet.</p>
          <Link href="/dashboard/career-intelligence">
            <Button variant="link" className="text-primary mt-2">Analyze your Resume vs Job Description</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  const companyReadiness = latestAnalysis.companyReadiness as any[];
  const topCompany = companyReadiness && companyReadiness.length > 0 
    ? companyReadiness.reduce((prev, curr) => (prev.score > curr.score) ? prev : curr) 
    : null;

  return (
    <Card className="bg-white/5 border-white/10 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-50" />
      <CardHeader className="relative pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" /> Career Readiness
          </CardTitle>
          <Link href="/dashboard/career-intelligence">
            <Button variant="ghost" size="sm" className="gap-2 h-8 text-xs">
              Full Analysis <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="relative grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        
        <div className="bg-black/40 border border-white/10 rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">ATS Match</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold font-mono text-green-400">{latestAnalysis.atsMatchScore}</span>
            <span className="text-sm text-muted-foreground mb-1">/100</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2 truncate">Target: {latestAnalysis.jobDescription.title}</p>
        </div>

        <div className="bg-black/40 border border-white/10 rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Top Readiness</p>
          {topCompany ? (
            <>
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold">{topCompany.company}</span>
              </div>
              <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-1000 ${topCompany.score >= 80 ? 'bg-green-500' : topCompany.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${topCompany.score}%` }} />
              </div>
            </>
          ) : (
             <span className="text-sm text-muted-foreground italic">N/A</span>
          )}
        </div>

        <div className="bg-black/40 border border-white/10 rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Active Resume</p>
          <p className="text-sm font-semibold truncate text-blue-400">{latestAnalysis.resume.fileName}</p>
          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
            {(latestAnalysis.resumeImprovements as any)?.suggestions?.length || 0} optimization tips available.
          </p>
        </div>

      </CardContent>
    </Card>
  )
}
