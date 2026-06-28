/**
 * EngineSelector
 * Tab row at the top of the canvas area for switching between engines.
 */
export default function EngineSelector({ active, onChange }) {
  const engines = [
    { key: 'lissajous', label: 'Lissajous' },
    { key: 'lsystem',   label: 'L-System'  },
    { key: 'rd',        label: 'React-Diff' },
  ]

  return (
    <div className="flex border-b border-border bg-panel px-4">
      {engines.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-4 py-2 text-xs font-mono tracking-widest uppercase transition-colors border-b-2 -mb-px
            ${active === key
              ? 'border-accent text-accent'
              : 'border-transparent text-muted hover:text-white'}`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
