import type { Category } from '../types'

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'relationship', label: 'Relationship' },
  { value: 'friends',      label: 'Friends'      },
  { value: 'work',         label: 'Work'         },
  { value: 'family',       label: 'Family'       }
]

type Props = {
  value: Category
  onChange: (value: Category) => void
}

export function CategorySelector({ value, onChange }: Props) {
  return (
    <div className="selector category-selector">
      <label>Category</label>
      <div className="option-group">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            type="button"
            className={`option-btn ${value === cat.value ? 'selected' : ''}`}
            onClick={() => onChange(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  )
}
