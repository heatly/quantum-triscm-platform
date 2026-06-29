import { ok } from "@/lib/api/respond"
import { trustGraph } from "@/lib/sample-data"

export async function GET() {
  return ok(trustGraph)
}
