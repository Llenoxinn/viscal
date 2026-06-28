import { useRef, useState, useCallback, useEffect } from 'react'
import { createGrid, stepGrid, renderGrid, RD_PRESETS } from '../engines/grayscott'
import { COLORMAPS } from '../utils/colormap'
import { useAnimationLoop } from '../hooks/useAnimationLoop'
import ControlPanel from './ControlPanel'
import ExportButton from './ExportButton'

const GRID_W = 200
const GRID_H = 150

const DEFAULT_PARAMS = {
  f: 0.055,
  k: 0.062,
  Da: 1.0,
  Db: 0.5,
  dt: 1.0,
  steps: 8,
}

/**
 * RDCanvas
 * Animated reaction-diffusion simulation rendered to a scaled canvas.
 */
export default function RDCanvas() {
  const canvasRef = useRef(null)
  const stateRef  = useRef(createGrid(GRID_W, GRID_H))
  const [params, setParams] = useState(DEFAULT_PARAMS)
  const paramsRef = useRef(params)
  const [running, setRunning]   = useState(true)
  const [colormap, setColormap] = useState('green')
  const [preset, setPreset]     = useState('spots')

  useEffect(() => { paramsRef.current = params }, [params])

  const tick = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    stepGrid(stateRef.current, paramsRef.current)
    const ctx = canvas.getContext('2d')
    renderGrid(ctx, stateRef.current, COLORMAPS[colormap].fn)
  }, [colormap])

  useAnimationLoop(tick, running)

  const reset = () => {
    stateRef.current = createGrid(GRID_W, GRID_H)
  }

  const handlePreset = (name) => {
    setPreset(name)
    const p = RD_PRESETS[name]
    setParams((prev) => ({ ...prev, f: p.f, k: p.k }))
    reset()
  }

  const controls = [
    { label: 'feed rate (f)',   key: 'f',     type: 'range', min: 0.01, max: 0.1,  step: 0.001 },
    { label: 'kill rate (k)',   key: 'k',     type: 'range', min: 0.04, max: 0.08, step: 0.001 },
    { label: 'diffusion A',     key: 'Da',    type: 'range', min: 0.1,  max: 2.0,  step: 0.05  },
    { label: 'diffusion B',     key: 'Db',    type: 'range', min: 0.1,  max: 1.0,  step: 0.05  },
    { label: 'steps / frame',   key: 'steps', type: 'range', min: 1,    max: 20,   step: 1     },
  ]

  return (
    <div className="relative w-full h-full">
      {/* Presets panel */}
      <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-sm border border-border rounded p-2 flex flex-col gap-0.5 min-w-[110px]">
        <p className="text-[10px] text-muted font-mono tracking-widest uppercase px-2 py-1">Presets</p>
        {Object.entries(RD_PRESETS).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => handlePreset(key)}
            className={`px-2 py-1 text-xs font-mono rounded text-left transition-colors
              ${preset === key
                ? 'bg-accent/10 text-accent'
                : 'text-muted hover:text-white hover:bg-white/5'}`}
          >
            {label}
          </button>
        ))}
        <button
          onClick={reset}
          className="mt-1 px-2 py-1 text-xs font-mono rounded text-left text-muted hover:text-white hover:bg-white/5 transition-colors"
        >
          reset
        </button>
      </div>

      <canvas
        ref={canvasRef}
        width={GRID_W}
        height={GRID_H}
        className="w-full h-full bg-canvas"
        style={{ imageRendering: 'pixelated' }}
      />

      {/* Colormap panel */}
      <div className="absolute bottom-4 left-4 z-10 bg-black/60 backdrop-blur-sm border border-border rounded p-2 flex gap-1">
        {Object.entries(COLORMAPS).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => setColormap(key)}
            className={`px-2 py-1 text-xs font-mono rounded transition-colors
              ${colormap === key
                ? 'bg-accent/10 text-accent'
                : 'text-muted hover:text-white hover:bg-white/5'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Play/pause */}
      <button
        onClick={() => setRunning((r) => !r)}
        className="absolute bottom-4 right-36 z-10 px-3 py-1.5 text-xs font-mono bg-black/60 backdrop-blur-sm border border-border text-muted hover:text-white hover:border-accent rounded transition-colors"
      >
        {running ? 'pause' : 'play'}
      </button>

      <ControlPanel
        controls={controls}
        params={params}
        onChange={(key, val) => setParams((p) => ({ ...p, [key]: val }))}
      />
      <ExportButton canvasRef={canvasRef} filename="viscal-rd" />
    </div>
  )
}
