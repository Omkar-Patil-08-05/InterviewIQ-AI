"use server"

import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { CareerIntelligenceService } from "@/lib/services/career-intelligence.service"
import { revalidatePath } from "next/cache"

export async function generateJobAnalysis(resumeId: string, jdId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Check if analysis already exists
  const existing = await prisma.jobAnalysis.findUnique({
    where: {
      resumeId_jobDescriptionId: {
        resumeId,
        jobDescriptionId: jdId
      }
    }
  })

  if (existing) {
    return existing; // Return cached analysis
  }

  // Fetch resume and JD
  const resume = await prisma.resume.findUnique({ where: { id: resumeId, userId: user.id } })
  const jd = await prisma.jobDescription.findUnique({ where: { id: jdId, userId: user.id } })

  if (!resume || !jd) throw new Error("Resume or JD not found")

  // Generate Analysis via AI
  const analysis = await CareerIntelligenceService.analyzeResumeVsJD(resume.rawText, jd.rawText)

  // Save to Prisma
  const savedAnalysis = await prisma.jobAnalysis.create({
    data: {
      userId: user.id,
      resumeId: resume.id,
      jobDescriptionId: jd.id,
      atsMatchScore: analysis.atsMatchScore,
      overallCompatibility: analysis.overallCompatibility,
      technicalSkillMatch: analysis.technicalSkillMatch,
      softSkillMatch: analysis.softSkillMatch,
      experienceMatch: analysis.experienceMatch,
      educationMatch: analysis.educationMatch,
      projectMatch: analysis.projectMatch,
      keywordMatch: analysis.keywordMatch,
      missingSkills: analysis.missingSkills,
      resumeImprovements: analysis.resumeImprovements,
      aiCareerRoadmap: analysis.aiCareerRoadmap,
      companyReadiness: analysis.companyReadiness,
    }
  })

  revalidatePath("/dashboard/career-intelligence")
  revalidatePath("/dashboard")
  return savedAnalysis
}

export async function getJobAnalysis(resumeId: string, jdId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  return await prisma.jobAnalysis.findUnique({
    where: {
      resumeId_jobDescriptionId: {
        resumeId,
        jobDescriptionId: jdId
      }
    },
    include: {
      resume: true,
      jobDescription: true
    }
  })
}
