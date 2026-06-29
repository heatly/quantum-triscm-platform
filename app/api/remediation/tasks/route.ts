import { ok } from "@/lib/api/respond"
import { remediationTasks } from "@/lib/sample-data"

export async function GET() {
  return ok(remediationTasks, { total: remediationTasks.length })
}
