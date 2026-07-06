'use server'

import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"

export async function createInterviewAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/sign-in")
  }

  const role = formData.get("role") as string || "Frontend"
  const difficulty = formData.get("difficulty") as string || "Medium"
  const durationStr = formData.get("duration") as string || "30m"
  const duration = parseInt(durationStr.replace('m', ''), 10) || 30
  const company = formData.get("company") as string || ""
  const jobDescriptionId = formData.get("jobDescriptionId") as string || null

  await prisma.user.upsert({
    where: { id: user.id },
    update: {},
    create: {
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.full_name || 'Candidate',
    }
  })

  const interview = await prisma.interview.create({
    data: {
      userId: user.id,
      role: company ? `${company} - ${role}` : role,
      difficulty,
      duration,
      status: "IN_PROGRESS",
      jobDescriptionId: jobDescriptionId || undefined
    }
  })

  redirect(`/interview/${interview.id}`)
}
