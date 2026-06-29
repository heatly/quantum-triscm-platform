'use client'

import { useState } from 'react'
import { useCompliance } from '@/lib/api/client'
import { PageHeader } from '@/components/shared/page-header'
import { DataState } from '@/components/shared/data-state'
import { StatusBadge } from '@/components/shared/status-badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectGroup, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Search, ExternalLink } from 'lucide-react'
import { formatNumber, formatPercent } from '@/lib/format'

export default function CompliancePage() {
  const { data, isLoading, error } = useCompliance()
  const findings = data?.findings || []
  const [searchTerm, setSearchTerm] = useState('')
  const [framework, setFramework] = useState('all')

  const frameworks = Array.from(new Set(findings?.map(f => f.framework) || []))
  const filtered = findings.filter(f => {
    const matchesSearch = f.control.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.requirement.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFramework = framework === 'all' || f.framework === framework
    return matchesSearch && matchesFramework
  })

  const complianceStats = {
    total: findings.length,
    compliant: findings.filter(f => f.status === 'compliant').length,
    nonCompliant: findings.filter(f => f.status === 'non-compliant').length,
    inProgress: findings.filter(f => f.status === 'in-progress').length,
  }

  return (
    <>
      <PageHeader
        title='Compliance Management'
        description='Track compliance with regulations and security frameworks'
      />

      <div className='space-y-4'>
        {/* Compliance Stats */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>Total Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold'>{formatNumber(complianceStats.total)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>Compliant</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold text-green-600'>{formatNumber(complianceStats.compliant)}</p>
              <p className='text-xs text-muted-foreground mt-1'>
                {formatPercent((complianceStats.compliant / complianceStats.total) * 100)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>Non-Compliant</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold text-red-600'>{formatNumber(complianceStats.nonCompliant)}</p>
              <p className='text-xs text-muted-foreground mt-1'>
                {formatPercent((complianceStats.nonCompliant / complianceStats.total) * 100)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold text-yellow-600'>{formatNumber(complianceStats.inProgress)}</p>
              <p className='text-xs text-muted-foreground mt-1'>
                {formatPercent((complianceStats.inProgress / complianceStats.total) * 100)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Framework Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Framework Compliance Status</CardTitle>
            <CardDescription>Progress by compliance framework</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {frameworks.map(fw => {
              const fwData = data?.filter(d => d.framework === fw) || []
              const compliant = fwData.filter(d => d.status === 'compliant').length
              const percent = Math.round((compliant / fwData.length) * 100)
              return (
                <div key={fw}>
                  <div className='flex items-center justify-between mb-2'>
                    <p className='font-medium text-sm'>{fw}</p>
                    <span className='text-xs font-semibold'>{percent}%</span>
                  </div>
                  <Progress value={percent} className='h-2' />
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardContent className='pt-4'>
            <div className='flex gap-2 flex-wrap'>
              <div className='flex-1 min-w-64 flex gap-2'>
                <Search className='size-4 text-muted-foreground flex-shrink-0 mt-2' />
                <Input
                  placeholder='Search controls or requirements...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='flex-1'
                />
              </div>
              <Select value={framework} onValueChange={setFramework}>
                <SelectTrigger className='w-48'>
                  <SelectValue placeholder='Filter by framework' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value='all'>All Frameworks</SelectItem>
                    {frameworks.map(fw => (
                      <SelectItem key={fw} value={fw}>
                        {fw}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Findings Table */}
        <Tabs defaultValue='all' className='w-full'>
          <TabsList>
            <TabsTrigger value='all'>All ({filtered.length})</TabsTrigger>
            <TabsTrigger value='non-compliant'>Non-Compliant ({filtered.filter(f => f.status === 'non-compliant').length})</TabsTrigger>
            <TabsTrigger value='in-progress'>In Progress ({filtered.filter(f => f.status === 'in-progress').length})</TabsTrigger>
          </TabsList>

          <TabsContent value='all'>
            <Card>
              <CardContent className='pt-4'>
                <DataState isLoading={isLoading} error={error} isEmpty={filtered.length === 0}>
                  {filtered.length > 0 && (
                    <div className='overflow-x-auto'>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Control</TableHead>
                            <TableHead>Framework</TableHead>
                            <TableHead>Requirement</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Tenants</TableHead>
                            <TableHead className='text-right'>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filtered.map(finding => (
                            <TableRow key={finding.id}>
                              <TableCell className='font-medium'>{finding.control}</TableCell>
                              <TableCell>
                                <Badge variant='outline'>{finding.framework}</Badge>
                              </TableCell>
                              <TableCell className='text-sm text-muted-foreground truncate max-w-xs'>{finding.requirement}</TableCell>
                              <TableCell>
                                <StatusBadge status={finding.status} />
                              </TableCell>
                              <TableCell>{formatNumber(finding.affectedTenants)}</TableCell>
                              <TableCell className='text-right'>
                                <Sheet>
                                  <SheetTrigger asChild>
                                    <button className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 w-9'>
                                      <ExternalLink className='size-4' />
                                    </button>
                                  </SheetTrigger>
                                  <SheetContent className='w-[600px]'>
                                    <SheetHeader>
                                      <SheetTitle>{finding.control}</SheetTitle>
                                    </SheetHeader>
                                    <ScrollArea className='h-[calc(100vh-120px)] mt-4'>
                                      <div className='space-y-4 pr-4'>
                                        <div>
                                          <p className='text-sm font-medium text-muted-foreground'>Framework</p>
                                          <p>{finding.framework}</p>
                                        </div>
                                        <Separator />
                                        <div>
                                          <p className='text-sm font-medium text-muted-foreground'>Status</p>
                                          <StatusBadge status={finding.status} />
                                        </div>
                                        <Separator />
                                        <div>
                                          <p className='text-sm font-medium text-muted-foreground'>Requirement</p>
                                          <p className='text-sm'>{finding.requirement}</p>
                                        </div>
                                        <Separator />
                                        <div>
                                          <p className='text-sm font-medium text-muted-foreground'>Affected Tenants</p>
                                          <p className='text-sm'>{formatNumber(finding.affectedTenants)} tenants</p>
                                        </div>
                                        <Separator />
                                        <div>
                                          <p className='text-sm font-medium text-muted-foreground'>Evidence URL</p>
                                          <a href={finding.evidenceUrl} target='_blank' rel='noopener noreferrer' className='text-sm text-primary hover:underline break-all'>
                                            View Evidence
                                          </a>
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
                  )}
                </DataState>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='non-compliant'>
            <Card>
              <CardContent className='pt-4'>
                <DataState isLoading={isLoading} error={error} isEmpty={filtered.filter(f => f.status === 'non-compliant').length === 0}>
                  {filtered.filter(f => f.status === 'non-compliant').length > 0 && (
                    <div className='space-y-2'>
                      {filtered
                        .filter(f => f.status === 'non-compliant')
                        .map(finding => (
                          <div key={finding.id} className='flex items-center justify-between p-3 border rounded-lg'>
                            <div>
                              <p className='font-medium'>{finding.control}</p>
                              <p className='text-xs text-muted-foreground'>{finding.framework}</p>
                            </div>
                            <Badge className='bg-destructive'>{finding.affectedTenants} tenants</Badge>
                          </div>
                        ))}
                    </div>
                  )}
                </DataState>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='in-progress'>
            <Card>
              <CardContent className='pt-4'>
                <DataState isLoading={isLoading} error={error} isEmpty={filtered.filter(f => f.status === 'in-progress').length === 0}>
                  {filtered.filter(f => f.status === 'in-progress').length > 0 && (
                    <div className='space-y-2'>
                      {filtered
                        .filter(f => f.status === 'in-progress')
                        .map(finding => (
                          <div key={finding.id} className='flex items-center justify-between p-3 border rounded-lg'>
                            <div>
                              <p className='font-medium'>{finding.control}</p>
                              <p className='text-xs text-muted-foreground'>{finding.framework}</p>
                            </div>
                            <Badge variant='outline' className='bg-yellow-500/10 text-yellow-700'>
                              In Progress
                            </Badge>
                          </div>
                        ))}
                    </div>
                  )}
                </DataState>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
