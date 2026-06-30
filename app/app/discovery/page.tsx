'use client'

import { useDiscovery, useConnectors } from '@/lib/api/client'
import { PageHeader } from '@/components/shared/page-header'
import { DataState } from '@/components/shared/data-state'
import { JobStatusBadge, ConnectorStatusBadge } from '@/components/shared/status-badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Play, RotateCcw } from 'lucide-react'
import { formatNumber, formatDuration, relativeTime, titleCase } from '@/lib/format'

export default function DiscoveryPage() {
  const {
    data: discovery,
    isLoading: jobsLoading,
    error: jobsError,
    refresh: refreshJobs,
  } = useDiscovery()
  const {
    data: connectors,
    isLoading: connectorsLoading,
    error: connectorsError,
    refresh: refreshConnectors,
  } = useConnectors()

  const jobs = discovery?.jobs ?? []

  return (
    <>
      <PageHeader
        title="Cloud Discovery"
        description="Configure and monitor cloud asset discovery jobs"
        actions={
          <Dialog>
            <DialogTrigger
              render={
                <Button size="sm">
                  <Plus data-icon="inline-start" />
                  New Job
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Discovery Job</DialogTitle>
                <DialogDescription>Start a new cloud asset discovery scan</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">Available Connectors</p>
                {connectors?.map((c) => (
                  <Button key={c.id} variant="outline" className="w-full justify-start">
                    {c.name} ({c.kind.toUpperCase()})
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <Tabs defaultValue="jobs" className="w-full">
        <TabsList>
          <TabsTrigger value="jobs">Discovery Jobs ({jobs.length})</TabsTrigger>
          <TabsTrigger value="connectors">Connectors ({connectors?.length ?? 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Discovery Jobs</CardTitle>
              <CardDescription>Monitor and manage cloud and crypto discovery scans</CardDescription>
            </CardHeader>
            <CardContent>
              <DataState
                isLoading={jobsLoading}
                error={jobsError}
                data={discovery}
                onRetry={refreshJobs}
                isEmpty={(d) => d.jobs.length === 0}
              >
                {({ jobs }) => (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Source</TableHead>
                          <TableHead>Target</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Progress</TableHead>
                          <TableHead>Findings</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Last Run</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {jobs.map((job) => (
                          <TableRow key={job.id}>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">{job.sourceTool}</span>
                                <span className="text-xs text-muted-foreground">
                                  {titleCase(job.source)} · {job.schedule}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-xs">{job.target}</TableCell>
                            <TableCell>
                              <JobStatusBadge status={job.status} />
                            </TableCell>
                            <TableCell>
                              {job.status === 'running' && job.progress != null ? (
                                <div className="flex w-32 items-center gap-2">
                                  <Progress value={job.progress} className="h-2" />
                                  <span className="text-xs font-medium tabular-nums">{job.progress}%</span>
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell className="tabular-nums">{formatNumber(job.findingsCount)}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDuration(job.durationMs)}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {job.lastRun ? relativeTime(job.lastRun) : 'Never'}
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-end gap-1">
                                <Button variant="ghost" size="icon-sm" aria-label="Run job">
                                  <Play />
                                </Button>
                                <Button variant="ghost" size="icon-sm" aria-label="Reschedule job">
                                  <RotateCcw />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </DataState>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="connectors" className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Connectors</CardTitle>
              <CardDescription>Manage connections to cloud providers and discovery sources</CardDescription>
            </CardHeader>
            <CardContent>
              <DataState
                isLoading={connectorsLoading}
                error={connectorsError}
                data={connectors}
                onRetry={refreshConnectors}
                isEmpty={(d) => d.length === 0}
              >
                {(connectorList) => (
                  <div className="grid gap-4 md:grid-cols-2">
                    {connectorList.map((connector) => (
                      <Sheet key={connector.id}>
                        <SheetTrigger
                          render={
                            <Card className="cursor-pointer transition-colors hover:border-primary/50">
                              <CardHeader>
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex flex-col gap-0.5">
                                    <CardTitle className="text-base">{connector.name}</CardTitle>
                                    <CardDescription className="text-xs uppercase">
                                      {connector.kind}
                                    </CardDescription>
                                  </div>
                                  <ConnectorStatusBadge status={connector.status} />
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p className="text-xs text-muted-foreground">
                                  {connector.assetsDiscovered != null
                                    ? `${formatNumber(connector.assetsDiscovered)} assets discovered`
                                    : 'No assets discovered yet'}
                                </p>
                              </CardContent>
                            </Card>
                          }
                        />
                        <SheetContent className="w-full sm:max-w-md">
                          <SheetHeader>
                            <SheetTitle>{connector.name}</SheetTitle>
                          </SheetHeader>
                          <div className="mt-6 flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                              <p className="text-sm font-medium text-muted-foreground">Kind</p>
                              <p className="uppercase">{connector.kind}</p>
                            </div>
                            <div className="flex flex-col gap-1">
                              <p className="text-sm font-medium text-muted-foreground">Status</p>
                              <ConnectorStatusBadge status={connector.status} />
                            </div>
                            {connector.message && (
                              <div className="flex flex-col gap-1">
                                <p className="text-sm font-medium text-muted-foreground">Message</p>
                                <p className="text-sm">{connector.message}</p>
                              </div>
                            )}
                            <div className="flex flex-col gap-1">
                              <p className="text-sm font-medium text-muted-foreground">Last checked</p>
                              <p className="text-sm">
                                {connector.lastCheckedAt ? relativeTime(connector.lastCheckedAt) : 'Never'}
                              </p>
                            </div>
                            {connector.assetsDiscovered != null && (
                              <div className="flex flex-col gap-1">
                                <p className="text-sm font-medium text-muted-foreground">Assets discovered</p>
                                <Badge variant="secondary">{formatNumber(connector.assetsDiscovered)}</Badge>
                              </div>
                            )}
                            <div className="flex gap-2 pt-4">
                              <Button size="sm" variant="outline" className="flex-1">
                                Test Connection
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1">
                                Sync Now
                              </Button>
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>
                    ))}
                  </div>
                )}
              </DataState>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}
