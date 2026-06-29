import { ok } from "@/lib/api/respond"
import { buildOverview } from "@/lib/sample-data"

export async function GET() {
  return ok(buildOverview())
}
