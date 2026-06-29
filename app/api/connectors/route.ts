import { ok } from "@/lib/api/respond"
import { connectors } from "@/lib/sample-data"

export async function GET() {
  return ok(connectors, { total: connectors.length })
}
