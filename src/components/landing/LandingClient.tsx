"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Bot, Code2, LineChart, MessageSquare, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PublicNavbar, NavbarUser } from "./PublicNavbar"

import { HeroSection } from "./HeroSection"
import { FeatureShowcase } from "./FeatureShowcase"
import { HowItWorks } from "./HowItWorks"
import { CompanySupport } from "./CompanySupport"
import { ComparisonTable } from "./ComparisonTable"
import { Testimonials } from "./Testimonials"
import { FAQSection } from "./FAQSection"
import { FinalCTA } from "./FinalCTA"

interface LandingClientProps {
  user: NavbarUser | null;
}

export function LandingClient({ user }: LandingClientProps) {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden selection:bg-primary/30">
      
      {/* Navigation */}
      <PublicNavbar user={user} />

      {/* Main Content */}
      <div className="relative z-10">
        <HeroSection hasUser={!!user} />
        <CompanySupport />
        <FeatureShowcase />
        <HowItWorks />
        <ComparisonTable />
        <Testimonials />
        <FAQSection />
        <FinalCTA hasUser={!!user} />
      </div>
    </div>
  )
}
