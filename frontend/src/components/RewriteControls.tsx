import type { RewriteInstruction } from '../types'

const REWRITES: { value: RewriteInstruction; label: string }[] = [
  { value: 'more-sincere',  label: 'More sincere' },
  { value: 'shorter',       label: 'Shorter' },
  { value: 'more-formal',   label: 'More formal' },
  { value: 'less-awkward',  label: 'Less awkward' },
  { value: 'funnier',       label: 'Funnier' }
]

const MAX_REWRITES = 5

type Props = {
  onRewrite: (instruction: RewriteInstruction) => void
  rewriteCount: number
  loading: boolean
}

export function RewriteControls({ onRewrite, rewriteCount, loading }: Props) {
  const exhausted = rewriteCount >= MAX_REWRITES
  const remaining = MAX_REWRITES - rewriteCount

  return (
    <div className="rewrite-controls">
      <p className="rewrite-label">
        {exhausted
          ? "That's the limit — hope one of them worked! 🪿"
          : `Not quite right? Tweak it (${remaining} rewrite${remaining === 1 ? '' : 's'} left)`}
      </p>
      <div className="rewrite-btn-group">
        {REWRITES.map((rw) => (
          <button
            key={rw.value}
            type="button"
            className="btn-rewrite"
            disabled={exhausted || loading}
            onClick={() => onRewrite(rw.value)}
          >
            {rw.label}
          </button>
        ))}
      </div>
    </div>
  )
}
