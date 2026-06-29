import { ok } from "@/lib/api/respond"
import { riskScores } from "@/lib/sample-data"

export async function GET() {
  return ok(riskScores, { total: riskScores.length })
}
