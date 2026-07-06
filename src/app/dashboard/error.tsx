"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCcw } from "lucide-react"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Dashboard Error Caught:", error)
  }, [error])

  const isRateLimit = error.message?.includes("Quota exceeded") || error.message?.includes("429")

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8 text-center animate-in fade-in duration-500">
      <div className="bg-red-500/10 p-4 rounded-full mb-2">
        <AlertTriangle className="w-10 h-10 text-red-500" />
      </div>
      
      <h2 className="text-2xl font-bold tracking-tight">
        {isRateLimit ? "AI Rate Limit Reached" : "Something went wrong"}
      </h2>
      
      <p className="text-muted-foreground max-w-md mx-auto">
        {isRateLimit 
          ? "You've exceeded the free tier quota for the Gemini API. Please wait about a minute and try again, or check your API billing details."
          : error.message || "An unexpected error occurred while loading this page. Please try again."}
      </p>

      <div className="flex gap-4 mt-6">
        <Button onClick={() => reset()} className="gap-2">
          <RefreshCcw className="w-4 h-4" />
          Try Again
        </Button>
        <Button variant="outline" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    </div>
  )
}
