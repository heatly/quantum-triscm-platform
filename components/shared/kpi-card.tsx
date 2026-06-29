import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Tone = "default" | "critical" | "warning" | "success" | "info"

const iconTone: Record<Tone, string> = {
  default: "bg-muted text-muted-foreground",
  critical: "bg-destructive/12 text-destructive",
  warning: "bg-warning/15 text-warning",
  success: "bg-success/15 text-success",
  info: "bg-info/12 text-info",
}

interface KPICardProps {
  title: string
  value: string | number
  unit?: string
  icon?: LucideIcon
  status?: Tone
  trend?: { direction: 'up' | 'down'; value: number }
}

export function KPICard({
  title,
  value,
  unit,
  icon: Icon,
  status = "default",
  trend,
}: KPICardProps) {
  return (
    <Card className="gap-0 py-0">
      <CardContent className="flex items-start justify-between gap-3 p-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {title}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-heading text-2xl font-semibold tabular-nums tracking-tight">
              {value}
            </span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
          {trend && (
            <span className={`text-xs font-medium ${trend.direction === 'down' ? 'text-green-600' : 'text-red-600'}`}>
              {trend.direction === 'down' ? '↓' : '↑'} {trend.value}%
            </span>
          )}
        </div>
        {Icon && (
          <div
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-lg [&>svg]:size-4.5",
              iconTone[status]
            )}
          >
            <Icon />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Legacy alias for backward compatibility
export const KpiCard = KPICard
