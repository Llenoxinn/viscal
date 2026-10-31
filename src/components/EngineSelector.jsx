import { CurveMark } from './Icon'

export const ENGINES = [
  {
    key: 'lissajous',
    label: 'Lissajous curves',
    description: 'Beautiful patterns from two simple waves.'
  },
  {
    key: 'lsystem',
    label: 'L-Systems',
    description: 'Grow organic structures with simple rules.'
  },
  {
    key: 'rd',
    label: 'Reaction diffusion',
    description: 'Let patterns emerge from simple interactions.'
  }
]

export default function EngineSelector({ active, onChange }) {
  return (
    <div
      className="engine-selector"
      role="tablist"
      aria-label="Generative engines"
    >
      {ENGINES.map(({ key, label, description }, index) => (
        <button
          key={key}
          id={`tab-${key}`}
          role="tab"
          aria-selected={active === key}
          aria-controls={`panel-${key}`}
          tabIndex={active === key ? 0 : -1}
          className={`engine-tab ${active === key ? 'selected' : ''}`}
          onClick={() => onChange(key)}
          onKeyDown={(event) => {
            let next
            if (event.key === 'ArrowRight') next = (index + 1) % ENGINES.length
            if (event.key === 'ArrowLeft')
              next = (index + ENGINES.length - 1) % ENGINES.length
            if (event.key === 'Home') next = 0
            if (event.key === 'End') next = ENGINES.length - 1
            if (next === undefined) return
            event.preventDefault()
            onChange(ENGINES[next].key)
            document.getElementById(`tab-${ENGINES[next].key}`).focus()
          }}
        >
          <CurveMark variant={key} className="engine-art" />
          <span className="engine-copy">
            <span className="engine-title">{label}</span>
            <span className="engine-description">{description}</span>
          </span>
        </button>
      ))}
    </div>
  )
}
