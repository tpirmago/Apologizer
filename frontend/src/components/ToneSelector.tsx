import type { Tone } from '../types'

const TONES: { value: Tone; label: string; description: string }[] = [
  { value: 'sincere',     label: 'Sincere',     description: 'From the heart' },
  { value: 'formal',      label: 'Formal',      description: 'Professional & proper' },
  { value: 'casual',      label: 'Casual',      description: 'Relaxed & natural' },
  { value: 'light-funny', label: 'Light Funny',  description: 'Lighten the mood' }
]

type Props = {
  value: Tone
  onChange: (value: Tone) => void
}

export function ToneSelector({ value, onChange }: Props) {
  return (
    <div className="selector tone-selector">
      <label>Tone</label>
      <div className="option-group">
        {TONES.map((tone) => (
          <button
            key={tone.value}
            type="button"
            className={`option-btn tone-btn ${value === tone.value ? 'selected' : ''}`}
            onClick={() => onChange(tone.value)}
          >
            <span className="tone-name">{tone.label}</span>
            <span className="tone-desc">{tone.description}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
