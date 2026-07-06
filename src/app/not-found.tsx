import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 text-center">
      <h1 className="text-[120px] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/20 leading-none">
        404
      </h1>
      <h2 className="text-2xl font-semibold mt-4 mb-2">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
      </p>
      <Link href="/">
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Return Home
        </Button>
      </Link>
    </div>
  )
}
