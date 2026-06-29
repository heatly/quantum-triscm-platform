'use client'

import { AppProvider } from '@/components/shell/app-context'
import { AppLayout } from '@/components/shell/app-layout'

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppProvider>
      <AppLayout>{children}</AppLayout>
    </AppProvider>
  )
}
