export interface ExecutionResult {
  success: boolean
  output: string
  stdout?: string
  stderr?: string
  compilationError?: string
  runtimeError?: string
  executionStatus: string // e.g. "Passed", "Failed", "Compilation Error", "Runtime Error", "Timeout"
  runtimeMs: number
  memoryMb: number
  exitCode?: number
  passedCases: number
  totalCases: number
}

export interface TestCase {
  input: string
  expectedOutput: string
}

export interface ICodeExecutionService {
  executeCode(code: string, language: string, testCases: TestCase[]): Promise<ExecutionResult>
}
