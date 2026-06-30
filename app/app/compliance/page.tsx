'use client'

import { useState } from 'react'
import { useCompliance } from '@/lib/api/client'
import { PageHeader } from '@/components/shared/page-header'
import { DataState } from '@/components/shared/data-state'
import { ControlStatusBadge, SeverityBadge } from '@/components/shared/status-badge'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Search, ExternalLink } from 'lucide-react'
import { formatNumber, formatPercent, titleCase } from '@/lib/format'
import type { ComplianceFinding, ComplianceFramework } from '@/lib/types'

const FRAMEWORK_LABELS: Record<ComplianceFramework, string> = {
  iso27001: 'ISO 27001',
  nist_csf: 'NIST CSF',
  pci_dss: 'PCI DSS',
  soc2: 'SOC 2',
  custom_crypto: 'Crypto Policy',
}

function frameworkLabel(fw: ComplianceFramework) {
  return FRAMEWORK_LABELS[fw] ?? titleCase(fw)
}

export default function CompliancePage() {
  const { data, isLoading, error, refresh } = useCompliance()
  const [searchTerm, setSearchTerm] = useState('')
  const [framework, setFramework] = useState<string>('all')

  return (
    <>
      <PageHeader
        title="Compliance Management"
        description="Track compliance with regulations and cryptographic security frameworks"
      />

      <DataState
        isLoading={isLoading}
        error={error}
        data={data}
        onRetry={refresh}
        isEmpty={(d) => d.findings.length === 0}
      >
        {({ findings }) => {
          const frameworks = Array.from(new Set(findings.map((f) => f.framework)))
          const filtered = findings.filter((f) => {
            const matchesSearch =
              f.controlId.toLowerCase().includes(searchTerm.toLowerCase()) ||
              f.controlName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              f.policy.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesFramework = framework === 'all' || f.framework === framework
            return matchesSearch && matchesFramework
          })

          const stats = {
            total: findings.length,
            pass: findings.filter((f) => f.status === 'pass').length,
            fail: findings.filter((f) => f.status === 'fail').length,
            exception: findings.filter((f) => f.status === 'exception').length,
          }

          const failing = filtered.filter((f) => f.status === 'fail')
          const exceptions = filtered.filter((f) => f.status === 'exception')

          const renderTable = (rows: ComplianceFinding[]) => (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Control</TableHead>
                    <TableHead>Framework</TableHead>
                    <TableHead>Policy</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assets</TableHead>
                    <TableHead className="text-right">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((finding) => (
                    <TableRow key={finding.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{finding.controlId}</span>
                          <span className="text-xs text-muted-foreground">{finding.controlName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{frameworkLabel(finding.framework)}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                        {finding.policy}
                      </TableCell>
                      <TableCell>
                        <SeverityBadge severity={finding.severity} />
                      </TableCell>
                      <TableCell>
                        <ControlStatusBadge status={finding.status} />
                      </TableCell>
                      <TableCell className="tabular-nums">{formatNumber(finding.assetsAffected)}</TableCell>
                      <TableCell className="text-right">
                        <Sheet>
                          <SheetTrigger
                            render={
                              <Button variant="ghost" size="icon-sm" aria-label="View details">
                                <ExternalLink />
                              </Button>
                            }
                          />
                          <SheetContent className="w-full sm:max-w-lg">
                            <SheetHeader>
                              <SheetTitle>{finding.controlId}</SheetTitle>
                            </SheetHeader>
                            <ScrollArea className="mt-4 h-[calc(100vh-120px)]">
                              <div className="flex flex-col gap-4 pr-4">
                                <div className="flex flex-col gap-1">
                                  <p className="text-sm font-medium text-muted-foreground">Control name</p>
                                  <p className="text-sm">{finding.controlName}</p>
                                </div>
                                <Separator />
                                <div className="flex flex-col gap-1">
                                  <p className="text-sm font-medium text-muted-foreground">Framework</p>
                                  <p className="text-sm">{frameworkLabel(finding.framework)}</p>
                                </div>
                                <Separator />
                                <div className="flex flex-col gap-1">
                                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                                  <ControlStatusBadge status={finding.status} />
                                </div>
                                <Separator />
                                <div className="flex flex-col gap-1">
                                  <p className="text-sm font-medium text-muted-foreground">Policy</p>
                                  <p className="text-sm">{finding.policy}</p>
                                </div>
                                <Separator />
                                <div className="flex flex-col gap-1">
                                  <p className="text-sm font-medium text-muted-foreground">Assets affected</p>
                                  <p className="text-sm">{formatNumber(finding.assetsAffected)} assets</p>
                                </div>
                                <Separator />
                                <div className="flex flex-col gap-1">
                                  <p className="text-sm font-medium text-muted-foreground">Last evaluated</p>
                                  <p className="text-sm">{new Date(finding.lastEvaluated).toLocaleString()}</p>
                                </div>
                              </div>
                            </ScrollArea>
                          </SheetContent>
                        </Sheet>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )

          return (
            <div className="flex flex-col gap-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Controls</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-heading text-2xl font-semibold tabular-nums">
                      {formatNumber(stats.total)}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Passing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-heading text-2xl font-semibold tabular-nums text-emerald-500">
                      {formatNumber(stats.pass)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {stats.total ? formatPercent((stats.pass / stats.total) * 100) : '0%'}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Failing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-heading text-2xl font-semibold tabular-nums text-destructive">
                      {formatNumber(stats.fail)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {stats.total ? formatPercent((stats.fail / stats.total) * 100) : '0%'}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Exceptions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-heading text-2xl font-semibold tabular-nums text-amber-500">
                      {formatNumber(stats.exception)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {stats.total ? formatPercent((stats.exception / stats.total) * 100) : '0%'}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Framework Compliance Status</CardTitle>
                  <CardDescription>Pass rate by compliance framework</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {frameworks.map((fw) => {
                    const fwData = findings.filter((d) => d.framework === fw)
                    const passing = fwData.filter((d) => d.status === 'pass').length
                    const percent = fwData.length ? Math.round((passing / fwData.length) * 100) : 0
                    return (
                      <div key={fw} className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{frameworkLabel(fw)}</p>
                          <span className="text-xs font-semibold tabular-nums">{percent}%</span>
                        </div>
                        <Progress value={percent} className="h-2" />
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex flex-wrap gap-2">
                    <div className="flex min-w-64 flex-1 items-center gap-2 rounded-md border border-input px-3">
                      <Search className="size-4 shrink-0 text-muted-foreground" />
                      <Input
                        placeholder="Search controls or policies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                      />
                    </div>
                    <Select value={framework} onValueChange={(v) => setFramework(v ?? 'all')}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by framework" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="all">All Frameworks</SelectItem>
                          {frameworks.map((fw) => (
                            <SelectItem key={fw} value={fw}>
                              {frameworkLabel(fw)}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="all" className="w-full">
                <TabsList>
                  <TabsTrigger value="all">All ({filtered.length})</TabsTrigger>
                  <TabsTrigger value="fail">Failing ({failing.length})</TabsTrigger>
                  <TabsTrigger value="exception">Exceptions ({exceptions.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  <Card>
                    <CardContent className="pt-4">{renderTable(filtered)}</CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="fail">
                  <Card>
                    <CardContent className="pt-4">{renderTable(failing)}</CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="exception">
                  <Card>
                    <CardContent className="pt-4">{renderTable(exceptions)}</CardContent>
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
