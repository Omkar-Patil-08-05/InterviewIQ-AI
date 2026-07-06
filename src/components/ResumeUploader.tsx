"use client"
import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { UploadCloud, AlertCircle } from "lucide-react"

export function ResumeUploader({ onAnalysisComplete }: { onAnalysisComplete: (data: any) => void }) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return
    
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be under 5MB")
      return
    }

    setIsUploading(true)
    setError("")

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      
      if (res.ok && data.analysis) {
        onAnalysisComplete(data.analysis)
      } else {
        setError(data.error || "Failed to process resume")
      }
    } catch (err) {
      setError("An unexpected error occurred during processing.")
    } finally {
      setIsUploading(false)
    }
  }, [onAnalysisComplete])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  })

  return (
    <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${isDragActive ? 'border-primary bg-primary/10 scale-[1.02]' : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'}`}>
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-4">
        {isUploading ? (
          <>
            <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <div className="text-xl font-medium text-foreground">Extracting Intelligence...</div>
            <p className="text-sm text-muted-foreground">Securely parsing document and running AI analysis.</p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform">
              <UploadCloud className="w-10 h-10" />
            </div>
            <div className="text-2xl font-semibold text-foreground">Drop your resume here</div>
            <p className="text-sm text-muted-foreground">Support for PDF or DOCX (Max 5MB)</p>
          </>
        )}
        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm mt-4 bg-red-950/50 px-4 py-2 rounded-lg">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}
      </div>
    </div>
  )
}
