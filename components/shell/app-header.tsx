"use client"

import { Bell, Moon, Search, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Kbd } from "@/components/shared/kbd"
import { useTheme } from "@/components/theme-provider"
import { useAppState, type TimeRange } from "@/components/shell/app-context"
import { useMonitoring, useTenants } from "@/lib/api/client"

const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: "24h", label: "Last 24 hours" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
]

export function AppHeader() {
  const { theme, toggleTheme } = useTheme()
  const {
    tenantId,
    setTenantId,
    environment,
    setEnvironment,
    timeRange,
    setTimeRange,
    setCommandOpen,
  } = useAppState()
  const { data: tenants } = useTenants()
  const { data: events } = useMonitoring()

  const openAlerts = events?.filter((e) => e.status === "open").length ?? 0

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mr-1 h-5" />

      <Select value={tenantId} onValueChange={setTenantId}>
        <SelectTrigger size="sm" className="w-[180px]" aria-label="Select tenant">
          <SelectValue placeholder="Select tenant" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Tenants</SelectLabel>
            {tenants?.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select value={environment} onValueChange={setEnvironment}>
        <SelectTrigger
          size="sm"
          className="hidden w-[130px] sm:flex"
          aria-label="Select environment"
        >
          <SelectValue placeholder="Environment" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Environment</SelectLabel>
            <SelectItem value="all">All environments</SelectItem>
            <SelectItem value="production">Production</SelectItem>
            <SelectItem value="staging">Staging</SelectItem>
            <SelectItem value="development">Development</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <button
        type="button"
        onClick={() => setCommandOpen(true)}
        className="ml-1 hidden h-8 max-w-72 flex-1 items-center gap-2 rounded-lg border border-input bg-muted/40 px-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted md:flex"
      >
        <Search className="size-4 shrink-0" />
        <span className="truncate">Search assets, findings, pages…</span>
        <Kbd className="ml-auto">⌘K</Kbd>
      </button>

      <div className="ml-auto flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          onClick={() => setCommandOpen(true)}
          aria-label="Search"
        >
          <Search />
        </Button>

        <Select
          value={timeRange}
          onValueChange={(v) => setTimeRange(v as TimeRange)}
        >
          <SelectTrigger
            size="sm"
            className="hidden w-[150px] lg:flex"
            aria-label="Time range"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Time range</SelectLabel>
              {TIME_RANGES.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun /> : <Moon />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="relative"
                aria-label="Notifications"
              >
                <Bell />
                {openAlerts > 0 && (
                  <span className="absolute right-1 top-1 flex size-2 rounded-full bg-destructive ring-2 ring-background" />
                )}
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>
              Notifications
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                {openAlerts} open
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {(events ?? []).slice(0, 4).map((e) => (
                <DropdownMenuItem key={e.id} className="flex-col items-start gap-0.5">
                  <span className="text-sm font-medium">{e.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {e.source}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="ml-0.5"
                aria-label="User menu"
              >
                <Avatar className="size-7">
                  <AvatarFallback className="text-xs">SA</AvatarFallback>
                </Avatar>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col gap-0.5">
              <span>Security Architect</span>
              <span className="text-xs font-normal text-muted-foreground">
                architect@acme.com
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Preferences</DropdownMenuItem>
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
