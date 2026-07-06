import { ICodeExecutionService, ExecutionResult, TestCase } from './index'

export class Judge0ExecutionService implements ICodeExecutionService {
  async executeCode(code: string, language: string, testCases: TestCase[]): Promise<ExecutionResult> {
    throw new Error("Judge0 Execution Service is a placeholder for future implementation.")
  }
}
