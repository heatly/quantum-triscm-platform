'use client'

import { useOverview } from '@/lib/api/client'
import { PageHeader } from '@/components/shared/page-header'
import { DataState } from '@/components/shared/data-state'
import { KPICard } from '@/components/shared/kpi-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Chart, ChartContainer, ChartTooltip, ChartLegend } from '@/components/ui/chart'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { AlertTriangle, TrendingUp, CheckCircle2, Clock } from 'lucide-react'
import { formatNumber, formatPercent } from '@/lib/format'

const overviewChartConfig = {
  score: { label: 'Risk Score', color: '#ef4444' },
  trend: { label: 'Trend', color: '#3b82f6' },
}

const riskTrendData = [
  { month: 'Jan', score: 68, trend: 72 },
  { month: 'Feb', score: 65, trend: 71 },
  { month: 'Mar', score: 62, trend: 68 },
  { month: 'Apr', score: 58, trend: 64 },
  { month: 'May', score: 61, trend: 65 },
  { month: 'Jun', score: 59, trend: 63 },
]

const tenantRiskData = [
  { name: 'Critical', value: 12 },
  { name: 'High', value: 28 },
  { name: 'Medium', value: 45 },
  { name: 'Low', value: 65 },
]

const tenantRiskColors = ['#ef4444', '#f97316', '#eab308', '#84cc16']

export default function OverviewPage() {
  const { data, isLoading, error } = useOverview()

  return (
    <>
      <PageHeader
        title='Security Intelligence Hub'
        description='Enterprise-wide visibility into risk, compliance, and threat landscape'
      />

      <div className='space-y-4'>
        {/* Alert Banner */}
        {data?.alertCount && data.alertCount > 0 && (
          <Alert className='border-destructive bg-destructive/5'>
            <AlertTriangle className='size-4' />
            <AlertDescription>
              {data.alertCount} critical findings require immediate attention
            </AlertDescription>
          </Alert>
        )}

        {/* KPI Grid */}
        <DataState isLoading={isLoading} error={error} isEmpty={!data}>
          {data && (
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <KPICard
                title='Overall Risk'
                value={formatNumber(data.overallRisk)}
                unit='/100'
                icon={TrendingUp}
                trend={{ direction: 'down', value: 3 }}
                status='critical'
              />
              <KPICard
                title='Compliant'
                value={formatPercent(data.complianceRate)}
                icon={CheckCircle2}
                status='success'
              />
              <KPICard
                title='Findings'
                value={formatNumber(data.findingCount)}
                trend={{ direction: 'down', value: 5 }}
                status='warning'
              />
              <KPICard
                title='Time to Fix'
                value={`${data.avgTimeToRemedy}d`}
                icon={Clock}
                status='info'
              />
            </div>
          )}
        </DataState>

        {/* Charts Row */}
        <div className='grid gap-4 lg:grid-cols-2'>
          {/* Risk Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Trend</CardTitle>
              <CardDescription>6-month trajectory</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width='100%' height={280}>
                <LineChart data={riskTrendData}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='month' />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type='monotone' dataKey='score' stroke='#ef4444' strokeWidth={2} dot={false} />
                  <Line type='monotone' dataKey='trend' stroke='#3b82f6' strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Tenant Risk Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Tenant Risk Distribution</CardTitle>
              <CardDescription>{data?.tenantCount || 0} tenants tracked</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width='100%' height={280}>
                <PieChart>
                  <Pie data={tenantRiskData} cx='50%' cy='50%' labelLine={false} label={({ name, value }) => `${name} (${value})`} outerRadius={80}>
                    {tenantRiskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={tenantRiskColors[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest events and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className='h-80 pr-4'>
              <DataState isLoading={isLoading} error={error} isEmpty={!data?.recentActivity?.length}>
                {data?.recentActivity && data.recentActivity.length > 0 ? (
                  <div className='space-y-3'>
                    {data.recentActivity.map((activity, idx) => (
                      <div key={idx} className='flex items-start gap-3 border-b pb-3 last:border-0'>
                        <div className='mt-1 size-2 flex-shrink-0 rounded-full bg-primary' />
                        <div className='flex-1 min-w-0'>
                          <p className='font-medium text-sm truncate'>{activity.title}</p>
                          <p className='text-xs text-muted-foreground'>{activity.timestamp}</p>
                        </div>
                        <Badge variant='outline' className='flex-shrink-0 text-xs'>
                          {activity.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='text-sm text-muted-foreground'>No recent activity</p>
                )}
              </DataState>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
