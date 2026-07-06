import { ReactNode } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  actionOnClick?: () => void
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  actionOnClick
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-4 bg-white/5 rounded-xl border border-white/10 animate-in fade-in duration-500">
      <div className="mb-6 opacity-40 text-muted-foreground [&>svg]:w-16 [&>svg]:h-16">
        {icon}
      </div>
      <h3 className="text-xl font-bold tracking-tight mb-2">{title}</h3>
      <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
        {description}
      </p>
      
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button className="font-semibold">{actionLabel}</Button>
        </Link>
      )}
      
      {actionLabel && actionOnClick && !actionHref && (
        <Button onClick={actionOnClick} className="font-semibold">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
