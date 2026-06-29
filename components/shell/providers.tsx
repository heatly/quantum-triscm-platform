"use client"

import * as React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppProvider } from "@/components/shell/app-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <SidebarProvider>{children}</SidebarProvider>
    </AppProvider>
  )
}
