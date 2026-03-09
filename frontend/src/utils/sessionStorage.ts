import type { ApologySession } from '../types'

const STORAGE_KEY = 'apologizer_session'

export function saveSession(session: ApologySession): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export function loadSession(): ApologySession | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as ApologySession
    if (!parsed.situation || !parsed.category || !parsed.severity || !parsed.tone) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEY)
}
