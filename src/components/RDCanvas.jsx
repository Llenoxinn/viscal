import { useRef, useState, useCallback, useEffect, useId } from 'react'
import {
  createGrid,
  seedGrid,
  stepGrid,
  renderGrid,
  RD_PRESETS
} from '../engines/grayscott'
import { COLORMAPS } from '../utils/colormap'
import { useAnimationLoop } from '../hooks/useAnimationLoop'
import ControlPanel, { PresetSelector } from './ControlPanel'
import ExportButton from './ExportButton'
import StudioLayout from './StudioLayout'
import Icon from './Icon'

const GRID_W = 240,
  GRID_H = 180
const DEFAULTS = { ...RD_PRESETS.spots, Da: 1, Db: 0.5, dt: 1, steps: 8 }
const CONTROLS = [
  { label: 'Feed rate', key: 'f', min: 0.01, max: 0.1, step: 0.001 },
  { label: 'Kill rate', key: 'k', min: 0.04, max: 0.08, step: 0.001 },
  { label: 'Diffusion A', key: 'Da', min: 0.1, max: 2, step: 0.05 },
  { label: 'Diffusion B', key: 'Db', min: 0.1, max: 1, step: 0.05 },
  { label: 'Steps per frame', key: 'steps', min: 1, max: 16 }
]

export default function RDCanvas({ active }) {
  const canvasRef = useRef(null)
  const stateRef = useRef(null)
  const pointerRef = useRef(null)
  const warmedRef = useRef(false)
  const [params, setParams] = useState(DEFAULTS)
  const [running, setRunning] = useState(
    () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const [colormap, setColormap] = useState('yellow')
  const [preset, setPreset] = useState('spots')
  const paletteId = useId()

  const draw = useCallback(() => {
    const context = canvasRef.current?.getContext('2d')
    if (context && stateRef.current)
      renderGrid(context, stateRef.current, COLORMAPS[colormap].fn)
  }, [colormap])
  useEffect(() => {
    if (!active) return
    if (!stateRef.current) stateRef.current = createGrid(GRID_W, GRID_H)
    if (!warmedRef.current) {
      stepGrid(stateRef.current, { ...params, steps: 100 })
      warmedRef.current = true
    }
    draw()
  }, [active, draw, params])

  useAnimationLoop(() => {
    stepGrid(stateRef.current, params)
    draw()
  }, active && running)

  function resetGrid(nextParams = params) {
    stateRef.current = createGrid(GRID_W, GRID_H)
    stepGrid(stateRef.current, { ...nextParams, steps: 100 })
    draw()
  }
  function selectPreset(key) {
    const next = { ...params, ...RD_PRESETS[key] }
    setPreset(key)
    setParams(next)
    resetGrid(next)
  }
  function paint(event) {
    const rect = canvasRef.current.getBoundingClientRect()
    const scale = Math.min(rect.width / GRID_W, rect.height / GRID_H)
    const x =
      (event.clientX - rect.left - (rect.width - GRID_W * scale) / 2) / scale
    const y =
      (event.clientY - rect.top - (rect.height - GRID_H * scale) / 2) / scale
    if (x < 0 || y < 0 || x >= GRID_W || y >= GRID_H) return
    seedGrid(stateRef.current, x, y)
    draw()
  }

  return (
    <StudioLayout
      title="Reaction diffusion"
      subtitle="A living pattern, grown from two virtual chemicals."
      equation="∂B/∂t = Dᵦ∇²B + AB² − (f + k)B"
      stats={`${GRID_W} × ${GRID_H} · ${running ? 'running' : 'paused'}`}
      hint="Paint on the canvas to plant a new pattern."
      onReset={() => {
        setParams(DEFAULTS)
        setPreset('spots')
        setColormap('yellow')
        resetGrid(DEFAULTS)
      }}
      onRandomize={() => {
        const keys = Object.keys(RD_PRESETS)
        selectPreset(keys[Math.floor(Math.random() * keys.length)])
      }}
      exports={
        <ExportButton
          canvasRef={canvasRef}
          filename="viscal-reaction-diffusion"
        />
      }
      toolbar={
        <div className="simulation-actions">
          <button
            className="button"
            onClick={() => {
              seedGrid(stateRef.current, GRID_W / 2, GRID_H / 2, 9)
              draw()
            }}
          >
            Add seed
          </button>
          <button
            className="button play-button"
            onClick={() => setRunning(!running)}
            aria-pressed={running}
          >
            <Icon name={running ? 'pause' : 'play'} size={15} />
            {running ? 'Pause' : 'Play'}
          </button>
        </div>
      }
      controls={
        <>
          <PresetSelector
            presets={RD_PRESETS}
            value={preset}
            onChange={selectPreset}
          />
          <ControlPanel
            controls={CONTROLS}
            params={params}
            onChange={(key, value) => {
              setParams((previous) => ({ ...previous, [key]: value }))
              if (key === 'f' || key === 'k') setPreset('custom')
            }}
          />
          <div className="preset-control">
            <label htmlFor={paletteId} className="section-label">
              Color palette
            </label>
            <select
              id={paletteId}
              value={colormap}
              onChange={(event) => setColormap(event.target.value)}
            >
              {Object.entries(COLORMAPS).map(([key, item]) => (
                <option value={key} key={key}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <p className="control-tip">
            Let it grow for a moment. The best patterns take a little time.
          </p>
        </>
      }
    >
      <canvas
        ref={canvasRef}
        width={GRID_W}
        height={GRID_H}
        className="rd-canvas"
        role="img"
        aria-label="Interactive reaction-diffusion pattern. Use Add seed to place a centered seed without painting."
        onPointerDown={(event) => {
          if (pointerRef.current !== null || event.button !== 0) return
          pointerRef.current = event.pointerId
          event.currentTarget.setPointerCapture(event.pointerId)
          paint(event)
        }}
        onPointerMove={(event) => {
          if (pointerRef.current === event.pointerId) paint(event)
        }}
        onPointerUp={(event) => {
          if (pointerRef.current === event.pointerId) {
            event.currentTarget.releasePointerCapture(event.pointerId)
            pointerRef.current = null
          }
        }}
        onPointerCancel={() => {
          pointerRef.current = null
        }}
        onLostPointerCapture={() => {
          pointerRef.current = null
        }}
      />
    </StudioLayout>
  )
}
