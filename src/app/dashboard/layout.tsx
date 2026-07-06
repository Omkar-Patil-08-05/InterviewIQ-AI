import { ReactNode } from "react"
import { ClientSidebar } from "./ClientSidebar"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const dbNotifications = user ? await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 10
  }) : []

  // Serialize dates to prevent Server Component payload errors
  const notifications = dbNotifications.map(n => ({
    ...n,
    createdAt: n.createdAt.toISOString()
  })) as any[];

  return (
    <div className="flex h-screen bg-background overflow-hidden print:h-auto print:overflow-visible print:block selection:bg-primary/30 text-sm">
      <ClientSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-y-auto print:overflow-visible print:block bg-background">
        <DashboardHeader 
          email={user?.email || "Unknown User"} 
          name={user?.user_metadata?.full_name || ""} 
          initialNotifications={notifications}
        />
        
        <div className="p-8 max-w-5xl mx-auto w-full flex-1">
          {children}
        </div>
      </main>
    </div>
  )
}
