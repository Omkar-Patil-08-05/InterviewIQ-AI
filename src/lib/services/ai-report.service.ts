import { google } from '@ai-sdk/google'
import { generateObject } from 'ai'
import { z } from 'zod'
import prisma from '@/lib/prisma'
export const ReportSchema = z.object({
  overallScore: z.number().min(0).max(100),
  hiringRecommendation: z.string(),
  confidenceLevel: z.string(),
  performanceMetrics: z.object({
    technicalKnowledge: z.number().min(0).max(100),
    problemSolving: z.number().min(0).max(100),
    communication: z.number().min(0).max(100),
    confidence: z.number().min(0).max(100),
    timeManagement: z.number().min(0).max(100),
    accuracy: z.number().min(0).max(100),
  }),
  strengths: z.array(z.string()).length(5),
  weaknesses: z.array(z.string()).length(5),
  learningRoadmap: z.object({
    topicsToRevise: z.array(z.string()),
    suggestedQuestions: z.array(z.string()),
    leetCodeDifficulty: z.string(),
    learningOrder: z.array(z.string()),
  }),
  companyReadiness: z.object({
    google: z.number().min(0).max(100),
    microsoft: z.number().min(0).max(100),
    amazon: z.number().min(0).max(100),
    flipkart: z.number().min(0).max(100),
    infosys: z.number().min(0).max(100),
  }),
})

export class AIReportService {
  /**
   * Generates a fully structured analytical report using Gemini
   */
  static async generateReportForInterview(interviewTranscript: string, interviewId: string) {
    const { object } = await generateObject({
      model: google('gemini-flash-latest'),
      schema: ReportSchema,
      prompt: `Analyze the following interview transcript and generate a highly detailed, professional performance report. The output must strictly adhere to the provided schema.\n\nTranscript:\n\n${interviewTranscript}`,
    })

    const report = await prisma.interviewReport.create({
      data: {
        interviewId,
        overallScore: object.overallScore,
        hiringRecommendation: object.hiringRecommendation,
        confidenceLevel: object.confidenceLevel,
        performanceMetrics: object.performanceMetrics,
        strengths: object.strengths,
        weaknesses: object.weaknesses,
        learningRoadmap: object.learningRoadmap,
        companyReadiness: object.companyReadiness,
      }
    })
    return report
  }
}
