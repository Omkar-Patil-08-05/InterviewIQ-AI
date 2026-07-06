import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import prisma from '@/lib/prisma';

export const CareerReadinessInsightsSchema = z.object({
  strengths: z.array(z.string()).describe("Top 4 key strengths of the candidate"),
  weaknesses: z.array(z.string()).describe("Top 4 weaknesses or areas of improvement"),
  weeklyGoals: z.array(z.string()).describe("5 highly personalized actionable weekly goals"),
  careerInsights: z.string().describe("A concise 1-2 sentence overarching career insight"),
  skillRadar: z.array(z.object({
    subject: z.string(),
    score: z.number(),
    fullMark: z.number()
  })).describe("Exactly 8 subjects: DSA, Backend, Frontend, Databases, System Design, Communication, Problem Solving, Leadership. fullMark is always 100. Generate score based on candidate data."),
  companyReadiness: z.array(z.object({
    company: z.string(),
    score: z.number(),
    missingSkills: z.array(z.string()),
    resumeMatch: z.string(),
    interviewReadiness: z.string(),
    codingReadiness: z.string(),
    overallRecommendation: z.string()
  })).describe("Generate readiness analysis for top companies (e.g. Google, Amazon, Microsoft) or the specific companies found in their Job Descriptions."),
  improvementTimeline: z.array(z.object({
    date: z.string(),
    event: z.string(),
    description: z.string(),
    type: z.string() // e.g. "resume", "interview", "coding", "ats"
  })).describe("A chronological timeline of 5 milestones based on their actual data"),
  recruiterPreview: z.object({
    summary: z.string(),
    ats: z.string(),
    interview: z.string(),
    coding: z.string(),
    topSkills: z.array(z.string()),
    risks: z.array(z.string()),
    recommendation: z.string(),
    rating: z.number().describe("1 to 10 overall candidate rating")
  })
});

export class CareerReadinessService {
  static async getOrGenerateReadiness(userId: string) {
    // 1. Fetch latest timestamps to check cache invalidation
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

    const cache = await prisma.careerReadinessCache.findUnique({ where: { userId } });

    if (cache && cache.updatedAt.getTime() >= latestActivityDate) {
       return cache;
    }

    // 2. Fetch all raw data for aggregation
    const resumes = await prisma.resume.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 1 });
    const jobAnalyses = await prisma.jobAnalysis.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 5, include: { jobDescription: true } });
    const interviewReports = await prisma.interviewReport.findMany({ 
      where: { interview: { userId } }, 
      orderBy: { createdAt: 'desc' }, 
      take: 5 
    });
    const codingAttempts = await prisma.codingAttempt.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 50 });

    // 3. Compute Component Scores
    let resumeScore = 0;
    if (resumes.length > 0) {
      // Basic heuristic: length of resume text up to 2000 chars gives 100
      resumeScore = Math.min(100, Math.floor((resumes[0].rawText.length / 2000) * 100));
      // Boost if they have parsed ATS score
      if (resumes[0].atsScore) {
         resumeScore = (resumeScore + resumes[0].atsScore) / 2;
      }
    }

    let atsScore = 0;
    if (jobAnalyses.length > 0) {
       atsScore = jobAnalyses.reduce((acc, curr) => acc + curr.atsMatchScore, 0) / jobAnalyses.length;
    }

    let interviewScore = 0;
    if (interviewReports.length > 0) {
       interviewScore = interviewReports.reduce((acc, curr) => acc + curr.overallScore, 0) / interviewReports.length;
    }

    let codingScore = 0;
    if (codingAttempts.length > 0) {
       const successful = codingAttempts.filter(c => c.executionStatus === 'success').length;
       codingScore = (successful / codingAttempts.length) * 100;
    }

    let skillCoverageScore = 20;
    if (resumes.length > 0) skillCoverageScore += 20;
    if (jobAnalyses.length > 0) skillCoverageScore += 20;
    if (interviewReports.length > 0) skillCoverageScore += 20;
    if (codingAttempts.length > 0) skillCoverageScore += 20;

    const componentScores = {
       resume: Math.round(resumeScore),
       ats: Math.round(atsScore),
       interview: Math.round(interviewScore),
       coding: Math.round(codingScore),
       skill: Math.round(skillCoverageScore)
    };

    // Calculate weighted overall score (20% each)
    const overallScore = Math.round(
      (componentScores.resume * 0.20) +
      (componentScores.ats * 0.20) +
      (componentScores.interview * 0.20) +
      (componentScores.coding * 0.20) +
      (componentScores.skill * 0.20)
    );

    // 4. Generate AI Insights
    const aiContext = `
      CANDIDATE PERFORMANCE DATA:
      - Overall Calculated Readiness: ${overallScore}/100
      - Resume Score: ${componentScores.resume}
      - ATS Match Score: ${componentScores.ats} (Across ${jobAnalyses.length} Job Descriptions)
      - Interview Score: ${componentScores.interview} (Across ${interviewReports.length} Interviews)
      - Coding Success Rate: ${componentScores.coding}% (Across ${codingAttempts.length} Submissions)
      
      RECENT INTERVIEW FEEDBACK:
      ${interviewReports.slice(0,2).map(r => `Score: ${r.overallScore}, Strengths: ${r.strengths.join(', ')}, Weaknesses: ${r.weaknesses.join(', ')}`).join('\n')}

      TARGET COMPANIES:
      ${jobAnalyses.map(ja => ja.jobDescription.company || 'Unknown').join(', ')}
    `;

    try {
      const { object } = await generateObject({
        model: google('gemini-flash-latest'),
        schema: CareerReadinessInsightsSchema,
        prompt: `You are an elite Tech Recruiter and Career Coach. Analyze the candidate's performance data below and generate a comprehensive Career Readiness Report. Be critical but encouraging. Make the weekly goals highly actionable (e.g. 'Solve 10 Dynamic Programming Leetcode mediums' rather than 'Practice coding'). Ensure companyReadiness array is robust and recruiter preview is deeply analytical.
        
        DATA:
        ${aiContext}
        `
      });

      // 5. Upsert Cache
      const newCache = await prisma.careerReadinessCache.upsert({
        where: { userId },
        update: {
          overallScore,
          componentScores,
          companyReadiness: object.companyReadiness,
          skillRadar: object.skillRadar,
          strengths: object.strengths,
          weaknesses: object.weaknesses,
          weeklyGoals: object.weeklyGoals,
          careerInsights: object.careerInsights,
          improvementTimeline: object.improvementTimeline,
          recruiterPreview: object.recruiterPreview,
          updatedAt: new Date()
        },
        create: {
          userId,
          overallScore,
          componentScores,
          companyReadiness: object.companyReadiness,
          skillRadar: object.skillRadar,
          strengths: object.strengths,
          weaknesses: object.weaknesses,
          weeklyGoals: object.weeklyGoals,
          careerInsights: object.careerInsights,
          improvementTimeline: object.improvementTimeline,
          recruiterPreview: object.recruiterPreview,
        }
      });

      return newCache;
    } catch (error) {
      console.error("AI Generation Error in CareerReadinessService:", error);
      // Fallback: Return null so the UI can gracefully show an empty state instead of crashing
      return null;
    }
  }
}
