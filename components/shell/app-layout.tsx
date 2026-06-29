'use client'

import { ReactNode } from 'react'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './app-sidebar'
import { AppHeader } from './app-header'
import { CommandPalette } from './command-palette'
import { GlobalBanners } from './global-banners'

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className='flex flex-col'>
        <GlobalBanners />
        <AppHeader />
        <main className='flex-1 overflow-auto bg-background px-6 py-4'>
          {children}
        </main>
        <CommandPalette />
      </SidebarInset>
    </SidebarProvider>
  )
}
