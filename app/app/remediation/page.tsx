'use client'

import { useState } from 'react'
import { useRemediation } from '@/lib/api/client'
import { PageHeader } from '@/components/shared/page-header'
import { DataState } from '@/components/shared/data-state'
import { StatusBadge } from '@/components/shared/status-badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectGroup, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Search, CheckCircle2, Clock } from 'lucide-react'
import { formatNumber } from '@/lib/format'

export default function RemediationPage() {
  const { data, isLoading, error } = useRemediation()
  const [searchTerm, setSearchTerm] = useState('')
  const [priority, setPriority] = useState('all')

  const filtered = data?.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.finding.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = priority === 'all' || t.priority === priority
    return matchesSearch && matchesPriority
  }) || []

  const taskStats = {
    total: data?.length || 0,
    completed: data?.filter(t => t.status === 'completed').length || 0,
    inProgress: data?.filter(t => t.status === 'in-progress').length || 0,
    pending: data?.filter(t => t.status === 'pending').length || 0,
  }

  const completionPercent = taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0

  return (
    <>
      <PageHeader
        title='Remediation Tracking'
        description='Plan, assign, and track remediation of security findings'
      />

      <div className='space-y-4'>
        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Remediation Progress</CardTitle>
            <CardDescription>Overall completion rate</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <div className='flex items-center justify-between mb-2'>
                <p className='text-sm font-medium'>Completion</p>
                <span className='text-sm font-semibold'>{completionPercent}%</span>
              </div>
              <Progress value={completionPercent} className='h-3' />
            </div>
            <div className='grid gap-4 md:grid-cols-4'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>Total</p>
                <p className='text-2xl font-bold'>{formatNumber(taskStats.total)}</p>
              </div>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>Completed</p>
                <p className='text-2xl font-bold text-green-600'>{formatNumber(taskStats.completed)}</p>
              </div>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>In Progress</p>
                <p className='text-2xl font-bold text-blue-600'>{formatNumber(taskStats.inProgress)}</p>
              </div>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>Pending</p>
                <p className='text-2xl font-bold text-orange-600'>{formatNumber(taskStats.pending)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardContent className='pt-4'>
            <div className='flex gap-2 flex-wrap'>
              <div className='flex-1 min-w-64 flex gap-2'>
                <Search className='size-4 text-muted-foreground flex-shrink-0 mt-2' />
                <Input
                  placeholder='Search remediation tasks...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='flex-1'
                />
              </div>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className='w-48'>
                  <SelectValue placeholder='Filter by priority' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value='all'>All Priorities</SelectItem>
                    <SelectItem value='critical'>Critical</SelectItem>
                    <SelectItem value='high'>High</SelectItem>
                    <SelectItem value='medium'>Medium</SelectItem>
                    <SelectItem value='low'>Low</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue='all' className='w-full'>
          <TabsList>
            <TabsTrigger value='all'>All ({filtered.length})</TabsTrigger>
            <TabsTrigger value='pending'>Pending ({filtered.filter(t => t.status === 'pending').length})</TabsTrigger>
            <TabsTrigger value='in-progress'>In Progress ({filtered.filter(t => t.status === 'in-progress').length})</TabsTrigger>
            <TabsTrigger value='completed'>Completed ({filtered.filter(t => t.status === 'completed').length})</TabsTrigger>
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
                            <TableHead>Task</TableHead>
                            <TableHead>Finding</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Owner</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead className='text-right'>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filtered.map(task => (
                            <TableRow key={task.id}>
                              <TableCell className='font-medium max-w-xs truncate'>{task.title}</TableCell>
                              <TableCell className='text-sm text-muted-foreground max-w-xs truncate'>{task.finding}</TableCell>
                              <TableCell>
                                <Badge
                                  className={
                                    task.priority === 'critical'
                                      ? 'bg-red-600'
                                      : task.priority === 'high'
                                        ? 'bg-orange-600'
                                        : task.priority === 'medium'
                                          ? 'bg-yellow-600'
                                          : 'bg-blue-600'
                                  }
                                >
                                  {task.priority}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <StatusBadge status={task.status} />
                              </TableCell>
                              <TableCell className='text-sm'>{task.owner}</TableCell>
                              <TableCell className='text-sm text-muted-foreground'>{task.dueDate}</TableCell>
                              <TableCell className='text-right'>
                                <Sheet>
                                  <SheetTrigger asChild>
                                    <Button variant='ghost' size='sm'>
                                      View
                                    </Button>
                                  </SheetTrigger>
                                  <SheetContent className='w-[600px]'>
                                    <SheetHeader>
                                      <SheetTitle>{task.title}</SheetTitle>
                                    </SheetHeader>
                                    <ScrollArea className='h-[calc(100vh-120px)] mt-4'>
                                      <div className='space-y-4 pr-4'>
                                        <div>
                                          <p className='text-sm font-medium text-muted-foreground'>Status</p>
                                          <StatusBadge status={task.status} />
                                        </div>
                                        <Separator />
                                        <div>
                                          <p className='text-sm font-medium text-muted-foreground'>Priority</p>
                                          <Badge className={
                                            task.priority === 'critical'
                                              ? 'bg-red-600'
                                              : task.priority === 'high'
                                                ? 'bg-orange-600'
                                                : task.priority === 'medium'
                                                  ? 'bg-yellow-600'
                                                  : 'bg-blue-600'
                                          }>
                                            {task.priority}
                                          </Badge>
                                        </div>
                                        <Separator />
                                        <div>
                                          <p className='text-sm font-medium text-muted-foreground'>Finding</p>
                                          <p className='text-sm'>{task.finding}</p>
                                        </div>
                                        <Separator />
                                        <div>
                                          <p className='text-sm font-medium text-muted-foreground'>Owner</p>
                                          <p className='text-sm'>{task.owner}</p>
                                        </div>
                                        <Separator />
                                        <div>
                                          <p className='text-sm font-medium text-muted-foreground'>Due Date</p>
                                          <p className='text-sm'>{task.dueDate}</p>
                                        </div>
                                        <Separator />
                                        <div>
                                          <p className='text-sm font-medium text-muted-foreground'>Description</p>
                                          <p className='text-sm'>{task.description}</p>
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

          <TabsContent value='pending'>
            <Card>
              <CardContent className='pt-4'>
                <DataState isLoading={isLoading} error={error} isEmpty={filtered.filter(t => t.status === 'pending').length === 0}>
                  {filtered.filter(t => t.status === 'pending').length > 0 && (
                    <div className='space-y-2'>
                      {filtered
                        .filter(t => t.status === 'pending')
                        .map(task => (
                          <div key={task.id} className='flex items-center justify-between p-3 border rounded-lg'>
                            <div>
                              <p className='font-medium'>{task.title}</p>
                              <p className='text-xs text-muted-foreground'>Due: {task.dueDate}</p>
                            </div>
                            <Badge className={task.priority === 'critical' ? 'bg-red-600' : 'bg-orange-600'}>
                              {task.priority}
                            </Badge>
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
                <DataState isLoading={isLoading} error={error} isEmpty={filtered.filter(t => t.status === 'in-progress').length === 0}>
                  {filtered.filter(t => t.status === 'in-progress').length > 0 && (
                    <div className='space-y-2'>
                      {filtered
                        .filter(t => t.status === 'in-progress')
                        .map(task => (
                          <div key={task.id} className='flex items-center justify-between p-3 border rounded-lg'>
                            <div>
                              <p className='font-medium'>{task.title}</p>
                              <p className='text-xs text-muted-foreground'>Owner: {task.owner}</p>
                            </div>
                            <Badge variant='outline' className='bg-blue-500/10 text-blue-700'>
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

          <TabsContent value='completed'>
            <Card>
              <CardContent className='pt-4'>
                <DataState isLoading={isLoading} error={error} isEmpty={filtered.filter(t => t.status === 'completed').length === 0}>
                  {filtered.filter(t => t.status === 'completed').length > 0 && (
                    <div className='space-y-2'>
                      {filtered
                        .filter(t => t.status === 'completed')
                        .map(task => (
                          <div key={task.id} className='flex items-center justify-between p-3 border rounded-lg'>
                            <div>
                              <p className='font-medium'>{task.title}</p>
                              <p className='text-xs text-muted-foreground'>{task.finding}</p>
                            </div>
                            <Badge className='bg-green-600'>Completed</Badge>
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
