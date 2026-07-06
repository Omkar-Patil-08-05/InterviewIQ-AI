import { NextResponse } from 'next/server'
import { PistonExecutionService } from '@/lib/services/code-executor/piston.service'
import { AICodeReviewerService } from '@/lib/services/ai-code-reviewer.service'
import prisma from '@/lib/prisma'
import { logger } from "@/lib/logger"
import { requireUser } from "@/lib/auth-utils"

// Using the Adapter Pattern. Future: Swap this to Judge0ExecutionService.
const executor = new PistonExecutionService()

export const maxDuration = 45

export async function POST(req: Request) {
  try {
    let user;
    try {
      user = await requireUser()
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { code, language, question, interviewId } = await req.json()

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
    let isStrict = false
    if (dbUser?.settings) {
      const settings = dbUser.settings as Record<string, unknown>
      if (settings.strictMode) isStrict = true
    }
    
    // Test cases can be derived from question or hardcoded for now until full dynamic evaluation is built
    const testCases = [
      { input: "1 2", expectedOutput: "" },
      { input: "3 4", expectedOutput: "" }
    ]

    // 1. Execute Code via Adapter
    const executionResult = await executor.executeCode(code, language, testCases)
    
    // 2. Perform deep AI structural review passing actual execution results
    let aiReview = null
    try {
      aiReview = await AICodeReviewerService.reviewCode(code, language, question, executionResult, isStrict)
    } catch (aiErr: any) {
      console.warn("AI Review Skipped due to error:", aiErr.message)
      // Fallback AI review object so UI doesn't completely break, or just leave it null
      aiReview = null
    }

    // 3. Save to Prisma
    if (interviewId) {
      // Find latest question for this interview
      let questionRecord = await prisma.question.findFirst({
        where: { interviewId },
        orderBy: { createdAt: 'desc' }
      })

      if (!questionRecord) {
        questionRecord = await prisma.question.create({
          data: {
            interviewId,
            questionText: question || "Coding Challenge",
          }
        })
      }

      await prisma.codingAttempt.create({
        data: {
          userId: user.id,
          interviewId: interviewId,
          questionId: questionRecord.id,
          language,
          sourceCode: code,
          stdin: testCases.map(tc => tc.input).join('\n'),
          stdout: executionResult.stdout || executionResult.output,
          stderr: executionResult.compilationError || executionResult.runtimeError || null,
          executionStatus: executionResult.executionStatus,
          runtimeMs: executionResult.runtimeMs,
          memoryMb: executionResult.memoryMb,
          testResults: JSON.parse(JSON.stringify(executionResult)),
          aiReview: aiReview ? JSON.parse(JSON.stringify(aiReview)) : null,
          timeComplexity: aiReview?.timeComplexity || "Unknown",
          spaceComplexity: aiReview?.spaceComplexity || "Unknown"
        }
      })
    }
    
    return NextResponse.json({ executionResult, aiReview })
  } catch (err: any) {
    logger.error("Execution Error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
