'use client'

import { useRiskScores } from '@/lib/api/client'
import { PageHeader } from '@/components/shared/page-header'
import { DataState } from '@/components/shared/data-state'
import { KPICard } from '@/components/shared/kpi-card'
import { RiskBadge } from '@/components/shared/status-badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Cell } from 'recharts'
import { ShieldAlert, TrendingUp, TrendingDown, Activity } from 'lucide-react'
import { formatNumber, titleCase } from '@/lib/format'
import type { RiskScore } from '@/lib/types'

const riskTrend = [
  { month: 'Jan', score: 72 },
  { month: 'Feb', score: 71 },
  { month: 'Mar', score: 68 },
  { month: 'Apr', score: 64 },
  { month: 'May', score: 65 },
  { month: 'Jun', score: 63 },
  { month: 'Jul', score: 61 },
]

const trendConfig = {
  score: { label: 'Avg Risk', color: 'var(--chart-1)' },
} satisfies ChartConfig

const distConfig = {
  count: { label: 'Assets', color: 'var(--chart-1)' },
} satisfies ChartConfig

const BAND_COLORS: Record<string, string> = {
  critical: 'var(--chart-5)',
  high: 'var(--chart-4)',
  medium: 'var(--chart-3)',
  low: 'var(--chart-2)',
}

export default function RiskPage() {
  const { data, isLoading, error, refresh } = useRiskScores()

  return (
    <>
      <PageHeader
        title="Risk Management"
        description="Monitor cryptographic risk scores and trends across your infrastructure"
      />

      <DataState
        isLoading={isLoading}
        error={error}
        data={data}
        onRetry={refresh}
        isEmpty={(d) => d.length === 0}
      >
        {(scores) => {
          const sorted = [...scores].sort((a, b) => b.totalScore - a.totalScore)
          const avg = scores.length
            ? Math.round(scores.reduce((sum, s) => sum + s.totalScore, 0) / scores.length)
            : 0
          const highRisk = scores.filter((s) => s.band === 'critical' || s.band === 'high').length
          const exposed = scores.filter((s) => s.internetExposed).length

          const bands: Array<RiskScore['band']> = ['critical', 'high', 'medium', 'low']
          const distribution = bands.map((band) => ({
            range: titleCase(band),
            band,
            count: scores.filter((s) => s.band === band).length,
          }))

          // Aggregate dimension contributions across all assets
          const dimMap = new Map<string, { label: string; total: number; count: number }>()
          for (const s of scores) {
            for (const d of s.dimensions) {
              const entry = dimMap.get(d.key) ?? { label: d.label, total: 0, count: 0 }
              entry.total += d.score
              entry.count += 1
              dimMap.set(d.key, entry)
            }
          }
          const topFactors = Array.from(dimMap.values())
            .map((e) => ({ label: e.label, avg: Math.round(e.total / Math.max(e.count, 1)) }))
            .sort((a, b) => b.avg - a.avg)

          return (
            <div className="flex flex-col gap-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <KPICard title="Average Risk" value={avg} unit="/100" icon={ShieldAlert} status="critical" />
                <KPICard title="High Risk Assets" value={formatNumber(highRisk)} icon={TrendingUp} status="warning" />
                <KPICard title="Internet Exposed" value={formatNumber(exposed)} icon={Activity} status="info" />
                <KPICard title="Scored Assets" value={formatNumber(scores.length)} icon={TrendingDown} status="default" />
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Risk Distribution</CardTitle>
                    <CardDescription>Assets by risk band</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={distConfig} className="h-[300px] w-full">
                      <BarChart data={distribution} margin={{ left: 4, right: 12, top: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="range" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis tickLine={false} axisLine={false} width={32} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" radius={4}>
                          {distribution.map((entry) => (
                            <Cell key={entry.band} fill={BAND_COLORS[entry.band]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Risk Trend</CardTitle>
                    <CardDescription>7-month trajectory</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={trendConfig} className="h-[300px] w-full">
                      <LineChart data={riskTrend} margin={{ left: 4, right: 12, top: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis domain={[0, 100]} tickLine={false} axisLine={false} width={32} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="score" stroke="var(--color-score)" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Top Risk Factors</CardTitle>
                  <CardDescription>Average contribution by scoring dimension</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {topFactors.map((factor) => (
                    <div key={factor.label} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{factor.label}</p>
                        <span className="text-xs font-semibold tabular-nums">{factor.avg}/100</span>
                      </div>
                      <Progress value={factor.avg} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Highest Risk Assets</CardTitle>
                  <CardDescription>Assets requiring immediate attention</CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Asset</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Environment</TableHead>
                        <TableHead>Band</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Rationale</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sorted.slice(0, 10).map((asset) => (
                        <TableRow key={asset.assetId}>
                          <TableCell className="font-medium">{asset.assetName}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{titleCase(asset.assetType)}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {titleCase(asset.environment)}
                          </TableCell>
                          <TableCell>
                            <RiskBadge band={asset.band} />
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="tabular-nums">
                              {asset.totalScore}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                            {asset.rationale}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )
        }}
      </DataState>
    </>
  )
}
