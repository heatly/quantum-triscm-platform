/**
 * Quantum TRiSCM — domain model.
 *
 * These interfaces describe the shape of data the UI expects from the backend.
 * Mock adapters in `lib/api` currently satisfy them with clearly labelled
 * "sample development data" and can be swapped for real `/api/*` responses.
 */

export type Severity = "critical" | "high" | "medium" | "low" | "info"
export type HealthStatus = "healthy" | "degraded" | "down" | "unknown"
export type EnvironmentName = "production" | "staging" | "development" | "all"

/* ----------------------------------- Tenant ---------------------------------- */

export type ConnectorStatus =
  | "not_connected"
  | "validating"
  | "connected"
  | "error"

export type ConnectorKind =
  | "aws"
  | "azure"
  | "gcp"
  | "kubernetes"
  | "scm"
  | "tls_discovery"
  | "ct"
  | "postgres"
  | "opensearch"
  | "neo4j"

export interface Connector {
  id: string
  tenantId: string
  kind: ConnectorKind
  name: string
  status: ConnectorStatus
  lastCheckedAt: string | null
  message?: string
  assetsDiscovered?: number
}

export interface Tenant {
  id: string
  name: string
  slug: string
  industry: string
  environment: EnvironmentName[]
  region: string
  createdAt: string
  connectorsHealthy: number
  connectorsTotal: number
  assetCount: number
  onboardingComplete: boolean
}

/* --------------------------------- Discovery --------------------------------- */

export type DiscoverySource =
  | "cloud"
  | "tls"
  | "code"
  | "sbom"
  | "secrets"
  | "ct"

export type JobStatus =
  | "queued"
  | "running"
  | "succeeded"
  | "failed"
  | "cancelled"

export interface DiscoveryJob {
  id: string
  source: DiscoverySource
  sourceTool: string
  target: string
  schedule: string
  lastRun: string | null
  durationMs: number | null
  findingsCount: number
  status: JobStatus
  progress?: number
}

export interface JobLogLine {
  ts: string
  level: "info" | "warn" | "error" | "debug"
  message: string
}

/* --------------------------------- Inventory --------------------------------- */

export type AssetType =
  | "endpoint"
  | "certificate"
  | "key"
  | "kms"
  | "repo"
  | "dependency"
  | "container"
  | "kubernetes"

export type PqcReadiness = "ready" | "partial" | "not_ready" | "unknown"

export interface AssetRecord {
  id: string
  type: AssetType
  name: string
  owner: string
  environment: Exclude<EnvironmentName, "all">
  location: string
  internetExposed: boolean
  algorithm: string
  keySize: number | null
  protocol: string | null
  protocolVersion: string | null
  cipherSuite: string | null
  certificateIssuer: string | null
  validTo: string | null
  cryptoLibrary: string | null
  libraryVersion: string | null
  pqcReady: PqcReadiness
  riskScore: number
  lastSeen: string
}

export interface CertificateRecord {
  id: string
  commonName: string
  issuer: string
  serialNumber: string
  signatureAlgorithm: string
  keyAlgorithm: string
  keySize: number
  notBefore: string
  notAfter: string
  sans: string[]
  internetExposed: boolean
  status: "valid" | "expiring" | "expired" | "revoked"
}

/* ------------------------------------ Risk ----------------------------------- */

export interface RiskDimension {
  key: string
  label: string
  weight: number
  score: number
}

export interface RiskScore {
  assetId: string
  assetName: string
  assetType: AssetType
  environment: Exclude<EnvironmentName, "all">
  internetExposed: boolean
  totalScore: number
  band: "critical" | "high" | "medium" | "low"
  dimensions: RiskDimension[]
  rationale: string
}

/* --------------------------------- Compliance -------------------------------- */

export type ComplianceFramework =
  | "iso27001"
  | "nist_csf"
  | "pci_dss"
  | "soc2"
  | "custom_crypto"

export type ControlStatus = "pass" | "fail" | "exception" | "not_assessed"

export interface ComplianceFinding {
  id: string
  framework: ComplianceFramework
  controlId: string
  controlName: string
  status: ControlStatus
  assetsAffected: number
  severity: Severity
  policy: string
  lastEvaluated: string
}

export interface PolicyCard {
  id: string
  name: string
  description: string
  enabled: boolean
  violations: number
}

/* --------------------------------- Monitoring -------------------------------- */

export type MonitoringEventType =
  | "drift"
  | "cert_expiry"
  | "new_asset"
  | "failed_job"
  | "benchmark_anomaly"
  | "policy_violation"

export type AckStatus = "open" | "acknowledged" | "assigned" | "resolved"

export interface MonitoringEvent {
  id: string
  type: MonitoringEventType
  severity: Severity
  title: string
  description: string
  source: string
  assetId?: string
  createdAt: string
  status: AckStatus
  assignee?: string
}

/* -------------------------- Certificate Transparency ------------------------- */

export interface CTEvent {
  id: string
  timestamp: string
  domain: string
  issuer: string
  notBefore: string
  notAfter: string
  matchedWatchlist: string | null
  riskReason: string | null
  severity: Severity
  rawCertUrl: string
}

export interface WatchlistEntry {
  id: string
  pattern: string
  matches24h: number
  createdAt: string
}

/* ------------------------------------ PQ Lab --------------------------------- */

export type PqAlgorithm =
  | "ML-KEM-512"
  | "ML-KEM-768"
  | "ML-KEM-1024"
  | "ML-DSA-44"
  | "ML-DSA-65"
  | "ML-DSA-87"
  | "Falcon-512"
  | "Falcon-1024"
  | "SPHINCS+-SHA2-128f"
  | "SLH-DSA-SHA2-128s"
  | "X25519"
  | "RSA-2048"
  | "ECDSA-P256"

export type PqOperation =
  | "keygen"
  | "encapsulate"
  | "decapsulate"
  | "sign"
  | "verify"
  | "handshake"

export interface PQBenchmarkJob {
  id: string
  algorithm: PqAlgorithm
  operation: PqOperation
  target: string
  iterations: number
  status: JobStatus
  submittedAt: string
  provider: string
}

export interface PQBenchmarkResult {
  id: string
  algorithm: PqAlgorithm
  family: "kem" | "signature" | "classical"
  keygenMs: number | null
  encapsulateMs: number | null
  decapsulateMs: number | null
  signMs: number | null
  verifyMs: number | null
  publicKeyBytes: number
  privateKeyBytes: number
  ciphertextBytes: number | null
  signatureBytes: number | null
  measuredAt: string
}

export interface ProviderInfo {
  name: string
  version: string
  status: HealthStatus
  algorithms: string[]
}

/* --------------------------------- Trust Graph ------------------------------- */

export type GraphNodeType =
  | "endpoint"
  | "certificate"
  | "issuer"
  | "application"
  | "repository"
  | "dependency"
  | "kms_key"
  | "cluster"
  | "namespace"
  | "workload"

export type GraphEdgeType =
  | "uses"
  | "signed_by"
  | "deployed_in"
  | "depends_on"
  | "exposes"
  | "managed_by"

export interface GraphNode {
  id: string
  type: GraphNodeType
  label: string
  riskBand: "critical" | "high" | "medium" | "low"
  pqcReady: PqcReadiness
  metadata: Record<string, string>
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  type: GraphEdgeType
}

export interface TrustGraph {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

/* -------------------------------- Remediation -------------------------------- */

export type RemediationCategory =
  | "renew_certificate"
  | "rotate_key"
  | "replace_weak_library"
  | "disable_deprecated_tls"
  | "move_secret_to_vault"
  | "hybrid_pq_pilot"
  | "policy_exception_review"

export type RemediationState =
  | "open"
  | "assigned"
  | "in_progress"
  | "awaiting_approval"
  | "approved"
  | "rejected"
  | "deferred"
  | "done"

export interface RemediationTask {
  id: string
  title: string
  category: RemediationCategory
  severity: Severity
  state: RemediationState
  owner: string | null
  slaDueAt: string
  changeWindow: string | null
  linkedAssets: string[]
  linkedPolicies: string[]
  description: string
  createdAt: string
}

/* ------------------------------- Migration Planner --------------------------- */

export type MigrationStage =
  | "current_state"
  | "discovery_complete"
  | "hybrid_pilot"
  | "pq_ready_validation"
  | "production_rollout"
  | "legacy_deprecation"

export interface MigrationPlan {
  id: string
  assetName: string
  businessService: string
  criticality: "tier-1" | "tier-2" | "tier-3"
  currentAlgorithm: string
  targetAlgorithm: string
  stage: MigrationStage
  blockers: string[]
  dependencies: string[]
  owner: string
  targetDate: string
  progress: number
}

/* --------------------------------- Overview ---------------------------------- */

export interface OverviewKpis {
  totalCryptoAssets: number
  internetFacingAssets: number
  expiringCertificates: number
  deprecatedAlgorithms: number
  pqReadyAssets: number
  openRemediationTasks: number
  activeAlerts: number
  connectorsHealthy: number
  connectorsTotal: number
}

export interface TimeSeriesPoint {
  date: string
  value: number
}

export interface DistributionPoint {
  name: string
  value: number
  key: string
}

export interface OverviewData {
  kpis: OverviewKpis
  assetGrowth: { date: string; assets: number; pqReady: number }[]
  riskDistribution: DistributionPoint[]
  certExpiryBuckets: DistributionPoint[]
  findingsBySource: DistributionPoint[]
  recentDiscoveries: { id: string; name: string; source: string; at: string }[]
  recentCtEvents: CTEvent[]
  topRiskyAssets: RiskScore[]
  activeBenchmarkJobs: PQBenchmarkJob[]
  complianceDrift: { framework: string; drift: number; controls: number }[]
}

/* ------------------------------- API envelope -------------------------------- */

export interface ApiResult<T> {
  data: T
  meta?: {
    total?: number
    sample?: boolean
  }
}
