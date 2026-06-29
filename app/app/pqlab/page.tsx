'use client'

import { usePqLab } from '@/lib/api/client'
import { PageHeader } from '@/components/shared/page-header'
import { DataState } from '@/components/shared/data-state'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Shield, AlertTriangle } from 'lucide-react'
import { formatNumber } from '@/lib/format'

const pqReadinessBenchmarks = [
  { algo: 'Lattice-based', readiness: 78 },
  { algo: 'Hash-based', readiness: 92 },
  { algo: 'Code-based', readiness: 65 },
  { algo: 'Multivariate', readiness: 58 },
]

export default function PQLabPage() {
  const { data, isLoading, error } = usePqLab()

  return (
    <>
      <PageHeader
        title='Post-Quantum Lab'
        description='PQC readiness assessment and migration planning'
      />

      <div className='space-y-4'>
        {/* Assessment Status */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>PQC Readiness</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-3xl font-bold'>{data?.overallReadiness || 0}%</p>
              <Progress value={data?.overallReadiness || 0} className='mt-2 h-2' />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>At-Risk Cryptography</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold text-red-600'>{formatNumber(data?.vulnerableCount || 0)}</p>
              <p className='text-xs text-muted-foreground mt-1'>Harvest Now, Decrypt Later</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>Hybrid Implementations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold text-green-600'>{formatNumber(data?.hybridCount || 0)}</p>
              <Badge className='mt-2 bg-green-600 text-xs'>Secure Path</Badge>
            </CardContent>
          </Card>
        </div>

        {/* PQC Readiness by Algorithm */}
        <Card>
          <CardHeader>
            <CardTitle>Algorithm Readiness</CardTitle>
            <CardDescription>PQC implementation readiness by algorithm family</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={pqReadinessBenchmarks}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='algo' />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey='readiness' fill='#3b82f6' />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Vulnerable Systems */}
        <Card>
          <CardHeader>
            <CardTitle>Vulnerable Systems</CardTitle>
            <CardDescription>Assets using weak cryptography susceptible to quantum attacks</CardDescription>
          </CardHeader>
          <CardContent>
            <DataState isLoading={isLoading} error={error} isEmpty={!data?.vulnerableSystems?.length}>
              {data?.vulnerableSystems && data.vulnerableSystems.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>System</TableHead>
                      <TableHead>Algorithm</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Migration Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.vulnerableSystems.map((sys, idx) => (
                      <TableRow key={idx}>
                        <TableCell className='font-medium'>{sys.name}</TableCell>
                        <TableCell className='text-sm'>{sys.algorithm}</TableCell>
                        <TableCell>
                          <Badge className={sys.riskLevel === 'critical' ? 'bg-red-600' : 'bg-orange-600'}>
                            {sys.riskLevel}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant='outline'>{sys.migrationStatus}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className='text-sm text-muted-foreground text-center py-8'>No vulnerable systems detected</p>
              )}
            </DataState>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Migration Recommendations</CardTitle>
            <CardDescription>NIST-recommended post-quantum algorithms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {[
                {
                  name: 'ML-KEM (Kyber)',
                  use: 'Key Encapsulation',
                  status: 'Standardized',
                  icon: Shield,
                },
                {
                  name: 'ML-DSA (Dilithium)',
                  use: 'Digital Signatures',
                  status: 'Standardized',
                  icon: Shield,
                },
                {
                  name: 'SLH-DSA (SPHINCS+)',
                  use: 'Hash-based Signatures',
                  status: 'Standardized',
                  icon: Shield,
                },
              ].map((rec, idx) => (
                <div key={idx} className='flex items-center justify-between p-3 border rounded-lg'>
                  <div>
                    <p className='font-medium'>{rec.name}</p>
                    <p className='text-xs text-muted-foreground'>{rec.use}</p>
                  </div>
                  <Badge className='bg-green-600'>{rec.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
