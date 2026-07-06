"use client"

import { useState, useEffect, useRef } from "react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Sparkles, Clock, CheckCircle2, Circle, AlertCircle, Maximize2, Minimize2, Send } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { endInterviewAction, getInterviewSettingsAction } from './actions'
import { CodeWorkspace } from "@/components/CodeWorkspace"

import { use } from 'react'

export default function InterviewRoom({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30 * 60)
  const [showEndDialog, setShowEndDialog] = useState(false)
  const [isEnding, setIsEnding] = useState(false)
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/interview/chat',
    body: { interviewId: resolvedParams.id },
    initialMessages: [
      {
        id: 'initial',
        role: 'assistant',
        content: 'Welcome to your mock interview. I am your AI interviewer. Are you ready to begin with the first question?'
      }
    ]
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    
    // Voice Output Logic
    if (isVoiceEnabled && synthRef.current && !isLoading && messages.length > 0) {
      const lastMsg = messages[messages.length - 1]
      if (lastMsg.role === 'assistant') {
        synthRef.current.cancel() // Stop previous speech
        const utterance = new SpeechSynthesisUtterance(lastMsg.content)
        // Clean up markdown before speaking
        utterance.text = lastMsg.content.replace(/```[\s\S]*?```/g, "Code block provided.").replace(/[*_~`]/g, "")
        synthRef.current.speak(utterance)
      }
    }
  }, [messages, isLoading, isVoiceEnabled])

  useEffect(() => {
    synthRef.current = window.speechSynthesis
    let timer: NodeJS.Timeout;
    
    getInterviewSettingsAction(resolvedParams.id).then(res => {
      setIsVoiceEnabled(res.voiceOutput)
      
      let savedEndTime = localStorage.getItem(`interview_end_${resolvedParams.id}`)
      if (!savedEndTime) {
        const endTime = Date.now() + (res.duration || 30) * 60 * 1000
        localStorage.setItem(`interview_end_${resolvedParams.id}`, endTime.toString())
        savedEndTime = endTime.toString()
      }

      const remaining = Math.max(0, Math.floor((parseInt(savedEndTime) - Date.now()) / 1000))
      setTimeLeft(remaining)

      if (remaining > 0) {
        timer = setInterval(() => {
          setTimeLeft(t => {
            if (t <= 1) {
              clearInterval(timer)
              return 0
            }
            return t - 1
          })
        }, 1000)
      }
    })
    
    return () => {
      if (synthRef.current) synthRef.current.cancel()
      if (timer) clearInterval(timer)
    }
  }, [resolvedParams.id])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(e => console.error(e))
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(e => console.error(e))
      }
    }
  }

  const handleSaveAndExit = () => {
    if (synthRef.current) synthRef.current.cancel()
    window.location.href = `/dashboard`
  }

  const handleEndInterview = async () => {
    setIsEnding(true)
    if (synthRef.current) synthRef.current.cancel()
    const transcript = messages.map(m => `[${m.role}] ${m.content}`).join('\n\n')
    await endInterviewAction(resolvedParams.id, transcript)
    window.location.href = `/dashboard/reports/${resolvedParams.id}`
  }

  return (
    <div className="flex h-screen bg-black text-foreground overflow-hidden selection:bg-primary/30">
      
      <aside className="w-72 border-l border-white/10 bg-black flex-col hidden xl:flex">
        <div className="p-6 border-b border-white/10 flex flex-col items-center justify-center shrink-0">
           <Clock className={`w-8 h-8 mb-2 ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-muted-foreground'}`} />
           <div className={`text-4xl font-mono font-light tracking-tighter ${timeLeft < 300 ? 'text-red-500' : 'text-foreground'}`}>
             {formatTime(timeLeft)}
           </div>
           <p className="text-xs text-muted-foreground mt-1">Remaining Time</p>
        </div>
        
        <div className="p-4 flex-1">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Tips</h3>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm text-blue-200 leading-relaxed">
            <p className="mb-2"><strong className="text-blue-400">1. Think out loud.</strong> Explain your reasoning before writing code.</p>
            <p className="mb-2"><strong className="text-blue-400">2. Ask for clarification.</strong> If a question is ambiguous, ask the AI to clarify.</p>
          </div>
          
          <div className="mt-6 flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
            <span className="text-sm font-medium text-gray-300">Voice Output</span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
              className={isVoiceEnabled ? "text-primary" : "text-muted-foreground"}
            >
              {isVoiceEnabled ? 'Enabled' : 'Muted'}
            </Button>
          </div>
        </div>

        <div className="p-4 border-t border-white/10 shrink-0">
          <Button variant="destructive" className="w-full bg-red-950 text-red-400 hover:bg-red-900 border border-red-900/50" onClick={() => setShowEndDialog(true)}>
            End Interview
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden">
        {/* Chat UI */}
        <div className="w-1/2 flex flex-col border-r border-white/10 bg-[#0a0a0a] relative">
          <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-32 scroll-smooth">
            {messages.map(m => (
              <div key={m.id} className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-5 shadow-sm ${m.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-white/5 border border-white/10 rounded-bl-none text-gray-200'}`}>
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({node, inline, className, children, ...props}: any) {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                          <SyntaxHighlighter
                            {...props}
                            style={vscDarkPlus as any}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-md mt-3 mb-3 text-sm font-mono shadow-xl border border-white/10"
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code {...props} className="bg-black/30 px-1.5 py-0.5 rounded text-sm font-mono text-purple-300">
                            {children}
                          </code>
                        )
                      }
                    }}
                  >
                    {m.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-4 justify-start">
                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-none p-4 flex gap-1 items-center h-12">
                  <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent pt-12">
            <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto">
              <input 
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-5 py-4 pr-14 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm placeholder:text-muted-foreground shadow-lg"
                value={input}
                onChange={handleInputChange}
                placeholder="Explain your thought process or ask for a hint..."
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={!input.trim() || isLoading} className="absolute right-2 top-2 bg-primary hover:bg-primary/90 text-primary-foreground h-10 w-10 rounded-lg transition-transform active:scale-95">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Code Editor */}
        <div className="w-1/2 h-full">
          <CodeWorkspace question="Write your code here based on the interview chat." interviewId={resolvedParams.id} />
        </div>
      </main>

      {/* End Dialog */}
      {showEndDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-zinc-950 border border-white/10 p-6 rounded-xl max-w-sm w-full shadow-2xl scale-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-400 mb-2">
              <AlertCircle className="w-5 h-5" />
              <h2 className="text-lg font-semibold text-foreground">End Interview?</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to end this session early? Your current progress and score will be saved.
            </p>
            <div className="flex flex-col gap-3">
              <Button variant="default" onClick={handleSaveAndExit} disabled={isEnding} className="w-full">
                Save & Exit to Dashboard
              </Button>
              <Button variant="destructive" onClick={handleEndInterview} disabled={isEnding} className="w-full bg-red-950/50 hover:bg-red-900/50 border border-red-900/50 text-red-400">
                {isEnding ? 'Generating Report...' : 'Submit & Generate Report'}
              </Button>
              <Button variant="ghost" onClick={() => setShowEndDialog(false)} disabled={isEnding} className="w-full hover:bg-white/10">
                Cancel, Resume Interview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
