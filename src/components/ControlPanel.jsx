import { useState } from 'react'

/**
 * ControlPanel
 * Renders a list of labeled controls (range sliders, color pickers).
 *
 * @param {object[]} controls  - array of control descriptors
 * @param {object}   params    - current values
 * @param {function} onChange  - (key, value) => void
 */
export default function ControlPanel({ controls, params, onChange }) {
  const [open, setOpen] = useState(true)

  return (
    <div className="absolute top-4 right-4 w-64 bg-panel border border-border rounded z-10">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-2 text-xs text-muted hover:text-white transition-colors"
      >
        <span className="font-mono uppercase tracking-widest">params</span>
        <span>{open ? '\u2212' : '+'}</span>
      </button>

      {open && (
        <div className="px-3 pb-3 flex flex-col gap-3">
          {controls.map(({ label, key, type, min, max, step }) => (
            <div key={key} className="flex flex-col gap-1">
              <div className="flex justify-between text-xs text-muted">
                <span>{label}</span>
                {type === 'range' && (
                  <span className="text-accent">
                    {typeof params[key] === 'number'
                      ? params[key].toFixed(step < 1 ? 2 : 0)
                      : params[key]}
                  </span>
                )}
              </div>

              {type === 'range' && (
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={params[key]}
                  onChange={(e) => onChange(key, parseFloat(e.target.value))}
                  className="w-full accent-accent h-1 bg-border rounded"
                />
              )}

              {type === 'color' && (
                <input
                  type="color"
                  value={params[key]}
                  onChange={(e) => onChange(key, e.target.value)}
                  className="w-full h-7 bg-transparent border border-border rounded cursor-pointer"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
