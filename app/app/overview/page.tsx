'use client'

import { useOverview } from '@/lib/api/client'
import { PageHeader } from '@/components/shared/page-header'
import { DataState } from '@/components/shared/data-state'
import { KPICard } from '@/components/shared/kpi-card'
import { RiskBadge, SeverityBadge } from '@/components/shared/status-badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import { Boxes, Globe, ShieldAlert, Wrench, FileWarning, KeyRound, ShieldCheck, PlugZap } from 'lucide-react'
import { formatNumber, relativeTime } from '@/lib/format'

const growthConfig = {
  assets: { label: 'Total Assets', color: 'var(--chart-1)' },
  pqReady: { label: 'PQ Ready', color: 'var(--chart-2)' },
} satisfies ChartConfig

const RISK_COLORS: Record<string, string> = {
  critical: 'var(--chart-5)',
  high: 'var(--chart-4)',
  medium: 'var(--chart-3)',
  low: 'var(--chart-2)',
}

export default function OverviewPage() {
  const { data, isLoading, error, refresh } = useOverview()

  return (
    <>
      <PageHeader
        title="Security Intelligence Hub"
        description="Enterprise-wide visibility into cryptographic risk, compliance, and PQC readiness"
      />

      <DataState isLoading={isLoading} error={error} data={data} onRetry={refresh}>
        {(overview) => {
          const { kpis } = overview
          return (
            <div className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <KPICard
                  title="Total Crypto Assets"
                  value={formatNumber(kpis.totalCryptoAssets)}
                  icon={Boxes}
                  status="info"
                />
                <KPICard
                  title="Internet Facing"
                  value={formatNumber(kpis.internetFacingAssets)}
                  icon={Globe}
                  status="warning"
                />
                <KPICard
                  title="Expiring Certificates"
                  value={formatNumber(kpis.expiringCertificates)}
                  icon={FileWarning}
                  status="warning"
                />
                <KPICard
                  title="Deprecated Algorithms"
                  value={formatNumber(kpis.deprecatedAlgorithms)}
                  icon={KeyRound}
                  status="critical"
                />
                <KPICard
                  title="PQ-Ready Assets"
                  value={formatNumber(kpis.pqReadyAssets)}
                  icon={ShieldCheck}
                  status="success"
                />
                <KPICard
                  title="Open Remediations"
                  value={formatNumber(kpis.openRemediationTasks)}
                  icon={Wrench}
                  status="default"
                />
                <KPICard
                  title="Active Alerts"
                  value={formatNumber(kpis.activeAlerts)}
                  icon={ShieldAlert}
                  status="critical"
                />
                <KPICard
                  title="Connector Health"
                  value={`${kpis.connectorsHealthy}/${kpis.connectorsTotal}`}
                  icon={PlugZap}
                  status={kpis.connectorsHealthy === kpis.connectorsTotal ? 'success' : 'warning'}
                />
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Asset Growth & PQC Readiness</CardTitle>
                    <CardDescription>Discovered assets versus post-quantum ready assets</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={growthConfig} className="h-[280px] w-full">
                      <AreaChart data={overview.assetGrowth} margin={{ left: 4, right: 12, top: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          width={44}
                          tickFormatter={(v: number) =>
                            v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`
                          }
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                          type="monotone"
                          dataKey="assets"
                          stroke="var(--color-assets)"
                          fill="var(--color-assets)"
                          fillOpacity={0.15}
                          strokeWidth={2}
                        />
                        <Area
                          type="monotone"
                          dataKey="pqReady"
                          stroke="var(--color-pqReady)"
                          fill="var(--color-pqReady)"
                          fillOpacity={0.15}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Risk Distribution</CardTitle>
                    <CardDescription>Assets by risk band</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={{}} className="mx-auto aspect-square max-h-[240px]">
                      <PieChart>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Pie
                          data={overview.riskDistribution}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={2}
                        >
                          {overview.riskDistribution.map((entry) => (
                            <Cell
                              key={entry.key}
                              fill={RISK_COLORS[entry.key] ?? 'var(--chart-1)'}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ChartContainer>
                    <div className="mt-2 flex flex-wrap justify-center gap-3">
                      {overview.riskDistribution.map((entry) => (
                        <div key={entry.key} className="flex items-center gap-1.5">
                          <span
                            className="size-2.5 rounded-full"
                            style={{ background: RISK_COLORS[entry.key] ?? 'var(--chart-1)' }}
                          />
                          <span className="text-xs text-muted-foreground">
                            {entry.name} ({entry.value})
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Risky Assets</CardTitle>
                    <CardDescription>Highest scored assets needing attention</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-72 pr-4">
                      <div className="flex flex-col gap-2">
                        {overview.topRiskyAssets.map((asset) => (
                          <div
                            key={asset.assetId}
                            className="flex items-center justify-between rounded-lg border border-border p-3"
                          >
                            <div className="flex min-w-0 flex-col">
                              <span className="truncate font-medium">{asset.assetName}</span>
                              <span className="truncate text-xs text-muted-foreground">{asset.rationale}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <RiskBadge band={asset.band} />
                              <Badge variant="secondary" className="tabular-nums">
                                {asset.totalScore}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent CT Events</CardTitle>
                    <CardDescription>Newly observed certificates in transparency logs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-72 pr-4">
                      <div className="flex flex-col gap-2">
                        {overview.recentCtEvents.map((event) => (
                          <div
                            key={event.id}
                            className="flex items-center justify-between rounded-lg border border-border p-3"
                          >
                            <div className="flex min-w-0 flex-col">
                              <span className="truncate font-medium">{event.domain}</span>
                              <span className="truncate text-xs text-muted-foreground">
                                {event.issuer} · {relativeTime(event.timestamp)}
                              </span>
                            </div>
                            <SeverityBadge severity={event.severity} />
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Discoveries</CardTitle>
                  <CardDescription>Latest assets found across discovery sources</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    {overview.recentDiscoveries.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0"
                      >
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate text-sm font-medium">{item.name}</span>
                          <span className="text-xs text-muted-foreground">{relativeTime(item.at)}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {item.source}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        }}
      </DataState>
    </>
  )
}
