import type {
  GenerateApologyRequest,
  GenerateApologyResponse
} from '../types'

const BASE = import.meta.env.VITE_API_URL ?? '/api'

export async function generateApology(
  request: GenerateApologyRequest
): Promise<GenerateApologyResponse> {
  const res = await fetch(`${BASE}/generate-apology`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  })
  if (!res.ok) {
    const errorBody = await res.text()
    let message = errorBody
    try { message = JSON.parse(errorBody).error ?? errorBody } catch { /* use raw text */ }
    throw new Error(message || `Request failed (${res.status})`)
  }
  return res.json() as Promise<GenerateApologyResponse>
}
