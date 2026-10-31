import { useMemo, useRef, useState } from 'react'
import { computeLissajous, LISS_PRESETS } from '../engines/lissajous'
import { ART_COLOR } from '../utils/theme'
import ControlPanel, { PresetSelector } from './ControlPanel'
import ExportButton from './ExportButton'
import StudioLayout from './StudioLayout'

const DEFAULTS = {
  ...LISS_PRESETS.weave,
  A: 1,
  B: 1,
  points: 2000,
  strokeColor: ART_COLOR,
  strokeWidth: 2,
  alpha: 1
}
const GEOMETRY = [
  { label: 'X frequency', key: 'a', min: 1, max: 10 },
  { label: 'Y frequency', key: 'b', min: 1, max: 10 },
  {
    label: 'Phase offset',
    key: 'delta',
    min: 0,
    max: 6.28,
    step: 0.01,
    format: (value) => `${(value / Math.PI).toFixed(2)}π`
  },
  { label: 'X amplitude', key: 'A', min: 0.1, max: 1, step: 0.01 },
  { label: 'Y amplitude', key: 'B', min: 0.1, max: 1, step: 0.01 }
]
const APPEARANCE = [
  { label: 'Line weight', key: 'strokeWidth', min: 0.5, max: 5, step: 0.5 },
  { label: 'Opacity', key: 'alpha', min: 0.1, max: 1, step: 0.01 },
  { label: 'Sample points', key: 'points', min: 100, max: 5000, step: 100 },
  { label: 'Stroke color', key: 'strokeColor', type: 'color' }
]

export default function LissajousCanvas() {
  const svgRef = useRef(null)
  const [params, setParams] = useState(DEFAULTS)
  const [preset, setPreset] = useState('weave')
  const { a, b, delta, A, B, points } = params
  const path = useMemo(() => {
    const result = computeLissajous({ a, b, delta, A, B, points })
    return Array.from(
      result.x,
      (x, index) =>
        `${index ? 'L' : 'M'}${(x * 200).toFixed(3)},${(result.y[index] * 200).toFixed(3)}`
    ).join('')
  }, [a, b, delta, A, B, points])

  function update(key, value) {
    setParams((previous) => ({ ...previous, [key]: value }))
    if (GEOMETRY.some((control) => control.key === key)) setPreset('custom')
  }
  function selectPreset(key) {
    setPreset(key)
    setParams((previous) => ({ ...previous, ...LISS_PRESETS[key], A: 1, B: 1 }))
  }

  return (
    <StudioLayout
      title="Lissajous"
      subtitle="Two waves. One beautiful conversation."
      equation={`x = A sin(${a}t + δ) · y = B sin(${b}t)`}
      stats={`${points.toLocaleString()} samples · vector`}
      onReset={() => {
        setParams(DEFAULTS)
        setPreset('weave')
      }}
      onRandomize={() => {
        setPreset('custom')
        setParams((previous) => ({
          ...previous,
          a: 1 + Math.floor(Math.random() * 10),
          b: 1 + Math.floor(Math.random() * 10),
          delta: Math.round(Math.random() * 628) / 100
        }))
      }}
      exports={<ExportButton svgRef={svgRef} filename="viscal-lissajous" />}
      controls={
        <>
          <PresetSelector
            presets={LISS_PRESETS}
            value={preset}
            onChange={selectPreset}
          />
          <ControlPanel controls={GEOMETRY} params={params} onChange={update} />
          <details className="advanced-controls">
            <summary>Appearance & detail</summary>
            <ControlPanel
              title="Appearance"
              controls={APPEARANCE}
              params={params}
              onChange={update}
            />
          </details>
        </>
      }
    >
      <svg
        ref={svgRef}
        viewBox="-240 -240 480 480"
        className="generative-svg"
        role="img"
        aria-label={`Lissajous curve with ${a} to ${b} frequency ratio`}
      >
        <path
          d={path}
          fill="none"
          stroke={params.strokeColor}
          strokeWidth={params.strokeWidth}
          opacity={params.alpha}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </StudioLayout>
  )
}
