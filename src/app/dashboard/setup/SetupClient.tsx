"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Sparkles, Briefcase, Clock, Building2, ChevronRight } from "lucide-react"
import { createInterviewAction } from "./actions"
import { useFormStatus } from "react-dom"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="gap-2 px-6">
      {pending ? (
        <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      ) : (
        <Sparkles className="w-4 h-4" />
      )}
      Initialize Interview <ChevronRight className="w-4 h-4" />
    </Button>
  )
}

export default function SetupClient({ jds }: { jds: any[] }) {
  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Configure Interview</h1>
        <p className="text-sm text-muted-foreground mt-1">Customize your mock interview parameters.</p>
      </div>

      <Card className="bg-black/20 border-white/10">
        <form action={createInterviewAction}>
          <CardContent className="p-6 space-y-6">
            
            {/* Role Selection */}
            <div className="space-y-3">
              <Label className="text-muted-foreground flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Role & Focus
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["Frontend", "Backend", "Full Stack", "Data Structures", "System Design", "Python", "Java", "HR"].map((role) => (
                  <label key={role} className="cursor-pointer relative">
                    <input type="radio" name="role" value={role} className="peer sr-only" defaultChecked={role === "Frontend"} />
                    <div className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-center peer-checked:bg-primary/20 peer-checked:border-primary/50 peer-checked:text-primary transition-all hover:bg-white/10">
                      {role}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Difficulty */}
              <div className="space-y-3">
                <Label className="text-muted-foreground">Difficulty</Label>
                <div className="flex bg-white/5 rounded-md p-1 border border-white/10">
                  {["Easy", "Medium", "Hard"].map((diff) => (
                    <label key={diff} className="flex-1 cursor-pointer">
                      <input type="radio" name="difficulty" value={diff} className="peer sr-only" defaultChecked={diff === "Medium"} />
                      <div className="rounded text-center py-1.5 text-sm peer-checked:bg-white/10 peer-checked:text-foreground text-muted-foreground transition-all">
                        {diff}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-3">
                <Label className="text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Duration
                </Label>
                <div className="flex bg-white/5 rounded-md p-1 border border-white/10">
                  {["15m", "30m", "45m", "60m"].map((dur) => (
                    <label key={dur} className="flex-1 cursor-pointer">
                      <input type="radio" name="duration" value={dur} className="peer sr-only" defaultChecked={dur === "30m"} />
                      <div className="rounded text-center py-1.5 text-sm peer-checked:bg-white/10 peer-checked:text-foreground text-muted-foreground transition-all">
                        {dur}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Company Preset */}
            <div className="space-y-3">
              <Label className="text-muted-foreground flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Company Preset
              </Label>
              <select name="company" className="w-full h-10 rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground appearance-none">
                <option value="">General</option>
                <option value="Google">Google</option>
                <option value="Microsoft">Microsoft</option>
                <option value="Amazon">Amazon</option>
                <option value="Flipkart">Flipkart</option>
                <option value="Infosys">Infosys</option>
              </select>
            </div>

            {/* Target Job Description */}
            <div className="space-y-3">
              <Label className="text-muted-foreground flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Target Job Description (Optional)
              </Label>
              <select name="jobDescriptionId" className="w-full h-10 rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground appearance-none">
                <option value="">None (General Mock Interview)</option>
                {jds.map(jd => (
                  <option key={jd.id} value={jd.id}>{jd.title} {jd.company ? `at ${jd.company}` : ''}</option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">Selecting a Job Description will heavily tailor the interview questions towards its requirements.</p>
            </div>

          </CardContent>
          <div className="p-6 pt-0 flex justify-end">
             <SubmitButton />
          </div>
        </form>
      </Card>
    </div>
  )
}
