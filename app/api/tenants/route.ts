import { ok } from "@/lib/api/respond"
import { tenants } from "@/lib/sample-data"

export async function GET() {
  return ok(tenants, { total: tenants.length })
}
