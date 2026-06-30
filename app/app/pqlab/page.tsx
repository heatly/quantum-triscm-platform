'use client'

import { usePqLab } from '@/lib/api/client'
import { PageHeader } from '@/components/shared/page-header'
import { DataState } from '@/components/shared/data-state'
import { JobStatusBadge, HealthBadge } from '@/components/shared/status-badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { formatNumber, formatMs, formatBytes, relativeTime, titleCase } from '@/lib/format'

const chartConfig = {
  keygenMs: { label: 'Keygen', color: 'var(--chart-1)' },
  signMs: { label: 'Sign', color: 'var(--chart-2)' },
  verifyMs: { label: 'Verify', color: 'var(--chart-3)' },
} satisfies ChartConfig

export default function PQLabPage() {
  const { data, isLoading, error, refresh } = usePqLab()

  return (
    <>
      <PageHeader
        title="Post-Quantum Lab"
        description="Benchmark post-quantum algorithms and track provider readiness"
      />

      <DataState
        isLoading={isLoading}
        error={error}
        data={data}
        onRetry={refresh}
        isEmpty={(d) => d.results.length === 0 && d.jobs.length === 0}
      >
        {({ jobs, results, providers }) => {
          const runningJobs = jobs.filter((j) => j.status === 'running').length
          const signatureResults = results.filter((r) => r.family === 'signature')
          const chartData = signatureResults.map((r) => ({
            algorithm: r.algorithm,
            signMs: r.signMs ?? 0,
            verifyMs: r.verifyMs ?? 0,
          }))

          return (
            <div className="flex flex-col gap-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Benchmark Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-heading text-2xl font-semibold tabular-nums">
                      {formatNumber(results.length)}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Running Jobs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-heading text-2xl font-semibold tabular-nums text-info">
                      {formatNumber(runningJobs)}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-heading text-2xl font-semibold tabular-nums">
                      {formatNumber(jobs.length)}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Providers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-heading text-2xl font-semibold tabular-nums">
                      {formatNumber(providers.length)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {chartData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Signature Performance</CardTitle>
                    <CardDescription>Sign and verify latency by algorithm (lower is better)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                      <BarChart data={chartData} margin={{ left: 4, right: 12, top: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="algorithm" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis tickLine={false} axisLine={false} width={40} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="signMs" fill="var(--color-signMs)" radius={4} />
                        <Bar dataKey="verifyMs" fill="var(--color-verifyMs)" radius={4} />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              )}

              <Tabs defaultValue="results" className="w-full">
                <TabsList>
                  <TabsTrigger value="results">Results ({results.length})</TabsTrigger>
                  <TabsTrigger value="jobs">Jobs ({jobs.length})</TabsTrigger>
                  <TabsTrigger value="providers">Providers ({providers.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="results">
                  <Card>
                    <CardContent className="overflow-x-auto pt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Algorithm</TableHead>
                            <TableHead>Family</TableHead>
                            <TableHead>Keygen</TableHead>
                            <TableHead>Sign / Encap</TableHead>
                            <TableHead>Verify / Decap</TableHead>
                            <TableHead>Public Key</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {results.map((r) => (
                            <TableRow key={r.id}>
                              <TableCell className="font-mono text-xs">{r.algorithm}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{titleCase(r.family)}</Badge>
                              </TableCell>
                              <TableCell className="tabular-nums">{formatMs(r.keygenMs)}</TableCell>
                              <TableCell className="tabular-nums">
                                {formatMs(r.signMs ?? r.encapsulateMs)}
                              </TableCell>
                              <TableCell className="tabular-nums">
                                {formatMs(r.verifyMs ?? r.decapsulateMs)}
                              </TableCell>
                              <TableCell className="tabular-nums">{formatBytes(r.publicKeyBytes)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="jobs">
                  <Card>
                    <CardContent className="overflow-x-auto pt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Algorithm</TableHead>
                            <TableHead>Operation</TableHead>
                            <TableHead>Target</TableHead>
                            <TableHead>Iterations</TableHead>
                            <TableHead>Provider</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Submitted</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {jobs.map((j) => (
                            <TableRow key={j.id}>
                              <TableCell className="font-mono text-xs">{j.algorithm}</TableCell>
                              <TableCell>{titleCase(j.operation)}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">{j.target}</TableCell>
                              <TableCell className="tabular-nums">{formatNumber(j.iterations)}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">{j.provider}</TableCell>
                              <TableCell>
                                <JobStatusBadge status={j.status} />
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {relativeTime(j.submittedAt)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="providers">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {providers.map((p) => (
                      <Card key={p.name}>
                        <CardHeader>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex flex-col gap-0.5">
                              <CardTitle className="text-base">{p.name}</CardTitle>
                              <CardDescription>v{p.version}</CardDescription>
                            </div>
                            <HealthBadge status={p.status} />
                          </div>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-1.5">
                          {p.algorithms.map((algo) => (
                            <Badge key={algo} variant="secondary" className="font-mono text-xs">
                              {algo}
                            </Badge>
                          ))}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )
        }}
      </DataState>
    </>
  )
}
