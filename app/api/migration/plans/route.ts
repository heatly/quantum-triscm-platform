import { ok } from "@/lib/api/respond"
import { migrationPlans } from "@/lib/sample-data"

export async function GET() {
  return ok(migrationPlans, { total: migrationPlans.length })
}
