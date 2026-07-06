"use client"

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Target } from "lucide-react";

interface SkillRadarProps {
  data: {
    subject: string;
    score: number;
    fullMark: number;
  }[]
}

export function SkillRadar({ data }: SkillRadarProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-[400px] flex items-center justify-center">
        <p className="text-muted-foreground">Not enough data to generate skill radar.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-full min-h-[400px] flex flex-col">
      <h3 className="font-semibold mb-6 flex items-center gap-2">
        <Target className="w-4 h-4 text-primary" /> Skill Radar Profile
      </h3>
      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'transparent' }} axisLine={false} />
            <Radar name="Candidate" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.4} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
