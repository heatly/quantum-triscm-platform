import { ok } from "@/lib/api/respond"
import { ctEvents, watchlist } from "@/lib/sample-data"

export async function GET() {
  return ok({ events: ctEvents, watchlist }, { total: ctEvents.length })
}
