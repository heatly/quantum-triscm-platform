"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAppContext } from "@/components/shell/app-context"

export function DetailDrawer() {
  const { drawer, closeDrawer } = useAppContext()

  return (
    <Sheet open={drawer.open} onOpenChange={(o) => !o && closeDrawer()}>
      <SheetContent className="w-full gap-0 p-0 sm:max-w-xl">
        <SheetHeader className="border-b border-border px-6 py-4">
          <SheetTitle className="text-balance">{drawer.title ?? "Details"}</SheetTitle>
          {drawer.description ? (
            <SheetDescription className="text-pretty">{drawer.description}</SheetDescription>
          ) : (
            <SheetDescription className="sr-only">Detail panel</SheetDescription>
          )}
        </SheetHeader>
        <ScrollArea className="h-[calc(100svh-5rem)]">
          <div className="px-6 py-5">{drawer.content}</div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
