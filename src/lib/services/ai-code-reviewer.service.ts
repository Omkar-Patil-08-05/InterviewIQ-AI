import { google } from '@ai-sdk/google'
import { generateObject } from 'ai'
import { z } from 'zod'

export const CodeReviewSchema = z.object({
  correctnessScore: z.number().min(0).max(100),
  timeComplexity: z.string(),
  spaceComplexity: z.string(),
  codeQualityScore: z.number().min(0).max(100),
  readabilityScore: z.number().min(0).max(100),
  bestPracticesFeedback: z.array(z.string()),
  securitySuggestions: z.array(z.string()),
  edgeCasesMissed: z.array(z.string()),
  alternativeBetterSolution: z.string(),
})

export class AICodeReviewerService {
  /**
   * Evaluates submitted code for time/space complexity, correctness, and provides alternatives.
   */
  static async reviewCode(code: string, language: string, question: string, executionResult?: any, isStrict: boolean = false) {
    let executionContext = "";
    if (executionResult) {
      executionContext = `
Execution Results:
- Status: ${executionResult.executionStatus}
- Passed Cases: ${executionResult.passedCases} / ${executionResult.totalCases}
- Runtime: ${executionResult.runtimeMs}ms
- Memory: ${executionResult.memoryMb}MB
- Output Log:\n${executionResult.output}
      `;
    }

    const strictRules = isStrict ? `
      CRITICAL - STRICT MODE: 
      - The user is being graded strictly. 
      - If there are ANY syntax errors, compilation errors, or runtime errors, the correctnessScore MUST be severely penalized (below 30).
      - If time or space complexity is sub-optimal (e.g. O(N^2) instead of O(N)), severely penalize codeQualityScore and correctnessScore.
      - Be extremely critical of readability and best practices.
    ` : "";

    const { object } = await generateObject({
      model: google('gemini-flash-latest'),
      schema: CodeReviewSchema,
      prompt: `Review the following ${language} code submitted for the question: "${question}".\n\nCode:\n${code}\n${executionContext}\nProvide deep structural review, big-O analysis, and alternative optimal solutions if applicable. Take the Execution Results into account: if it failed compilation or runtime, highlight why. Return code snippets wrapped in markdown inside the alternativeBetterSolution field.\n${strictRules}`,
    })

    return object
  }
}
