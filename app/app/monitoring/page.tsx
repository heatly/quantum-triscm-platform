'use client'

import { useMonitoring } from '@/lib/api/client'
import { PageHeader } from '@/components/shared/page-header'
import { DataState } from '@/components/shared/data-state'
import { StatusBadge } from '@/components/shared/status-badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { AlertTriangle, Activity } from 'lucide-react'
import { formatNumber } from '@/lib/format'

const eventTimeline = [
  { time: '00:00', events: 45 },
  { time: '04:00', events: 32 },
  { time: '08:00', events: 78 },
  { time: '12:00', events: 125 },
  { time: '16:00', events: 93 },
  { time: '20:00', events: 67 },
  { time: '24:00', events: 52 },
]

const severityColors = {
  critical: 'bg-red-600',
  high: 'bg-orange-600',
  medium: 'bg-yellow-600',
  low: 'bg-blue-600',
  info: 'bg-cyan-600',
}

export default function MonitoringPage() {
  const { data, isLoading, error } = useMonitoring()

  const eventStats = {
    total: data?.length || 0,
    critical: data?.filter(e => e.severity === 'critical').length || 0,
    high: data?.filter(e => e.severity === 'high').length || 0,
    medium: data?.filter(e => e.severity === 'medium').length || 0,
  }

  return (
    <>
      <PageHeader
        title='Security Monitoring'
        description='Real-time security events and anomaly detection'
      />

      <div className='space-y-4'>
        {/* Event Stats */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold'>{formatNumber(eventStats.total)}</p>
              <p className='text-xs text-muted-foreground mt-1'>Last 24 hours</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>Critical</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold text-red-600'>{formatNumber(eventStats.critical)}</p>
              <Badge className='mt-2 bg-red-600'>Require Action</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>High Severity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold text-orange-600'>{formatNumber(eventStats.high)}</p>
              <p className='text-xs text-muted-foreground mt-1'>Elevated risk</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>Active Anomalies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold'>{formatNumber(eventStats.medium)}</p>
              <Badge variant='outline' className='mt-2'>Under Review</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Event Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Event Timeline</CardTitle>
            <CardDescription>Security events over 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <LineChart data={eventTimeline}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='time' />
                <YAxis />
                <Tooltip />
                <Line type='monotone' dataKey='events' stroke='#ef4444' strokeWidth={2} dot={{ fill: '#ef4444', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Events */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Security Events</CardTitle>
            <CardDescription>Latest activity in your infrastructure</CardDescription>
          </CardHeader>
          <CardContent>
            <DataState isLoading={isLoading} error={error} isEmpty={!data?.length}>
              {data && data.length > 0 ? (
                <ScrollArea className='h-96'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Resource</TableHead>
                        <TableHead>Tenant</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map((event, idx) => (
                        <TableRow key={idx}>
                          <TableCell className='text-sm text-muted-foreground font-mono'>{event.timestamp}</TableCell>
                          <TableCell className='max-w-xs truncate'>{event.eventName}</TableCell>
                          <TableCell>
                            <Badge className={severityColors[event.severity]}>
                              {event.severity.charAt(0).toUpperCase() + event.severity.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className='text-sm font-mono text-muted-foreground'>{event.resource}</TableCell>
                          <TableCell className='text-sm'>{event.tenant}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              ) : (
                <p className='text-sm text-muted-foreground text-center py-8'>No events detected</p>
              )}
            </DataState>
          </CardContent>
        </Card>

        {/* Top Triggered Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Top Alert Triggers</CardTitle>
            <CardDescription>Most frequently triggered security alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <DataState isLoading={isLoading} error={error} isEmpty={!data?.length}>
              {data && data.length > 0 ? (
                <div className='space-y-2'>
                  {Array.from(new Set(data.map(e => e.eventName)))
                    .slice(0, 5)
                    .map((eventName, idx) => {
                      const count = data.filter(e => e.eventName === eventName).length
                      const severity = data.find(e => e.eventName === eventName)?.severity || 'info'
                      return (
                        <div key={idx} className='flex items-center justify-between p-3 border rounded-lg'>
                          <div className='flex items-start gap-3'>
                            <div className={`size-3 rounded-full mt-1 ${severityColors[severity]}`} />
                            <div>
                              <p className='font-medium text-sm'>{eventName}</p>
                              <p className='text-xs text-muted-foreground'>Last 24 hours</p>
                            </div>
                          </div>
                          <Badge variant='outline'>{formatNumber(count)}</Badge>
                        </div>
                      )
                    })}
                </div>
              ) : (
                <p className='text-sm text-muted-foreground'>No alerts triggered</p>
              )}
            </DataState>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
