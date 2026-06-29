'use client'

import { useCtEvents } from '@/lib/api/client'
import { PageHeader } from '@/components/shared/page-header'
import { DataState } from '@/components/shared/data-state'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AlertTriangle } from 'lucide-react'
import { formatNumber } from '@/lib/format'

export default function CTMonitorPage() {
  const { data, isLoading, error } = useCtEvents()

  const criticalCerts = data?.filter(e => e.daysUntilExpiry <= 30).length || 0

  return (
    <>
      <PageHeader
        title='Certificate Transparency Monitor'
        description='Monitor SSL/TLS certificates for domain hijacking and misuse'
      />

      <div className='space-y-4'>
        {/* Alerts */}
        {criticalCerts > 0 && (
          <Alert className='border-destructive bg-destructive/5'>
            <AlertTriangle className='size-4' />
            <AlertDescription>
              {criticalCerts} certificate(s) expiring within 30 days
            </AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>Total Certificates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold'>{formatNumber(data?.length || 0)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>Monitored Domains</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold'>{formatNumber(new Set(data?.map(d => d.domain) || []).size)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>Expiring Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold text-orange-600'>{formatNumber(data?.filter(e => e.daysUntilExpiry <= 30 && e.daysUntilExpiry > 0).length || 0)}</p>
              <p className='text-xs text-muted-foreground mt-1'>Within 30 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>Anomalies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold text-red-600'>{formatNumber(data?.filter(e => e.anomalyFlag).length || 0)}</p>
              <Badge className='mt-2 bg-red-600 text-xs'>Suspicious Activity</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Certificate List */}
        <Card>
          <CardHeader>
            <CardTitle>Monitored Certificates</CardTitle>
            <CardDescription>SSL/TLS certificates from Certificate Transparency logs</CardDescription>
          </CardHeader>
          <CardContent>
            <DataState isLoading={isLoading} error={error} isEmpty={!data?.length}>
              {data && data.length > 0 && (
                <div className='overflow-x-auto'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Domain</TableHead>
                        <TableHead>Issuer</TableHead>
                        <TableHead>Expires</TableHead>
                        <TableHead>Days Left</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map((cert, idx) => (
                        <TableRow key={idx}>
                          <TableCell className='font-medium'>{cert.domain}</TableCell>
                          <TableCell className='text-sm'>{cert.issuer}</TableCell>
                          <TableCell className='text-sm text-muted-foreground'>{cert.expiryDate}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                cert.daysUntilExpiry <= 0
                                  ? 'bg-red-600'
                                  : cert.daysUntilExpiry <= 30
                                    ? 'bg-orange-600'
                                    : 'bg-green-600'
                              }
                            >
                              {cert.daysUntilExpiry <= 0 ? 'EXPIRED' : `${cert.daysUntilExpiry}d`}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {cert.anomalyFlag && (
                              <Badge className='bg-red-600'>Anomaly Detected</Badge>
                            )}
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
      </div>
    </>
  )
}
