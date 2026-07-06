"use client"

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'

interface RadarData {
  subject: string
  score: number
  fullMark: number
}

export function PerformanceRadarChart({ data }: { data: RadarData[] }) {
  return (
    <div className="h-[300px] w-full">
      <style>{`
        @media print {
          .recharts-polar-grid line, .recharts-polar-grid path {
            stroke: #e5e7eb !important;
          }
          .recharts-polar-angle-axis-tick-value {
            fill: #4b5563 !important;
          }
        }
      `}</style>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} 
            itemStyle={{ color: '#fff' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
