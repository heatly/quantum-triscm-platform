'use client'

import { useDiscovery, useConnectors } from '@/lib/api/client'
import { PageHeader } from '@/components/shared/page-header'
import { DataState } from '@/components/shared/data-state'
import { StatusBadge } from '@/components/shared/status-badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Play, PauseIcon, RotateCcw, Info } from 'lucide-react'
import { formatNumber } from '@/lib/format'

export default function DiscoveryPage() {
  const { data: jobs, isLoading: jobsLoading, error: jobsError } = useDiscovery()
  const { data: connectors, isLoading: connectorsLoading, error: connectorsError } = useConnectors()

  return (
    <>
      <PageHeader
        title='Cloud Discovery'
        description='Configure and monitor cloud asset discovery jobs'
        action={
          <Dialog>
            <DialogTrigger asChild>
              <Button size='sm'>
                <Plus className='size-4 mr-2' />
                New Job
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Discovery Job</DialogTitle>
                <DialogDescription>Start a new cloud asset discovery scan</DialogDescription>
              </DialogHeader>
              <div className='space-y-4'>
                <div>
                  <p className='text-sm font-medium mb-2'>Available Connectors</p>
                  <div className='space-y-2'>
                    {connectors?.map(c => (
                      <Button key={c.id} variant='outline' className='w-full justify-start'>
                        {c.name} ({c.type})
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <Tabs defaultValue='jobs' className='w-full'>
        <TabsList>
          <TabsTrigger value='jobs'>Active Jobs ({jobs?.length || 0})</TabsTrigger>
          <TabsTrigger value='connectors'>Connectors ({connectors?.length || 0})</TabsTrigger>
        </TabsList>

        {/* Discovery Jobs Tab */}
        <TabsContent value='jobs' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Discovery Jobs</CardTitle>
              <CardDescription>Monitor and manage cloud discovery scans</CardDescription>
            </CardHeader>
            <CardContent>
              <DataState isLoading={jobsLoading} error={jobsError} isEmpty={!jobs?.length}>
                {jobs && jobs.length > 0 && (
                  <div className='overflow-x-auto'>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Job Name</TableHead>
                          <TableHead>Connector</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Progress</TableHead>
                          <TableHead>Assets Found</TableHead>
                          <TableHead>Last Run</TableHead>
                          <TableHead className='text-right'>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {jobs.map(job => (
                          <TableRow key={job.id}>
                            <TableCell className='font-medium'>{job.name}</TableCell>
                            <TableCell>{job.connectorName}</TableCell>
                            <TableCell>
                              <StatusBadge status={job.status} />
                            </TableCell>
                            <TableCell>
                              <div className='flex items-center gap-2 w-32'>
                                <Progress value={job.progress} className='h-2' />
                                <span className='text-xs font-medium'>{job.progress}%</span>
                              </div>
                            </TableCell>
                            <TableCell>{formatNumber(job.assetsFound)}</TableCell>
                            <TableCell className='text-sm text-muted-foreground'>{job.lastRunTime}</TableCell>
                            <TableCell className='text-right flex gap-1 justify-end'>
                              {job.status === 'running' ? (
                                <Button variant='ghost' size='sm'>
                                  <PauseIcon className='size-4' />
                                </Button>
                              ) : (
                                <Button variant='ghost' size='sm'>
                                  <Play className='size-4' />
                                </Button>
                              )}
                              <Button variant='ghost' size='sm'>
                                <RotateCcw className='size-4' />
                              </Button>
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

        {/* Connectors Tab */}
        <TabsContent value='connectors' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Cloud Connectors</CardTitle>
              <CardDescription>Manage connections to cloud providers</CardDescription>
            </CardHeader>
            <CardContent>
              <DataState isLoading={connectorsLoading} error={connectorsError} isEmpty={!connectors?.length}>
                {connectors && connectors.length > 0 && (
                  <div className='grid gap-4 md:grid-cols-2'>
                    {connectors.map(connector => (
                      <Sheet key={connector.id}>
                        <SheetTrigger asChild>
                          <Card className='cursor-pointer hover:border-primary/50 transition-colors'>
                            <CardHeader>
                              <div className='flex items-start justify-between'>
                                <div>
                                  <CardTitle className='text-base'>{connector.name}</CardTitle>
                                  <CardDescription className='text-xs'>{connector.type}</CardDescription>
                                </div>
                                <StatusBadge status={connector.status} />
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className='text-xs text-muted-foreground'>
                                Tenant: <span className='font-mono'>{connector.tenantId}</span>
                              </p>
                            </CardContent>
                          </Card>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>{connector.name}</SheetTitle>
                          </SheetHeader>
                          <div className='space-y-4 mt-6'>
                            <div>
                              <p className='text-sm font-medium text-muted-foreground'>Type</p>
                              <p>{connector.type}</p>
                            </div>
                            <div>
                              <p className='text-sm font-medium text-muted-foreground'>Status</p>
                              <StatusBadge status={connector.status} />
                            </div>
                            <div>
                              <p className='text-sm font-medium text-muted-foreground'>Tenant ID</p>
                              <p className='font-mono text-xs break-all'>{connector.tenantId}</p>
                            </div>
                            <div>
                              <p className='text-sm font-medium text-muted-foreground'>Last Sync</p>
                              <p className='text-sm'>{connector.lastSync}</p>
                            </div>
                            <div className='flex gap-2 pt-4'>
                              <Button size='sm' variant='outline' className='flex-1'>
                                Test Connection
                              </Button>
                              <Button size='sm' variant='outline' className='flex-1'>
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
