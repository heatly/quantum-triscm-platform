'use client'

import { useState } from 'react'
import { useInventory } from '@/lib/api/client'
import { PageHeader } from '@/components/shared/page-header'
import { DataState } from '@/components/shared/data-state'
import { PqcBadge } from '@/components/shared/status-badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Search, ExternalLink, Globe } from 'lucide-react'
import { formatNumber, formatDate, relativeTime, titleCase } from '@/lib/format'
import type { AssetRecord } from '@/lib/types'

function riskBadgeClass(score: number) {
  if (score >= 70) return 'bg-destructive text-destructive-foreground'
  if (score >= 50) return 'bg-warning text-warning-foreground'
  return 'bg-success text-success-foreground'
}

export default function InventoryPage() {
  const { data, isLoading, error, refresh } = useInventory()
  const [searchTerm, setSearchTerm] = useState('')
  const [assetType, setAssetType] = useState<string>('all')

  return (
    <>
      <PageHeader
        title="Asset Inventory"
        description="Centralized catalog of all discovered cryptographic assets"
      />

      <DataState
        isLoading={isLoading}
        error={error}
        data={data}
        onRetry={refresh}
        isEmpty={(d) => d.length === 0}
      >
        {(assets) => {
          const assetTypes = Array.from(new Set(assets.map((a) => a.type)))
          const filtered = assets.filter((asset) => {
            const matchesSearch =
              asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              asset.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
              asset.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
              asset.algorithm.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesType = assetType === 'all' || asset.type === assetType
            return matchesSearch && matchesType
          })

          const atRisk = filtered.filter((a) => a.riskScore >= 70)
          const exposed = filtered.filter((a) => a.internetExposed)

          const renderList = (rows: AssetRecord[], badge: (a: AssetRecord) => React.ReactNode) => (
            <div className="flex flex-col gap-2">
              {rows.map((asset) => (
                <div
                  key={asset.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div className="flex flex-col">
                    <p className="font-medium">{asset.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {titleCase(asset.type)} · {asset.location} · {asset.algorithm}
                    </p>
                  </div>
                  {badge(asset)}
                </div>
              ))}
            </div>
          )

          return (
            <div className="flex flex-col gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex flex-wrap gap-2">
                    <div className="flex min-w-64 flex-1 items-center gap-2 rounded-md border border-input px-3">
                      <Search className="size-4 shrink-0 text-muted-foreground" />
                      <Input
                        placeholder="Search by name, ID, location, or algorithm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                      />
                    </div>
                    <Select value={assetType} onValueChange={(v) => setAssetType(v ?? 'all')}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="all">All Types</SelectItem>
                          {assetTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {titleCase(type)}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="all" className="w-full">
                <TabsList>
                  <TabsTrigger value="all">All ({filtered.length})</TabsTrigger>
                  <TabsTrigger value="high-risk">At Risk ({atRisk.length})</TabsTrigger>
                  <TabsTrigger value="exposed">Internet Exposed ({exposed.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Asset</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Environment</TableHead>
                              <TableHead>Algorithm</TableHead>
                              <TableHead>PQC</TableHead>
                              <TableHead>Risk</TableHead>
                              <TableHead className="text-right">Details</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filtered.map((asset) => (
                              <TableRow key={asset.id}>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    {asset.internetExposed && (
                                      <Globe className="size-3.5 text-warning" aria-label="Internet exposed" />
                                    )}
                                    <div className="flex flex-col">
                                      <span className="font-medium">{asset.name}</span>
                                      <span className="text-xs text-muted-foreground">{asset.location}</span>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">{titleCase(asset.type)}</Badge>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {titleCase(asset.environment)}
                                </TableCell>
                                <TableCell className="font-mono text-xs">
                                  {asset.algorithm}
                                  {asset.keySize ? ` (${asset.keySize})` : ''}
                                </TableCell>
                                <TableCell>
                                  <PqcBadge readiness={asset.pqcReady} />
                                </TableCell>
                                <TableCell>
                                  <Badge className={riskBadgeClass(asset.riskScore)}>{asset.riskScore}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Sheet>
                                    <SheetTrigger
                                      render={
                                        <Button variant="ghost" size="icon-sm" aria-label="View asset">
                                          <ExternalLink />
                                        </Button>
                                      }
                                    />
                                    <SheetContent className="w-full sm:max-w-lg">
                                      <SheetHeader>
                                        <SheetTitle>{asset.name}</SheetTitle>
                                      </SheetHeader>
                                      <ScrollArea className="mt-4 h-[calc(100vh-120px)]">
                                        <div className="flex flex-col gap-4 pr-4">
                                          <Detail label="Asset ID" value={asset.id} mono />
                                          <Separator />
                                          <Detail label="Type" value={titleCase(asset.type)} />
                                          <Separator />
                                          <Detail label="Owner" value={asset.owner} />
                                          <Separator />
                                          <Detail label="Environment" value={titleCase(asset.environment)} />
                                          <Separator />
                                          <Detail label="Location" value={asset.location} />
                                          <Separator />
                                          <Detail
                                            label="Algorithm"
                                            value={`${asset.algorithm}${asset.keySize ? ` (${asset.keySize}-bit)` : ''}`}
                                          />
                                          {asset.protocol && (
                                            <>
                                              <Separator />
                                              <Detail
                                                label="Protocol"
                                                value={`${asset.protocol}${asset.protocolVersion ? ` ${asset.protocolVersion}` : ''}`}
                                              />
                                            </>
                                          )}
                                          {asset.cryptoLibrary && (
                                            <>
                                              <Separator />
                                              <Detail
                                                label="Library"
                                                value={`${asset.cryptoLibrary}${asset.libraryVersion ? ` ${asset.libraryVersion}` : ''}`}
                                              />
                                            </>
                                          )}
                                          {asset.validTo && (
                                            <>
                                              <Separator />
                                              <Detail label="Valid until" value={formatDate(asset.validTo)} />
                                            </>
                                          )}
                                          <Separator />
                                          <div className="flex flex-col gap-1">
                                            <p className="text-sm font-medium text-muted-foreground">PQC Readiness</p>
                                            <PqcBadge readiness={asset.pqcReady} />
                                          </div>
                                          <Separator />
                                          <div className="flex flex-col gap-1">
                                            <p className="text-sm font-medium text-muted-foreground">Risk Score</p>
                                            <p className="font-heading text-2xl font-semibold">{asset.riskScore}/100</p>
                                          </div>
                                          <Separator />
                                          <Detail label="Last Seen" value={relativeTime(asset.lastSeen)} />
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
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="high-risk">
                  <Card>
                    <CardContent className="pt-4">
                      {renderList(
                        [...atRisk].sort((a, b) => b.riskScore - a.riskScore),
                        (asset) => <Badge className={riskBadgeClass(asset.riskScore)}>{asset.riskScore}/100</Badge>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="exposed">
                  <Card>
                    <CardContent className="pt-4">
                      {renderList(exposed, (asset) => <PqcBadge readiness={asset.pqcReady} />)}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {formatNumber(filtered.length)} assets shown
                  </CardTitle>
                </CardHeader>
              </Card>
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
