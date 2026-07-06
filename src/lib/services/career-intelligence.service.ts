import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';

export const MatchSchema = z.object({
  atsMatchScore: z.number().describe("0 to 100 ATS Match Score"),
  overallCompatibility: z.number().describe("0 to 100 Overall Compatibility"),
  technicalSkillMatch: z.object({
    score: z.number(),
    matching: z.array(z.string()),
    missing: z.array(z.string())
  }),
  softSkillMatch: z.object({
    score: z.number(),
    matching: z.array(z.string()),
    missing: z.array(z.string())
  }),
  experienceMatch: z.object({
    score: z.number(),
    feedback: z.string()
  }),
  educationMatch: z.object({
    score: z.number(),
    feedback: z.string()
  }),
  projectMatch: z.object({
    score: z.number(),
    feedback: z.string()
  }),
  keywordMatch: z.object({
    score: z.number(),
    matching: z.array(z.string()),
    missing: z.array(z.string())
  }),
  missingSkills: z.object({
    critical: z.array(z.string()),
    important: z.array(z.string()),
    optional: z.array(z.string())
  }),
  resumeImprovements: z.object({
    suggestions: z.array(z.object({
      category: z.string(),
      suggestion: z.string(),
      impact: z.string()
    }))
  }),
  aiCareerRoadmap: z.object({
    shortTerm: z.array(z.string()),
    mediumTerm: z.array(z.string()),
    longTerm: z.array(z.string())
  }),
  companyReadiness: z.array(z.object({
    company: z.string(),
    score: z.number(),
    reason: z.string(),
    improvements: z.string()
  })).describe("Company readiness for Google, Amazon, Microsoft, Meta, Apple, Netflix, Adobe, Flipkart, Infosys, TCS")
});

export class CareerIntelligenceService {
  static async analyzeResumeVsJD(resumeText: string, jdText: string) {
    try {
      const { object } = await generateObject({
        model: google('gemini-flash-latest'),
        schema: MatchSchema,
        prompt: `You are an elite ATS System and Career Coach. Compare the following Resume and Job Description. Provide a deep analysis, score the match out of 100, identify missing skills categorized by criticality, provide actionable resume improvement suggestions, generate an AI career roadmap (short/medium/long term), and compute company readiness scores for top companies.
        
        RESUME:
        ${resumeText.substring(0, 4000)}
        
        JOB DESCRIPTION:
        ${jdText.substring(0, 4000)}
        `
      });
      return object;
    } catch (error) {
      logger.error("AI Career Intelligence Error:", error);
      throw error;
    }
  }
}
