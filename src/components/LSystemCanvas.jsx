import { useState, useRef, useMemo } from 'react'
import { expandLSystem, turtleWalk, PRESETS } from '../engines/lsystem'
import ControlPanel from './ControlPanel'
import ExportButton from './ExportButton'

const DEFAULT_PRESET = 'plant'

/**
 * LSystemCanvas
 * Renders an L-system as an inline SVG with a viewBox fitted to the output.
 */
export default function LSystemCanvas() {
  const svgRef = useRef(null)
  const [preset, setPreset] = useState(DEFAULT_PRESET)
  const [params, setParams] = useState(PRESETS[DEFAULT_PRESET])
  const [strokeColor, setStrokeColor] = useState('#b5f0a5')
  const [strokeWidth, setStrokeWidth] = useState(0.8)

  const { segments, bounds } = useMemo(() => {
    try {
      const str = expandLSystem(params.axiom, params.rules, params.iterations)
      if (str.length > 500_000) return { segments: [], bounds: { minX: 0, minY: 0, maxX: 100, maxY: 100 } }
      return turtleWalk(str, params.angle, params.stepSize)
    } catch {
      return { segments: [], bounds: { minX: 0, minY: 0, maxX: 100, maxY: 100 } }
    }
  }, [params])

  const pad = 20
  const vbX = bounds.minX - pad
  const vbY = bounds.minY - pad
  const vbW = (bounds.maxX - bounds.minX) + pad * 2
  const vbH = (bounds.maxY - bounds.minY) + pad * 2

  const handlePreset = (name) => {
    setPreset(name)
    setParams(PRESETS[name])
  }

  const controls = [
    { label: 'iterations', key: 'iterations', type: 'range', min: 1, max: 8, step: 1 },
    { label: 'angle (\u00b0)', key: 'angle', type: 'range', min: 1, max: 180, step: 1 },
    { label: 'step size',  key: 'stepSize',   type: 'range', min: 1, max: 20, step: 1 },
  ]

  const set = (key) => (val) => setParams((p) => ({ ...p, [key]: val }))

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-4 left-4 flex flex-col gap-1 z-10">
        {Object.entries(PRESETS).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => handlePreset(key)}
            className={`px-3 py-1 text-xs font-mono border rounded transition-colors
              ${preset === key
                ? 'border-accent text-accent'
                : 'border-border text-muted hover:text-white'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <svg
        ref={svgRef}
        className="w-full h-full bg-canvas"
        viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {segments.map((seg, i) => (
          <line
            key={i}
            x1={seg.x1} y1={seg.y1}
            x2={seg.x2} y2={seg.y2}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        ))}
      </svg>

      <ControlPanel
        controls={controls}
        params={params}
        onChange={(key, val) => set(key)(val)}
      />

      <div className="absolute bottom-4 right-4 flex gap-3 items-center z-10">
        <input
          type="color"
          value={strokeColor}
          onChange={(e) => setStrokeColor(e.target.value)}
          className="h-7 w-12 bg-transparent border border-border rounded cursor-pointer"
          title="stroke color"
        />
        <input
          type="range"
          min={0.3} max={4} step={0.1}
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(parseFloat(e.target.value))}
          className="w-24 accent-accent"
          title="stroke width"
        />
        <span className="text-xs text-muted font-mono">{strokeWidth.toFixed(1)}px</span>
      </div>

      <ExportButton svgRef={svgRef} canvasRef={null} filename="viscal-lsystem" />
    </div>
  )
}
