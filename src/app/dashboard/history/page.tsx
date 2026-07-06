import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { History, ArrowRight } from "lucide-react"
import Link from "next/link"
import { InterviewHistoryGrid } from "./InterviewHistoryGrid"
import { EmptyState } from "@/components/ui/empty-state"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"

export default async function HistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/sign-in")
  }

  const interviews = await prisma.interview.findMany({
    where: { userId: user.id, status: "COMPLETED" },
    orderBy: { createdAt: "desc" },
    include: { interviewReports: true }
  })

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Interview History</h1>
          <p className="text-muted-foreground mt-1">Review your past interviews and track your progress.</p>
        </div>
        <Button variant="outline" className="gap-2 border-white/10 hover:bg-white/5">
           Compare
        </Button>
      </div>

      {interviews.length === 0 ? (
        <EmptyState
          icon={<History />}
          title="No interviews yet"
          description="Complete your first mock interview to see your history and start tracking your progress."
          actionLabel="Create First Interview"
          actionHref="/dashboard/setup"
        />
      ) : (
        <InterviewHistoryGrid interviews={interviews} />
      )}
    </div>
  )
}
