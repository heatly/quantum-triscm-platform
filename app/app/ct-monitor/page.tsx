'use client'

import { useCtEvents } from '@/lib/api/client'
import { PageHeader } from '@/components/shared/page-header'
import { DataState } from '@/components/shared/data-state'
import { SeverityBadge } from '@/components/shared/status-badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { TriangleAlert, ExternalLink } from 'lucide-react'
import { formatNumber, relativeTime } from '@/lib/format'

export default function CTMonitorPage() {
  const { data, isLoading, error, refresh } = useCtEvents()

  return (
    <>
      <PageHeader
        title="Certificate Transparency Monitor"
        description="Watch public CT logs for newly issued certificates matching your domains"
      />

      <DataState
        isLoading={isLoading}
        error={error}
        data={data}
        onRetry={refresh}
        isEmpty={(d) => d.events.length === 0}
      >
        {({ events, watchlist }) => {
          const flagged = events.filter((e) => e.matchedWatchlist !== null)
          const domains = new Set(events.map((e) => e.domain)).size

          return (
            <div className="flex flex-col gap-4">
              {flagged.length > 0 && (
                <Alert variant="destructive">
                  <TriangleAlert />
                  <AlertTitle>{flagged.length} certificate(s) matched a watchlist pattern</AlertTitle>
                  <AlertDescription>
                    Review newly issued certificates that match monitored domains for possible misissuance.
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">CT Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-heading text-2xl font-semibold tabular-nums">
                      {formatNumber(events.length)}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Unique Domains</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-heading text-2xl font-semibold tabular-nums">
                      {formatNumber(domains)}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Watchlist Matches</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-heading text-2xl font-semibold tabular-nums text-destructive">
                      {formatNumber(flagged.length)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">Requires review</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Active Watchlist</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-heading text-2xl font-semibold tabular-nums">
                      {formatNumber(watchlist.length)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">Patterns monitored</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Recent CT Log Events</CardTitle>
                    <CardDescription>Certificates observed in public Certificate Transparency logs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Domain</TableHead>
                            <TableHead>Issuer</TableHead>
                            <TableHead>Seen</TableHead>
                            <TableHead>Severity</TableHead>
                            <TableHead>Match</TableHead>
                            <TableHead className="text-right">Cert</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {events.map((event) => (
                            <TableRow key={event.id}>
                              <TableCell className="font-medium">{event.domain}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">{event.issuer}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {relativeTime(event.timestamp)}
                              </TableCell>
                              <TableCell>
                                <SeverityBadge severity={event.severity} />
                              </TableCell>
                              <TableCell>
                                {event.matchedWatchlist ? (
                                  <Badge variant="destructive">{event.matchedWatchlist}</Badge>
                                ) : (
                                  <span className="text-xs text-muted-foreground">—</span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  aria-label="Open raw certificate"
                                  render={
                                    <a href={event.rawCertUrl} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink />
                                    </a>
                                  }
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Watchlist</CardTitle>
                    <CardDescription>Domain patterns under active monitoring</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2">
                    {watchlist.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between rounded-lg border border-border p-3"
                      >
                        <div className="flex flex-col">
                          <span className="font-mono text-sm">{entry.pattern}</span>
                          <span className="text-xs text-muted-foreground">
                            Added {relativeTime(entry.createdAt)}
                          </span>
                        </div>
                        <Badge variant="secondary">{formatNumber(entry.matches24h)} / 24h</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )
        }}
      </DataState>
    </>
  )
}
