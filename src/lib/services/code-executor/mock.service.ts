import { ICodeExecutionService, ExecutionResult, TestCase } from './index'

export class MockExecutionService implements ICodeExecutionService {
  async executeCode(code: string, language: string, testCases: TestCase[] = [{ input: '1', expectedOutput: '1' }]): Promise<ExecutionResult> {
    // Simulate execution latency
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const isError = code.includes('SyntaxError') || code.trim() === ''
    if (isError) {
      return {
        success: false,
        output: "SyntaxError: Unexpected token",
        runtimeMs: 0,
        memoryMb: 0,
        passedCases: 0,
        totalCases: testCases.length,
        executionStatus: "Compilation Error"
      }
    }

    return {
      success: true,
      output: "All test cases passed successfully.\nOutput: Valid Output",
      runtimeMs: Math.floor(Math.random() * 50) + 10,
      memoryMb: +(Math.random() * 10 + 20).toFixed(2),
      passedCases: testCases.length,
      totalCases: testCases.length,
      executionStatus: "Passed"
    }
  }
}
