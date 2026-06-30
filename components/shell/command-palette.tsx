"use client"

import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { useAppState } from "@/components/shell/app-context"
import { allNavItems } from "@/lib/nav"
import { useInventory, useRemediation, useTenants } from "@/lib/api/client"

export function CommandPalette() {
  const router = useRouter()
  const { commandOpen, setCommandOpen, setTenantId } = useAppState()
  const { data: assets } = useInventory()
  const { data: tasks } = useRemediation()
  const { data: tenants } = useTenants()

  const go = (href: string) => {
    setCommandOpen(false)
    router.push(href)
  }

  return (
    <CommandDialog
      open={commandOpen}
      onOpenChange={setCommandOpen}
      title="Command palette"
      description="Jump to tenants, assets, findings, and pages"
    >
      <CommandInput placeholder="Search pages, tenants, assets, tasks…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Pages">
          {allNavItems.map((item) => (
            <CommandItem
              key={item.href}
              value={`page ${item.title} ${item.description}`}
              onSelect={() => go(item.href)}
            >
              <item.icon />
              <span>{item.title}</span>
              <span className="ml-auto truncate text-xs text-muted-foreground">
                {item.description}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Tenants">
          {tenants?.map((t) => (
            <CommandItem
              key={t.id}
              value={`tenant ${t.name}`}
              onSelect={() => {
                setTenantId(t.id)
                go("/app/tenants")
              }}
            >
              <span>{t.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {t.industry}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Assets">
          {assets?.slice(0, 6).map((a) => (
            <CommandItem
              key={a.id}
              value={`asset ${a.name} ${a.id}`}
              onSelect={() => go("/app/inventory")}
            >
              <span className="truncate">{a.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {a.type}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Remediation tasks">
          {tasks?.slice(0, 5).map((t) => (
            <CommandItem
              key={t.id}
              value={`task ${t.title}`}
              onSelect={() => go("/app/remediation")}
            >
              <span className="truncate">{t.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
