'use client'

import { useMigration } from '@/lib/api/client'
import { PageHeader } from '@/components/shared/page-header'
import { DataState } from '@/components/shared/data-state'
import { Pill } from '@/components/shared/status-badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { TriangleAlert, ArrowRight } from 'lucide-react'
import { formatNumber, formatDate, titleCase } from '@/lib/format'
import type { MigrationPlan, MigrationStage } from '@/lib/types'

type Tone = 'critical' | 'warning' | 'success' | 'info' | 'neutral' | 'accent'

const STAGE_ORDER: MigrationStage[] = [
  'current_state',
  'discovery_complete',
  'hybrid_pilot',
  'pq_ready_validation',
  'production_rollout',
  'legacy_deprecation',
]

const criticalityTone: Record<MigrationPlan['criticality'], Tone> = {
  'tier-1': 'critical',
  'tier-2': 'warning',
  'tier-3': 'neutral',
}

function StageBadge({ stage }: { stage: MigrationStage }) {
  const idx = STAGE_ORDER.indexOf(stage)
  const tone: Tone = stage === 'legacy_deprecation' ? 'success' : idx >= 3 ? 'info' : 'neutral'
  return <Pill tone={tone}>{titleCase(stage)}</Pill>
}

export default function MigrationPage() {
  const { data, isLoading, error, refresh } = useMigration()

  return (
    <>
      <PageHeader
        title="PQC Migration Planner"
        description="Plan and track the migration from classical to post-quantum cryptography"
      />

      <DataState
        isLoading={isLoading}
        error={error}
        data={data}
        onRetry={refresh}
        isEmpty={(d) => d.length === 0}
      >
        {(plans) => {
          const inProgress = plans.filter(
            (p) => p.stage !== 'current_state' && p.stage !== 'legacy_deprecation'
          )
          const blocked = plans.filter((p) => p.blockers.length > 0)
          const completed = plans.filter((p) => p.stage === 'legacy_deprecation' || p.progress >= 100)

          const stats = {
            total: plans.length,
            inProgress: inProgress.length,
            blocked: blocked.length,
            completed: completed.length,
          }

          const renderCard = (plan: MigrationPlan) => (
            <Sheet key={plan.id}>
              <SheetTrigger
                render={
                  <div className="cursor-pointer rounded-lg border border-border p-4 transition-colors hover:bg-accent">
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div className="flex min-w-0 flex-col">
                        <p className="truncate font-semibold">{plan.assetName}</p>
                        <p className="truncate text-sm text-muted-foreground">{plan.businessService}</p>
                      </div>
                      {plan.blockers.length > 0 && (
                        <Badge variant="destructive" className="flex shrink-0 items-center gap-1">
                          <TriangleAlert className="size-3" />
                          {plan.blockers.length} blocker{plan.blockers.length > 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                    <div className="mb-3 flex items-center gap-2 text-xs">
                      <span className="font-mono">{plan.currentAlgorithm}</span>
                      <ArrowRight className="size-3 text-muted-foreground" />
                      <span className="font-mono text-primary">{plan.targetAlgorithm}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="mb-1 flex justify-between text-xs">
                          <span className="font-medium">Progress</span>
                          <span className="tabular-nums text-muted-foreground">{plan.progress}%</span>
                        </div>
                        <Progress value={plan.progress} className="h-2" />
                      </div>
                      <StageBadge stage={plan.stage} />
                    </div>
                  </div>
                }
              />
              <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle>{plan.assetName}</SheetTitle>
                </SheetHeader>
                <ScrollArea className="mt-4 h-[calc(100vh-120px)]">
                  <div className="flex flex-col gap-4 pr-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium text-muted-foreground">Stage</p>
                      <StageBadge stage={plan.stage} />
                    </div>
                    <Separator />
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium text-muted-foreground">Criticality</p>
                      <Pill tone={criticalityTone[plan.criticality]}>{plan.criticality.toUpperCase()}</Pill>
                    </div>
                    <Separator />
                    <Detail label="Business Service" value={plan.businessService} />
                    <Separator />
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium text-muted-foreground">Algorithm Migration</p>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-mono">{plan.currentAlgorithm}</span>
                        <ArrowRight className="size-3.5 text-muted-foreground" />
                        <span className="font-mono text-primary">{plan.targetAlgorithm}</span>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground">Progress</p>
                        <span className="tabular-nums text-sm">{plan.progress}%</span>
                      </div>
                      <Progress value={plan.progress} className="h-2" />
                    </div>
                    <Separator />
                    <Detail label="Owner" value={plan.owner} />
                    <Separator />
                    <Detail label="Target Date" value={formatDate(plan.targetDate)} />
                    {plan.blockers.length > 0 && (
                      <>
                        <Separator />
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-medium text-muted-foreground">Blockers</p>
                          <ul className="flex flex-col gap-1">
                            {plan.blockers.map((b) => (
                              <li key={b} className="flex items-center gap-2 text-sm">
                                <TriangleAlert className="size-3.5 text-destructive" />
                                {b}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}
                    {plan.dependencies.length > 0 && (
                      <>
                        <Separator />
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-medium text-muted-foreground">Dependencies</p>
                          <div className="flex flex-wrap gap-1.5">
                            {plan.dependencies.map((d) => (
                              <Badge key={d} variant="secondary" className="text-xs">
                                {d}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          )

          return (
            <div className="flex flex-col gap-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Total Plans" value={stats.total} />
                <StatCard label="In Progress" value={stats.inProgress} hint="Active migrations" tone="text-info" />
                <StatCard label="Blocked" value={stats.blocked} hint="Need attention" tone="text-destructive" />
                <StatCard label="Completed" value={stats.completed} hint="PQ ready" tone="text-emerald-500" />
              </div>

              <Tabs defaultValue="in-progress" className="w-full">
                <TabsList>
                  <TabsTrigger value="in-progress">In Progress ({inProgress.length})</TabsTrigger>
                  <TabsTrigger value="blocked">Blocked ({blocked.length})</TabsTrigger>
                  <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
                  <TabsTrigger value="all">All ({plans.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="in-progress">
                  <Card>
                    <CardHeader>
                      <CardTitle>Active Migrations</CardTitle>
                      <CardDescription>Plans currently moving toward post-quantum readiness</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                      {inProgress.length ? (
                        inProgress.map(renderCard)
                      ) : (
                        <p className="py-8 text-center text-sm text-muted-foreground">No active migrations</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="blocked">
                  <Card>
                    <CardHeader>
                      <CardTitle>Blocked Migrations</CardTitle>
                      <CardDescription>Plans with unresolved blockers</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                      {blocked.length ? (
                        blocked.map(renderCard)
                      ) : (
                        <p className="py-8 text-center text-sm text-muted-foreground">No blocked migrations</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="completed">
                  <Card>
                    <CardHeader>
                      <CardTitle>Completed Migrations</CardTitle>
                      <CardDescription>Assets that reached post-quantum readiness</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                      {completed.length ? (
                        completed.map(renderCard)
                      ) : (
                        <p className="py-8 text-center text-sm text-muted-foreground">No completed migrations</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="all">
                  <Card>
                    <CardContent className="flex flex-col gap-4 pt-4">
                      {plans.map(renderCard)}
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

function StatCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string
  value: number
  hint?: string
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
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  )
}
