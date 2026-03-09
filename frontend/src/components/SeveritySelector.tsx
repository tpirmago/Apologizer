import type { Severity } from '../types'

const SEVERITY_LEVELS: { value: Severity; label: string; image: string }[] = [
  { value: 1, label: 'Tiny oops',      image: '/goose-awkward.png' },
  { value: 2, label: 'Awkward',        image: '/goose-ashamed.png' },
  { value: 3, label: 'Bad',            image: '/goose-guilty.png' },
  { value: 4, label: 'Very bad',       image: '/goose-embarrassed.png' },
  { value: 5, label: 'Insane fuckup',  image: '/goose-fuckup.png' }
]

type Props = {
  value: Severity
  onChange: (value: Severity) => void
}

export function SeveritySelector({ value, onChange }: Props) {
  const current = SEVERITY_LEVELS[value - 1]

  return (
    <div className="selector severity-selector">
      <label>How bad was it?</label>
      <div className="severity-slider-wrap">
        <img
          src={current.image}
          alt={current.label}
          className="severity-goose"
        />
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value) as Severity)}
          className="severity-range"
        />
        <div className="severity-ticks">
          {SEVERITY_LEVELS.map((level) => (
            <span
              key={level.value}
              className={`severity-tick ${value === level.value ? 'active' : ''}`}
              onClick={() => onChange(level.value)}
            >
              {level.value}
              <span className="severity-tick-label">{level.label}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
