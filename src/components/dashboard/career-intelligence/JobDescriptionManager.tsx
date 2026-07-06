"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, Briefcase, Plus, CheckCircle, Search } from "lucide-react"
import { uploadJobDescription, deleteJobDescription, setActiveJobDescription } from "@/app/dashboard/job-descriptions/actions"
import { Loader2 } from "lucide-react"

export default function JobDescriptionManager({ initialJds }: { initialJds: any[] }) {
  const [jds, setJds] = useState(initialJds)
  const [isUploading, setIsUploading] = useState(false)
  const [title, setTitle] = useState("")
  const [company, setCompany] = useState("")
  const [rawText, setRawText] = useState("")
  const [search, setSearch] = useState("")

  const handleUpload = async () => {
    if (!title || !rawText) return
    setIsUploading(true)
    try {
      const newJd = await uploadJobDescription(title, company, rawText)
      setJds([newJd, ...jds.map(j => ({ ...j, isActive: false }))])
      setTitle("")
      setCompany("")
      setRawText("")
    } catch (e) {
      console.error(e)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteJobDescription(id)
      setJds(jds.filter(j => j.id !== id))
    } catch (e) {
      console.error(e)
    }
  }

  const handleSetActive = async (id: string) => {
    try {
      await setActiveJobDescription(id)
      setJds(jds.map(j => ({ ...j, isActive: j.id === id })))
    } catch (e) {
      console.error(e)
    }
  }

  const filteredJds = jds.filter(j => 
    j.title.toLowerCase().includes(search.toLowerCase()) || 
    (j.company && j.company.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <div className="lg:col-span-1 space-y-6">
        <Card className="bg-white/5 border-white/10 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-500" /> Add Job Description
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input 
              placeholder="Job Title (e.g., Senior React Developer)" 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              className="bg-black/50 border-white/10"
            />
            <Input 
              placeholder="Company Name (optional)" 
              value={company} 
              onChange={e => setCompany(e.target.value)}
              className="bg-black/50 border-white/10"
            />
            <textarea 
              placeholder="Paste Job Description text here..." 
              value={rawText} 
              onChange={e => setRawText(e.target.value)}
              className="flex min-h-[200px] w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            <Button 
              onClick={handleUpload} 
              disabled={isUploading || !title || !rawText}
              className="w-full"
            >
              {isUploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Save Job Description"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="bg-white/5 border-white/10 shadow-xl h-full flex flex-col">
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-500" /> Saved Job Descriptions
              </CardTitle>
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search..." 
                  value={search}
                  onChange={(e: any) => setSearch(e.target.value)}
                  className="pl-9 bg-black/40 border-white/10 h-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto space-y-3">
            {filteredJds.length === 0 ? (
              <p className="text-center text-muted-foreground p-8 border border-white/5 border-dashed rounded-lg">No job descriptions found.</p>
            ) : filteredJds.map(jd => (
              <div key={jd.id} className={`flex items-center justify-between p-4 rounded-xl border ${jd.isActive ? 'border-green-500/50 bg-green-500/5' : 'border-white/10 bg-black/40'}`}>
                <div>
                  <h4 className="font-semibold flex items-center gap-2">
                    {jd.title} 
                    {jd.isActive && <span className="text-[10px] uppercase bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-bold">Active</span>}
                  </h4>
                  {jd.company && <p className="text-sm text-muted-foreground">{jd.company}</p>}
                  <p className="text-xs text-muted-foreground mt-1">Saved {new Date(jd.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  {!jd.isActive && (
                    <Button variant="outline" size="sm" onClick={() => handleSetActive(jd.id)} className="bg-white/5 border-white/10 hover:bg-green-500/10 hover:text-green-400 hover:border-green-500/30">
                      <CheckCircle className="w-4 h-4 mr-1" /> Set Active
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(jd.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
