import { NextResponse } from 'next/server'
import { ResumeParserService } from '@/lib/services/resume-parser.service'
import { AIResumeService } from '@/lib/services/ai-resume.service'
import { logger } from "@/lib/logger"
import { requireUser } from "@/lib/auth-utils"
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    let user;
    try {
      user = await requireUser()
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    
    // Parse the physical file into raw text
    const parsedText = await ResumeParserService.parseFile(buffer, file.type)
    
    let analysis;
    try {
      // Analyze the raw text using Gemini to get structured output
      analysis = await AIResumeService.analyzeResume(parsedText);
    } catch (aiError: any) {
      logger.error("AI Analysis Error:", aiError);
      
      const errorMessage = aiError.message?.toLowerCase() || "";
      if (errorMessage.includes("quota") || errorMessage.includes("429") || errorMessage.includes("rate limit")) {
        return NextResponse.json(
          { error: "Our AI analysis service is currently overloaded or out of quota. Please try again later or upgrade your plan." },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { error: "Failed to analyze resume with AI. Please ensure the document is readable and try again." },
        { status: 500 }
      );
    }
    
    // Ensure user exists in Prisma before creating the resume
    const userEmail = user.email || user.user_metadata?.email || 'unknown@example.com';
    const userName = user.user_metadata?.full_name || 'Candidate';
    
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        email: userEmail,
        name: userName
      },
      create: {
        id: user.id,
        email: userEmail,
        name: userName,
      }
    })

    // Link to the authenticated User session and save to Prisma
    const savedResume = await prisma.resume.create({
      data: {
        userId: user.id,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        rawText: parsedText,
        structuredData: analysis.structuredData ? (analysis.structuredData as any) : {},
        gapAnalysis: analysis.gapAnalysis ? (analysis.gapAnalysis as any) : {},
        atsScore: analysis.atsScore || 0,
      }
    })
    
    // Create a notification for the user
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'RESUME_ANALYZED',
        message: `Your resume ${file.name} has been parsed and scored. ATS Score: ${analysis.atsScore || 0}/100.`
      }
    })

    return NextResponse.json({ success: true, analysis, resumeId: savedResume.id })
  } catch (error: any) {
    logger.error("Resume Upload Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
