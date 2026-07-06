"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Quote } from "lucide-react"

export default function ExecutiveSummary({ data }: { data: any }) {
  const { evaluation } = data
  if (!evaluation) return null;

  return (
    <Card className="bg-white/5 border-white/10 shadow-2xl overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <CardContent className="p-8 relative z-10 flex flex-col md:flex-row gap-6 items-center">
        
        <div className="shrink-0 p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative">
          <Quote className="w-8 h-8 text-primary absolute opacity-20 -top-2 -left-2" />
          <Sparkles className="w-10 h-10 text-primary" />
        </div>

        <div className="flex-1">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
            AI Executive Summary
          </h3>
          <p className="text-lg md:text-xl text-foreground leading-relaxed font-medium">
            {evaluation.executiveSummary}
          </p>
        </div>

      </CardContent>
    </Card>
  )
}
