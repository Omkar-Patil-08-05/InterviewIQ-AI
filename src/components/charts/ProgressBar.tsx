"use client"

import { motion } from "framer-motion"

export function ProgressBar({ label, value, colorClass = "bg-primary" }: { label: string, value: number, colorClass?: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-foreground font-medium print:text-black">{label}</span>
        <span className="text-muted-foreground print:text-gray-600">{value}%</span>
      </div>
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden print:bg-gray-200">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${colorClass} rounded-full`}
        />
      </div>
    </div>
  )
}
