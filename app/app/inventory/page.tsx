'use client'

import { useState } from 'react'
import { useInventory } from '@/lib/api/client'
import { PageHeader } from '@/components/shared/page-header'
import { DataState } from '@/components/shared/data-state'
import { StatusBadge } from '@/components/shared/status-badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectGroup, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Search, Filter, ExternalLink } from 'lucide-react'
import { formatNumber } from '@/lib/format'

export default function InventoryPage() {
  const { data, isLoading, error } = useInventory()
  const [searchTerm, setSearchTerm] = useState('')
  const [assetType, setAssetType] = useState('all')

  const filtered = data
    ?.filter(asset => {
      const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.region.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = assetType === 'all' || asset.type === assetType
      return matchesSearch && matchesType
    }) || []

  const assetTypes = Array.from(new Set(data?.map(a => a.type) || []))

  return (
    <>
      <PageHeader
        title='Asset Inventory'
        description='Centralized catalog of all discovered cloud assets'
      />

      <div className='space-y-4'>
        {/* Filters */}
        <Card>
          <CardContent className='pt-4'>
            <div className='flex gap-2 flex-wrap'>
              <div className='flex-1 min-w-64 flex gap-2'>
                <Search className='size-4 text-muted-foreground flex-shrink-0 mt-2' />
                <Input
                  placeholder='Search assets by name, ID, or region...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='flex-1'
                />
              </div>
              <Select value={assetType} onValueChange={setAssetType}>
                <SelectTrigger className='w-48'>
                  <SelectValue placeholder='Filter by type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value='all'>All Types</SelectItem>
                    {assetTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
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
            <TabsTrigger value='high-risk'>At Risk ({filtered.filter(a => a.riskScore >= 70).length})</TabsTrigger>
            <TabsTrigger value='untagged'>Untagged ({filtered.filter(a => !a.tags?.length).length})</TabsTrigger>
          </TabsList>

          {/* All Assets Tab */}
          <TabsContent value='all'>
            <Card>
              <CardContent className='pt-4'>
                <DataState isLoading={isLoading} error={error} isEmpty={filtered.length === 0}>
                  {filtered.length > 0 && (
                    <div className='overflow-x-auto'>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Asset Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Region</TableHead>
                            <TableHead>Tenant</TableHead>
                            <TableHead>Risk Score</TableHead>
                            <TableHead>Tags</TableHead>
                            <TableHead className='text-right'>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filtered.map(asset => (
                            <TableRow key={asset.id}>
                              <TableCell className='font-medium'>{asset.name}</TableCell>
                              <TableCell>
                                <Badge variant='outline'>{asset.type}</Badge>
                              </TableCell>
                              <TableCell className='text-sm text-muted-foreground'>{asset.region}</TableCell>
                              <TableCell className='text-sm'>{asset.tenantId}</TableCell>
                              <TableCell>
                                <Badge className={asset.riskScore >= 70 ? 'bg-destructive' : asset.riskScore >= 50 ? 'bg-warning' : 'bg-success'}>
                                  {asset.riskScore}/100
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className='flex gap-1 flex-wrap'>
                                  {asset.tags?.slice(0, 2).map(tag => (
                                    <Badge key={tag} variant='secondary' className='text-xs'>
                                      {tag}
                                    </Badge>
                                  ))}
                                  {asset.tags && asset.tags.length > 2 && (
                                    <Badge variant='secondary' className='text-xs'>
                                      +{asset.tags.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className='text-right'>
                                <Sheet>
                                  <SheetTrigger asChild>
                                    <button className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 w-9'>
                                      <ExternalLink className='size-4' />
                                    </button>
                                  </SheetTrigger>
                                  <SheetContent className='w-[600px]'>
                                    <SheetHeader>
                                      <SheetTitle>{asset.name}</SheetTitle>
                                    </SheetHeader>
                                    <ScrollArea className='h-[calc(100vh-120px)] mt-4'>
                                      <div className='space-y-4 pr-4'>
                                        <div>
                                          <p className='text-sm font-medium text-muted-foreground'>Asset ID</p>
                                          <p className='font-mono text-xs break-all'>{asset.id}</p>
                                        </div>
                                        <Separator />
                                        <div>
                                          <p className='text-sm font-medium text-muted-foreground'>Type</p>
                                          <p>{asset.type}</p>
                                        </div>
                                        <Separator />
                                        <div>
                                          <p className='text-sm font-medium text-muted-foreground'>Region</p>
                                          <p>{asset.region}</p>
                                        </div>
                                        <Separator />
                                        <div>
                                          <p className='text-sm font-medium text-muted-foreground'>Tenant</p>
                                          <p className='font-mono text-xs'>{asset.tenantId}</p>
                                        </div>
                                        <Separator />
                                        <div>
                                          <p className='text-sm font-medium text-muted-foreground'>Risk Score</p>
                                          <p className='text-2xl font-bold'>{asset.riskScore}/100</p>
                                        </div>
                                        <Separator />
                                        <div>
                                          <p className='text-sm font-medium text-muted-foreground'>Tags</p>
                                          <div className='flex flex-wrap gap-2 mt-2'>
                                            {asset.tags?.map(tag => (
                                              <Badge key={tag} variant='secondary'>
                                                {tag}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                        <Separator />
                                        <div>
                                          <p className='text-sm font-medium text-muted-foreground'>Last Scanned</p>
                                          <p className='text-sm'>{asset.lastScanned}</p>
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

          {/* At Risk Tab */}
          <TabsContent value='high-risk'>
            <Card>
              <CardContent className='pt-4'>
                <DataState isLoading={isLoading} error={error} isEmpty={filtered.filter(a => a.riskScore >= 70).length === 0}>
                  {filtered.filter(a => a.riskScore >= 70).length > 0 && (
                    <div className='space-y-2'>
                      {filtered
                        .filter(a => a.riskScore >= 70)
                        .sort((a, b) => b.riskScore - a.riskScore)
                        .map(asset => (
                          <div key={asset.id} className='flex items-center justify-between p-3 border rounded-lg'>
                            <div>
                              <p className='font-medium'>{asset.name}</p>
                              <p className='text-xs text-muted-foreground'>{asset.type} • {asset.region}</p>
                            </div>
                            <Badge className='bg-destructive'>{asset.riskScore}/100</Badge>
                          </div>
                        ))}
                    </div>
                  )}
                </DataState>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Untagged Tab */}
          <TabsContent value='untagged'>
            <Card>
              <CardContent className='pt-4'>
                <DataState isLoading={isLoading} error={error} isEmpty={filtered.filter(a => !a.tags?.length).length === 0}>
                  {filtered.filter(a => !a.tags?.length).length > 0 && (
                    <div className='space-y-2'>
                      {filtered
                        .filter(a => !a.tags?.length)
                        .map(asset => (
                          <div key={asset.id} className='flex items-center justify-between p-3 border rounded-lg'>
                            <div>
                              <p className='font-medium'>{asset.name}</p>
                              <p className='text-xs text-muted-foreground'>{asset.type} • {asset.region}</p>
                            </div>
                            <Badge variant='outline'>No Tags</Badge>
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
