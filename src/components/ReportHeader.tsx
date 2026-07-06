"use client"
import { Button } from '@/components/ui/button'
import { Download, Calendar, User, Briefcase } from 'lucide-react'
import { useState } from 'react'

interface ReportHeaderProps {
  candidateName?: string | null;
  candidateEmail?: string | null;
  role?: string;
  date?: Date;
}

export function ReportHeader({ candidateName, candidateEmail, role, date }: ReportHeaderProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    window.print()
  }

  return (
     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-white/10 print:border-gray-300 pb-6">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground print:text-black">Interview Report</h1>
            <p className="text-muted-foreground mt-1 print:text-gray-600">Detailed analysis and performance breakdown.</p>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground print:text-gray-800">
             {candidateName && (
               <div className="flex items-center gap-1.5">
                 <User className="w-4 h-4" />
                 <span className="font-medium text-foreground print:text-black">{candidateName}</span>
                 {candidateEmail && <span className="opacity-75">({candidateEmail})</span>}
               </div>
             )}
             {role && (
               <div className="flex items-center gap-1.5">
                 <Briefcase className="w-4 h-4" />
                 <span className="font-medium text-foreground print:text-black">{role}</span>
               </div>
             )}
             {date && (
               <div className="flex items-center gap-1.5">
                 <Calendar className="w-4 h-4" />
                 <span className="font-medium text-foreground print:text-black">
                   {new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                 </span>
               </div>
             )}
          </div>
        </div>
        <Button variant="outline" onClick={handleExport} disabled={isExporting} className="gap-2 border-white/10 hover:bg-white/5 print:hidden">
           <Download className="w-4 h-4" /> {isExporting ? "Exporting..." : "Export PDF"}
        </Button>
     </div>
  )
}
