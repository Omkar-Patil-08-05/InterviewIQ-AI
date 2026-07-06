import { AnalyticsData } from "@/types/analytics"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts"

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/90 border border-white/20 p-3 rounded-lg shadow-xl backdrop-blur-md">
        <p className="text-white font-semibold mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="text-sm">
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ChartsTabs({ data }: { data: AnalyticsData }) {
  
  // Data prep
  const attemptDates = data.attempts.map(a => {
    return {
      date: new Date(a.createdAt).toLocaleDateString(),
      runtime: a.runtimeMs,
      memory: a.memoryMb,
      score: (a.aiReview as any)?.codeQualityScore || 0,
    }
  }).reverse() // Chronological

  // Aggregate by date to reduce noise if needed, but plotting raw points over time is fine for now
  
  const pieData = data.languageStats.map(l => ({ name: l.language, value: l.count }))
  
  const successData = [
    { name: 'Passed', value: data.totalProblemsSolved },
    { name: 'Failed', value: data.totalExecutions - data.totalProblemsSolved }
  ]

  const complexityCounts: Record<string, number> = {}
  data.attempts.forEach(a => {
    if (a.timeComplexity) {
      complexityCounts[a.timeComplexity] = (complexityCounts[a.timeComplexity] || 0) + 1
    }
  })
  const complexityData = Object.entries(complexityCounts).map(([name, value]) => ({ name, value }))

  return (
    <Card className="bg-white/5 border-white/10 shadow-xl overflow-hidden">
      <CardHeader className="pb-0 border-b border-white/10">
        <Tabs defaultValue="activity" className="w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <CardTitle className="text-lg font-bold">Performance Trends</CardTitle>
            <TabsList className="bg-white/5 border border-white/10 h-auto p-1 flex-wrap">
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="runtime">Runtime</TabsTrigger>
              <TabsTrigger value="memory">Memory</TabsTrigger>
              <TabsTrigger value="aiscore">AI Score</TabsTrigger>
              <TabsTrigger value="distribution">Distributions</TabsTrigger>
            </TabsList>
          </div>

          <CardContent className="p-0 pt-6 pb-6">
            <TabsContent value="activity" className="m-0 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.dailyActivity}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
                  <XAxis dataKey="date" stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 12 }} />
                  <YAxis stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="count" name="Submissions" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="runtime" className="m-0 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attemptDates.filter(a => a.runtime > 0)}>
                  <defs>
                    <linearGradient id="colorRuntime" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
                  <XAxis dataKey="date" stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 12 }} />
                  <YAxis stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="runtime" name="Runtime (ms)" stroke="#10b981" fillOpacity={1} fill="url(#colorRuntime)" />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="memory" className="m-0 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attemptDates.filter(a => a.memory > 0)}>
                  <defs>
                    <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
                  <XAxis dataKey="date" stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 12 }} />
                  <YAxis stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="memory" name="Memory (MB)" stroke="#f59e0b" fillOpacity={1} fill="url(#colorMemory)" />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="aiscore" className="m-0 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attemptDates.filter(a => a.score > 0)}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
                  <XAxis dataKey="date" stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 12 }} />
                  <YAxis domain={[0, 100]} stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="score" name="AI Score" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="distribution" className="m-0 h-[300px] flex gap-4 overflow-hidden">
               <div className="flex-1 border border-white/5 rounded-xl bg-black/20 p-4 flex flex-col">
                  <h4 className="text-sm text-center text-muted-foreground mb-2">Language Usage</h4>
                  <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={5} dataKey="value">
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
               </div>
               
               <div className="flex-1 border border-white/5 rounded-xl bg-black/20 p-4 flex flex-col">
                  <h4 className="text-sm text-center text-muted-foreground mb-2">Success Rate</h4>
                  <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={successData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={5} dataKey="value">
                          <Cell fill="#10b981" />
                          <Cell fill="#ef4444" />
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
               </div>

               <div className="flex-1 border border-white/5 rounded-xl bg-black/20 p-4 flex flex-col">
                  <h4 className="text-sm text-center text-muted-foreground mb-2">Time Complexity</h4>
                  <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={complexityData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false}/>
                        <XAxis dataKey="name" stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 10 }} />
                        <YAxis stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 10 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="value" name="Count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
               </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </CardHeader>
    </Card>
  )
}
