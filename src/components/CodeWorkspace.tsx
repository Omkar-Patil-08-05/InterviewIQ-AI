"use client"
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { useTheme } from 'next-themes'

const Editor = dynamic(() => import('@monaco-editor/react'), { 
  ssr: false, 
  loading: () => <div className="flex-1 min-h-[50vh] flex items-center justify-center text-muted-foreground animate-pulse">Loading Editor Workspace...</div>
})
import { Button } from '@/components/ui/button'
import { Play, Check, X, Loader2, BrainCircuit } from 'lucide-react'

interface CodeWorkspaceProps {
  question: string
  initialCode?: string
  interviewId?: string
}

export function CodeWorkspace({ question, initialCode = "// Write your solution here", interviewId }: CodeWorkspaceProps) {
  const [code, setCode] = useState(initialCode)
  const [language, setLanguage] = useState("javascript")
  const [isExecuting, setIsExecuting] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [aiReview, setAiReview] = useState<any>(null)
  const { theme } = useTheme()

  const handleRun = async () => {
    setIsExecuting(true)
    setResult(null)
    setAiReview(null)
    
    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        body: JSON.stringify({ code, language, question, interviewId })
      })
      const data = await res.json()
      setResult(data.executionResult)
      setAiReview(data.aiReview)
    } catch (e) {
      setResult({ success: false, output: "Execution Service Unavailable." })
    } finally {
      setIsExecuting(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-card shadow-2xl relative border border-border overflow-hidden rounded-xl">
      {/* Editor Toolbar */}
      <div className="flex justify-between items-center bg-background p-3 border-b border-border">
        <select 
          className="bg-muted text-foreground border border-border rounded px-3 py-1.5 text-sm outline-none cursor-pointer hover:bg-muted/80 transition-colors"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>
        
        <Button onClick={handleRun} disabled={isExecuting} className="h-8 gap-2 bg-green-600 hover:bg-green-700 text-white border-none shadow-sm px-6">
          {isExecuting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />} Run & Submit
        </Button>
      </div>
      
      {/* Monaco Editor */}
      <div className="flex-1 min-h-[50vh]">
        <Editor
          height="100%"
          language={language}
          theme={theme === 'light' ? 'light' : 'vs-dark'}
          value={code}
          onChange={(val) => setCode(val || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "JetBrains Mono, Menlo, monospace",
            padding: { top: 16 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
          }}
        />
      </div>

      {/* Execution Results & AI Review Panel */}
      {(result || isExecuting) && (
        <div className="h-[40%] bg-card border-t border-border p-4 overflow-y-auto shadow-[0_-10px_20px_rgba(0,0,0,0.1)] z-10 animate-in slide-in-from-bottom-8">
           {isExecuting ? (
             <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="animate-pulse">Executing code securely in isolated Piston sandbox...</p>
             </div>
           ) : (
             <div className="space-y-6">
                <div>
                   <h3 className={`font-semibold flex items-center gap-2 ${result?.success ? 'text-green-500' : 'text-red-500'}`}>
                     {result?.success ? <Check className="w-5 h-5"/> : <X className="w-5 h-5"/>} 
                     {result?.success ? "All Tests Passed" : "Execution Failed"}
                   </h3>
                   <div className="flex gap-4 mt-3 text-xs text-muted-foreground font-mono">
                     <span className="bg-muted px-3 py-1.5 rounded-full border border-border">Runtime: {result?.runtimeMs} ms</span>
                     <span className="bg-muted px-3 py-1.5 rounded-full border border-border">Memory: {result?.memoryMb} MB</span>
                   </div>
                   <pre className="mt-4 p-3 bg-muted rounded border border-border text-sm font-mono text-foreground whitespace-pre-wrap">{result?.output}</pre>
                </div>

                {aiReview && (
                  <div className="border-t border-border pt-6 mt-6">
                     <h3 className="font-semibold text-purple-500 flex items-center gap-2 mb-4 text-lg">
                       <BrainCircuit className="w-5 h-5" /> AI Code Analysis
                     </h3>
                     
                     <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                        <div className="bg-background p-4 rounded-xl border border-border">
                           <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Time Complexity</span>
                           <span className="font-mono text-lg text-primary">{aiReview.timeComplexity}</span>
                        </div>
                        <div className="bg-background p-4 rounded-xl border border-border">
                           <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Space Complexity</span>
                           <span className="font-mono text-lg text-primary">{aiReview.spaceComplexity}</span>
                        </div>
                     </div>
                     
                     <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Best Practices & Feedback</h4>
                     <ul className="text-sm text-foreground space-y-2 mb-6">
                        {aiReview.bestPracticesFeedback?.map((tip:string, i:number) => (
                           <li key={i} className="flex gap-3"><span className="text-purple-500 mt-0.5">•</span> {tip}</li>
                        ))}
                     </ul>
                  </div>
                )}
             </div>
           )}
        </div>
      )}
    </div>
  )
}
