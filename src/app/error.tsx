"use client"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service in production
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
         <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-2">Something went wrong!</h1>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        We apologize for the inconvenience. An unexpected error occurred within our systems. Our engineering team has been notified.
      </p>
      <div className="flex gap-4">
        <Button onClick={reset} variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Try Again
        </Button>
        <Button onClick={() => window.location.href = '/dashboard'} variant="outline" className="border-white/10 hover:bg-white/5">
          Return to Dashboard
        </Button>
      </div>
    </div>
  )
}
