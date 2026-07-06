"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, User as UserIcon, LogOut, LayoutDashboard, FileText, History, Code2, Settings } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export interface NavbarUser {
  id: string
  email: string
  name?: string | null
}

interface PublicNavbarProps {
  user: NavbarUser | null
}

export function PublicNavbar({ user }: PublicNavbarProps) {
  const router = useRouter()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
    router.push("/")
  }

  // Generate initials for avatar
  const getInitials = () => {
    if (user?.name) {
      const parts = user.name.split(" ")
      return parts.length > 1 
        ? parts[0][0] + parts[parts.length - 1][0] 
        : parts[0].substring(0, 2)
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase()
    }
    return "US"
  }

  return (
    <nav className="border-b border-border/50 bg-background/70 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => router.push('/')}>
          <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 group-hover:to-white transition-all">
            InterviewIQ
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-blue-600/30 border border-primary/20 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                <span className="text-sm font-medium text-white">{getInitials()}</span>
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-64 rounded-xl border border-white/10 bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden origin-top-right"
                  >
                    <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                      <p className="text-sm font-medium text-white truncate">{user.name || "User"}</p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</p>
                    </div>
                    <div className="p-2 space-y-1">
                      <Link href="/dashboard" onClick={() => setIsDropdownOpen(false)}>
                        <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer group">
                          <LayoutDashboard className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          Dashboard
                        </div>
                      </Link>
                      <Link href="/dashboard/resume-intelligence" onClick={() => setIsDropdownOpen(false)}>
                        <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer group">
                          <FileText className="w-4 h-4 text-muted-foreground group-hover:text-emerald-400 transition-colors" />
                          Resume Intelligence
                        </div>
                      </Link>
                      <Link href="/dashboard/history" onClick={() => setIsDropdownOpen(false)}>
                        <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer group">
                          <History className="w-4 h-4 text-muted-foreground group-hover:text-purple-400 transition-colors" />
                          Interview History
                        </div>
                      </Link>
                      <Link href="/dashboard/coding" onClick={() => setIsDropdownOpen(false)}>
                        <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer group">
                          <Code2 className="w-4 h-4 text-muted-foreground group-hover:text-orange-400 transition-colors" />
                          Coding Workspace
                        </div>
                      </Link>
                      <Link href="/dashboard/setup" onClick={() => setIsDropdownOpen(false)}>
                        <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer group">
                          <Settings className="w-4 h-4 text-muted-foreground group-hover:text-blue-400 transition-colors" />
                          Settings
                        </div>
                      </Link>
                    </div>
                    <div className="p-2 border-t border-white/5">
                      <button 
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/sign-in">
                <Button variant="ghost" className="text-muted-foreground hover:text-white px-4 hover:bg-white/5">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-primary hover:bg-primary/90 text-white border border-primary/50 shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
