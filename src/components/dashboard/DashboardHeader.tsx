"use client"

import { useState } from "react"
import { Bell, LogOut, Settings, User as UserIcon, Menu, LayoutDashboard, History, Code2, FileText, LineChart, Sparkles, Target, Briefcase } from "lucide-react"
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Notification } from "@prisma/client"

const timeAgo = (date: Date | string) => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  if (seconds < 30) return "just now";
  return Math.floor(seconds) + " seconds ago";
}

export function DashboardHeader({ name, email, initialNotifications = [] }: { name: string, email: string, initialNotifications?: Notification[] }) {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const unreadCount = notifications.filter(n => !n.read).length

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
    router.push("/")
  }

  const initials = name ? name.charAt(0).toUpperCase() : email ? email.charAt(0).toUpperCase() : "U"

  return (
    <header className="h-14 border-b border-border/50 bg-background/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-10 w-full print:hidden">
      {/* Mobile Nav (Hamburger) */}
      <div className="md:hidden flex items-center gap-2">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="p-2 -ml-2 rounded-md hover:bg-white/5 transition-colors focus:outline-none">
              <Menu className="w-5 h-5 text-foreground" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content align="start" sideOffset={8} className="w-64 bg-background/95 backdrop-blur-xl border border-border mt-2 p-2 shadow-2xl rounded-xl z-50">
              <div className="flex items-center gap-2 px-3 py-2 mb-2 border-b border-border/50 pb-3">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="font-semibold tracking-tight">InterviewIQ</span>
              </div>
              <DropdownMenu.Item onClick={() => router.push('/dashboard')} className="cursor-pointer flex items-center gap-3 py-2.5 px-3 rounded-md hover:bg-white/5 focus:bg-white/5 focus:outline-none text-sm font-medium text-foreground">
                <LayoutDashboard className="w-4 h-4 text-primary" /> Overview
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => router.push('/dashboard/career-readiness')} className="cursor-pointer flex items-center gap-3 py-2.5 px-3 rounded-md hover:bg-white/5 focus:bg-white/5 focus:outline-none text-sm font-medium text-foreground">
                <Target className="w-4 h-4 text-primary" /> Career Readiness
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => router.push('/dashboard/history')} className="cursor-pointer flex items-center gap-3 py-2.5 px-3 rounded-md hover:bg-white/5 focus:bg-white/5 focus:outline-none text-sm font-medium text-foreground">
                <History className="w-4 h-4 text-primary" /> Interview History
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => router.push('/dashboard/coding')} className="cursor-pointer flex items-center gap-3 py-2.5 px-3 rounded-md hover:bg-white/5 focus:bg-white/5 focus:outline-none text-sm font-medium text-foreground">
                <Code2 className="w-4 h-4 text-primary" /> Coding Engine
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => router.push('/dashboard/resume-intelligence')} className="cursor-pointer flex items-center gap-3 py-2.5 px-3 rounded-md hover:bg-white/5 focus:bg-white/5 focus:outline-none text-sm font-medium text-foreground">
                <FileText className="w-4 h-4 text-primary" /> Resume Intelligence
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => router.push('/dashboard/career-intelligence')} className="cursor-pointer flex items-center gap-3 py-2.5 px-3 rounded-md hover:bg-white/5 focus:bg-white/5 focus:outline-none text-sm font-medium text-foreground">
                <LineChart className="w-4 h-4 text-primary" /> Career Intelligence
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => router.push('/dashboard/recruiter')} className="cursor-pointer flex items-center gap-3 py-2.5 px-3 rounded-md hover:bg-white/5 focus:bg-white/5 focus:outline-none text-sm font-medium text-foreground">
                <Briefcase className="w-4 h-4 text-purple-400" /> Recruiter View
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
        <span className="font-semibold tracking-tight text-foreground">InterviewIQ</span>
      </div>

      {/* Spacer for desktop to keep right alignment */}
      <div className="hidden md:block flex-1" />

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="relative p-2 rounded-full hover:bg-white/5 transition-colors focus:outline-none">
              <Bell className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-background animate-pulse" />
              )}
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content align="end" sideOffset={8} className="w-80 bg-background/95 backdrop-blur-xl border border-border shadow-2xl rounded-xl overflow-hidden z-50">
              <DropdownMenu.Label className="px-4 py-3 font-semibold text-sm text-foreground">Notifications</DropdownMenu.Label>
              <DropdownMenu.Separator className="h-px bg-border" />
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.length > 0 ? notifications.map((notif, index) => (
                <div key={notif.id}>
                  <div className={`p-3 hover:bg-white/5 cursor-pointer ${!notif.read ? 'border-l-2 border-primary' : ''}`}>
                    <div className="text-sm font-medium text-foreground">
                      {notif.type === 'RESUME_ANALYZED' ? 'Resume Analysis Complete' : 'Notification'}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{notif.message}</div>
                    <div className="text-[10px] text-muted-foreground mt-2">{timeAgo(notif.createdAt)}</div>
                  </div>
                  {index < notifications.length - 1 && <DropdownMenu.Separator className="h-px bg-border" />}
                </div>
              )) : (
                <div className="p-4 text-center text-sm text-muted-foreground">No notifications yet.</div>
              )}
            </div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {/* Profile Dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="focus:outline-none">
              <div className="flex items-center gap-2 hover:bg-white/5 p-1 pr-2 rounded-full transition-colors border border-transparent hover:border-white/10">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/40 to-blue-600/40 border border-primary/30 flex items-center justify-center text-primary-foreground font-medium shadow-sm">
                  {initials}
                </div>
              </div>
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content align="end" sideOffset={8} className="w-64 bg-background/95 backdrop-blur-xl border border-border mt-2 p-2 shadow-2xl rounded-xl z-50">
              <div className="flex items-center gap-3 p-2 mb-2">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-lg">
                  {initials}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium truncate text-foreground">{name}</p>
                  <p className="text-xs text-muted-foreground truncate">{email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-2 p-2 bg-muted/50 rounded-lg border border-border">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-0.5">Avg Score</div>
                  <div className="text-sm font-bold text-green-500">85%</div>
                </div>
                <div className="text-center border-l border-border">
                  <div className="text-xs text-muted-foreground mb-0.5">Interviews</div>
                  <div className="text-sm font-bold text-blue-500">4</div>
                </div>
              </div>

              <DropdownMenu.Separator className="h-px bg-border my-1" />
              <DropdownMenu.Item onClick={() => router.push('/dashboard/settings')} className="cursor-pointer flex items-center gap-2 py-2 px-3 rounded-md hover:bg-muted focus:bg-muted focus:outline-none text-sm text-foreground">
                <UserIcon className="w-4 h-4 text-muted-foreground" />
                <span>Profile Settings</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => router.push('/dashboard/settings')} className="cursor-pointer flex items-center gap-2 py-2 px-3 rounded-md hover:bg-muted focus:bg-muted focus:outline-none text-sm text-foreground">
                <Settings className="w-4 h-4 text-muted-foreground" />
                <span>Preferences</span>
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="h-px bg-border my-1" />
              <DropdownMenu.Item onClick={handleSignOut} className="cursor-pointer flex items-center gap-2 py-2 px-3 rounded-md hover:bg-red-500/10 focus:bg-red-500/10 focus:outline-none text-sm text-red-500">
                <LogOut className="w-4 h-4" />
                <span>Sign out</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  )
}
