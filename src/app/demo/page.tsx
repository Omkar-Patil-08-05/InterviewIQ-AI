import { DemoClient } from "@/components/demo/DemoClient"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { NavbarUser } from "@/components/landing/PublicNavbar"

export default async function DemoPage() {
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

  return <DemoClient user={navUser} />
}
