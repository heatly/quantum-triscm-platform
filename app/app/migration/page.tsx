'use client'

import { useMigration } from '@/lib/api/client'
import { PageHeader } from '@/components/shared/page-header'
import { DataState } from '@/components/shared/data-state'
import { StatusBadge } from '@/components/shared/status-badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Calendar, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { formatNumber, formatPercent } from '@/lib/format'

export default function MigrationPage() {
  const { data, isLoading, error } = useMigration()

  const planStats = {
    total: data?.length || 0,
    active: data?.filter(p => p.status === 'active').length || 0,
    completed: data?.filter(p => p.status === 'completed').length || 0,
    onTrack: data?.filter(p => !p.isDelayed).length || 0,
  }

  return (
    <>
      <PageHeader
        title='Migration Planner'
        description='Plan and track cloud infrastructure migrations'
      />

      <div className='space-y-4'>
        {/* Plan Stats */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>Total Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold'>{formatNumber(planStats.total)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>Active</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold text-blue-600'>{formatNumber(planStats.active)}</p>
              <p className='text-xs text-muted-foreground mt-1'>In progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold text-green-600'>{formatNumber(planStats.completed)}</p>
              <p className='text-xs text-muted-foreground mt-1'>Successfully migrated</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>On Track</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold text-green-600'>{formatNumber(planStats.onTrack)}</p>
              <p className='text-xs text-muted-foreground mt-1'>Meeting timeline</p>
            </CardContent>
          </Card>
        </div>

        {/* Migration Plans */}
        <Tabs defaultValue='active' className='w-full'>
          <TabsList>
            <TabsTrigger value='active'>Active ({planStats.active})</TabsTrigger>
            <TabsTrigger value='delayed'>Delayed ({data?.filter(p => p.isDelayed).length || 0})</TabsTrigger>
            <TabsTrigger value='completed'>Completed ({planStats.completed})</TabsTrigger>
          </TabsList>

          <TabsContent value='active'>
            <Card>
              <CardHeader>
                <CardTitle>Active Migration Plans</CardTitle>
                <CardDescription>Ongoing migrations and their progress</CardDescription>
              </CardHeader>
              <CardContent>
                <DataState isLoading={isLoading} error={error} isEmpty={!data?.filter(p => p.status === 'active').length}>
                  {data?.filter(p => p.status === 'active').length ? (
                    <div className='space-y-4'>
                      {data
                        .filter(p => p.status === 'active')
                        .map(plan => (
                          <Sheet key={plan.id}>
                            <SheetTrigger asChild>
                              <div className='cursor-pointer p-4 border rounded-lg hover:bg-accent transition-colors'>
                                <div className='flex items-start justify-between mb-3'>
                                  <div>
                                    <p className='font-semibold'>{plan.name}</p>
                                    <p className='text-sm text-muted-foreground'>{plan.sourceProvider} → {plan.targetProvider}</p>
                                  </div>
                                  {plan.isDelayed && (
                                    <Badge className='bg-destructive flex items-center gap-1'>
                                      <AlertTriangle className='size-3' />
                                      Delayed
                                    </Badge>
                                  )}
                                </div>
                                <div className='flex items-center gap-3'>
                                  <div className='flex-1'>
                                    <div className='flex justify-between text-xs mb-1'>
                                      <span className='font-medium'>Progress</span>
                                      <span className='text-muted-foreground'>{plan.progressPercent}%</span>
                                    </div>
                                    <Progress value={plan.progressPercent} className='h-2' />
                                  </div>
                                  <span className='text-xs font-medium whitespace-nowrap text-muted-foreground'>
                                    {plan.completedWaves}/{plan.totalWaves} waves
                                  </span>
                                </div>
                              </div>
                            </SheetTrigger>
                            <SheetContent className='w-[600px]'>
                              <SheetHeader>
                                <SheetTitle>{plan.name}</SheetTitle>
                              </SheetHeader>
                              <ScrollArea className='h-[calc(100vh-120px)] mt-4'>
                                <div className='space-y-4 pr-4'>
                                  <div>
                                    <p className='text-sm font-medium text-muted-foreground'>Status</p>
                                    <StatusBadge status={plan.status} />
                                  </div>
                                  <Separator />
                                  <div>
                                    <p className='text-sm font-medium text-muted-foreground'>Source → Target</p>
                                    <p className='text-sm'>{plan.sourceProvider} → {plan.targetProvider}</p>
                                  </div>
                                  <Separator />
                                  <div>
                                    <p className='text-sm font-medium text-muted-foreground'>Progress</p>
                                    <p className='text-2xl font-bold mb-2'>{plan.progressPercent}%</p>
                                    <Progress value={plan.progressPercent} className='h-2' />
                                  </div>
                                  <Separator />
                                  <div>
                                    <p className='text-sm font-medium text-muted-foreground'>Waves</p>
                                    <p className='text-sm'>{plan.completedWaves} of {plan.totalWaves} completed</p>
                                  </div>
                                  <Separator />
                                  <div>
                                    <p className='text-sm font-medium text-muted-foreground'>Start Date</p>
                                    <p className='text-sm'>{plan.startDate}</p>
                                  </div>
                                  <Separator />
                                  <div>
                                    <p className='text-sm font-medium text-muted-foreground'>Target Date</p>
                                    <p className='text-sm'>{plan.targetDate}</p>
                                  </div>
                                  <Separator />
                                  <div>
                                    <p className='text-sm font-medium text-muted-foreground'>Assets Migrated</p>
                                    <p className='text-lg font-semibold'>{formatNumber(plan.assetsMigrated)}/{formatNumber(plan.totalAssets)}</p>
                                  </div>
                                </div>
                              </ScrollArea>
                            </SheetContent>
                          </Sheet>
                        ))}
                    </div>
                  ) : (
                    <p className='text-sm text-muted-foreground text-center py-8'>No active migration plans</p>
                  )}
                </DataState>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='delayed'>
            <Card>
              <CardHeader>
                <CardTitle>Delayed Plans</CardTitle>
                <CardDescription>Migrations behind schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <DataState isLoading={isLoading} error={error} isEmpty={!data?.filter(p => p.isDelayed).length}>
                  {data?.filter(p => p.isDelayed).length ? (
                    <div className='space-y-2'>
                      {data
                        .filter(p => p.isDelayed)
                        .map(plan => (
                          <div key={plan.id} className='flex items-center justify-between p-3 border border-destructive/50 rounded-lg bg-destructive/5'>
                            <div>
                              <p className='font-medium'>{plan.name}</p>
                              <p className='text-xs text-muted-foreground'>Target: {plan.targetDate}</p>
                            </div>
                            <Badge className='bg-destructive flex items-center gap-1'>
                              <AlertTriangle className='size-3' />
                              {formatPercent((plan.progressPercent / 100) * 100)}% complete
                            </Badge>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className='text-sm text-muted-foreground text-center py-8'>All plans on track</p>
                  )}
                </DataState>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='completed'>
            <Card>
              <CardHeader>
                <CardTitle>Completed Migrations</CardTitle>
                <CardDescription>Successfully completed migration plans</CardDescription>
              </CardHeader>
              <CardContent>
                <DataState isLoading={isLoading} error={error} isEmpty={!planStats.completed}>
                  {planStats.completed > 0 ? (
                    <div className='space-y-2'>
                      {data
                        ?.filter(p => p.status === 'completed')
                        .map(plan => (
                          <div key={plan.id} className='flex items-center justify-between p-3 border rounded-lg bg-green-500/5'>
                            <div>
                              <p className='font-medium flex items-center gap-2'>
                                <CheckCircle2 className='size-4 text-green-600' />
                                {plan.name}
                              </p>
                              <p className='text-xs text-muted-foreground'>Completed: {plan.targetDate}</p>
                            </div>
                            <Badge className='bg-green-600'>{formatNumber(plan.totalAssets)} assets</Badge>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className='text-sm text-muted-foreground text-center py-8'>No completed migrations</p>
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
