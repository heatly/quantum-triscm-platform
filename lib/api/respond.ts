import { NextResponse } from "next/server"
import type { ApiResult } from "@/lib/types"

/**
 * Wraps sample data in the standard API envelope. Real backend handlers should
 * return the same `{ data, meta }` shape so the frontend adapters stay stable.
 */
export function ok<T>(data: T, meta?: ApiResult<T>["meta"]) {
  return NextResponse.json<ApiResult<T>>({
    data,
    meta: { sample: true, ...meta },
  })
}
