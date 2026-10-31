import Icon, { CurveMark } from './Icon'

export const ENGINES = [
  {
    key: 'lissajous',
    label: 'Lissajous curves',
    description: 'Find harmony in oscillation',
    tag: 'PARAMETRIC'
  },
  {
    key: 'lsystem',
    label: 'L-Systems',
    description: 'Simple rules. Complex worlds.',
    tag: 'FRACTAL'
  },
  {
    key: 'rd',
    label: 'Reaction diffusion',
    description: 'Let organic patterns emerge',
    tag: 'SIMULATION'
  }
]

export default function EngineSelector({ active, onChange }) {
  return (
    <div
      className="engine-selector"
      role="tablist"
      aria-label="Generative engines"
    >
      {ENGINES.map(({ key, label, description, tag }, index) => (
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
          <span className="engine-art">
            <CurveMark variant={key} />
          </span>
          <span className="engine-copy">
            <span className="engine-overline">
              0{index + 1}
              <span>{tag}</span>
            </span>
            <span className="engine-title">{label}</span>
            <span className="engine-description">{description}</span>
          </span>
          <span className="engine-arrow">
            <Icon name={active === key ? 'check' : 'chevron'} size={16} />
          </span>
        </button>
      ))}
    </div>
  )
}
