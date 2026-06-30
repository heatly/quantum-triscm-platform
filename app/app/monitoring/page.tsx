'use client'

import { useMonitoring } from '@/lib/api/client'
import { PageHeader } from '@/components/shared/page-header'
import { DataState } from '@/components/shared/data-state'
import { SeverityBadge, AckBadge } from '@/components/shared/status-badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'
import { formatNumber, relativeTime, titleCase } from '@/lib/format'
import type { MonitoringEvent } from '@/lib/types'

const eventTimeline = [
  { time: '00:00', events: 45 },
  { time: '04:00', events: 32 },
  { time: '08:00', events: 78 },
  { time: '12:00', events: 125 },
  { time: '16:00', events: 93 },
  { time: '20:00', events: 67 },
  { time: '24:00', events: 52 },
]

const chartConfig = {
  events: { label: 'Events', color: 'var(--chart-1)' },
} satisfies ChartConfig

export default function MonitoringPage() {
  const { data, isLoading, error, refresh } = useMonitoring()

  return (
    <>
      <PageHeader
        title="Security Monitoring"
        description="Real-time cryptographic security events and anomaly detection"
      />

      <DataState
        isLoading={isLoading}
        error={error}
        data={data}
        onRetry={refresh}
        isEmpty={(d) => d.length === 0}
      >
        {(events) => {
          const stats = {
            total: events.length,
            critical: events.filter((e) => e.severity === 'critical').length,
            high: events.filter((e) => e.severity === 'high').length,
            open: events.filter((e) => e.status === 'open').length,
          }

          const topTypes = Array.from(new Set(events.map((e) => e.type)))
            .map((type) => ({
              type,
              count: events.filter((e) => e.type === type).length,
              severity: events.find((e) => e.type === type)?.severity ?? 'info',
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)

          return (
            <div className="flex flex-col gap-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-heading text-2xl font-semibold tabular-nums">{formatNumber(stats.total)}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Current window</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Critical</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-heading text-2xl font-semibold tabular-nums text-destructive">
                      {formatNumber(stats.critical)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">Require action</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">High Severity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-heading text-2xl font-semibold tabular-nums text-warning">
                      {formatNumber(stats.high)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">Elevated risk</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Open</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-heading text-2xl font-semibold tabular-nums">{formatNumber(stats.open)}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Unresolved</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Event Timeline</CardTitle>
                  <CardDescription>Security events over the last 24 hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[280px] w-full">
                    <LineChart data={eventTimeline} margin={{ left: 4, right: 12, top: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
                      <YAxis tickLine={false} axisLine={false} width={32} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="events"
                        stroke="var(--color-events)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <div className="grid gap-4 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Recent Security Events</CardTitle>
                    <CardDescription>Latest activity across your infrastructure</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Event</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Severity</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>When</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {events.map((event: MonitoringEvent) => (
                            <TableRow key={event.id}>
                              <TableCell className="max-w-xs">
                                <div className="flex flex-col">
                                  <span className="truncate font-medium">{event.title}</span>
                                  <span className="truncate text-xs text-muted-foreground">
                                    {event.description}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{titleCase(event.type)}</Badge>
                              </TableCell>
                              <TableCell>
                                <SeverityBadge severity={event.severity} />
                              </TableCell>
                              <TableCell className="font-mono text-xs text-muted-foreground">
                                {event.source}
                              </TableCell>
                              <TableCell>
                                <AckBadge status={event.status} />
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {relativeTime(event.createdAt)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Event Types</CardTitle>
                    <CardDescription>Most frequent event categories</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2">
                    {topTypes.map((entry) => (
                      <div
                        key={entry.type}
                        className="flex items-center justify-between rounded-lg border border-border p-3"
                      >
                        <div className="flex flex-col">
                          <p className="text-sm font-medium">{titleCase(entry.type)}</p>
                          <SeverityBadge severity={entry.severity} />
                        </div>
                        <Badge variant="secondary">{formatNumber(entry.count)}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )
        }}
      </DataState>
    </>
  )
}
