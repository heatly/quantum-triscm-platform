'use client'

import { useState } from 'react'
import { useRemediation } from '@/lib/api/client'
import { PageHeader } from '@/components/shared/page-header'
import { DataState } from '@/components/shared/data-state'
import { SeverityBadge } from '@/components/shared/status-badge'
import { Pill } from '@/components/shared/status-badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Search } from 'lucide-react'
import { formatNumber, formatDate, titleCase } from '@/lib/format'
import type { RemediationState, RemediationTask } from '@/lib/types'

type Tone = 'critical' | 'warning' | 'success' | 'info' | 'neutral' | 'accent'

const stateTone: Record<RemediationState, Tone> = {
  open: 'warning',
  assigned: 'info',
  in_progress: 'info',
  awaiting_approval: 'accent',
  approved: 'success',
  rejected: 'critical',
  deferred: 'neutral',
  done: 'success',
}

function StateBadge({ state }: { state: RemediationState }) {
  return <Pill tone={stateTone[state]}>{titleCase(state)}</Pill>
}

export default function RemediationPage() {
  const { data, isLoading, error, refresh } = useRemediation()
  const [searchTerm, setSearchTerm] = useState('')
  const [severity, setSeverity] = useState<string>('all')

  return (
    <>
      <PageHeader
        title="Remediation Tracking"
        description="Plan, assign, and track remediation of cryptographic findings"
      />

      <DataState
        isLoading={isLoading}
        error={error}
        data={data}
        onRetry={refresh}
        isEmpty={(d) => d.length === 0}
      >
        {(tasks) => {
          const filtered = tasks.filter((t) => {
            const matchesSearch =
              t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              t.description.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesSeverity = severity === 'all' || t.severity === severity
            return matchesSearch && matchesSeverity
          })

          const isDone = (t: RemediationTask) => t.state === 'done' || t.state === 'approved'
          const isActive = (t: RemediationTask) =>
            t.state === 'in_progress' || t.state === 'assigned'
          const isOpen = (t: RemediationTask) => t.state === 'open'

          const stats = {
            total: tasks.length,
            done: tasks.filter(isDone).length,
            active: tasks.filter(isActive).length,
            open: tasks.filter(isOpen).length,
          }
          const completionPercent = stats.total ? Math.round((stats.done / stats.total) * 100) : 0

          const renderList = (rows: RemediationTask[], subtitle: (t: RemediationTask) => string) => (
            <div className="flex flex-col gap-2">
              {rows.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div className="flex min-w-0 flex-col">
                    <p className="truncate font-medium">{task.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{subtitle(task)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <SeverityBadge severity={task.severity} />
                    <StateBadge state={task.state} />
                  </div>
                </div>
              ))}
            </div>
          )

          return (
            <div className="flex flex-col gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Remediation Progress</CardTitle>
                  <CardDescription>Overall completion rate</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Completion</p>
                      <span className="text-sm font-semibold tabular-nums">{completionPercent}%</span>
                    </div>
                    <Progress value={completionPercent} className="h-3" />
                  </div>
                  <div className="grid gap-4 md:grid-cols-4">
                    <Stat label="Total" value={stats.total} />
                    <Stat label="Resolved" value={stats.done} className="text-emerald-500" />
                    <Stat label="In Progress" value={stats.active} className="text-info" />
                    <Stat label="Open" value={stats.open} className="text-warning" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex flex-wrap gap-2">
                    <div className="flex min-w-64 flex-1 items-center gap-2 rounded-md border border-input px-3">
                      <Search className="size-4 shrink-0 text-muted-foreground" />
                      <Input
                        placeholder="Search remediation tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                      />
                    </div>
                    <Select value={severity} onValueChange={(v) => setSeverity(v ?? 'all')}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="all">All Severities</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="all" className="w-full">
                <TabsList>
                  <TabsTrigger value="all">All ({filtered.length})</TabsTrigger>
                  <TabsTrigger value="open">Open ({filtered.filter(isOpen).length})</TabsTrigger>
                  <TabsTrigger value="active">In Progress ({filtered.filter(isActive).length})</TabsTrigger>
                  <TabsTrigger value="done">Resolved ({filtered.filter(isDone).length})</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  <Card>
                    <CardContent className="overflow-x-auto pt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Task</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Severity</TableHead>
                            <TableHead>State</TableHead>
                            <TableHead>Owner</TableHead>
                            <TableHead>SLA Due</TableHead>
                            <TableHead className="text-right">Details</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filtered.map((task) => (
                            <TableRow key={task.id}>
                              <TableCell className="max-w-xs truncate font-medium">{task.title}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{titleCase(task.category)}</Badge>
                              </TableCell>
                              <TableCell>
                                <SeverityBadge severity={task.severity} />
                              </TableCell>
                              <TableCell>
                                <StateBadge state={task.state} />
                              </TableCell>
                              <TableCell className="text-sm">{task.owner ?? 'Unassigned'}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {formatDate(task.slaDueAt)}
                              </TableCell>
                              <TableCell className="text-right">
                                <Sheet>
                                  <SheetTrigger
                                    render={
                                      <Button variant="ghost" size="sm">
                                        View
                                      </Button>
                                    }
                                  />
                                  <SheetContent className="w-full sm:max-w-lg">
                                    <SheetHeader>
                                      <SheetTitle>{task.title}</SheetTitle>
                                    </SheetHeader>
                                    <ScrollArea className="mt-4 h-[calc(100vh-120px)]">
                                      <div className="flex flex-col gap-4 pr-4">
                                        <div className="flex flex-col gap-1">
                                          <p className="text-sm font-medium text-muted-foreground">State</p>
                                          <StateBadge state={task.state} />
                                        </div>
                                        <Separator />
                                        <div className="flex flex-col gap-1">
                                          <p className="text-sm font-medium text-muted-foreground">Severity</p>
                                          <SeverityBadge severity={task.severity} />
                                        </div>
                                        <Separator />
                                        <Detail label="Category" value={titleCase(task.category)} />
                                        <Separator />
                                        <Detail label="Owner" value={task.owner ?? 'Unassigned'} />
                                        <Separator />
                                        <Detail label="SLA Due" value={formatDate(task.slaDueAt)} />
                                        {task.changeWindow && (
                                          <>
                                            <Separator />
                                            <Detail label="Change Window" value={task.changeWindow} />
                                          </>
                                        )}
                                        <Separator />
                                        <Detail label="Description" value={task.description} />
                                        {task.linkedAssets.length > 0 && (
                                          <>
                                            <Separator />
                                            <div className="flex flex-col gap-1">
                                              <p className="text-sm font-medium text-muted-foreground">
                                                Linked Assets
                                              </p>
                                              <div className="flex flex-wrap gap-1.5">
                                                {task.linkedAssets.map((a) => (
                                                  <Badge key={a} variant="secondary" className="font-mono text-xs">
                                                    {a}
                                                  </Badge>
                                                ))}
                                              </div>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    </ScrollArea>
                                  </SheetContent>
                                </Sheet>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="open">
                  <Card>
                    <CardContent className="pt-4">
                      {renderList(filtered.filter(isOpen), (t) => `Due ${formatDate(t.slaDueAt)}`)}
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="active">
                  <Card>
                    <CardContent className="pt-4">
                      {renderList(filtered.filter(isActive), (t) => `Owner: ${t.owner ?? 'Unassigned'}`)}
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="done">
                  <Card>
                    <CardContent className="pt-4">
                      {renderList(filtered.filter(isDone), (t) => titleCase(t.category))}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )
        }}
      </DataState>
    </>
  )
}

function Stat({ label, value, className }: { label: string; value: number; className?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className={`font-heading text-2xl font-semibold tabular-nums ${className ?? ''}`}>
        {formatNumber(value)}
      </p>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  )
}
