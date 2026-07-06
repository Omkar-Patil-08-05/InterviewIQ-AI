"use client"
import { useState, useEffect } from "react"
import { ResumeUploader } from "@/components/ResumeUploader"
import { Card, CardContent } from "@/components/ui/card"
import { ProgressBar } from "@/components/charts/ProgressBar"
import { BrainCircuit, AlertTriangle, Briefcase, GraduationCap, Loader2, FileText, Trash2, CheckCircle2, UploadCloud } from "lucide-react"
import { getAllResumes, deleteResume, setResumeActive } from "./actions"
import { Button } from "@/components/ui/button"

export default function ResumeIntelligencePage() {
  const [resumes, setResumes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showUploader, setShowUploader] = useState(false)

  const fetchResumes = () => {
    setLoading(true)
    getAllResumes().then(res => {
      setResumes(res)
      if (res.length === 0) setShowUploader(true)
      else setShowUploader(false)
      setLoading(false)
    })
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchResumes()
  }, [])

  const handleDelete = async (id: string) => {
    await deleteResume(id)
    fetchResumes()
  }

  const handleSetActive = async (id: string) => {
    await setResumeActive(id)
    fetchResumes()
  }

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary opacity-50" /></div>
  }

  const activeResume = resumes.length > 0 ? resumes[0] : null
  const pastResumes = resumes.slice(1)

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resume Management</h1>
          <p className="text-muted-foreground mt-1">Upload and manage your resumes to tailor your mock interviews.</p>
        </div>
        {!showUploader && (
          <Button onClick={() => setShowUploader(true)} className="gap-2 bg-primary text-white">
            <UploadCloud className="w-4 h-4" /> Upload New Resume
          </Button>
        )}
      </div>

      {showUploader ? (
        <div className="max-w-2xl mx-auto mt-12 bg-card border border-border p-8 rounded-xl shadow-sm">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-medium text-foreground">Upload Resume</h3>
             {resumes.length > 0 && (
               <Button variant="ghost" size="sm" onClick={() => setShowUploader(false)}>Cancel</Button>
             )}
           </div>
           <ResumeUploader onAnalysisComplete={() => fetchResumes()} />
        </div>
      ) : (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
          
          {/* Active Resume Section */}
          {activeResume && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Active Profile
              </h2>
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8 pb-6 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground text-lg">{activeResume.fileName}</div>
                      <div className="text-sm text-muted-foreground">Uploaded {new Date(activeResume.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(activeResume.id)} className="gap-2">
                    <Trash2 className="w-4 h-4" /> Delete
                  </Button>
                </div>

                {/* ATS Top Level Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-background border border-border rounded-xl p-6 md:col-span-1 shadow-sm">
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">ATS Optimization Score</h3>
                      <div className="text-5xl font-bold text-primary mb-4">{activeResume.atsScore}<span className="text-xl text-muted-foreground font-medium">/100</span></div>
                      <ProgressBar label="Keyword Relevance" value={Math.min(activeResume.atsScore + 10, 100)} colorClass="bg-green-500" />
                  </div>
                  
                  <div className="bg-background border border-border rounded-xl p-6 md:col-span-2 shadow-sm flex flex-col justify-center">
                    <h3 className="text-base font-semibold mb-4 text-orange-500 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> ATS Gap Analysis
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">Missing Critical Skills</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          {activeResume.gapAnalysis?.missingSkills?.slice(0,3).map((s:string, i:number) => <li key={i} className="flex gap-2"><span className="text-orange-500">•</span>{s}</li>)}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">Actionable Suggestions</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          {activeResume.gapAnalysis?.improvementSuggestions?.slice(0,3).map((s:string, i:number) => <li key={i} className="flex gap-2"><span className="text-orange-500">•</span>{s}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Structured Intelligence */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                      <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground"><Briefcase className="w-4 h-4 text-blue-500"/> Experience Timeline</h3>
                      {activeResume.structuredData?.experience?.map((exp:any, i:number) => (
                        <Card key={i} className="bg-background border-border hover:border-primary/20 transition-colors shadow-sm">
                          <CardContent className="p-5">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-semibold text-foreground">{exp.role}</h4>
                                <p className="text-sm text-primary font-medium">{exp.company}</p>
                              </div>
                              <span className="text-xs font-mono px-2 py-1 bg-muted rounded-md text-muted-foreground border border-border">{exp.duration}</span>
                            </div>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                              {exp.highlights?.slice(0,2).map((h:string, j:number) => <li key={j} className="flex gap-2"><span className="text-blue-500">•</span> {h}</li>)}
                            </ul>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                  
                  <div className="space-y-8">
                      <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-foreground"><BrainCircuit className="w-4 h-4 text-purple-500"/> Technology Cloud</h3>
                        <div className="flex flex-wrap gap-2">
                          {activeResume.structuredData?.technologies?.map((tech:string, i:number) => (
                            <span key={i} className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-300 rounded-lg text-xs font-medium">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-foreground"><GraduationCap className="w-4 h-4 text-green-500"/> Education & Certs</h3>
                        <div className="space-y-3 text-sm text-muted-foreground">
                          {activeResume.structuredData?.education?.map((edu:string, i:number) => (
                            <div key={i} className="p-3 bg-background border border-border rounded-lg shadow-sm">{edu}</div>
                          ))}
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Past Resumes Section */}
          {pastResumes.length > 0 && (
            <div className="space-y-6 pt-8 border-t border-border/50">
              <h2 className="text-xl font-bold text-foreground">Resume History</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastResumes.map(resume => (
                  <Card key={resume.id} className="bg-card border-border shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span className="font-medium text-sm truncate">{resume.fileName}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm mb-6">
                        <span className="text-muted-foreground">{new Date(resume.createdAt).toLocaleDateString()}</span>
                        <span className="font-medium text-primary">ATS: {resume.atsScore}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="w-full text-xs" onClick={() => handleSetActive(resume.id)}>
                          Set Active
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-500/10 px-2" onClick={() => handleDelete(resume.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  )
}
