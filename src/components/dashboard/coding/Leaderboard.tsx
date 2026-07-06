import { AnalyticsData } from "@/types/analytics"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, FastForward, Cpu, BrainCircuit, Star } from "lucide-react"

export default function Leaderboard({ data }: { data: AnalyticsData }) {
  
  // Find personal bests
  const passed = data.attempts.filter(a => a.executionStatus === 'Passed');
  
  let bestRuntime = null;
  let bestMemory = null;
  let bestScore = null;

  if (passed.length > 0) {
    const runtimes = passed.filter(a => a.runtimeMs > 0).sort((a,b) => a.runtimeMs - b.runtimeMs);
    bestRuntime = runtimes.length > 0 ? runtimes[0] : null;

    const memories = passed.filter(a => a.memoryMb > 0).sort((a,b) => a.memoryMb - b.memoryMb);
    bestMemory = memories.length > 0 ? memories[0] : null;
  }

  const scores = data.attempts.filter(a => (a.aiReview as any)?.codeQualityScore).sort((a,b) => (b.aiReview as any).codeQualityScore - (a.aiReview as any).codeQualityScore);
  bestScore = scores.length > 0 ? scores[0] : null;

  return (
    <Card className="bg-white/5 border-white/10 shadow-xl h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          Personal Records
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
        
        {bestRuntime && (
          <div className="flex items-center gap-4 bg-gradient-to-r from-green-500/10 to-transparent p-4 rounded-xl border border-green-500/20">
             <div className="p-3 bg-green-500/20 rounded-full text-green-400">
               <FastForward className="w-5 h-5" />
             </div>
             <div>
               <p className="text-xs text-green-400/80 uppercase tracking-wider font-semibold">Fastest Runtime</p>
               <h4 className="text-xl font-bold text-green-400">{bestRuntime.runtimeMs} ms</h4>
               <p className="text-xs text-muted-foreground truncate max-w-[200px]">in {bestRuntime.language}</p>
             </div>
          </div>
        )}

        {bestMemory && (
          <div className="flex items-center gap-4 bg-gradient-to-r from-orange-500/10 to-transparent p-4 rounded-xl border border-orange-500/20">
             <div className="p-3 bg-orange-500/20 rounded-full text-orange-400">
               <Cpu className="w-5 h-5" />
             </div>
             <div>
               <p className="text-xs text-orange-400/80 uppercase tracking-wider font-semibold">Most Memory Efficient</p>
               <h4 className="text-xl font-bold text-orange-400">{bestMemory.memoryMb} MB</h4>
               <p className="text-xs text-muted-foreground truncate max-w-[200px]">in {bestMemory.language}</p>
             </div>
          </div>
        )}

        {bestScore && (
          <div className="flex items-center gap-4 bg-gradient-to-r from-purple-500/10 to-transparent p-4 rounded-xl border border-purple-500/20">
             <div className="p-3 bg-purple-500/20 rounded-full text-purple-400">
               <BrainCircuit className="w-5 h-5" />
             </div>
             <div>
               <p className="text-xs text-purple-400/80 uppercase tracking-wider font-semibold">Highest AI Score</p>
               <h4 className="text-xl font-bold text-purple-400">{(bestScore.aiReview as any).codeQualityScore} / 100</h4>
               <p className="text-xs text-muted-foreground truncate max-w-[200px]">in {bestScore.language}</p>
             </div>
          </div>
        )}

        {!bestRuntime && !bestScore && (
          <p className="text-sm text-muted-foreground italic p-4 text-center">Solve more problems to set personal records.</p>
        )}

      </CardContent>
    </Card>
  )
}
