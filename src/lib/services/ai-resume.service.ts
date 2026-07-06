import { google } from '@ai-sdk/google'
import { generateObject } from 'ai'
import { z } from 'zod'

export const ResumeProfileSchema = z.object({
  personalInfo: z.object({ name: z.string().optional(), title: z.string().optional() }),
  education: z.array(z.string()),
  experience: z.array(z.object({ role: z.string(), company: z.string(), duration: z.string(), highlights: z.array(z.string()) })),
  skills: z.array(z.string()),
  projects: z.array(z.object({ name: z.string(), description: z.string(), techStack: z.array(z.string()) })),
  certifications: z.array(z.string()),
  technologies: z.array(z.string()),
  achievements: z.array(z.string()),
})

export const GapAnalysisSchema = z.object({
  missingSkills: z.array(z.string()),
  weakProjectDescriptions: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  missingAchievements: z.boolean(),
  improvementSuggestions: z.array(z.string()),
  atsOptimizationScore: z.number().min(0).max(100),
})

export class AIResumeService {
  /**
   * Transforms raw resume text into structured JSON data and runs ATS gap analysis.
   */
  static async analyzeResume(parsedText: string) {
    const profilePromise = generateObject({
      model: google('gemini-flash-latest'),
      schema: ResumeProfileSchema,
      prompt: `Extract structured resume data from the following text:\n\n${parsedText}`,
    })

    const gapPromise = generateObject({
      model: google('gemini-flash-latest'),
      schema: GapAnalysisSchema,
      prompt: `Analyze the following resume text. Identify gaps, weak descriptions, missing keywords, and suggest improvements. Assume the candidate is targeting software engineering roles. Rate their ATS optimization score (0-100).\n\n${parsedText}`,
    })

    const [profileResult, gapResult] = await Promise.all([profilePromise, gapPromise])

    return {
      structuredData: profileResult.object,
      gapAnalysis: gapResult.object,
      atsScore: gapResult.object.atsOptimizationScore
    }
  }
}
