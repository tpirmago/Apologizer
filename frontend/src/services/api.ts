import type {
  GenerateApologyRequest,
  GenerateApologyResponse
} from '../types'

const BASE = '/api'

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
    throw new Error(`Failed to generate apology: ${errorBody}`)
  }
  return res.json() as Promise<GenerateApologyResponse>
}
