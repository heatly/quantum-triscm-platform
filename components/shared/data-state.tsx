"use client"

import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

/**
 * Standard loading / error / empty handling for backend-driven views.
 * Pass the SWR-style state and render children only when data is present.
 */
export function DataState<T>({
  isLoading,
  error,
  data,
  isEmpty,
  onRetry,
  skeleton,
  emptyTitle = "No data yet",
  emptyDescription = "Connect a backend source to populate this view.",
  children,
}: {
  isLoading: boolean
  error?: Error
  data: T | undefined
  isEmpty?: (data: T) => boolean
  onRetry?: () => void
  skeleton?: React.ReactNode
  emptyTitle?: string
  emptyDescription?: string
  children: (data: T) => React.ReactNode
}) {
  if (isLoading && !data) {
    return <>{skeleton ?? <DefaultSkeleton />}</>
  }

  if (error) {
    return (
      <Empty className="border border-border bg-card">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertTriangle className="text-destructive" />
          </EmptyMedia>
          <EmptyTitle>Failed to load data</EmptyTitle>
          <EmptyDescription>{error.message}</EmptyDescription>
        </EmptyHeader>
        {onRetry && (
          <EmptyContent>
            <Button variant="outline" size="sm" onClick={onRetry}>
              <RefreshCw data-icon="inline-start" />
              Retry
            </Button>
          </EmptyContent>
        )}
      </Empty>
    )
  }

  if (!data || (isEmpty && isEmpty(data))) {
    return (
      <Empty className="border border-dashed border-border bg-card/50">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertTriangle />
          </EmptyMedia>
          <EmptyTitle>{emptyTitle}</EmptyTitle>
          <EmptyDescription>{emptyDescription}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return <>{children(data)}</>
}

export function DefaultSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  )
}
