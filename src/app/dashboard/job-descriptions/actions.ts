"use server"

import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function uploadJobDescription(title: string, company: string, rawText: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  // Mark others as inactive if this is the first one, or we can just keep it simple
  const jd = await prisma.jobDescription.create({
    data: {
      userId: user.id,
      title,
      company,
      rawText,
      isActive: true, // Make newly uploaded JD active by default
    }
  })
  
  // Mark others inactive
  await prisma.jobDescription.updateMany({
    where: { userId: user.id, id: { not: jd.id } },
    data: { isActive: false }
  })

  revalidatePath("/dashboard/job-descriptions")
  revalidatePath("/dashboard")
  return jd
}

export async function getJobDescriptions() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  return await prisma.jobDescription.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' }
  })
}

export async function deleteJobDescription(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  await prisma.jobDescription.delete({
    where: { id, userId: user.id }
  })
  revalidatePath("/dashboard/job-descriptions")
}

export async function setActiveJobDescription(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  await prisma.jobDescription.updateMany({
    where: { userId: user.id },
    data: { isActive: false }
  })

  await prisma.jobDescription.update({
    where: { id, userId: user.id },
    data: { isActive: true }
  })

  revalidatePath("/dashboard/job-descriptions")
  revalidatePath("/dashboard")
}
