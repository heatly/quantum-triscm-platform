"use client"

import Link from "next/link"
import {
  Activity,
  Boxes,
  CalendarClock,
  Globe,
  ShieldCheck,
  ShieldX,
  Wrench,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PageHeader } from "@/components/shared/page-header"
import { KpiCard } from "@/components/shared/kpi-card"
import { DataState } from "@/components/shared/data-state"
import { Pill, RiskBadge } from "@/components/shared/status-badge"
import {
  AssetGrowthChart,
  CertExpiryChart,
  RiskDistributionChart,
} from "@/components/overview/overview-charts"
import { useOverview } from "@/lib/api/client"
import { formatNumber, relativeTime } from "@/lib/format"

export default function OverviewPage() {
  const { data, isLoading, error, refresh } = useOverview()

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Quantum posture overview"
        description="Program-wide view of cryptographic exposure, post-quantum readiness, and active risk."
      />

      <DataState data={data} isLoading={isLoading} error={error} onRetry={refresh}>
        {(d) => (
          <div className="flex flex-col gap-5">
            <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <KpiCard
                label="Crypto assets"
                value={formatNumber(d.kpis.totalCryptoAssets)}
                icon={Boxes}
                tone="info"
                hint={`${d.kpis.pqReadyAssets} PQ-ready`}
              />
              <KpiCard
                label="Internet-facing"
                value={formatNumber(d.kpis.internetFacingAssets)}
                icon={Globe}
                tone="warning"
                hint="Externally exposed crypto"
              />
              <KpiCard
                label="Deprecated algos"
                value={formatNumber(d.kpis.deprecatedAlgorithms)}
                icon={ShieldX}
                tone="critical"
                hint="RSA-1024, SHA-1, 3DES…"
              />
              <KpiCard
                label="Expiring certs"
                value={formatNumber(d.kpis.expiringCertificates)}
                icon={CalendarClock}
                tone="warning"
                hint="Next 30 days"
              />
              <KpiCard
                label="PQ-ready"
                value={formatNumber(d.kpis.pqReadyAssets)}
                icon={ShieldCheck}
                tone="success"
                hint="Hybrid or full PQC"
              />
              <KpiCard
                label="Open remediation"
                value={formatNumber(d.kpis.openRemediationTasks)}
                icon={Wrench}
                tone="default"
                hint="Across all workflows"
              />
              <KpiCard
                label="Active alerts"
                value={formatNumber(d.kpis.activeAlerts)}
                icon={Activity}
                tone="critical"
                hint="Unacknowledged"
              />
              <KpiCard
                label="Connectors"
                value={`${d.kpis.connectorsHealthy}/${d.kpis.connectorsTotal}`}
                icon={ShieldCheck}
                tone="success"
                hint="Healthy / total"
              />
            </section>

            <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <AssetGrowthChart data={d.assetGrowth} />
              </div>
              <RiskDistributionChart data={d.riskDistribution} />
            </section>

            <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <CertExpiryChart data={d.certExpiryBuckets} />

              <Card className="gap-3">
                <CardHeader>
                  <CardTitle>Top risky assets</CardTitle>
                  <CardDescription>Highest quantum risk scores right now</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  {d.topRiskyAssets.slice(0, 6).map((r) => (
                    <div key={r.assetId} className="flex items-center justify-between gap-2">
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate text-sm font-medium">{r.assetName}</span>
                        <span className="truncate text-xs text-muted-foreground">{r.rationale}</span>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="font-mono text-sm tabular-nums">{r.totalScore}</span>
                        <RiskBadge band={r.band} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="gap-3">
                <CardHeader>
                  <CardTitle>Compliance drift</CardTitle>
                  <CardDescription>Control gaps by framework</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {d.complianceDrift.map((c) => (
                    <div key={c.framework} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{c.framework}</span>
                        <span className="text-muted-foreground tabular-nums">
                          {c.drift}/{c.controls} gaps
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-warning"
                          style={{ width: `${(c.drift / c.controls) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>

            <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Card className="gap-3">
                <CardHeader className="flex-row items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <CardTitle>Recent discoveries</CardTitle>
                    <CardDescription>Latest assets found by scanners</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" render={<Link href="/inventory">View all</Link>} />
                </CardHeader>
                <CardContent className="flex flex-col">
                  {d.recentDiscoveries.map((item, i) => (
                    <div key={item.id}>
                      {i > 0 && <Separator />}
                      <div className="flex items-center justify-between gap-2 py-2">
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate text-sm font-medium">{item.name}</span>
                          <span className="text-xs text-muted-foreground">{item.source}</span>
                        </div>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {relativeTime(item.at)}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="gap-3">
                <CardHeader className="flex-row items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <CardTitle>Certificate Transparency</CardTitle>
                    <CardDescription>Recently observed certificates</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" render={<Link href="/ct-monitor">CT Monitor</Link>} />
                </CardHeader>
                <CardContent className="flex flex-col">
                  {d.recentCtEvents.slice(0, 5).map((e, i) => (
                    <div key={e.id}>
                      {i > 0 && <Separator />}
                      <div className="flex items-center justify-between gap-2 py-2">
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate font-mono text-sm">{e.domain}</span>
                          <span className="truncate text-xs text-muted-foreground">{e.issuer}</span>
                        </div>
                        {e.matchedWatchlist ? (
                          <Pill tone="warning">Watchlist</Pill>
                        ) : (
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {relativeTime(e.timestamp)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>
          </div>
        )}
      </DataState>
    </div>
  )
}
