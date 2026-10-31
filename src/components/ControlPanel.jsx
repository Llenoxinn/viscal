import { useId } from 'react'

export default function ControlPanel({
  controls,
  params,
  onChange,
  title = 'Parameters'
}) {
  const id = useId()
  return (
    <fieldset className="control-group">
      <legend className="section-label">{title}</legend>
      {controls.map(
        ({ label, key, type = 'range', min, max, step = 1, format }) => {
          const inputId = `${id}-${key}`
          const decimals = String(step).split('.')[1]?.length ?? 0
          return (
            <div
              className={`control ${type === 'color' ? 'color-control' : ''}`}
              key={key}
            >
              <div className="control-label">
                <label htmlFor={inputId}>{label}</label>
                <output htmlFor={inputId}>
                  {format
                    ? format(params[key])
                    : typeof params[key] === 'number'
                      ? params[key].toFixed(decimals)
                      : params[key].toUpperCase()}
                </output>
              </div>
              <input
                id={inputId}
                type={type}
                min={min}
                max={max}
                step={step}
                value={params[key]}
                onChange={(event) =>
                  onChange(
                    key,
                    type === 'range'
                      ? Number(event.target.value)
                      : event.target.value
                  )
                }
                style={
                  type === 'range'
                    ? {
                        '--range-progress': `${((params[key] - min) / (max - min)) * 100}%`
                      }
                    : undefined
                }
              />
            </div>
          )
        }
      )}
    </fieldset>
  )
}

export function PresetSelector({ presets, value, onChange }) {
  const id = useId()
  return (
    <div className="preset-control">
      <label className="section-label" htmlFor={id}>
        Starting point
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {value === 'custom' && (
          <option value="custom">Custom exploration</option>
        )}
        {Object.entries(presets).map(([key, preset]) => (
          <option key={key} value={key}>
            {preset.label}
          </option>
        ))}
      </select>
    </div>
  )
}
