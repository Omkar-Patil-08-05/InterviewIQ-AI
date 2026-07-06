import { LandingClient } from "@/components/landing/LandingClient"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { NavbarUser } from "@/components/landing/PublicNavbar"

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let navUser: NavbarUser | null = null
  if (user) {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { name: true, email: true }
    })
    
    if (dbUser) {
      navUser = {
        id: user.id,
        email: dbUser.email,
        name: dbUser.name
      }
    }
  }

  return <LandingClient user={navUser} />
}
