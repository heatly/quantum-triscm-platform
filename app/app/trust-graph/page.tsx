'use client'

import { useGraph } from '@/lib/api/client'
import { PageHeader } from '@/components/shared/page-header'
import { DataState } from '@/components/shared/data-state'
import { RiskBadge, PqcBadge } from '@/components/shared/status-badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Network } from 'lucide-react'
import { formatNumber, titleCase } from '@/lib/format'
import type { GraphNode } from '@/lib/types'

export default function TrustGraphPage() {
  const { data, isLoading, error, refresh } = useGraph()

  return (
    <>
      <PageHeader
        title="Trust Graph"
        description="Explore cryptographic dependencies, supply chain trust, and blast radius"
      />

      <DataState
        isLoading={isLoading}
        error={error}
        data={data}
        onRetry={refresh}
        isEmpty={(d) => d.nodes.length === 0}
      >
        {({ nodes, edges }) => {
          // Downstream blast radius: how many edges target / originate from a node
          const degree = new Map<string, number>()
          for (const e of edges) {
            degree.set(e.source, (degree.get(e.source) ?? 0) + 1)
            degree.set(e.target, (degree.get(e.target) ?? 0) + 1)
          }

          const atRisk = nodes.filter((n) => n.riskBand === 'critical' || n.riskBand === 'high')
          const nodesByType = Array.from(new Set(nodes.map((n) => n.type))).map((type) => ({
            type,
            count: nodes.filter((n) => n.type === type).length,
          }))

          const rankedRisk = [...atRisk].sort(
            (a, b) => (degree.get(b.id) ?? 0) - (degree.get(a.id) ?? 0)
          )

          return (
            <div className="flex flex-col gap-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Nodes" value={nodes.length} hint="Services & assets" />
                <StatCard label="Edges" value={edges.length} hint="Trust relationships" />
                <StatCard
                  label="At-Risk Nodes"
                  value={atRisk.length}
                  hint="Critical or high"
                  tone="text-destructive"
                />
                <StatCard
                  label="Node Types"
                  value={nodesByType.length}
                  hint="Distinct categories"
                />
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Dependency Map</CardTitle>
                    <CardDescription>Trust relationships between cryptographic entities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[420px] pr-4">
                      <div className="flex flex-col gap-2">
                        {edges.map((edge) => {
                          const source = nodes.find((n) => n.id === edge.source)
                          const target = nodes.find((n) => n.id === edge.target)
                          if (!source || !target) return null
                          return (
                            <div
                              key={edge.id}
                              className="flex items-center gap-2 rounded-lg border border-border p-3 text-sm"
                            >
                              <span className="font-medium">{source.label}</span>
                              <Badge variant="outline" className="text-xs">
                                {titleCase(edge.type)}
                              </Badge>
                              <Network className="size-3.5 text-muted-foreground" />
                              <span className="font-medium">{target.label}</span>
                            </div>
                          )
                        })}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Nodes by Type</CardTitle>
                    <CardDescription>Distribution of graph entities</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2">
                    {nodesByType.map((entry) => (
                      <div
                        key={entry.type}
                        className="flex items-center justify-between rounded-lg border border-border p-3"
                      >
                        <span className="text-sm font-medium">{titleCase(entry.type)}</span>
                        <Badge variant="secondary">{formatNumber(entry.count)}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Propagation</CardTitle>
                  <CardDescription>At-risk nodes ranked by blast radius (connections)</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  {rankedRisk.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No high-risk nodes in the current graph.</p>
                  ) : (
                    rankedRisk.slice(0, 10).map((node: GraphNode) => (
                      <div
                        key={node.id}
                        className="flex items-center justify-between rounded-lg border border-border p-3"
                      >
                        <div className="flex min-w-0 flex-col">
                          <p className="truncate text-sm font-medium">{node.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {titleCase(node.type)} · blast radius {degree.get(node.id) ?? 0} nodes
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <PqcBadge readiness={node.pqcReady} />
                          <RiskBadge band={node.riskBand} />
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          )
        }}
      </DataState>
    </>
  )
}

function StatCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string
  value: number
  hint: string
  tone?: string
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`font-heading text-2xl font-semibold tabular-nums ${tone ?? ''}`}>
          {formatNumber(value)}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  )
}
