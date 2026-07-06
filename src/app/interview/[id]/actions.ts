'use server'

import prisma from "@/lib/prisma"
import { AIReportService } from "@/lib/services/ai-report.service"

export async function endInterviewAction(interviewId: string, transcript: string) {
  try {
    // 1. Mark interview as completed
    await prisma.interview.update({
      where: { id: interviewId },
      data: { status: 'COMPLETED' }
    })

    // 2. Generate and save the AI Report
    await AIReportService.generateReportForInterview(transcript, interviewId)

    return { success: true }
  } catch (error: any) {
    console.error("Error ending interview:", error)
    return { success: false, error: error.message }
  }
}

export async function getInterviewSettingsAction(interviewId: string) {
  try {
    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
      include: { user: true }
    })
    
    if (interview?.user?.settings) {
      const settings = interview.user.settings as Record<string, unknown>
      return { voiceOutput: !!settings.voiceOutput, duration: interview.duration }
    }
    return { voiceOutput: false, duration: interview?.duration || 30 }
  } catch (error) {
    console.error("Error fetching settings:", error)
    return { voiceOutput: false, duration: 30 }
  }
}
