"use client"

import useSWR, { type SWRConfiguration } from "swr"
import type {
  ApiResult,
  AssetRecord,
  CTEvent,
  ComplianceFinding,
  Connector,
  DiscoveryJob,
  JobLogLine,
  MigrationPlan,
  MonitoringEvent,
  OverviewData,
  PQBenchmarkJob,
  PQBenchmarkResult,
  PolicyCard,
  ProviderInfo,
  RemediationTask,
  RiskScore,
  Tenant,
  TrustGraph,
  WatchlistEntry,
} from "@/lib/types"

/**
 * Typed API adapters. Each hook hits a `/api/*` route handler that currently
 * serves sample development data. Swap the handlers for real services without
 * touching the UI — the hook signatures and return types stay the same.
 */
async function fetcher<T>(url: string): Promise<ApiResult<T>> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Request failed (${res.status}) for ${url}`)
  }
  return res.json() as Promise<ApiResult<T>>
}

type State<T> = {
  data: T | undefined
  isLoading: boolean
  isSample: boolean
  error: Error | undefined
  refresh: () => void
}

function useApi<T>(key: string, config?: SWRConfiguration): State<T> {
  const { data, error, isLoading, mutate } = useSWR<ApiResult<T>>(
    key,
    fetcher<T>,
    { revalidateOnFocus: false, ...config }
  )
  return {
    data: data?.data,
    isSample: Boolean(data?.meta?.sample),
    isLoading,
    error: error as Error | undefined,
    refresh: () => void mutate(),
  }
}

export const useOverview = () => useApi<OverviewData>("/api/overview")
export const useTenants = () => useApi<Tenant[]>("/api/tenants")
export const useConnectors = () => useApi<Connector[]>("/api/connectors")
export const useDiscovery = () =>
  useApi<{ jobs: DiscoveryJob[]; logs: JobLogLine[] }>("/api/discovery/jobs", {
    refreshInterval: 5000,
  })
export const useInventory = () => useApi<AssetRecord[]>("/api/inventory/assets")
export const useRiskScores = () => useApi<RiskScore[]>("/api/risk/scores")
export const useCompliance = () =>
  useApi<{ findings: ComplianceFinding[]; policies: PolicyCard[] }>(
    "/api/compliance/findings"
  )
export const useMonitoring = () =>
  useApi<MonitoringEvent[]>("/api/monitoring/events", { refreshInterval: 8000 })
export const useCtEvents = () =>
  useApi<{ events: CTEvent[]; watchlist: WatchlistEntry[] }>("/api/ct/events", {
    refreshInterval: 6000,
  })
export const usePqLab = () =>
  useApi<{
    jobs: PQBenchmarkJob[]
    results: PQBenchmarkResult[]
    providers: ProviderInfo[]
  }>("/api/pqlab/benchmarks")
export const useGraph = () => useApi<TrustGraph>("/api/graph")
export const useRemediation = () =>
  useApi<RemediationTask[]>("/api/remediation/tasks")
export const useMigration = () => useApi<MigrationPlan[]>("/api/migration/plans")
