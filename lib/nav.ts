import {
  Activity,
  Boxes,
  Building2,
  ClipboardCheck,
  FlaskConical,
  LayoutDashboard,
  Radar,
  Route,
  ScanEye,
  Settings,
  Share2,
  ShieldAlert,
  Wrench,
  type LucideIcon,
} from "lucide-react"

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  description: string
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    label: "Posture",
    items: [
      { title: "Overview", href: "/app/overview", icon: LayoutDashboard, description: "Program-wide quantum posture summary" },
      { title: "Tenants", href: "/app/tenants", icon: Building2, description: "Onboarding, connectors, and scope" },
    ],
  },
  {
    label: "Discovery & Inventory",
    items: [
      { title: "Discovery", href: "/app/discovery", icon: Radar, description: "Scan jobs, logs, and source coverage" },
      { title: "Inventory", href: "/app/inventory", icon: Boxes, description: "Searchable cryptographic asset inventory" },
    ],
  },
  {
    label: "Analysis",
    items: [
      { title: "Risk", href: "/app/risk", icon: ShieldAlert, description: "Quantum risk scoring and prioritization" },
      { title: "Compliance", href: "/app/compliance", icon: ClipboardCheck, description: "Framework alignment and exceptions" },
    ],
  },
  {
    label: "Operations",
    items: [
      { title: "Monitoring", href: "/app/monitoring", icon: Activity, description: "Continuous monitoring and alerting" },
      { title: "CT Monitor", href: "/app/ct-monitor", icon: ScanEye, description: "Certificate Transparency surveillance" },
    ],
  },
  {
    label: "Cryptography",
    items: [
      { title: "PQ Lab", href: "/app/pqlab", icon: FlaskConical, description: "Post-quantum benchmarking and protocol lab" },
      { title: "Trust Graph", href: "/app/trust-graph", icon: Share2, description: "Dependency and blast-radius analysis" },
    ],
  },
  {
    label: "Orchestration",
    items: [
      { title: "Remediation", href: "/app/remediation", icon: Wrench, description: "Workflow-driven remediation queue" },
      { title: "Migration Planner", href: "/app/migration", icon: Route, description: "Phased PQC migration roadmap" },
    ],
  },
]

export const settingsItem: NavItem = {
  title: "Settings",
  href: "/app/settings",
  icon: Settings,
  description: "Connectors, users, policies, and audit",
}

export const allNavItems: NavItem[] = [
  ...navGroups.flatMap((g) => g.items),
  settingsItem,
]
