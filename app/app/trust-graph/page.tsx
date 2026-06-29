'use client'

import { useGraph } from '@/lib/api/client'
import { PageHeader } from '@/components/shared/page-header'
import { DataState } from '@/components/shared/data-state'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, Network } from 'lucide-react'

export default function TrustGraphPage() {
  const { data, isLoading, error } = useGraph()

  return (
    <>
      <PageHeader
        title='Trust Graph'
        description='Visualize dependencies, supply chain risks, and blast radius analysis'
      />

      <div className='space-y-4'>
        <Alert>
          <Network className='size-4' />
          <AlertDescription>
            Interactive dependency graph loading. This feature benefits from a full-screen graph visualization library like Cytoscape, D3, or OG.
          </AlertDescription>
        </Alert>

        {/* Graph Stats */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>Nodes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold'>{data?.nodes?.length || 0}</p>
              <p className='text-xs text-muted-foreground mt-1'>Services & Assets</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>Edges</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold'>{data?.edges?.length || 0}</p>
              <p className='text-xs text-muted-foreground mt-1'>Trust Relationships</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>Risk Propagation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold text-red-600'>{data?.riskNodes?.length || 0}</p>
              <p className='text-xs text-muted-foreground mt-1'>At-risk nodes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>Blast Radius</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold'>{data?.avgBlastRadius || 0}%</p>
              <p className='text-xs text-muted-foreground mt-1'>Avg impact spread</p>
            </CardContent>
          </Card>
        </div>

        {/* Graph Canvas Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Dependency Graph</CardTitle>
            <CardDescription>Interactive trust relationship network</CardDescription>
          </CardHeader>
          <CardContent>
            <DataState isLoading={isLoading} error={error} isEmpty={!data?.nodes?.length}>
              <div className='bg-muted rounded-lg p-12 flex items-center justify-center min-h-[500px]'>
                <div className='text-center'>
                  <Network className='size-12 mx-auto text-muted-foreground mb-4' />
                  <p className='text-muted-foreground'>Graph visualization ready</p>
                  <p className='text-xs text-muted-foreground mt-2'>
                    {data?.nodes?.length || 0} nodes • {data?.edges?.length || 0} relationships
                  </p>
                </div>
              </div>
            </DataState>
          </CardContent>
        </Card>

        {/* Risk Propagation Analysis */}
        {data?.riskNodes && data.riskNodes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Risk Propagation</CardTitle>
              <CardDescription>Nodes at risk and their downstream impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                {data.riskNodes.slice(0, 10).map((node, idx) => (
                  <div key={idx} className='flex items-center justify-between p-3 border rounded-lg'>
                    <div>
                      <p className='font-medium text-sm'>{node.name}</p>
                      <p className='text-xs text-muted-foreground'>Blast radius: {node.blastRadius} nodes</p>
                    </div>
                    <Badge className='bg-red-600'>{node.riskScore}/100</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}
