import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { SettingsClient } from "./SettingsClient"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { name: true, email: true, settings: true }
  })

  return <SettingsClient dbUser={dbUser} />
}
