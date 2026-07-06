import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import CareerIntelligenceClient from "./CareerIntelligenceClient"

export default async function CareerIntelligencePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/sign-in")
  }

  // Fetch Resumes and JDs
  const [resumes, jds] = await Promise.all([
    prisma.resume.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.jobDescription.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })
  ]);

  // Fetch latest Job Analysis if active ones exist
  const activeJd = jds.find(j => j.isActive) || jds[0];
  const activeResume = resumes[0]; // Assume first is active for now

  let latestAnalysis = null;
  if (activeJd && activeResume) {
    latestAnalysis = await prisma.jobAnalysis.findUnique({
      where: {
        resumeId_jobDescriptionId: {
          resumeId: activeResume.id,
          jobDescriptionId: activeJd.id
        }
      },
      include: {
        resume: true,
        jobDescription: true
      }
    })
  }

  return (
    <CareerIntelligenceClient 
      resumes={resumes} 
      jds={jds} 
      initialAnalysis={latestAnalysis} 
    />
  )
}
