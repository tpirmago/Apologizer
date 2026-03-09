import { useState } from 'react'

type Props = {
  apology: string
  loading: boolean
}

export function ApologyResult({ apology, loading }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(apology)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="apology-result loading">
        <img src="/goose-thinking.png" alt="Goose" className="goose-spinner" />
        <p className="loading-text">Crafting something sincere...</p>
      </div>
    )
  }

  if (!apology) return null

  return (
    <div className="apology-result">
      <h3>Your Apology</h3>
      <blockquote className="apology-text">{apology}</blockquote>
      <button type="button" className="btn-copy" onClick={handleCopy}>
        {copied ? (
          'Copied!'
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }}>
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Copy to clipboard
          </>
        )}
      </button>
    </div>
  )
}
