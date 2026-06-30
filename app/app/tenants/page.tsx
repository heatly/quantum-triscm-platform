'use client'

import { useState } from 'react'
import { useTenants } from '@/lib/api/client'
import { PageHeader } from '@/components/shared/page-header'
import { DataState } from '@/components/shared/data-state'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Search, Plus, ExternalLink } from 'lucide-react'
import { formatNumber, formatDate, titleCase } from '@/lib/format'
import type { Tenant } from '@/lib/types'

function connectorHealthTone(healthy: number, total: number) {
  if (total === 0) return 'text-muted-foreground'
  const ratio = healthy / total
  if (ratio >= 1) return 'text-emerald-500'
  if (ratio >= 0.5) return 'text-warning'
  return 'text-destructive'
}

export default function TenantsPage() {
  const { data, isLoading, error, refresh } = useTenants()
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <>
      <PageHeader
        title="Tenant Management"
        description="Monitor and manage security posture across all cloud tenants"
        actions={
          <Button size="sm">
            <Plus data-icon="inline-start" />
            Add Tenant
          </Button>
        }
      />

      <DataState
        isLoading={isLoading}
        error={error}
        data={data}
        onRetry={refresh}
        isEmpty={(d) => d.length === 0}
      >
        {(tenants) => {
          const filtered = tenants.filter(
            (t) =>
              t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              t.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
              t.region.toLowerCase().includes(searchTerm.toLowerCase())
          )
          const onboarding = filtered.filter((t) => !t.onboardingComplete)
          const degraded = filtered.filter((t) => t.connectorsHealthy < t.connectorsTotal)

          const renderList = (rows: Tenant[], subtitle: (t: Tenant) => string) => (
            <div className="flex flex-col gap-2">
              {rows.map((tenant) => (
                <div
                  key={tenant.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div className="flex flex-col">
                    <p className="font-medium">{tenant.name}</p>
                    <p className="text-xs text-muted-foreground">{subtitle(tenant)}</p>
                  </div>
                  <Badge variant="secondary">{formatNumber(tenant.assetCount)} assets</Badge>
                </div>
              ))}
            </div>
          )

          return (
            <div className="flex flex-col gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 rounded-md border border-input px-3">
                    <Search className="size-4 shrink-0 text-muted-foreground" />
                    <Input
                      placeholder="Search tenants by name, industry, or region..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                    />
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="all" className="w-full">
                <TabsList>
                  <TabsTrigger value="all">All ({filtered.length})</TabsTrigger>
                  <TabsTrigger value="onboarding">Onboarding ({onboarding.length})</TabsTrigger>
                  <TabsTrigger value="degraded">Degraded Connectors ({degraded.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  <Card>
                    <CardContent className="overflow-x-auto pt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tenant</TableHead>
                            <TableHead>Industry</TableHead>
                            <TableHead>Region</TableHead>
                            <TableHead>Environments</TableHead>
                            <TableHead>Connectors</TableHead>
                            <TableHead>Assets</TableHead>
                            <TableHead>Onboarding</TableHead>
                            <TableHead className="text-right">Details</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filtered.map((tenant) => (
                            <TableRow key={tenant.id}>
                              <TableCell className="font-medium">{tenant.name}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">{tenant.industry}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">{tenant.region}</TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {tenant.environment.map((env) => (
                                    <Badge key={env} variant="outline" className="text-xs">
                                      {titleCase(env)}
                                    </Badge>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                <span
                                  className={`text-sm tabular-nums ${connectorHealthTone(tenant.connectorsHealthy, tenant.connectorsTotal)}`}
                                >
                                  {tenant.connectorsHealthy}/{tenant.connectorsTotal}
                                </span>
                              </TableCell>
                              <TableCell className="tabular-nums">{formatNumber(tenant.assetCount)}</TableCell>
                              <TableCell>
                                <Badge variant={tenant.onboardingComplete ? 'secondary' : 'destructive'}>
                                  {tenant.onboardingComplete ? 'Complete' : 'In Progress'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Sheet>
                                  <SheetTrigger
                                    render={
                                      <Button variant="ghost" size="icon-sm" aria-label="View tenant">
                                        <ExternalLink />
                                      </Button>
                                    }
                                  />
                                  <SheetContent className="w-full sm:max-w-lg">
                                    <SheetHeader>
                                      <SheetTitle>{tenant.name}</SheetTitle>
                                    </SheetHeader>
                                    <ScrollArea className="mt-4 h-[calc(100vh-120px)]">
                                      <div className="flex flex-col gap-4 pr-4">
                                        <Detail label="Tenant ID" value={tenant.id} mono />
                                        <Separator />
                                        <Detail label="Slug" value={tenant.slug} mono />
                                        <Separator />
                                        <Detail label="Industry" value={tenant.industry} />
                                        <Separator />
                                        <Detail label="Region" value={tenant.region} />
                                        <Separator />
                                        <div className="flex flex-col gap-1">
                                          <p className="text-sm font-medium text-muted-foreground">Environments</p>
                                          <div className="flex flex-wrap gap-1">
                                            {tenant.environment.map((env) => (
                                              <Badge key={env} variant="outline">
                                                {titleCase(env)}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                        <Separator />
                                        <div className="flex flex-col gap-1.5">
                                          <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-muted-foreground">
                                              Connector Health
                                            </p>
                                            <span className="text-sm tabular-nums">
                                              {tenant.connectorsHealthy}/{tenant.connectorsTotal}
                                            </span>
                                          </div>
                                          <Progress
                                            value={
                                              tenant.connectorsTotal
                                                ? (tenant.connectorsHealthy / tenant.connectorsTotal) * 100
                                                : 0
                                            }
                                            className="h-2"
                                          />
                                        </div>
                                        <Separator />
                                        <div className="flex flex-col gap-1">
                                          <p className="text-sm font-medium text-muted-foreground">Assets</p>
                                          <p className="font-heading text-2xl font-semibold">
                                            {formatNumber(tenant.assetCount)}
                                          </p>
                                        </div>
                                        <Separator />
                                        <Detail label="Created" value={formatDate(tenant.createdAt)} />
                                      </div>
                                    </ScrollArea>
                                  </SheetContent>
                                </Sheet>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="onboarding">
                  <Card>
                    <CardContent className="pt-4">
                      {renderList(onboarding, (t) => `${t.industry} · ${t.region}`)}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="degraded">
                  <Card>
                    <CardContent className="pt-4">
                      {renderList(
                        degraded,
                        (t) => `${t.connectorsHealthy}/${t.connectorsTotal} connectors healthy`
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )
        }}
      </DataState>
    </>
  )
}

function Detail({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className={mono ? 'break-all font-mono text-xs' : 'text-sm'}>{value}</p>
    </div>
  )
}
