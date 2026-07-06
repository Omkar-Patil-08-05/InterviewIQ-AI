import { AnalyticsData, ExtendedCodingAttempt } from "@/types/analytics"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, History, ChevronLeft, ChevronRight, CheckCircle2, XCircle } from "lucide-react"

export default function SubmissionHistory({ data }: { data: AnalyticsData }) {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [selectedAttempt, setSelectedAttempt] = useState<ExtendedCodingAttempt | null>(null)
  
  const limit = 10;

  const filtered = data.attempts.filter(a => {
    if (!search) return true;
    const s = search.toLowerCase();
    return a.question.questionText.toLowerCase().includes(s) || 
           a.language.toLowerCase().includes(s) || 
           (a.executionStatus && a.executionStatus.toLowerCase().includes(s));
  });

  const totalPages = Math.ceil(filtered.length / limit) || 1;
  const currentData = filtered.slice((page - 1) * limit, page * limit);

  return (
    <Card className="bg-white/5 border-white/10 shadow-xl print:break-inside-avoid">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <History className="w-5 h-5 text-blue-500" />
            Submission History
          </CardTitle>
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search submissions..." 
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 bg-black/40 border-white/10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-white/10 overflow-hidden print:overflow-visible">
          <Table>
            <TableHeader className="bg-black/60">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead>Date</TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Lang</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Runtime</TableHead>
                <TableHead className="text-right">Memory</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No submissions found.</TableCell>
                </TableRow>
              ) : currentData.map((attempt) => {
                const passed = attempt.executionStatus === 'Passed'
                return (
                  <TableRow 
                    key={attempt.id} 
                    className="border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                    onClick={() => setSelectedAttempt(attempt)}
                  >
                    <TableCell suppressHydrationWarning className="whitespace-nowrap text-xs text-muted-foreground">{new Date(attempt.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate" title={attempt.question.questionText}>{attempt.question.questionText}</TableCell>
                    <TableCell className="text-xs uppercase tracking-wider">{attempt.language}</TableCell>
                    <TableCell>
                      <span className={`flex items-center gap-1 text-xs font-semibold ${passed ? 'text-green-500' : 'text-red-500'}`}>
                        {passed ? <CheckCircle2 className="w-3 h-3"/> : <XCircle className="w-3 h-3"/>}
                        {attempt.executionStatus || 'Unknown'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs text-yellow-200">{attempt.runtimeMs}ms</TableCell>
                    <TableCell className="text-right font-mono text-xs text-orange-200">{attempt.memoryMb}MB</TableCell>
                    <TableCell className="text-right font-mono text-xs text-purple-300">{(attempt.aiReview as any)?.codeQualityScore || '-'}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="bg-white/5 border-white/10">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="bg-white/5 border-white/10">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>

      <Dialog open={!!selectedAttempt} onOpenChange={(open: boolean) => !open && setSelectedAttempt(null)}>
        <DialogContent className="max-w-3xl bg-zinc-950 border-white/10 text-white max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Submission Details</DialogTitle>
          </DialogHeader>
          {selectedAttempt && (
            <div className="space-y-6 mt-4">
               <div>
                  <h3 className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Question</h3>
                  <p className="text-sm bg-black p-4 rounded-xl border border-white/5 leading-relaxed">{selectedAttempt.question.questionText}</p>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <p className={`font-semibold ${selectedAttempt.executionStatus === 'Passed' ? 'text-green-500' : 'text-red-500'}`}>{selectedAttempt.executionStatus}</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                    <p className="text-xs text-muted-foreground mb-1">Language</p>
                    <p className="font-semibold uppercase text-cyan-400">{selectedAttempt.language}</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                    <p className="text-xs text-muted-foreground mb-1">Runtime</p>
                    <p className="font-semibold font-mono text-yellow-400">{selectedAttempt.runtimeMs} ms</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                    <p className="text-xs text-muted-foreground mb-1">Memory</p>
                    <p className="font-semibold font-mono text-orange-400">{selectedAttempt.memoryMb} MB</p>
                  </div>
               </div>
               <div>
                  <h3 className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Source Code</h3>
                  <pre className="bg-black p-4 rounded-xl border border-white/5 text-sm font-mono text-green-300 overflow-x-auto">
                    {selectedAttempt.sourceCode}
                  </pre>
               </div>
               {(selectedAttempt.stdout || selectedAttempt.stderr) && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedAttempt.stdout && (
                      <div>
                        <h3 className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Stdout</h3>
                        <pre className="bg-black p-4 rounded-xl border border-white/5 text-sm font-mono text-blue-300 overflow-x-auto">{selectedAttempt.stdout}</pre>
                      </div>
                    )}
                    {selectedAttempt.stderr && (
                      <div>
                        <h3 className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Stderr</h3>
                        <pre className="bg-black p-4 rounded-xl border border-red-500/20 text-sm font-mono text-red-400 overflow-x-auto">{selectedAttempt.stderr}</pre>
                      </div>
                    )}
                 </div>
               )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}
