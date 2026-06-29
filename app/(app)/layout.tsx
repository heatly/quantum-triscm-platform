import type React from "react"
import { Providers } from "@/components/shell/providers"
import { AppSidebar } from "@/components/shell/app-sidebar"
import { AppHeader } from "@/components/shell/app-header"
import { DetailDrawer } from "@/components/shell/detail-drawer"
import { CommandPalette } from "@/components/shell/command-palette"
import { GlobalBanners } from "@/components/shell/global-banners"
import { SidebarInset } from "@/components/ui/sidebar"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <AppSidebar />
      <SidebarInset className="min-w-0">
        <AppHeader />
        <GlobalBanners />
        <main className="flex-1 px-4 py-5 md:px-6 md:py-6">{children}</main>
      </SidebarInset>
      <DetailDrawer />
      <CommandPalette />
    </Providers>
  )
}
