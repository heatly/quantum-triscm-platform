'use client'

import { useRiskScores } from '@/lib/api/client'
import { PageHeader } from '@/components/shared/page-header'
import { DataState } from '@/components/shared/data-state'
import { KPICard } from '@/components/shared/kpi-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react'
import { formatNumber, formatPercent } from '@/lib/format'

const riskDistribution = [
  { range: 'Critical (90-100)', count: 8 },
  { range: 'High (70-89)', count: 24 },
  { range: 'Medium (50-69)', count: 45 },
  { range: 'Low (0-49)', count: 78 },
]

const riskTrend = [
  { month: 'Jan', score: 72 },
  { month: 'Feb', score: 71 },
  { month: 'Mar', score: 68 },
  { month: 'Apr', score: 64 },
  { month: 'May', score: 65 },
  { month: 'Jun', score: 63 },
  { month: 'Jul', score: 61 },
]

export default function RiskPage() {
  const { data, isLoading, error } = useRiskScores()

  return (
    <>
      <PageHeader
        title='Risk Management'
        description='Monitor security risk scores and trends across your infrastructure'
      />

      <div className='space-y-4'>
        {/* KPI Cards */}
        <DataState isLoading={isLoading} error={error} isEmpty={!data}>
          {data && (
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <KPICard
                title='Overall Risk'
                value={formatNumber(data.overallScore)}
                unit='/100'
                icon={AlertTriangle}
                status='critical'
              />
              <KPICard
                title='High Risk Assets'
                value={formatNumber(data.highRiskCount)}
                trend={{ direction: 'down', value: 3 }}
                status='warning'
              />
              <KPICard
                title='Avg Risk Score'
                value={formatNumber(data.avgScore)}
                unit='/100'
                icon={TrendingDown}
                status='info'
              />
              <KPICard
                title='Assets Improving'
                value={formatPercent(data.improvingPercent)}
                icon={TrendingUp}
                status='success'
              />
            </div>
          )}
        </DataState>

        {/* Charts */}
        <div className='grid gap-4 lg:grid-cols-2'>
          {/* Risk Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Distribution</CardTitle>
              <CardDescription>Assets by risk level</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width='100%' height={300}>
                <BarChart data={riskDistribution}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='range' angle={-45} textAnchor='end' height={100} interval={0} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey='count' fill='#3b82f6'>
                    {riskDistribution.map((entry, index) => {
                      const colors = ['#ef4444', '#f97316', '#eab308', '#84cc16']
                      return <Cell key={`cell-${index}`} fill={colors[index]} />
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Risk Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Trend</CardTitle>
              <CardDescription>7-month trajectory</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width='100%' height={300}>
                <LineChart data={riskTrend}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='month' />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line type='monotone' dataKey='score' stroke='#3b82f6' strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Risk Factors */}
        <Card>
          <CardHeader>
            <CardTitle>Top Risk Factors</CardTitle>
            <CardDescription>Primary contributors to overall risk score</CardDescription>
          </CardHeader>
          <CardContent>
            <DataState isLoading={isLoading} error={error} isEmpty={!data?.topFactors?.length}>
              {data?.topFactors && data.topFactors.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Risk Factor</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Count</TableHead>
                      <TableHead>Impact Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.topFactors.map((factor, idx) => (
                      <TableRow key={idx}>
                        <TableCell className='font-medium'>{factor.name}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              factor.severity === 'critical'
                                ? 'bg-destructive'
                                : factor.severity === 'high'
                                  ? 'bg-orange-500'
                                  : factor.severity === 'medium'
                                    ? 'bg-yellow-500'
                                    : 'bg-blue-500'
                            }
                          >
                            {factor.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatNumber(factor.count)}</TableCell>
                        <TableCell className='font-semibold'>{formatNumber(factor.impactScore)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className='text-sm text-muted-foreground'>No risk factors detected</p>
              )}
            </DataState>
          </CardContent>
        </Card>

        {/* High Risk Assets */}
        <Card>
          <CardHeader>
            <CardTitle>Highest Risk Assets</CardTitle>
            <CardDescription>Assets requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <DataState isLoading={isLoading} error={error} isEmpty={!data?.highestRiskAssets?.length}>
              {data?.highestRiskAssets && data.highestRiskAssets.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset</TableHead>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Risk Score</TableHead>
                      <TableHead>Top Issue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.highestRiskAssets.map((asset, idx) => (
                      <TableRow key={idx}>
                        <TableCell className='font-medium'>{asset.name}</TableCell>
                        <TableCell className='text-sm'>{asset.tenant}</TableCell>
                        <TableCell>
                          <Badge className='bg-destructive'>{asset.score}/100</Badge>
                        </TableCell>
                        <TableCell className='text-sm text-muted-foreground'>{asset.topIssue}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className='text-sm text-muted-foreground'>No high risk assets</p>
              )}
            </DataState>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
