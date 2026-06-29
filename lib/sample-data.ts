/**
 * SAMPLE DEVELOPMENT DATA — for layout validation only.
 *
 * Every value below is clearly fabricated placeholder data. Replace these
 * adapters with real backend responses from the `/api/*` routes. The shapes
 * conform to `lib/types.ts`.
 */
import type {
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
} from "./types"

export const SAMPLE_NOTICE = "sample development data"

const now = Date.now()
const iso = (offsetMs: number) => new Date(now + offsetMs).toISOString()
const days = (n: number) => n * 24 * 60 * 60 * 1000
const hours = (n: number) => n * 60 * 60 * 1000

export const tenants: Tenant[] = [
  {
    id: "tnt_acme",
    name: "Acme Financial",
    slug: "acme-financial",
    industry: "Banking",
    environment: ["production", "staging"],
    region: "us-east-1",
    createdAt: iso(-days(220)),
    connectorsHealthy: 7,
    connectorsTotal: 10,
    assetCount: 18432,
    onboardingComplete: true,
  },
  {
    id: "tnt_globex",
    name: "Globex Health",
    slug: "globex-health",
    industry: "Healthcare",
    environment: ["production"],
    region: "eu-west-1",
    createdAt: iso(-days(90)),
    connectorsHealthy: 4,
    connectorsTotal: 9,
    assetCount: 6210,
    onboardingComplete: true,
  },
  {
    id: "tnt_initech",
    name: "Initech Cloud",
    slug: "initech-cloud",
    industry: "SaaS",
    environment: ["development"],
    region: "us-west-2",
    createdAt: iso(-days(8)),
    connectorsHealthy: 1,
    connectorsTotal: 6,
    assetCount: 0,
    onboardingComplete: false,
  },
]

export const connectors: Connector[] = [
  { id: "con_aws", tenantId: "tnt_acme", kind: "aws", name: "AWS Organization", status: "connected", lastCheckedAt: iso(-hours(1)), assetsDiscovered: 8421 },
  { id: "con_azure", tenantId: "tnt_acme", kind: "azure", name: "Azure Tenant", status: "connected", lastCheckedAt: iso(-hours(2)), assetsDiscovered: 3120 },
  { id: "con_gcp", tenantId: "tnt_acme", kind: "gcp", name: "GCP Projects", status: "error", lastCheckedAt: iso(-hours(6)), message: "Service account missing cloudasset.viewer", assetsDiscovered: 0 },
  { id: "con_k8s", tenantId: "tnt_acme", kind: "kubernetes", name: "EKS Clusters", status: "connected", lastCheckedAt: iso(-hours(1)), assetsDiscovered: 1840 },
  { id: "con_scm", tenantId: "tnt_acme", kind: "scm", name: "GitHub Enterprise", status: "validating", lastCheckedAt: iso(-hours(0.2)), assetsDiscovered: 0 },
  { id: "con_tls", tenantId: "tnt_acme", kind: "tls_discovery", name: "Domain TLS Discovery", status: "connected", lastCheckedAt: iso(-hours(3)), assetsDiscovered: 2204 },
  { id: "con_ct", tenantId: "tnt_acme", kind: "ct", name: "Certificate Transparency", status: "connected", lastCheckedAt: iso(-hours(0.1)), assetsDiscovered: 612 },
  { id: "con_pg", tenantId: "tnt_acme", kind: "postgres", name: "Inventory DB (PostgreSQL)", status: "connected", lastCheckedAt: iso(-hours(0.5)) },
  { id: "con_os", tenantId: "tnt_acme", kind: "opensearch", name: "OpenSearch", status: "not_connected", lastCheckedAt: null },
  { id: "con_neo", tenantId: "tnt_acme", kind: "neo4j", name: "Neo4j Trust Graph", status: "not_connected", lastCheckedAt: null },
]

export const discoveryJobs: DiscoveryJob[] = [
  { id: "job_001", source: "cloud", sourceTool: "AWS Config + Asset API", target: "aws:123456789012", schedule: "every 6h", lastRun: iso(-hours(1)), durationMs: 184000, findingsCount: 8421, status: "succeeded" },
  { id: "job_002", source: "tls", sourceTool: "tls-scanner", target: "*.acme.com", schedule: "daily", lastRun: iso(-hours(3)), durationMs: 92000, findingsCount: 2204, status: "succeeded" },
  { id: "job_003", source: "code", sourceTool: "semgrep-crypto", target: "github.com/acme", schedule: "on push", lastRun: iso(-hours(0.3)), durationMs: null, findingsCount: 0, status: "running", progress: 62 },
  { id: "job_004", source: "sbom", sourceTool: "syft", target: "ecr/acme/*", schedule: "every 12h", lastRun: iso(-hours(7)), durationMs: 41000, findingsCount: 318, status: "succeeded" },
  { id: "job_005", source: "secrets", sourceTool: "trufflehog", target: "github.com/acme", schedule: "daily", lastRun: iso(-hours(9)), durationMs: 60000, findingsCount: 12, status: "failed" },
  { id: "job_006", source: "ct", sourceTool: "ct-watcher", target: "acme.com watchlist", schedule: "streaming", lastRun: iso(-hours(0.05)), durationMs: null, findingsCount: 612, status: "running", progress: 100 },
  { id: "job_007", source: "cloud", sourceTool: "Azure Resource Graph", target: "azure:acme-prod", schedule: "every 6h", lastRun: null, durationMs: null, findingsCount: 0, status: "queued" },
]

export const jobLogs: JobLogLine[] = [
  { ts: iso(-hours(0.3)), level: "info", message: "Starting semgrep-crypto scan on github.com/acme (142 repos)" },
  { ts: iso(-hours(0.28)), level: "info", message: "Cloning repo acme/payments-api @ main" },
  { ts: iso(-hours(0.26)), level: "debug", message: "Rule pack crypto-weak-algorithms@2.4 loaded (38 rules)" },
  { ts: iso(-hours(0.22)), level: "warn", message: "acme/legacy-gateway: MD5 usage detected in src/hash.go:88" },
  { ts: iso(-hours(0.2)), level: "info", message: "Normalized 14 findings into inventory candidates" },
  { ts: iso(-hours(0.18)), level: "error", message: "acme/billing-svc: rate limited by SCM API, backing off 30s" },
  { ts: iso(-hours(0.1)), level: "info", message: "Scan 62% complete — 88 of 142 repos processed" },
]

const assetSeed: Partial<AssetRecord>[] = [
  { type: "endpoint", name: "api.acme.com", owner: "platform-team", environment: "production", location: "us-east-1", internetExposed: true, algorithm: "RSA", keySize: 2048, protocol: "TLS", protocolVersion: "1.2", cipherSuite: "ECDHE-RSA-AES128-GCM-SHA256", certificateIssuer: "DigiCert", validTo: iso(days(18)), cryptoLibrary: "OpenSSL", libraryVersion: "1.1.1w", pqcReady: "not_ready", riskScore: 82 },
  { type: "endpoint", name: "checkout.acme.com", owner: "payments-team", environment: "production", location: "us-east-1", internetExposed: true, algorithm: "ECDSA", keySize: 256, protocol: "TLS", protocolVersion: "1.3", cipherSuite: "TLS_AES_256_GCM_SHA384", certificateIssuer: "Let's Encrypt", validTo: iso(days(64)), cryptoLibrary: "OpenSSL", libraryVersion: "3.0.13", pqcReady: "partial", riskScore: 41 },
  { type: "certificate", name: "*.internal.acme.com", owner: "infra", environment: "production", location: "vault", internetExposed: false, algorithm: "RSA", keySize: 4096, protocol: null, protocolVersion: null, cipherSuite: null, certificateIssuer: "Acme Internal CA", validTo: iso(days(5)), cryptoLibrary: null, libraryVersion: null, pqcReady: "not_ready", riskScore: 73 },
  { type: "key", name: "kms/payments-signing", owner: "payments-team", environment: "production", location: "aws-kms us-east-1", internetExposed: false, algorithm: "ECC_NIST_P256", keySize: 256, protocol: null, protocolVersion: null, cipherSuite: null, certificateIssuer: null, validTo: null, cryptoLibrary: "AWS KMS", libraryVersion: null, pqcReady: "not_ready", riskScore: 55 },
  { type: "dependency", name: "bouncycastle 1.68", owner: "android-team", environment: "production", location: "github.com/acme/mobile", internetExposed: false, algorithm: "mixed", keySize: null, protocol: null, protocolVersion: null, cipherSuite: null, certificateIssuer: null, validTo: null, cryptoLibrary: "BouncyCastle", libraryVersion: "1.68", pqcReady: "not_ready", riskScore: 67 },
  { type: "kubernetes", name: "ingress-nginx (prod-eks)", owner: "platform-team", environment: "production", location: "eks/prod-east", internetExposed: true, algorithm: "RSA", keySize: 2048, protocol: "TLS", protocolVersion: "1.2", cipherSuite: "ECDHE-RSA-CHACHA20-POLY1305", certificateIssuer: "cert-manager", validTo: iso(days(31)), cryptoLibrary: "OpenSSL", libraryVersion: "3.0.11", pqcReady: "partial", riskScore: 48 },
  { type: "endpoint", name: "legacy-gw.acme.com", owner: "infra", environment: "staging", location: "us-east-1", internetExposed: true, algorithm: "RSA", keySize: 1024, protocol: "TLS", protocolVersion: "1.0", cipherSuite: "AES128-SHA", certificateIssuer: "Acme Internal CA", validTo: iso(days(-3)), cryptoLibrary: "OpenSSL", libraryVersion: "1.0.2u", pqcReady: "not_ready", riskScore: 96 },
  { type: "repo", name: "acme/crypto-utils", owner: "security-eng", environment: "development", location: "github.com/acme", internetExposed: false, algorithm: "mixed", keySize: null, protocol: null, protocolVersion: null, cipherSuite: null, certificateIssuer: null, validTo: null, cryptoLibrary: "libsodium", libraryVersion: "1.0.18", pqcReady: "ready", riskScore: 12 },
  { type: "container", name: "auth-svc:2024.11", owner: "identity-team", environment: "production", location: "ecr/acme/auth-svc", internetExposed: false, algorithm: "ML-KEM-768", keySize: null, protocol: "TLS", protocolVersion: "1.3", cipherSuite: "TLS_AES_256_GCM_SHA384", certificateIssuer: "cert-manager", validTo: iso(days(120)), cryptoLibrary: "oqs-provider", libraryVersion: "0.6.1", pqcReady: "ready", riskScore: 18 },
]

export const assets: AssetRecord[] = Array.from({ length: 48 }).map((_, i) => {
  const base = assetSeed[i % assetSeed.length]
  return {
    id: `ast_${(i + 1).toString().padStart(4, "0")}`,
    lastSeen: iso(-hours((i % 12) + 1)),
    ...base,
  } as AssetRecord
})

export const riskScores: RiskScore[] = assets
  .map((a) => ({
    assetId: a.id,
    assetName: a.name,
    assetType: a.type,
    environment: a.environment,
    internetExposed: a.internetExposed,
    totalScore: a.riskScore,
    band:
      a.riskScore >= 80
        ? ("critical" as const)
        : a.riskScore >= 60
          ? ("high" as const)
          : a.riskScore >= 35
            ? ("medium" as const)
            : ("low" as const),
    dimensions: [
      { key: "algorithm", label: "Algorithm risk", weight: 0.25, score: Math.min(100, a.riskScore + 4) },
      { key: "keysize", label: "Key size", weight: 0.15, score: a.keySize && a.keySize < 2048 ? 90 : 30 },
      { key: "exposure", label: "Internet exposure", weight: 0.2, score: a.internetExposed ? 85 : 20 },
      { key: "cert", label: "Certificate urgency", weight: 0.15, score: a.riskScore - 5 },
      { key: "compliance", label: "Compliance status", weight: 0.1, score: a.riskScore - 10 },
      { key: "criticality", label: "Business criticality", weight: 0.1, score: a.environment === "production" ? 80 : 40 },
      { key: "agility", label: "Crypto agility", weight: 0.05, score: a.pqcReady === "ready" ? 15 : 75 },
    ],
    rationale:
      a.pqcReady === "not_ready"
        ? "Quantum-vulnerable primitive on an internet-facing asset with limited crypto agility."
        : "Hybrid/PQ-capable asset; residual risk from supporting classical fallback.",
  }))
  .sort((a, b) => b.totalScore - a.totalScore)

export const complianceFindings: ComplianceFinding[] = [
  { id: "cf_1", framework: "iso27001", controlId: "A.10.1.1", controlName: "Policy on the use of cryptographic controls", status: "fail", assetsAffected: 124, severity: "high", policy: "RSA < 2048 prohibited", lastEvaluated: iso(-hours(2)) },
  { id: "cf_2", framework: "nist_csf", controlId: "PR.DS-2", controlName: "Data-in-transit is protected", status: "fail", assetsAffected: 42, severity: "critical", policy: "TLS 1.2 minimum", lastEvaluated: iso(-hours(2)) },
  { id: "cf_3", framework: "pci_dss", controlId: "4.2.1", controlName: "Strong cryptography for transmission", status: "exception", assetsAffected: 8, severity: "medium", policy: "TLS 1.3 preferred", lastEvaluated: iso(-hours(5)) },
  { id: "cf_4", framework: "soc2", controlId: "CC6.7", controlName: "Encryption of sensitive data", status: "pass", assetsAffected: 0, severity: "info", policy: "SHA-1 prohibited", lastEvaluated: iso(-hours(1)) },
  { id: "cf_5", framework: "custom_crypto", controlId: "CRYPTO-07", controlName: "Secrets must be vault-managed", status: "fail", assetsAffected: 19, severity: "high", policy: "Secrets must be vault-managed", lastEvaluated: iso(-hours(3)) },
  { id: "cf_6", framework: "nist_csf", controlId: "PR.DS-1", controlName: "Data-at-rest is protected", status: "pass", assetsAffected: 0, severity: "info", policy: "Certificate expiry threshold", lastEvaluated: iso(-hours(4)) },
]

export const policyCards: PolicyCard[] = [
  { id: "p1", name: "TLS 1.2 minimum", description: "Reject negotiation below TLS 1.2 on all listeners.", enabled: true, violations: 42 },
  { id: "p2", name: "TLS 1.3 preferred", description: "Prefer TLS 1.3 where supported by the peer.", enabled: true, violations: 318 },
  { id: "p3", name: "SHA-1 prohibited", description: "No SHA-1 in signatures or certificates.", enabled: true, violations: 7 },
  { id: "p4", name: "RSA < 2048 prohibited", description: "Disallow RSA keys smaller than 2048 bits.", enabled: true, violations: 124 },
  { id: "p5", name: "Certificate expiry threshold", description: "Alert on certificates expiring within 30 days.", enabled: true, violations: 36 },
  { id: "p6", name: "Secrets must be vault-managed", description: "Private keys and secrets must reside in a managed vault.", enabled: false, violations: 19 },
]

export const monitoringEvents: MonitoringEvent[] = [
  { id: "ev_1", type: "cert_expiry", severity: "critical", title: "Certificate expiring in 5 days", description: "*.internal.acme.com expires soon and is used by 12 services.", source: "cert-monitor", assetId: "ast_0003", createdAt: iso(-hours(0.2)), status: "open" },
  { id: "ev_2", type: "drift", severity: "high", title: "TLS downgrade detected", description: "legacy-gw.acme.com began negotiating TLS 1.0.", source: "tls-monitor", assetId: "ast_0007", createdAt: iso(-hours(1)), status: "acknowledged", assignee: "j.rivera" },
  { id: "ev_3", type: "new_asset", severity: "medium", title: "New internet-facing endpoint", description: "promo.acme.com discovered via CT logs.", source: "ct-watcher", createdAt: iso(-hours(2)), status: "open" },
  { id: "ev_4", type: "failed_job", severity: "medium", title: "Discovery job failed", description: "trufflehog secrets scan failed (auth error).", source: "scheduler", createdAt: iso(-hours(9)), status: "assigned", assignee: "s.okafor" },
  { id: "ev_5", type: "benchmark_anomaly", severity: "low", title: "Benchmark latency regression", description: "ML-DSA-65 sign latency +18% vs baseline on bench-node-2.", source: "pq-lab", createdAt: iso(-hours(12)), status: "open" },
  { id: "ev_6", type: "policy_violation", severity: "high", title: "Weak cipher in production", description: "api.acme.com offers AES128-SHA cipher suite.", source: "policy-engine", assetId: "ast_0001", createdAt: iso(-hours(3)), status: "open" },
]

export const ctEvents: CTEvent[] = Array.from({ length: 24 }).map((_, i) => {
  const issuers = ["Let's Encrypt", "DigiCert", "Sectigo", "GlobalSign", "Unknown CA"]
  const domains = ["acme.com", "login.acme.com", "promo-acme.com", "acme-secure.net", "billing.acme.com"]
  const suspicious = i % 5 === 0
  return {
    id: `ct_${i + 1}`,
    timestamp: iso(-i * 60 * 1000),
    domain: domains[i % domains.length],
    issuer: issuers[i % issuers.length],
    notBefore: iso(-days(1)),
    notAfter: iso(days(89)),
    matchedWatchlist: suspicious ? "*.acme.com" : null,
    riskReason: suspicious ? "Look-alike domain issued by unmonitored CA" : null,
    severity: suspicious ? "high" : "info",
    rawCertUrl: "#",
  }
})

export const watchlist: WatchlistEntry[] = [
  { id: "w1", pattern: "*.acme.com", matches24h: 14, createdAt: iso(-days(120)) },
  { id: "w2", pattern: "acme-*.com", matches24h: 3, createdAt: iso(-days(40)) },
  { id: "w3", pattern: "*acme*.net", matches24h: 1, createdAt: iso(-days(12)) },
]

export const benchmarkJobs: PQBenchmarkJob[] = [
  { id: "bj_1", algorithm: "ML-KEM-768", operation: "encapsulate", target: "bench-node-1", iterations: 100000, status: "running", submittedAt: iso(-hours(0.1)), provider: "oqs-provider 0.6.1" },
  { id: "bj_2", algorithm: "ML-DSA-65", operation: "sign", target: "bench-node-2", iterations: 50000, status: "queued", submittedAt: iso(-hours(0.05)), provider: "oqs-provider 0.6.1" },
  { id: "bj_3", algorithm: "Falcon-512", operation: "verify", target: "bench-node-1", iterations: 50000, status: "succeeded", submittedAt: iso(-hours(2)), provider: "liboqs 0.10.1" },
]

export const benchmarkResults: PQBenchmarkResult[] = [
  { id: "br_1", algorithm: "ML-KEM-512", family: "kem", keygenMs: 0.021, encapsulateMs: 0.028, decapsulateMs: 0.031, signMs: null, verifyMs: null, publicKeyBytes: 800, privateKeyBytes: 1632, ciphertextBytes: 768, signatureBytes: null, measuredAt: iso(-hours(2)) },
  { id: "br_2", algorithm: "ML-KEM-768", family: "kem", keygenMs: 0.034, encapsulateMs: 0.041, decapsulateMs: 0.046, signMs: null, verifyMs: null, publicKeyBytes: 1184, privateKeyBytes: 2400, ciphertextBytes: 1088, signatureBytes: null, measuredAt: iso(-hours(2)) },
  { id: "br_3", algorithm: "ML-KEM-1024", family: "kem", keygenMs: 0.049, encapsulateMs: 0.058, decapsulateMs: 0.063, signMs: null, verifyMs: null, publicKeyBytes: 1568, privateKeyBytes: 3168, ciphertextBytes: 1568, signatureBytes: null, measuredAt: iso(-hours(2)) },
  { id: "br_4", algorithm: "X25519", family: "classical", keygenMs: 0.015, encapsulateMs: 0.019, decapsulateMs: 0.019, signMs: null, verifyMs: null, publicKeyBytes: 32, privateKeyBytes: 32, ciphertextBytes: 32, signatureBytes: null, measuredAt: iso(-hours(2)) },
  { id: "br_5", algorithm: "ML-DSA-44", family: "signature", keygenMs: 0.052, encapsulateMs: null, decapsulateMs: null, signMs: 0.18, verifyMs: 0.06, publicKeyBytes: 1312, privateKeyBytes: 2560, ciphertextBytes: null, signatureBytes: 2420, measuredAt: iso(-hours(2)) },
  { id: "br_6", algorithm: "ML-DSA-65", family: "signature", keygenMs: 0.083, encapsulateMs: null, decapsulateMs: null, signMs: 0.27, verifyMs: 0.09, publicKeyBytes: 1952, privateKeyBytes: 4032, ciphertextBytes: null, signatureBytes: 3309, measuredAt: iso(-hours(2)) },
  { id: "br_7", algorithm: "Falcon-512", family: "signature", keygenMs: 8.4, encapsulateMs: null, decapsulateMs: null, signMs: 0.39, verifyMs: 0.05, publicKeyBytes: 897, privateKeyBytes: 1281, ciphertextBytes: null, signatureBytes: 690, measuredAt: iso(-hours(2)) },
  { id: "br_8", algorithm: "SPHINCS+-SHA2-128f", family: "signature", keygenMs: 0.9, encapsulateMs: null, decapsulateMs: null, signMs: 21.4, verifyMs: 1.2, publicKeyBytes: 32, privateKeyBytes: 64, ciphertextBytes: null, signatureBytes: 17088, measuredAt: iso(-hours(2)) },
  { id: "br_9", algorithm: "ECDSA-P256", family: "classical", keygenMs: 0.03, encapsulateMs: null, decapsulateMs: null, signMs: 0.04, verifyMs: 0.08, publicKeyBytes: 64, privateKeyBytes: 32, ciphertextBytes: null, signatureBytes: 72, measuredAt: iso(-hours(2)) },
]

export const providers: ProviderInfo[] = [
  { name: "OpenSSL", version: "3.3.1", status: "healthy", algorithms: ["X25519", "ECDSA-P256", "RSA-2048", "TLS_AES_256_GCM_SHA384"] },
  { name: "oqs-provider", version: "0.6.1", status: "healthy", algorithms: ["ML-KEM-512", "ML-KEM-768", "ML-KEM-1024", "ML-DSA-44", "ML-DSA-65", "ML-DSA-87"] },
  { name: "liboqs", version: "0.10.1", status: "healthy", algorithms: ["Falcon-512", "Falcon-1024", "SPHINCS+-SHA2-128f", "SLH-DSA-SHA2-128s"] },
]

export const trustGraph: TrustGraph = {
  nodes: [
    { id: "n_app", type: "application", label: "payments-api", riskBand: "high", pqcReady: "not_ready", metadata: { owner: "payments-team", env: "production" } },
    { id: "n_ep", type: "endpoint", label: "api.acme.com", riskBand: "critical", pqcReady: "not_ready", metadata: { exposure: "internet", tls: "1.2" } },
    { id: "n_cert", type: "certificate", label: "*.acme.com", riskBand: "high", pqcReady: "not_ready", metadata: { algorithm: "RSA-2048", expires: "18d" } },
    { id: "n_issuer", type: "issuer", label: "DigiCert", riskBand: "low", pqcReady: "partial", metadata: { type: "public CA" } },
    { id: "n_repo", type: "repository", label: "acme/payments-api", riskBand: "medium", pqcReady: "partial", metadata: { lang: "Go" } },
    { id: "n_dep", type: "dependency", label: "bouncycastle 1.68", riskBand: "high", pqcReady: "not_ready", metadata: { ecosystem: "maven" } },
    { id: "n_kms", type: "kms_key", label: "kms/payments-signing", riskBand: "medium", pqcReady: "not_ready", metadata: { spec: "ECC_NIST_P256" } },
    { id: "n_cluster", type: "cluster", label: "prod-eks", riskBand: "medium", pqcReady: "partial", metadata: { region: "us-east-1" } },
    { id: "n_ns", type: "namespace", label: "payments", riskBand: "medium", pqcReady: "partial", metadata: { cluster: "prod-eks" } },
    { id: "n_wl", type: "workload", label: "payments-api-deploy", riskBand: "high", pqcReady: "not_ready", metadata: { replicas: "6" } },
  ],
  edges: [
    { id: "e1", source: "n_ep", target: "n_app", type: "exposes" },
    { id: "e2", source: "n_ep", target: "n_cert", type: "uses" },
    { id: "e3", source: "n_cert", target: "n_issuer", type: "signed_by" },
    { id: "e4", source: "n_app", target: "n_repo", type: "depends_on" },
    { id: "e5", source: "n_repo", target: "n_dep", type: "depends_on" },
    { id: "e6", source: "n_app", target: "n_kms", type: "managed_by" },
    { id: "e7", source: "n_wl", target: "n_ns", type: "deployed_in" },
    { id: "e8", source: "n_ns", target: "n_cluster", type: "deployed_in" },
    { id: "e9", source: "n_app", target: "n_wl", type: "uses" },
  ],
}

export const remediationTasks: RemediationTask[] = [
  { id: "rt_1", title: "Renew *.internal.acme.com certificate", category: "renew_certificate", severity: "critical", state: "assigned", owner: "j.rivera", slaDueAt: iso(days(2)), changeWindow: "Sat 02:00 UTC", linkedAssets: ["ast_0003"], linkedPolicies: ["Certificate expiry threshold"], description: "Certificate expires in 5 days; used by 12 internal services.", createdAt: iso(-hours(6)) },
  { id: "rt_2", title: "Disable TLS 1.0/1.1 on legacy-gw", category: "disable_deprecated_tls", severity: "high", state: "awaiting_approval", owner: "s.okafor", slaDueAt: iso(days(5)), changeWindow: "Wed 03:00 UTC", linkedAssets: ["ast_0007"], linkedPolicies: ["TLS 1.2 minimum"], description: "Enforce TLS 1.2 minimum on the legacy gateway listener.", createdAt: iso(-days(1)) },
  { id: "rt_3", title: "Replace BouncyCastle 1.68", category: "replace_weak_library", severity: "high", state: "open", owner: null, slaDueAt: iso(days(14)), changeWindow: null, linkedAssets: ["ast_0005"], linkedPolicies: ["SHA-1 prohibited"], description: "Upgrade to a maintained crypto provider with PQC support.", createdAt: iso(-days(2)) },
  { id: "rt_4", title: "Pilot hybrid ML-KEM on checkout", category: "hybrid_pq_pilot", severity: "medium", state: "in_progress", owner: "a.chen", slaDueAt: iso(days(30)), changeWindow: "rolling", linkedAssets: ["ast_0002"], linkedPolicies: ["TLS 1.3 preferred"], description: "Enable X25519+ML-KEM-768 hybrid handshake behind a flag.", createdAt: iso(-days(4)) },
  { id: "rt_5", title: "Move signing key to vault", category: "move_secret_to_vault", severity: "high", state: "open", owner: null, slaDueAt: iso(days(10)), changeWindow: null, linkedAssets: ["ast_0004"], linkedPolicies: ["Secrets must be vault-managed"], description: "Migrate file-based signing key into managed KMS/Vault.", createdAt: iso(-days(1)) },
]

export const migrationPlans: MigrationPlan[] = [
  { id: "mp_1", assetName: "api.acme.com", businessService: "Core API", criticality: "tier-1", currentAlgorithm: "RSA-2048 / TLS 1.2", targetAlgorithm: "Hybrid X25519+ML-KEM-768 / TLS 1.3", stage: "hybrid_pilot", blockers: ["Client compat testing"], dependencies: ["oqs-provider rollout"], owner: "platform-team", targetDate: iso(days(60)), progress: 45 },
  { id: "mp_2", assetName: "checkout.acme.com", businessService: "Payments", criticality: "tier-1", currentAlgorithm: "ECDSA-P256 / TLS 1.3", targetAlgorithm: "ML-DSA-65 + hybrid KEM", stage: "pq_ready_validation", blockers: [], dependencies: ["PCI re-attestation"], owner: "payments-team", targetDate: iso(days(45)), progress: 70 },
  { id: "mp_3", assetName: "legacy-gw.acme.com", businessService: "Edge Gateway", criticality: "tier-2", currentAlgorithm: "RSA-1024 / TLS 1.0", targetAlgorithm: "RSA-3072 → hybrid", stage: "current_state", blockers: ["EOL hardware", "Vendor support"], dependencies: ["Gateway replacement"], owner: "infra", targetDate: iso(days(120)), progress: 5 },
  { id: "mp_4", assetName: "auth-svc", businessService: "Identity", criticality: "tier-1", currentAlgorithm: "ML-KEM-768 / TLS 1.3", targetAlgorithm: "ML-KEM-768 + ML-DSA-65", stage: "production_rollout", blockers: [], dependencies: [], owner: "identity-team", targetDate: iso(days(20)), progress: 90 },
]

export function buildOverview(): OverviewData {
  return {
    kpis: {
      totalCryptoAssets: 18432,
      internetFacingAssets: 2204,
      expiringCertificates: 36,
      deprecatedAlgorithms: 173,
      pqReadyAssets: 1408,
      openRemediationTasks: remediationTasks.filter((t) => t.state !== "done").length,
      activeAlerts: monitoringEvents.filter((e) => e.status === "open").length,
      connectorsHealthy: 7,
      connectorsTotal: 10,
    },
    assetGrowth: Array.from({ length: 12 }).map((_, i) => ({
      date: new Date(now - days((11 - i) * 30)).toLocaleDateString("en-US", { month: "short" }),
      assets: 9000 + i * 850 + (i % 3) * 200,
      pqReady: 120 + i * 110,
    })),
    riskDistribution: [
      { key: "critical", name: "Critical", value: 184 },
      { key: "high", name: "High", value: 612 },
      { key: "medium", name: "Medium", value: 1980 },
      { key: "low", name: "Low", value: 15656 },
    ],
    certExpiryBuckets: [
      { key: "7d", name: "≤ 7 days", value: 9 },
      { key: "30d", name: "8–30 days", value: 27 },
      { key: "90d", name: "31–90 days", value: 142 },
      { key: "90plus", name: "90+ days", value: 2026 },
    ],
    findingsBySource: [
      { key: "cloud", name: "Cloud", value: 8421 },
      { key: "tls", name: "TLS", value: 2204 },
      { key: "sbom", name: "SBOM", value: 318 },
      { key: "code", name: "Code", value: 142 },
      { key: "ct", name: "CT", value: 612 },
      { key: "secrets", name: "Secrets", value: 12 },
    ],
    recentDiscoveries: assets.slice(0, 6).map((a) => ({ id: a.id, name: a.name, source: a.type, at: a.lastSeen })),
    recentCtEvents: ctEvents.slice(0, 5),
    topRiskyAssets: riskScores.slice(0, 5),
    activeBenchmarkJobs: benchmarkJobs.filter((j) => j.status !== "succeeded"),
    complianceDrift: [
      { framework: "ISO 27001", drift: 4, controls: 114 },
      { framework: "NIST CSF", drift: 6, controls: 108 },
      { framework: "PCI DSS", drift: 2, controls: 78 },
      { framework: "SOC 2", drift: 1, controls: 64 },
    ],
  }
}
