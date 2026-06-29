import { ok } from "@/lib/api/respond"
import { assets } from "@/lib/sample-data"

export async function GET() {
  return ok(assets, { total: assets.length })
}
