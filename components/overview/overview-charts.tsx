"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { DistributionPoint, OverviewData } from "@/lib/types"

const growthConfig = {
  assets: { label: "Total assets", color: "var(--chart-1)" },
  pqReady: { label: "PQ-ready", color: "var(--chart-2)" },
} satisfies ChartConfig

export function AssetGrowthChart({ data }: { data: OverviewData["assetGrowth"] }) {
  return (
    <Card className="gap-3">
      <CardHeader>
        <CardTitle>Cryptographic asset growth</CardTitle>
        <CardDescription>Total discovered assets vs. post-quantum ready over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={growthConfig} className="h-[260px] w-full">
          <AreaChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="fillAssets" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-assets)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-assets)" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="fillPq" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-pqReady)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-pqReady)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
            <YAxis tickLine={false} axisLine={false} width={32} fontSize={12} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              dataKey="assets"
              type="monotone"
              stroke="var(--color-assets)"
              fill="url(#fillAssets)"
              strokeWidth={2}
            />
            <Area
              dataKey="pqReady"
              type="monotone"
              stroke="var(--color-pqReady)"
              fill="url(#fillPq)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

const RISK_COLORS: Record<string, string> = {
  critical: "var(--destructive)",
  high: "var(--warning)",
  medium: "var(--info)",
  low: "var(--success)",
}

export function RiskDistributionChart({ data }: { data: DistributionPoint[] }) {
  const config = Object.fromEntries(
    data.map((d) => [d.key, { label: d.name, color: RISK_COLORS[d.key] ?? "var(--chart-1)" }])
  ) satisfies ChartConfig

  return (
    <Card className="gap-3">
      <CardHeader>
        <CardTitle>Risk distribution</CardTitle>
        <CardDescription>Assets by quantum risk band</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <ChartContainer config={config} className="h-[260px] w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} strokeWidth={3}>
              {data.map((entry) => (
                <Cell key={entry.key} fill={RISK_COLORS[entry.key] ?? "var(--chart-1)"} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="name" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

const expiryConfig = {
  value: { label: "Certificates", color: "var(--chart-4)" },
} satisfies ChartConfig

export function CertExpiryChart({ data }: { data: DistributionPoint[] }) {
  return (
    <Card className="gap-3">
      <CardHeader>
        <CardTitle>Certificate expiry windows</CardTitle>
        <CardDescription>Upcoming certificate expirations by window</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={expiryConfig} className="h-[220px] w-full">
          <BarChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
            <YAxis tickLine={false} axisLine={false} width={32} fontSize={12} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
