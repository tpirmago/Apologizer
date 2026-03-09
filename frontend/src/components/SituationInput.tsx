type Props = {
  value: string
  onChange: (value: string) => void
}

export function SituationInput({ value, onChange }: Props) {
  return (
    <div className="situation-input">
      <label htmlFor="situation">What happened?</label>
      <textarea
        id="situation"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe the situation honestly..."
        rows={5}
      />
    </div>
  )
}
