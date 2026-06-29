import { cn } from "@/lib/utils"
import { titleCase } from "@/lib/format"
import type {
  AckStatus,
  ConnectorStatus,
  HealthStatus,
  JobStatus,
  PqcReadiness,
  Severity,
} from "@/lib/types"

type Tone = "critical" | "warning" | "success" | "info" | "neutral" | "accent"

const toneClass: Record<Tone, string> = {
  critical: "bg-destructive/12 text-destructive ring-1 ring-inset ring-destructive/25",
  warning: "bg-warning/15 text-warning ring-1 ring-inset ring-warning/30",
  success: "bg-success/15 text-success ring-1 ring-inset ring-success/30",
  info: "bg-info/12 text-info ring-1 ring-inset ring-info/25",
  accent: "bg-primary/12 text-primary ring-1 ring-inset ring-primary/25",
  neutral: "bg-muted text-muted-foreground ring-1 ring-inset ring-border",
}

export function Pill({
  tone = "neutral",
  children,
  className,
  dot = false,
}: {
  tone?: Tone
  children: React.ReactNode
  className?: string
  dot?: boolean
}) {
  return (
    <span
      className={cn(
        "inline-flex h-5 w-fit items-center gap-1.5 rounded-full px-2 text-xs font-medium whitespace-nowrap",
        toneClass[tone],
        className
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}

const severityTone: Record<Severity, Tone> = {
  critical: "critical",
  high: "warning",
  medium: "info",
  low: "neutral",
  info: "neutral",
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <Pill tone={severityTone[severity]} dot>
      {titleCase(severity)}
    </Pill>
  )
}

const jobTone: Record<JobStatus, Tone> = {
  queued: "neutral",
  running: "info",
  succeeded: "success",
  failed: "critical",
  cancelled: "neutral",
}

export function JobStatusBadge({ status }: { status: JobStatus }) {
  return (
    <Pill tone={jobTone[status]} dot={status === "running"}>
      {titleCase(status)}
    </Pill>
  )
}

const connectorTone: Record<ConnectorStatus, Tone> = {
  connected: "success",
  validating: "info",
  error: "critical",
  not_connected: "neutral",
}

export function ConnectorStatusBadge({ status }: { status: ConnectorStatus }) {
  return (
    <Pill tone={connectorTone[status]} dot={status === "validating"}>
      {titleCase(status)}
    </Pill>
  )
}

const healthTone: Record<HealthStatus, Tone> = {
  healthy: "success",
  degraded: "warning",
  down: "critical",
  unknown: "neutral",
}

export function HealthBadge({ status }: { status: HealthStatus }) {
  return <Pill tone={healthTone[status]}>{titleCase(status)}</Pill>
}

const pqcTone: Record<PqcReadiness, Tone> = {
  ready: "success",
  partial: "warning",
  not_ready: "critical",
  unknown: "neutral",
}

const pqcLabel: Record<PqcReadiness, string> = {
  ready: "PQ Ready",
  partial: "Partial",
  not_ready: "Not Ready",
  unknown: "Unknown",
}

export function PqcBadge({ readiness }: { readiness: PqcReadiness }) {
  return <Pill tone={pqcTone[readiness]}>{pqcLabel[readiness]}</Pill>
}

const ackTone: Record<AckStatus, Tone> = {
  open: "warning",
  acknowledged: "info",
  assigned: "accent",
  resolved: "success",
}

export function AckBadge({ status }: { status: AckStatus }) {
  return <Pill tone={ackTone[status]}>{titleCase(status)}</Pill>
}

export function RiskBadge({
  band,
}: {
  band: "critical" | "high" | "medium" | "low"
}) {
  const tone: Tone =
    band === "critical"
      ? "critical"
      : band === "high"
        ? "warning"
        : band === "medium"
          ? "info"
          : "success"
  return (
    <Pill tone={tone} dot>
      {titleCase(band)}
    </Pill>
  )
}

export function StatusBadge({
  status,
}: {
  status:
    | JobStatus
    | ConnectorStatus
    | HealthStatus
    | AckStatus
    | "compliant"
    | "non-compliant"
    | "in-progress"
    | "completed"
    | "pending"
    | "active"
}) {
  const toneMap: Record<string, Tone> = {
    running: "info",
    pending: "info",
    completed: "success",
    failed: "critical",
    healthy: "success",
    unhealthy: "critical",
    warning: "warning",
    connected: "success",
    disconnected: "critical",
    pending_approval: "info",
    approved: "success",
    rejected: "critical",
    compliant: "success",
    "non-compliant": "critical",
    "in-progress": "info",
    active: "info",
  }

  const tone = (toneMap[status as string] || "neutral") as Tone
  return (
    <Pill tone={tone} dot>
      {titleCase(String(status))}
    </Pill>
  )
}
