"use client"

import { Building2, XCircle, CheckCircle2 } from "lucide-react"

interface CompanyReadinessProps {
  companies: {
    company: string;
    score: number;
    missingSkills: string[];
    resumeMatch: string;
    interviewReadiness: string;
    codingReadiness: string;
    overallRecommendation: string;
  }[]
}

export function CompanyReadinessGrid({ companies }: CompanyReadinessProps) {
  if (!companies || companies.length === 0) return null;

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-lg flex items-center gap-2">
        <Building2 className="w-5 h-5 text-primary" /> Target Company Readiness
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies.map((c, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-semibold text-lg">{c.company}</h4>
              <div className={`px-2 py-1 rounded-md text-xs font-bold ${
                c.score >= 85 ? 'bg-green-500/20 text-green-500' :
                c.score >= 70 ? 'bg-blue-500/20 text-blue-500' :
                c.score >= 50 ? 'bg-yellow-500/20 text-yellow-500' :
                'bg-red-500/20 text-red-500'
              }`}>
                {c.score}% Match
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4 h-10 line-clamp-2">
              {c.overallRecommendation}
            </p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs">
                {c.resumeMatch.toLowerCase().includes('strong') || c.resumeMatch.toLowerCase().includes('good') 
                  ? <CheckCircle2 className="w-3 h-3 text-green-500" />
                  : <XCircle className="w-3 h-3 text-red-500" />
                }
                <span className="text-muted-foreground truncate flex-1">Resume: {c.resumeMatch}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                {c.interviewReadiness.toLowerCase().includes('strong') || c.interviewReadiness.toLowerCase().includes('good') 
                  ? <CheckCircle2 className="w-3 h-3 text-green-500" />
                  : <XCircle className="w-3 h-3 text-red-500" />
                }
                <span className="text-muted-foreground truncate flex-1">Interview: {c.interviewReadiness}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                {c.codingReadiness.toLowerCase().includes('strong') || c.codingReadiness.toLowerCase().includes('good') 
                  ? <CheckCircle2 className="w-3 h-3 text-green-500" />
                  : <XCircle className="w-3 h-3 text-red-500" />
                }
                <span className="text-muted-foreground truncate flex-1">Coding: {c.codingReadiness}</span>
              </div>
            </div>

            {c.missingSkills.length > 0 && (
              <div className="pt-3 border-t border-white/10">
                <span className="text-xs font-medium text-foreground mb-2 block">Key Missing Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {c.missingSkills.slice(0, 3).map((skill, j) => (
                    <span key={j} className="px-2 py-0.5 bg-red-500/10 text-red-400 rounded-md text-[10px]">
                      {skill}
                    </span>
                  ))}
                  {c.missingSkills.length > 3 && (
                    <span className="px-2 py-0.5 bg-white/5 text-muted-foreground rounded-md text-[10px]">
                      +{c.missingSkills.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
