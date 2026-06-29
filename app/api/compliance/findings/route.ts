import { ok } from "@/lib/api/respond"
import { complianceFindings, policyCards } from "@/lib/sample-data"

export async function GET() {
  return ok(
    { findings: complianceFindings, policies: policyCards },
    { total: complianceFindings.length }
  )
}
