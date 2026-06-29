"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export function JsonViewer({
  data,
  label = "Raw backend JSON",
  className,
}: {
  data: unknown
  label?: string
  className?: string
}) {
  const [copied, setCopied] = React.useState(false)
  const json = React.useMemo(() => JSON.stringify(data, null, 2), [data])

  const copy = async () => {
    await navigator.clipboard.writeText(json)
    setCopied(true)
    toast.success("API payload copied to clipboard")
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
        <Button variant="outline" size="sm" onClick={copy}>
          {copied ? (
            <Check data-icon="inline-start" />
          ) : (
            <Copy data-icon="inline-start" />
          )}
          Copy API payload
        </Button>
      </div>
      <ScrollArea className="h-72 rounded-lg border border-border bg-muted/40">
        <pre className="p-3 font-mono text-xs leading-relaxed text-foreground/90">
          {json}
        </pre>
      </ScrollArea>
    </div>
  )
}
