import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import SetupClient from "./SetupClient"

export default async function SetupInterviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/sign-in")
  }

  const jds = await prisma.jobDescription.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' }
  })

  return <SetupClient jds={jds} />
}
