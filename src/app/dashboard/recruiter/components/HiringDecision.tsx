"use client"

import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { CheckCircle, AlertTriangle, XCircle, Search } from "lucide-react"

export default function HiringDecision({ data }: { data: any }) {
  const { evaluation } = data
  if (!evaluation) return null;

  const getRecommendationDetails = (rec: string) => {
    switch(rec?.toLowerCase()) {
      case 'strong hire': return { color: 'text-green-400', bg: 'bg-green-500/10', icon: <CheckCircle className="w-5 h-5" />, label: 'Strong Hire' }
      case 'hire': return { color: 'text-green-500', bg: 'bg-green-500/10', icon: <CheckCircle className="w-5 h-5" />, label: 'Hire' }
      case 'consider': return { color: 'text-yellow-400', bg: 'bg-yellow-500/10', icon: <AlertTriangle className="w-5 h-5" />, label: 'Consider' }
      case 'interview again': return { color: 'text-orange-400', bg: 'bg-orange-500/10', icon: <Search className="w-5 h-5" />, label: 'Interview Again' }
      case 'reject': return { color: 'text-red-400', bg: 'bg-red-500/10', icon: <XCircle className="w-5 h-5" />, label: 'Reject' }
      default: return { color: 'text-white', bg: 'bg-white/10', icon: <Search className="w-5 h-5" />, label: 'Pending' }
    }
  }

  const recDetails = getRecommendationDetails(evaluation.recommendation)

  return (
    <Card className={`border-white/10 shadow-2xl h-full flex flex-col justify-center relative overflow-hidden bg-gradient-to-br from-black to-black/80`}>
      <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 ${recDetails.bg.replace('/10', '')}`} />
      
      <CardContent className="p-6 relative z-10">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Hiring Decision</h3>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Overall Rating</p>
            <div className="text-4xl font-black font-mono">
              {evaluation.overallRating}<span className="text-xl text-muted-foreground">/10</span>
            </div>
          </div>
          <div className="flex-1 border-l border-white/10 pl-4">
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Confidence</p>
            <div className="text-2xl font-bold font-mono">
              {evaluation.confidenceLevel}%
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${recDetails.color.replace('text-', 'border-')}/30 ${recDetails.bg} ${recDetails.color} font-bold text-lg`}>
            {recDetails.icon} {recDetails.label}
          </div>
          <p className="text-sm text-muted-foreground italic leading-relaxed">
            "{evaluation.reasoning}"
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
