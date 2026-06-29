'use client'

import { useState } from 'react'
import { useTenants } from '@/lib/api/client'
import { PageHeader } from '@/components/shared/page-header'
import { DataState } from '@/components/shared/data-state'
import { StatusBadge } from '@/components/shared/status-badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Search, Plus, ExternalLink } from 'lucide-react'
import { formatNumber, formatPercent, getRiskColor } from '@/lib/format'

export default function TenantsPage() {
  const { data, isLoading, error } = useTenants()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null)

  const filtered = data?.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  return (
    <>
      <PageHeader
        title='Tenant Management'
        description='Monitor and manage security posture across all cloud tenants'
        action={
          <Button size='sm'>
            <Plus className='size-4 mr-2' />
            Add Tenant
          </Button>
        }
      />

      <div className='space-y-4'>
        {/* Search & Filters */}
        <Card>
          <CardContent className='pt-4'>
            <div className='flex gap-2'>
              <Search className='size-4 text-muted-foreground flex-shrink-0 mt-2' />
              <Input
                placeholder='Search tenants by name or ID...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='flex-1'
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue='all' className='w-full'>
          <TabsList>
            <TabsTrigger value='all'>All ({data?.length || 0})</TabsTrigger>
            <TabsTrigger value='high-risk'>High Risk ({data?.filter(t => t.riskScore >= 60).length || 0})</TabsTrigger>
            <TabsTrigger value='non-compliant'>Non-Compliant ({data?.filter(t => !t.isCompliant).length || 0})</TabsTrigger>
          </TabsList>

          {/* All Tenants Tab */}
          <TabsContent value='all'>
            <Card>
              <CardContent className='pt-4'>
                <DataState isLoading={isLoading} error={error} isEmpty={filtered.length === 0}>
                  {filtered.length > 0 && (
                    <div className='overflow-x-auto'>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tenant</TableHead>
                            <TableHead>Provider</TableHead>
                            <TableHead>Risk Score</TableHead>
                            <TableHead>Compliance</TableHead>
                            <TableHead>Assets</TableHead>
                            <TableHead>Findings</TableHead>
                            <TableHead className='text-right'>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filtered.map(tenant => (
                            <TableRow key={tenant.id}>
                              <TableCell className='font-medium'>{tenant.name}</TableCell>
                              <TableCell>
                                <Badge variant='outline'>{tenant.provider}</Badge>
                              </TableCell>
                              <TableCell>
                                <div className='flex items-center gap-2'>
                                  <div className={`size-2 rounded-full ${getRiskColor(tenant.riskScore)}`} />
                                  {formatNumber(tenant.riskScore)}/100
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={tenant.isCompliant ? 'default' : 'destructive'}>
                                  {tenant.isCompliant ? 'Compliant' : 'Non-Compliant'}
                                </Badge>
                              </TableCell>
                              <TableCell>{formatNumber(tenant.assetCount)}</TableCell>
                              <TableCell>
                                <Badge variant='outline' className={tenant.findingCount > 0 ? 'bg-destructive/10' : ''}>
                                  {formatNumber(tenant.findingCount)}
                                </Badge>
                              </TableCell>
                              <TableCell className='text-right'>
                                <Sheet>
                                  <SheetTrigger asChild>
                                    <Button variant='ghost' size='sm' onClick={() => setSelectedTenant(tenant.id)}>
                                      <ExternalLink className='size-4' />
                                    </Button>
                                  </SheetTrigger>
                                  <SheetContent className='w-[600px]'>
                                    <SheetHeader>
                                      <SheetTitle>{tenant.name}</SheetTitle>
                                    </SheetHeader>
                                    <ScrollArea className='h-[calc(100vh-120px)] mt-4'>
                                      <div className='space-y-4 pr-4'>
                                        <div>
                                          <p className='text-sm font-medium text-muted-foreground'>Tenant ID</p>
                                          <p className='font-mono text-sm'>{tenant.id}</p>
                                        </div>
                                        <Separator />
                                        <div>
                                          <p className='text-sm font-medium text-muted-foreground'>Provider</p>
                                          <p>{tenant.provider}</p>
                                        </div>
                                        <Separator />
                                        <div>
                                          <p className='text-sm font-medium text-muted-foreground'>Risk Score</p>
                                          <p className='text-2xl font-bold'>{tenant.riskScore}/100</p>
                                        </div>
                                        <Separator />
                                        <div>
                                          <p className='text-sm font-medium text-muted-foreground'>Compliance Status</p>
                                          <StatusBadge status={tenant.isCompliant ? 'compliant' : 'non-compliant'} />
                                        </div>
                                        <Separator />
                                        <div>
                                          <p className='text-sm font-medium text-muted-foreground'>Assets</p>
                                          <p className='text-lg font-semibold'>{formatNumber(tenant.assetCount)}</p>
                                        </div>
                                        <Separator />
                                        <div>
                                          <p className='text-sm font-medium text-muted-foreground'>Open Findings</p>
                                          <p className='text-lg font-semibold text-destructive'>{formatNumber(tenant.findingCount)}</p>
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

          {/* High Risk Tab */}
          <TabsContent value='high-risk'>
            <Card>
              <CardContent className='pt-4'>
                <DataState
                  isLoading={isLoading}
                  error={error}
                  isEmpty={filtered.filter(t => t.riskScore >= 60).length === 0}
                >
                  {filtered.filter(t => t.riskScore >= 60).length > 0 && (
                    <div className='space-y-2'>
                      {filtered
                        .filter(t => t.riskScore >= 60)
                        .map(tenant => (
                          <div key={tenant.id} className='flex items-center justify-between p-3 border rounded-lg'>
                            <div>
                              <p className='font-medium'>{tenant.name}</p>
                              <p className='text-sm text-muted-foreground'>{tenant.findingCount} open findings</p>
                            </div>
                            <Badge className='bg-destructive'>{tenant.riskScore}/100</Badge>
                          </div>
                        ))}
                    </div>
                  )}
                </DataState>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Non-Compliant Tab */}
          <TabsContent value='non-compliant'>
            <Card>
              <CardContent className='pt-4'>
                <DataState isLoading={isLoading} error={error} isEmpty={filtered.filter(t => !t.isCompliant).length === 0}>
                  {filtered.filter(t => !t.isCompliant).length > 0 && (
                    <div className='space-y-2'>
                      {filtered
                        .filter(t => !t.isCompliant)
                        .map(tenant => (
                          <div key={tenant.id} className='flex items-center justify-between p-3 border rounded-lg'>
                            <div>
                              <p className='font-medium'>{tenant.name}</p>
                              <p className='text-sm text-muted-foreground'>{tenant.provider}</p>
                            </div>
                            <Badge variant='destructive'>Non-Compliant</Badge>
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
