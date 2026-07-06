"use client"

import { Clock, CheckCircle2, TrendingUp, Code, FileText, Briefcase } from "lucide-react"

interface TimelineEvent {
  date: string;
  event: string;
  description: string;
  type: string;
}

export function ImprovementTimeline({ timeline }: { timeline: TimelineEvent[] }) {
  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'resume': return <FileText className="w-4 h-4 text-blue-500" />
      case 'interview': return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case 'coding': return <Code className="w-4 h-4 text-orange-500" />
      case 'ats': return <Briefcase className="w-4 h-4 text-purple-500" />
      default: return <TrendingUp className="w-4 h-4 text-primary" />
    }
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-full">
      <h3 className="font-semibold mb-6 flex items-center gap-2">
        <Clock className="w-4 h-4 text-primary" /> Progress Timeline
      </h3>
      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-muted-foreground/20 before:to-transparent">
        {timeline.map((item, i) => (
          <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-white/10 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
              {getIcon(item.type)}
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/5 p-4 rounded-xl border border-white/10 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-sm text-foreground">{item.event}</h4>
                <time className="text-xs font-medium text-muted-foreground">{item.date}</time>
              </div>
              <p className="text-sm text-muted-foreground leading-snug">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
