import { ICodeExecutionService, ExecutionResult } from './index'

export class DockerExecutionService implements ICodeExecutionService {
  async executeCode(code: string, language: string, testCases: any[]): Promise<ExecutionResult> {
    throw new Error("Docker Execution Service is a placeholder for future implementation.")
  }
}
