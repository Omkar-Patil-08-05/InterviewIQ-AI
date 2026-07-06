"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, History, Code2, FileText, Settings, Sparkles, Target, Briefcase } from "lucide-react"

export function ClientSidebar() {
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", icon: <LayoutDashboard className="w-4 h-4" />, label: "Overview" },
    { href: "/dashboard/career-readiness", icon: <Target className="w-4 h-4" />, label: "Career Readiness" },
    { href: "/dashboard/history", icon: <History className="w-4 h-4" />, label: "Interview History" },
    { href: "/dashboard/coding", icon: <Code2 className="w-4 h-4" />, label: "Coding Engine" },
    { href: "/dashboard/resume-intelligence", icon: <FileText className="w-4 h-4" />, label: "Resume Intelligence" },
    { href: "/dashboard/recruiter", icon: <Briefcase className="w-4 h-4 text-purple-400" />, label: "Recruiter View" },
  ]

  return (
    <aside aria-label="Sidebar Navigation" className="w-64 border-r border-border/50 bg-muted/40 dark:bg-black/20 backdrop-blur-xl flex flex-col justify-between hidden md:flex print:hidden">
      <div>
        {/* Logo Area */}
        <div className="h-14 flex items-center px-6 border-b border-border/50">
          <Link href="/" aria-label="Home" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-semibold tracking-tight">InterviewIQ</span>
          </Link>
        </div>
        
        {/* Navigation */}
        <nav aria-label="Main Navigation" className="p-4 space-y-1">
          {navItems.map(item => (
            <Link 
              key={item.href}
              href={item.href} 
              aria-current={pathname === item.href ? "page" : undefined}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                pathname === item.href 
                  ? "bg-white/10 text-foreground" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 space-y-1">
        <Link 
          href="/dashboard/settings" 
          className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
            pathname.startsWith("/dashboard/settings")
              ? "bg-white/10 text-foreground" 
              : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
          }`}
        >
          <Settings className="w-4 h-4" />
          <span className="font-medium">Settings</span>
        </Link>
      </div>
    </aside>
  )
}
