import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Map, Clock, Calendar, Briefcase } from "lucide-react"

export default function CareerRoadmap({ analysis }: { analysis: any }) {
  const roadmap = analysis.aiCareerRoadmap || { shortTerm: [], mediumTerm: [], longTerm: [] };

  return (
    <Card className="bg-white/5 border-white/10 shadow-xl h-full flex flex-col">
      <CardHeader className="pb-4 border-b border-white/5">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-indigo-400">
          <Map className="w-5 h-5" />
          AI Career Roadmap
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto pt-6 custom-scrollbar pr-2">
        <div className="relative pl-8 space-y-8 before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
          
          {/* Short Term */}
          <div className="relative">
            <div className="absolute left-[-32px] md:left-1/2 md:-ml-3.5 flex items-center justify-center w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500 text-blue-400 z-10">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div className="bg-black/40 border border-white/5 p-4 rounded-xl ml-4 md:ml-0 md:w-[calc(50%-2rem)] md:mr-auto">
              <h4 className="font-bold text-blue-400 mb-3 text-sm">Short Term (0-3 Months)</h4>
              <ul className="space-y-2">
                {roadmap.shortTerm?.map((item: string, i: number) => (
                  <li key={i} className="text-sm text-muted-foreground flex gap-2"><span className="text-blue-500">•</span> {item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Medium Term */}
          <div className="relative">
            <div className="absolute left-[-32px] md:left-1/2 md:-ml-3.5 flex items-center justify-center w-7 h-7 rounded-full bg-yellow-500/20 border border-yellow-500 text-yellow-400 z-10">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <div className="bg-black/40 border border-white/5 p-4 rounded-xl ml-4 md:ml-0 md:w-[calc(50%-2rem)] md:ml-auto">
              <h4 className="font-bold text-yellow-400 mb-3 text-sm">Medium Term (3-6 Months)</h4>
              <ul className="space-y-2">
                {roadmap.mediumTerm?.map((item: string, i: number) => (
                  <li key={i} className="text-sm text-muted-foreground flex gap-2"><span className="text-yellow-500">•</span> {item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Long Term */}
          <div className="relative">
            <div className="absolute left-[-32px] md:left-1/2 md:-ml-3.5 flex items-center justify-center w-7 h-7 rounded-full bg-purple-500/20 border border-purple-500 text-purple-400 z-10">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
            <div className="bg-black/40 border border-white/5 p-4 rounded-xl ml-4 md:ml-0 md:w-[calc(50%-2rem)] md:mr-auto">
              <h4 className="font-bold text-purple-400 mb-3 text-sm">Long Term (6+ Months)</h4>
              <ul className="space-y-2">
                {roadmap.longTerm?.map((item: string, i: number) => (
                  <li key={i} className="text-sm text-muted-foreground flex gap-2"><span className="text-purple-500">•</span> {item}</li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  )
}
