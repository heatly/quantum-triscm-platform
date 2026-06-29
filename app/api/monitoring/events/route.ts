import { ok } from "@/lib/api/respond"
import { monitoringEvents } from "@/lib/sample-data"

export async function GET() {
  return ok(monitoringEvents, { total: monitoringEvents.length })
}
