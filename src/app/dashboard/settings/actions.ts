'use server'

import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export async function updateUserSettings(settings: Prisma.JsonObject) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
  if (!dbUser) return false

  const currentSettings = (dbUser.settings as Prisma.JsonObject) || {}
  const newSettings = { ...currentSettings, ...settings }

  await prisma.user.update({
    where: { id: user.id },
    data: { settings: newSettings as Prisma.InputJsonObject }
  })
  return true
}

export async function updateUserProfile(name: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  await prisma.user.update({
    where: { id: user.id },
    data: { name }
  })
  
  // Update Supabase auth metadata as well
  await supabase.auth.updateUser({
    data: { full_name: name }
  })

  return true
}

export async function updateUserPassword(password: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { error: error.message }
  return { success: true }
}
