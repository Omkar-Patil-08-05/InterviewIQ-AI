"use client"

import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { User, Mail, Briefcase, GraduationCap, Building, Target, TrendingUp } from "lucide-react"

export default function CandidateOverview({ data }: { data: any }) {
  const { user, careerReadiness, evaluation, resumes, jobAnalyses } = data

  const resume = resumes[0]
  const targetCompanies = [...new Set(jobAnalyses.map((j: any) => j.jobDescription.company))].filter(Boolean)
  const targetRoles = [...new Set(jobAnalyses.map((j: any) => j.jobDescription.title))].filter(Boolean)

  const overallScore = careerReadiness?.overallScore || 0

  return (
    <Card className="bg-white/5 border-white/10 shadow-2xl overflow-hidden h-full">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500" />
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
          
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center">
                <User className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{user?.name || 'Anonymous Candidate'}</h2>
                <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                  <Mail className="w-3 h-3" /> {user?.email}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold flex items-center gap-1"><Briefcase className="w-3 h-3"/> Target Roles</div>
                <div className="text-sm font-medium">{targetRoles.join(', ') || 'Software Engineer'}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold flex items-center gap-1"><Building className="w-3 h-3"/> Target Companies</div>
                <div className="text-sm font-medium">{targetCompanies.join(', ') || 'Tech Industry'}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold flex items-center gap-1"><FileTextIcon className="w-3 h-3"/> Current Resume</div>
                <div className="text-sm font-medium truncate pr-4">{resume?.fileName || 'No Resume Uploaded'}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold flex items-center gap-1"><TrendingUp className="w-3 h-3"/> Platform Activity</div>
                <div className="text-sm font-medium">{data.coding.length} Submissions, {data.interviews.length} Interviews</div>
              </div>
            </div>
          </div>

          {/* Readiness Score Circle */}
          <div className="shrink-0 flex flex-col items-center justify-center p-6 bg-black/40 rounded-2xl border border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5" />
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="relative z-10 text-center"
            >
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-2">Career Readiness</p>
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="58" fill="none" stroke="currentColor" strokeWidth="6" className="text-white/10" />
                  <motion.circle 
                    cx="64" cy="64" r="58" fill="none" stroke="currentColor" strokeWidth="6"
                    strokeDasharray={364}
                    initial={{ strokeDashoffset: 364 }}
                    animate={{ strokeDashoffset: 364 - (364 * overallScore) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                    className={overallScore >= 80 ? "text-green-500" : overallScore >= 60 ? "text-yellow-500" : "text-red-500"}
                  />
                </svg>
                <div className="text-4xl font-black">{overallScore}</div>
              </div>
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium">
                <Target className="w-3 h-3" />
                {evaluation?.recommendation || 'Evaluating'}
              </div>
            </motion.div>
          </div>

        </div>
      </CardContent>
    </Card>
  )
}

function FileTextIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
}
