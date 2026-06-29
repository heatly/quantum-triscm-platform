import { ok } from "@/lib/api/respond"
import { benchmarkJobs, benchmarkResults, providers } from "@/lib/sample-data"

export async function GET() {
  return ok({ jobs: benchmarkJobs, results: benchmarkResults, providers })
}
