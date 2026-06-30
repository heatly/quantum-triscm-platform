'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, Home, RotateCcw } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[v0] Error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-24">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-red-500/10">
          <AlertCircle className="size-6 text-red-600" />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-3xl font-bold tracking-tight">Something Went Wrong</h1>
          <h2 className="text-sm text-muted-foreground">An unexpected error occurred</h2>
        </div>

        <p className="max-w-md text-sm text-muted-foreground">
          We're sorry for the inconvenience. Please try again or contact support if the problem persists.
        </p>

        {error.digest && (
          <div className="rounded-lg bg-muted/50 px-3 py-2 text-xs font-mono text-muted-foreground">
            Error ID: {error.digest}
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button onClick={reset}>
            <RotateCcw className="mr-2 size-4" />
            Try Again
          </Button>
          <Link href="/app/overview">
            <Button variant="outline">
              <Home className="mr-2 size-4" />
              Go to Overview
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
