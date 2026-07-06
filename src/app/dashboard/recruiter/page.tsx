import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { RecruiterEvaluationService } from "@/lib/services/recruiter-evaluation.service";
import RecruiterClient from "./RecruiterClient";
import prisma from "@/lib/prisma";

export default async function RecruiterPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Generate or fetch Recruiter Evaluation
  const evaluation = await RecruiterEvaluationService.getOrGenerateEvaluation(user.id);
  // Fetch contextual data for the UI sections in parallel
  const [dbUser, resumes, jobAnalyses] = await Promise.all([
    prisma.user.findUnique({ where: { id: user.id } }),
    prisma.resume.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } }),
    prisma.jobAnalysis.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, include: { jobDescription: true } })
  ]);

  const [interviews, coding, careerReadiness] = await Promise.all([
    prisma.interviewReport.findMany({ where: { interview: { userId: user.id } }, orderBy: { createdAt: 'desc' } }),
    prisma.codingAttempt.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } }),
    prisma.careerReadinessCache.findUnique({ where: { userId: user.id } })
  ]);

  const rawData = JSON.parse(JSON.stringify({
    user: dbUser,
    evaluation,
    resumes,
    jobAnalyses,
    interviews,
    coding,
    careerReadiness
  }));

  return (
    <div className="min-h-screen bg-background">
      <RecruiterClient data={rawData} />
    </div>
  );
}
