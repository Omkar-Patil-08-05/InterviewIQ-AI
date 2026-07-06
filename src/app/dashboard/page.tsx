import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, TrendingUp, Clock, Target, ArrowRight } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import CareerReadinessWidget from "@/components/dashboard/CareerReadinessWidget"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/sign-in")
  }

  // Fetch aggregated data
  const [aggregations, completedInterviews, codingAttemptsCount, recentInterviews] = await Promise.all([
    prisma.interviewReport.aggregate({
      where: { interview: { userId: user.id } },
      _avg: { overallScore: true },
    }),
    prisma.interview.count({
      where: { userId: user.id, status: 'COMPLETED' }
    }),
    prisma.codingAttempt.count({
      where: { userId: user.id }
    }),
    prisma.interview.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        jobDescription: true,
        interviewReports: true
      }
    })
  ]);

  const avgScore = aggregations._avg.overallScore ? Math.round(aggregations._avg.overallScore) : 0
  const timePracticingMins = (completedInterviews * 30) + (codingAttemptsCount * 15)
  const timePracticingHrs = Math.floor(timePracticingMins / 60)
  const timePracticingRemainder = timePracticingMins % 60

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">Track your interview preparation progress.</p>
        </div>
        <Link href="/dashboard/setup">
          <Button className="gap-2 bg-primary text-white hover:bg-primary/90">
            <Plus className="w-4 h-4" /> New Interview
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/5 border-white/10 hover:bg-white/[0.07] transition-colors cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Score</CardTitle>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgScore}<span className="text-sm text-muted-foreground font-normal">/100</span></div>
            <p className="text-xs text-muted-foreground mt-1">{completedInterviews > 0 ? "Based on recent interviews" : "No data yet"}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 border-white/10 hover:bg-white/[0.07] transition-colors cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Interviews Completed</CardTitle>
            <Target className="w-4 h-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedInterviews}</div>
            <p className="text-xs text-muted-foreground mt-1">Total completed</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 hover:bg-white/[0.07] transition-colors cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Time Practicing</CardTitle>
            <Clock className="w-4 h-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{timePracticingHrs}h {timePracticingRemainder}m</div>
            <p className="text-xs text-muted-foreground mt-1">Across all sessions</p>
          </CardContent>
        </Card>
      </div>

      <CareerReadinessWidget />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Recent Activity</h2>
        <Card className="bg-black/20 border-white/10">
          <div className="divide-y divide-white/10">
            {recentInterviews.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground flex flex-col items-center justify-center min-h-[200px]">
                <Target className="w-8 h-8 mb-3 opacity-20" />
                <p>No recent interviews.</p>
                <Link href="/dashboard/setup">
                  <Button variant="link" className="text-primary mt-2">Start your first mock interview</Button>
                </Link>
              </div>
            ) : (
              recentInterviews.map((interview) => (
                <div key={interview.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div>
                    <h3 className="font-medium text-foreground">{interview.role}</h3>
                    <p className="text-sm text-muted-foreground">{new Date(interview.createdAt).toLocaleDateString()} • {interview.difficulty}</p>
                  </div>
                  {interview.status === "COMPLETED" ? (
                    <Link href={`/dashboard/reports/${interview.id}`}>
                      <Button variant="ghost" size="sm" className="gap-2 border border-white/5">
                        View Report <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  ) : (
                    <Link href={`/interview/${interview.id}`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        Resume Interview <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
