"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { generateJobAnalysis } from "./actions"
import { Loader2, FileText } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"

import JobDescriptionManager from "@/components/dashboard/career-intelligence/JobDescriptionManager"
import MatchOverview from "@/components/dashboard/career-intelligence/MatchOverview"
import MissingSkills from "@/components/dashboard/career-intelligence/MissingSkills"
import ResumeImprovements from "@/components/dashboard/career-intelligence/ResumeImprovements"
import CareerRoadmap from "@/components/dashboard/career-intelligence/CareerRoadmap"
import CompanyReadinessJD from "@/components/dashboard/career-intelligence/CompanyReadinessJD"

interface Props {
  resumes: any[]
  jds: any[]
  initialAnalysis: any
}

export default function CareerIntelligenceClient({ resumes, jds, initialAnalysis }: Props) {
  const [activeResumeId, setActiveResumeId] = useState(resumes[0]?.id || "")
  const [activeJdId, setActiveJdId] = useState(jds.find(j => j.isActive)?.id || jds[0]?.id || "")
  
  const [analysis, setAnalysis] = useState<any>(initialAnalysis)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState("")

  const runAnalysis = async () => {
    if (!activeResumeId || !activeJdId) {
      setError("Please select both a Resume and a Job Description.")
      return
    }
    setIsAnalyzing(true)
    setError("")
    try {
      const res = await generateJobAnalysis(activeResumeId, activeJdId)
      setAnalysis(res)
    } catch (err: any) {
      setError(err.message || "Failed to analyze. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 pb-32">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Career Intelligence</h1>
        <p className="text-muted-foreground mt-1">Deep analysis of your Resume against Target Job Descriptions.</p>
      </div>

      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="bg-white/5 border border-white/10 mb-6">
          <TabsTrigger value="analysis">Match Analysis</TabsTrigger>
          <TabsTrigger value="jds">Manage Job Descriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-xl flex flex-col gap-4 shadow-xl">
              <h3 className="font-semibold text-lg">Configuration</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Select Resume</label>
                <select 
                  value={activeResumeId} 
                  onChange={e => setActiveResumeId(e.target.value)}
                  className="w-full h-10 rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground appearance-none"
                >
                  <option value="" disabled>Select a resume</option>
                  {resumes.map(r => (
                    <option key={r.id} value={r.id}>{r.fileName}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Select Job Description</label>
                <select 
                  value={activeJdId} 
                  onChange={e => setActiveJdId(e.target.value)}
                  className="w-full h-10 rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground appearance-none"
                >
                  <option value="" disabled>Select a JD</option>
                  {jds.map(j => (
                    <option key={j.id} value={j.id}>{j.title} {j.company ? `at ${j.company}` : ''}</option>
                  ))}
                </select>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button 
                onClick={runAnalysis} 
                disabled={isAnalyzing || !activeResumeId || !activeJdId}
                className="w-full mt-4"
              >
                {isAnalyzing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</> : "Run AI Match Analysis"}
              </Button>
            </div>

            <div className="md:col-span-2">
              {analysis ? (
                <MatchOverview analysis={analysis} />
              ) : (
                <div className="h-full">
                  <EmptyState 
                    icon={<FileText />}
                    title="No analysis generated"
                    description="Select a resume and job description on the left, then click run analysis to unlock deep insights."
                  />
                </div>
              )}
            </div>
          </div>

          {analysis && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MissingSkills analysis={analysis} />
                <ResumeImprovements analysis={analysis} />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <CareerRoadmap analysis={analysis} />
                </div>
                <div>
                  <CompanyReadinessJD analysis={analysis} />
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="jds">
          <JobDescriptionManager initialJds={jds} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
