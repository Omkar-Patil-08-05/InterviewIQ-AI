import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import prisma from '@/lib/prisma';

export const RecruiterEvaluationSchema = z.object({
  overallRating: z.number().min(0).max(10).describe("Overall Candidate Rating from 1 to 10 (e.g. 9.3)"),
  confidenceLevel: z.number().min(0).max(100).describe("Hiring Confidence percentage (e.g. 87.0)"),
  recommendation: z.string().describe("Offer Recommendation. Valid values: 'Strong Hire', 'Hire', 'Consider', 'Interview Again', 'Reject'"),
  reasoning: z.string().describe("1-2 sentences explaining the hiring decision."),
  executiveSummary: z.string().describe("A concise 3-4 sentence AI summary highlighting backend/frontend skills, ATS compatibility, and improvement areas. Written in third-person professional tone."),
  strengths: z.array(z.string()).describe("Top 5 key strengths. Short phrases (e.g. 'Strong backend architecture')."),
  risks: z.array(z.string()).describe("Top 5 recruiter concerns or risks. Short phrases (e.g. 'Limited system design experience')."),
  customQuestions: z.array(z.object({
    question: z.string(),
    reason: z.string()
  })).describe("Generate exactly 10 highly personalized recruiter probing questions based on their resume, projects, weak skills, and coding history.")
});

export class RecruiterEvaluationService {
  static async getOrGenerateEvaluation(userId: string) {
    // 1. Fetch latest timestamps for cache invalidation
    const [latestResume, latestInterview, latestCoding, latestJobAnalysis] = await Promise.all([
      prisma.resume.findFirst({ where: { userId }, orderBy: { createdAt: 'desc' }, select: { createdAt: true } }),
      prisma.interview.findFirst({ where: { userId, status: 'COMPLETED' }, orderBy: { updatedAt: 'desc' }, select: { updatedAt: true } }),
      prisma.codingAttempt.findFirst({ where: { userId }, orderBy: { createdAt: 'desc' }, select: { createdAt: true } }),
      prisma.jobAnalysis.findFirst({ where: { userId }, orderBy: { updatedAt: 'desc' }, select: { updatedAt: true } })
    ]);

    const latestActivityDate = Math.max(
      latestResume?.createdAt.getTime() || 0,
      latestInterview?.updatedAt.getTime() || 0,
      latestCoding?.createdAt.getTime() || 0,
      latestJobAnalysis?.updatedAt.getTime() || 0
    );

    if (latestActivityDate === 0) {
      return null;
    }

    const cache = await prisma.recruiterEvaluationCache.findUnique({ where: { userId } });

    // If cache is fresh, return it
    if (cache && cache.updatedAt.getTime() >= latestActivityDate) {
      return cache;
    }

    // 2. Fetch Aggregated Data
    const resumes = await prisma.resume.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 1 });
    const jobAnalyses = await prisma.jobAnalysis.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 5, include: { jobDescription: true } });
    const interviewReports = await prisma.interviewReport.findMany({ 
      where: { interview: { userId } }, 
      orderBy: { createdAt: 'desc' }, 
      take: 5 
    });
    const codingAttempts = await prisma.codingAttempt.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 50 });
    const careerReadiness = await prisma.careerReadinessCache.findUnique({ where: { userId } });

    // Handle Historical Snapshot creation if this is a regeneration
    let historicalData = cache?.historicalData ? JSON.parse(JSON.stringify(cache.historicalData)) : null;
    if (cache && cache.updatedAt.getTime() < latestActivityDate) {
      historicalData = {
         date: cache.updatedAt.toISOString(),
         overallRating: cache.overallRating,
         confidenceLevel: cache.confidenceLevel,
         recommendation: cache.recommendation,
         strengths: cache.strengths,
         risks: cache.risks
      };
    } else if (!cache) {
      // Simulate historical data if first generation, to power Comparison Mode
      historicalData = {
         date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 3 months ago
         overallRating: 6.5,
         confidenceLevel: 60.0,
         recommendation: "Consider",
         strengths: ["Basic understanding of algorithms", "Good communication"],
         risks: ["Slow coding speed", "Low ATS match"]
      };
    }

    // 3. Assemble AI Context Context
    const resumeText = resumes.length > 0 ? resumes[0].rawText.substring(0, 3000) : "No Resume Provided";
    const atsScores = jobAnalyses.map(ja => ja.atsMatchScore);
    const avgAts = atsScores.length > 0 ? (atsScores.reduce((a,b)=>a+b,0)/atsScores.length).toFixed(1) : 'N/A';
    
    const interviewScores = interviewReports.map(ir => ir.overallScore);
    const avgInterview = interviewScores.length > 0 ? (interviewScores.reduce((a,b)=>a+b,0)/interviewScores.length).toFixed(1) : 'N/A';
    const recentInterviewWeaknesses = interviewReports.flatMap(ir => ir.weaknesses).slice(0, 5);

    const successfulCoding = codingAttempts.filter(c => c.executionStatus === 'Passed').length;
    const codingSuccessRate = codingAttempts.length > 0 ? ((successfulCoding / codingAttempts.length) * 100).toFixed(1) : 'N/A';

    const aiContext = `
      CANDIDATE DATA:
      - Career Readiness Score: ${careerReadiness?.overallScore || 'N/A'}
      - Avg ATS Match: ${avgAts}
      - Avg Interview Score: ${avgInterview}
      - Recent Interview Weaknesses: ${recentInterviewWeaknesses.join(', ')}
      - Coding Success Rate: ${codingSuccessRate}%
      
      RESUME SUMMARY:
      ${resumeText}
    `;

    // 4. Generate AI Recruiter Insights
    try {
      const { object } = await generateObject({
        model: google('gemini-flash-latest'),
        schema: RecruiterEvaluationSchema,
        prompt: `You are an elite Senior Technical Recruiter at a FAANG company. Evaluate this candidate based strictly on the provided data. 
        Generate a brutally honest, professional executive summary, hiring decision, risks, strengths, and targeted interview questions that a hiring manager would want to ask them to probe their weaknesses and verify their resume claims.
        
        DATA:
        ${aiContext}
        `
      });

      // 5. Upsert Cache
      const newCache = await prisma.recruiterEvaluationCache.upsert({
        where: { userId },
        update: {
          overallRating: object.overallRating,
          confidenceLevel: object.confidenceLevel,
          recommendation: object.recommendation,
          reasoning: object.reasoning,
          executiveSummary: object.executiveSummary,
          strengths: object.strengths,
          risks: object.risks,
          customQuestions: object.customQuestions,
          historicalData: historicalData || undefined,
          updatedAt: new Date()
        },
        create: {
          userId,
          overallRating: object.overallRating,
          confidenceLevel: object.confidenceLevel,
          recommendation: object.recommendation,
          reasoning: object.reasoning,
          executiveSummary: object.executiveSummary,
          strengths: object.strengths,
          risks: object.risks,
          customQuestions: object.customQuestions,
          historicalData: historicalData || undefined
        }
      });

      return newCache;
    } catch (error) {
      console.error("AI Generation Error in RecruiterEvaluationService:", error);
      // Fallback: Return null to prevent UI from crashing
      return null;
    }
  }
}
