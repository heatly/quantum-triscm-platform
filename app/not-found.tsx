import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-24">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-5xl font-bold tracking-tight">404</h1>
          <h2 className="text-2xl font-semibold text-muted-foreground">Page Not Found</h2>
        </div>
        
        <p className="max-w-md text-base text-muted-foreground">
          The page you're looking for doesn't exist. Please check the URL or navigate back to the platform.
        </p>

        <div className="flex gap-3 pt-4">
          <Link href="/app/overview">
            <Button>
              <Home className="mr-2 size-4" />
              Back to Overview
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Go Home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
