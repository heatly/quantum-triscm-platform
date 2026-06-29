"use client"

import * as React from "react"

export type TimeRange = "24h" | "7d" | "30d" | "90d"

interface AppState {
  tenantId: string
  setTenantId: (id: string) => void
  environment: string
  setEnvironment: (env: string) => void
  timeRange: TimeRange
  setTimeRange: (range: TimeRange) => void
  commandOpen: boolean
  setCommandOpen: (open: boolean) => void
}

const AppContext = React.createContext<AppState | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [tenantId, setTenantId] = React.useState("tnt_acme")
  const [environment, setEnvironment] = React.useState("all")
  const [timeRange, setTimeRange] = React.useState<TimeRange>("30d")
  const [commandOpen, setCommandOpen] = React.useState(false)

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandOpen((o) => !o)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const value = React.useMemo<AppState>(
    () => ({
      tenantId,
      setTenantId,
      environment,
      setEnvironment,
      timeRange,
      setTimeRange,
      commandOpen,
      setCommandOpen,
    }),
    [tenantId, environment, timeRange, commandOpen]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppState() {
  const ctx = React.useContext(AppContext)
  if (!ctx) throw new Error("useAppState must be used within AppProvider")
  return ctx
}
