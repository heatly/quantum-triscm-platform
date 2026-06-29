import { ok } from "@/lib/api/respond"
import { discoveryJobs, jobLogs } from "@/lib/sample-data"

export async function GET() {
  return ok({ jobs: discoveryJobs, logs: jobLogs }, { total: discoveryJobs.length })
}
