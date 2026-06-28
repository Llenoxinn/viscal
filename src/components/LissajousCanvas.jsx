import { useRef, useEffect, useState } from 'react'
import { computeLissajous, drawLissajous } from '../engines/lissajous'
import ControlPanel from './ControlPanel'
import ExportButton from './ExportButton'

const DEFAULTS = {
  a: 3,
  b: 2,
  delta: Math.PI / 4,
  A: 1,
  B: 1,
  points: 2000,
  strokeColor: '#b5f0a5',
  strokeWidth: 1.5,
  alpha: 1,
}

/**
 * LissajousCanvas
 * Renders a Lissajous curve onto a full-size canvas.
 * Re-renders whenever params change.
 */
export default function LissajousCanvas() {
  const canvasRef = useRef(null)
  const [params, setParams] = useState(DEFAULTS)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const pts = computeLissajous(params)
    drawLissajous(ctx, pts, {
      strokeColor: params.strokeColor,
      strokeWidth: params.strokeWidth,
      alpha: params.alpha,
    })
  }, [params])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ro = new ResizeObserver(() => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      const ctx = canvas.getContext('2d')
      const pts = computeLissajous(params)
      drawLissajous(ctx, pts, {
        strokeColor: params.strokeColor,
        strokeWidth: params.strokeWidth,
        alpha: params.alpha,
      })
    })
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [params])

  const set = (key) => (val) => setParams((p) => ({ ...p, [key]: val }))

  const controls = [
    { label: 'freq x (a)', key: 'a',          type: 'range', min: 1, max: 10, step: 1 },
    { label: 'freq y (b)', key: 'b',          type: 'range', min: 1, max: 10, step: 1 },
    { label: 'phase \u03b4', key: 'delta',    type: 'range', min: 0, max: 6.28, step: 0.01 },
    { label: 'amplitude x', key: 'A',         type: 'range', min: 0.1, max: 1, step: 0.01 },
    { label: 'amplitude y', key: 'B',         type: 'range', min: 0.1, max: 1, step: 0.01 },
    { label: 'points',      key: 'points',    type: 'range', min: 100, max: 5000, step: 100 },
    { label: 'stroke width', key: 'strokeWidth', type: 'range', min: 0.5, max: 6, step: 0.5 },
    { label: 'opacity',     key: 'alpha',     type: 'range', min: 0.1, max: 1, step: 0.01 },
    { label: 'color',       key: 'strokeColor', type: 'color' },
  ]

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full bg-canvas"
        style={{ display: 'block' }}
      />
      <ControlPanel
        controls={controls}
        params={params}
        onChange={(key, val) => set(key)(val)}
      />
      <ExportButton canvasRef={canvasRef} filename="viscal-lissajous" />
    </div>
  )
}
