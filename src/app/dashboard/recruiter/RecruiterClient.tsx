"use client"

import { useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Download, FileText, Scale } from "lucide-react"
import { Button } from "@/components/ui/button"
// PDF exports now use native window.print()
// Components to implement
import CandidateOverview from "./components/CandidateOverview"
import ExecutiveSummary from "./components/ExecutiveSummary"
import ResumeEvaluation from "./components/ResumeEvaluation"
import CodingEvaluation from "./components/CodingEvaluation"
import InterviewEvaluation from "./components/InterviewEvaluation"
import ATSPerformance from "./components/ATSPerformance"
import StrengthsAndRisks from "./components/StrengthsAndRisks"
import InterviewQuestions from "./components/InterviewQuestions"
import HiringDecision from "./components/HiringDecision"
import ComparisonMode from "./components/ComparisonMode"

export default function RecruiterClient({ data }: { data: any }) {
  const reportRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [isComparisonMode, setIsComparisonMode] = useState(false)

  const exportPDF = () => {
    // html2canvas struggles with modern CSS like oklch/oklab used in Tailwind v3.4+
    // Using the native browser print API is much more robust, handles modern CSS flawlessly,
    // and produces text-searchable, vector-quality PDFs.
    window.print()
  }

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-8 pb-32">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <BriefcaseIcon /> Recruiter Evaluation Portal
          </h1>
          <p className="text-muted-foreground mt-1">Confidential Internal Hiring Assessment</p>
        </div>
        <div className="flex gap-3 print:hidden">
          <Button 
            variant="outline" 
            onClick={() => setIsComparisonMode(!isComparisonMode)}
            className={`gap-2 transition-all ${isComparisonMode ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
          >
            <Scale className="w-4 h-4" /> {isComparisonMode ? 'Exit Comparison' : 'Compare History'}
          </Button>
          <Button onClick={exportPDF} disabled={isExporting} className="gap-2">
            <Download className="w-4 h-4" /> {isExporting ? "Generating PDF..." : "Download Report"}
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isComparisonMode ? (
          <motion.div 
            key="comparison"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <ComparisonMode data={data} />
          </motion.div>
        ) : (
          <motion.div 
            key="report"
            ref={reportRef} 
            className="space-y-8 bg-black rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Section 1 & 10: Overview and Hiring Decision */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <CandidateOverview data={data} />
              </div>
              <div className="xl:col-span-1">
                <HiringDecision data={data} />
              </div>
            </div>

            {/* Section 2: Executive Summary */}
            <ExecutiveSummary data={data} />

            {/* Section 7 & 8: Strengths & Risks */}
            <StrengthsAndRisks data={data} />

            {/* Section 3 & 4: Resume & Coding Evaluation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ResumeEvaluation data={data} />
              <CodingEvaluation data={data} />
            </div>

            {/* Section 5 & 6: Interview Evaluation & ATS Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InterviewEvaluation data={data} />
              <ATSPerformance data={data} />
            </div>

            {/* Section 9: Interview Questions */}
            <InterviewQuestions data={data} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function BriefcaseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  )
}
