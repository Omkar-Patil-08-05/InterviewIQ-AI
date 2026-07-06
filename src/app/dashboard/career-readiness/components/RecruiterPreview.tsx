"use client"

import { useState } from "react"
import { Eye, FileText, MessagesSquare, Code2, AlertTriangle, ShieldCheck } from "lucide-react"
import * as Dialog from "@radix-ui/react-dialog"

interface RecruiterPreviewData {
  summary: string;
  ats: string;
  interview: string;
  coding: string;
  topSkills: string[];
  risks: string[];
  recommendation: string;
  rating: number;
}

export function RecruiterPreview({ data }: { data: RecruiterPreviewData }) {
  const [open, setOpen] = useState(false)

  if (!data) return null;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20 font-medium text-sm">
          <Eye className="w-4 h-4" /> View Recruiter Summary
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[600px] translate-x-[-50%] translate-y-[-50%] rounded-xl bg-background border border-border shadow-2xl p-6 focus:outline-none z-50 overflow-y-auto">
          <Dialog.Title className="text-xl font-bold mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" /> Recruiter Executive Summary
          </Dialog.Title>
          <div className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg border border-border">
              <p className="text-sm leading-relaxed">{data.summary}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1 mb-1">
                    <FileText className="w-3 h-3" /> ATS Profile
                  </h4>
                  <p className="text-sm font-medium">{data.ats}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1 mb-1">
                    <MessagesSquare className="w-3 h-3" /> Interview Score
                  </h4>
                  <p className="text-sm font-medium">{data.interview}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1 mb-1">
                    <Code2 className="w-3 h-3" /> Coding Aptitude
                  </h4>
                  <p className="text-sm font-medium">{data.coding}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1 mb-1">
                    <ShieldCheck className="w-3 h-3" /> Recommendation
                  </h4>
                  <p className="text-sm font-bold text-primary">{data.recommendation}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Verified Top Skills</h4>
              <div className="flex flex-wrap gap-2">
                {data.topSkills.map((s, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {data.risks.length > 0 && (
              <div className="border-t border-border pt-4">
                <h4 className="text-xs font-semibold text-red-500/80 uppercase mb-2 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Potential Risks
                </h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {data.risks.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="flex justify-between items-center bg-black/40 p-4 rounded-lg border border-white/5 mt-4">
              <span className="text-sm font-medium text-muted-foreground">Overall Candidate Rating</span>
              <span className="text-2xl font-bold text-white">{data.rating}<span className="text-muted-foreground text-sm">/10</span></span>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Dialog.Close asChild>
              <button className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-md transition-colors text-sm font-medium">
                Close Preview
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
