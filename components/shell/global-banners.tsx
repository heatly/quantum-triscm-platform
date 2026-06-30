"use client"

import Link from "next/link"
import { Radar, TriangleAlert } from "lucide-react"
import { cn } from "@/lib/utils"
import { useConnectors, useDiscovery } from "@/lib/api/client"

export function GlobalBanners() {
  const { data: connectors } = useConnectors()
  const { data: discovery } = useDiscovery()

  const erroredConnectors =
    connectors?.filter((c) => c.status === "error") ?? []
  const runningJobs =
    discovery?.jobs.filter((j) => j.status === "running") ?? []

  if (erroredConnectors.length === 0 && runningJobs.length === 0) return null

  return (
    <div className="flex flex-col gap-px">
      {erroredConnectors.length > 0 && (
        <Banner tone="critical">
          <TriangleAlert className="size-4 shrink-0" />
          <span>
            {erroredConnectors.length} connector
            {erroredConnectors.length > 1 ? "s" : ""} reporting errors
            {" — "}
            {erroredConnectors.map((c) => c.name).join(", ")}
          </span>
          <Link
            href="/app/tenants"
            className="ml-auto shrink-0 font-medium underline underline-offset-4 hover:opacity-80"
          >
            Review connectors
          </Link>
        </Banner>
      )}
      {runningJobs.length > 0 && (
        <Banner tone="info">
          <Radar className="size-4 shrink-0 animate-pulse" />
          <span>
            {runningJobs.length} discovery job
            {runningJobs.length > 1 ? "s" : ""} in progress
          </span>
          <Link
            href="/app/discovery"
            className="ml-auto shrink-0 font-medium underline underline-offset-4 hover:opacity-80"
          >
            View jobs
          </Link>
        </Banner>
      )}
    </div>
  )
}

function Banner({
  tone,
  children,
}: {
  tone: "critical" | "info"
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-4 py-1.5 text-xs font-medium",
        tone === "critical"
          ? "bg-destructive/10 text-destructive"
          : "bg-info/10 text-info"
      )}
    >
      {children}
    </div>
  )
}
