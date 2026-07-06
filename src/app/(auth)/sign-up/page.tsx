import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles } from "lucide-react"
import { signup } from "../actions"

export const metadata: Metadata = {
  title: "Sign Up - InterviewIQ AI",
  description: "Create your account.",
}

export default async function SignUpPage(props: { searchParams: Promise<{ message?: string }> }) {
  const searchParams = await props.searchParams
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-[400px] p-8 glass-panel rounded-2xl relative z-10 mx-4 border border-white/10 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Create an account</h1>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Start practicing for your technical interviews today.
          </p>
        </div>

        {searchParams?.message && (
          <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-sm mb-6 text-center border border-red-500/20">
            {searchParams.message}
          </div>
        )}

        <form action={signup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-muted-foreground">Full Name</Label>
            <Input id="name" name="name" type="text" placeholder="John Doe" required className="bg-black/50 focus:bg-black/80 transition-colors" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-muted-foreground">Email</Label>
            <Input id="email" name="email" type="email" placeholder="m@example.com" required className="bg-black/50 focus:bg-black/80 transition-colors" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-muted-foreground">Password</Label>
            <Input id="password" name="password" type="password" required className="bg-black/50 focus:bg-black/80 transition-colors" />
          </div>
          <Button type="submit" className="w-full h-11 text-base font-medium mt-2 bg-blue-600 hover:bg-blue-700">
            Sign Up
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
