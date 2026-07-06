'use server'

import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getAllResumes() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  return prisma.resume.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      fileName: true,
      fileSize: true,
      createdAt: true,
      atsScore: true,
      structuredData: true,
      gapAnalysis: true
    }
  })
}

export async function deleteResume(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  
  await prisma.resume.delete({
    where: { id, userId: user.id }
  })
  revalidatePath('/dashboard/resume-intelligence')
  return true
}

export async function setResumeActive(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  
  // To set active, we simply bump the createdAt to now, so it becomes the latest
  await prisma.resume.update({
    where: { id, userId: user.id },
    data: { createdAt: new Date() }
  })
  revalidatePath('/dashboard/resume-intelligence')
  return true
}

export async function getLatestResume() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const resume = await prisma.resume.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' }
  })

  if (!resume) return null
  return {
    atsScore: resume.atsScore,
    gapAnalysis: resume.gapAnalysis,
    structuredData: resume.structuredData
  }
}
