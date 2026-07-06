import { google } from '@ai-sdk/google'
import { streamText } from 'ai'
import prisma from '@/lib/prisma'
import { logger } from "@/lib/logger"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages, interviewId } = await req.json()
    
    // Default context fallback
    let context = "Frontend Developer"
    let difficulty = "Medium"

    let jdText = ""
    let isStrict = false

    if (interviewId) {
      const interview = await prisma.interview.findUnique({
        where: { id: interviewId },
        include: { jobDescription: true, user: true }
      })
      if (interview) {
        context = interview.role
        difficulty = interview.difficulty
        if (interview.jobDescription) {
          jdText = interview.jobDescription.rawText
        }
        if (interview.user?.settings) {
           const settings = interview.user.settings as Record<string, unknown>
           if (settings.strictMode) isStrict = true
        }
      }
    }

    const strictPrompt = isStrict ? `
      CRITICAL: You are operating in STRICT MODE. 
      - Heavily penalize any syntax errors or sub-optimal logic. 
      - Do not provide immediate hints or hand-holding.
      - If the candidate makes a mistake, point it out bluntly and ask them to fix it without giving the solution.
    ` : "";

    const result = await streamText({
      model: google('gemini-flash-latest'),
      system: `You are a strict but fair Senior Staff Software Engineer conducting a technical interview. 
      
      Candidate Interview Context:
      - Role: ${context}
      - Difficulty: ${difficulty}
      ${jdText ? `- Target Job Description: ${jdText.substring(0, 1000)}...` : ""}
      
      Rules:
      - Ask one question at a time.
      - Evaluate the answer, provide constructive feedback, and then proceed to the next question.
      - Frequently ask highly personalized technical questions based specifically on the Candidate's Role and Difficulty. Drill deep into technical specifics for ${context}.
      - Explicitly ask the candidate to solve coding challenges and write their code in the provided Code Editor workspace.
      - Maintain a professional, developer-focused tone. 
      ${jdText ? `- The user has provided a target Job Description. You MUST tailor your questions and evaluation criteria specifically to the required skills, tools, and experience listed in the Job Description.` : ""}
      ${strictPrompt}
      - Use markdown for code blocks.`,
      messages,
      async onFinish({ text }) {
        // Save the AI's generated question to the database
        if (interviewId) {
          try {
            await prisma.question.create({
              data: {
                interviewId: interviewId,
                questionText: text,
              }
            });
          } catch (e) {
            logger.error("Failed to save AI question to database:", e);
          }
        }
      }
    })

    return result.toDataStreamResponse()
  } catch (error: any) {
    logger.error("Chat API Error:", error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
