import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { KeyRound } from "lucide-react"
import { sendPasswordResetEmail } from "../actions"

export const metadata: Metadata = {
  title: "Forgot Password - InterviewIQ AI",
  description: "Reset your password.",
}

export default async function ForgotPasswordPage(props: { searchParams: Promise<{ message?: string }> }) {
  const searchParams = await props.searchParams
  const isSuccess = searchParams?.message?.includes('Check your email')
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-[400px] p-8 glass-panel rounded-2xl relative z-10 mx-4 border border-white/10 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
            <KeyRound className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Forgot password</h1>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        {searchParams?.message && (
          <div className={`${isSuccess ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'} p-3 rounded-lg text-sm mb-6 text-center border`}>
            {searchParams.message}
          </div>
        )}

        <form action={sendPasswordResetEmail} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-muted-foreground">Email</Label>
            <Input id="email" name="email" type="email" placeholder="m@example.com" required className="bg-black/50 focus:bg-black/80 transition-colors" />
          </div>
          
          <Button type="submit" className="w-full h-11 text-base font-medium mt-2">
            Send Reset Link
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link href="/sign-in" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
