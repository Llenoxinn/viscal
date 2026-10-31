import { useState, useRef, useMemo } from 'react'
import { expandLSystem, turtleWalk, PRESETS } from '../engines/lsystem'
import { ART_COLOR } from '../utils/theme'
import ControlPanel, { PresetSelector } from './ControlPanel'
import ExportButton from './ExportButton'
import StudioLayout from './StudioLayout'

const APPEARANCE = [
  { label: 'Line weight', key: 'strokeWidth', min: 0.3, max: 4, step: 0.1 },
  { label: 'Stroke color', key: 'strokeColor', type: 'color' }
]

export default function LSystemCanvas() {
  const svgRef = useRef(null)
  const [preset, setPreset] = useState('plant')
  const [params, setParams] = useState(PRESETS.plant)
  const [style, setStyle] = useState({
    strokeColor: ART_COLOR,
    strokeWidth: 1.2
  })
  const geometry = useMemo(() => {
    try {
      const instructions = expandLSystem(
        params.axiom,
        params.rules,
        params.iterations
      )
      const { segments, bounds } = turtleWalk(
        instructions,
        params.angle,
        params.stepSize
      )
      const padding =
        Math.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY) * 0.09 +
        1
      return {
        path: segments
          .map(
            ({ x1, y1, x2, y2 }) =>
              `M${x1.toFixed(2)},${y1.toFixed(2)}L${x2.toFixed(2)},${y2.toFixed(2)}`
          )
          .join(''),
        count: segments.length,
        viewBox: `${bounds.minX - padding} ${bounds.minY - padding} ${bounds.maxX - bounds.minX + padding * 2} ${bounds.maxY - bounds.minY + padding * 2}`
      }
    } catch (error) {
      return {
        path: '',
        count: 0,
        viewBox: '0 0 100 100',
        error: error.message
      }
    }
  }, [params])

  const controls = [
    {
      label: 'Iterations',
      key: 'iterations',
      min: 1,
      max: PRESETS[preset].maxIterations
    },
    {
      label: 'Branch angle',
      key: 'angle',
      min: 1,
      max: 180,
      format: (value) => `${value}°`
    },
    { label: 'Step length', key: 'stepSize', min: 1, max: 20 }
  ]
  function selectPreset(key) {
    setPreset(key)
    setParams(PRESETS[key])
  }

  return (
    <StudioLayout
      title="L-System"
      subtitle="Watch a simple rule grow into something complex."
      equation={`${params.axiom} → ${params.rules[params.axiom[0]] || 'recursive growth'}`}
      stats={`${geometry.count.toLocaleString()} segments · vector`}
      error={geometry.error}
      onReset={() => {
        selectPreset('plant')
        setStyle({ strokeColor: ART_COLOR, strokeWidth: 1.2 })
      }}
      onRandomize={() => {
        const keys = Object.keys(PRESETS)
        const key = keys[Math.floor(Math.random() * keys.length)]
        selectPreset(key)
        setParams({
          ...PRESETS[key],
          angle: 15 + Math.floor(Math.random() * 106)
        })
      }}
      exports={
        <ExportButton
          svgRef={svgRef}
          filename={`viscal-${preset}`}
          disabled={Boolean(geometry.error)}
        />
      }
      controls={
        <>
          <PresetSelector
            presets={PRESETS}
            value={preset}
            onChange={selectPreset}
          />
          <ControlPanel
            controls={controls}
            params={params}
            onChange={(key, value) =>
              setParams((previous) => ({ ...previous, [key]: value }))
            }
          />
          <ControlPanel
            title="Appearance"
            controls={APPEARANCE}
            params={style}
            onChange={(key, value) =>
              setStyle((previous) => ({ ...previous, [key]: value }))
            }
          />
          <div className="rule-note">
            <span className="section-label">THE RULE</span>
            <code>
              {Object.entries(params.rules)
                .map(([key, value]) => `${key} → ${value}`)
                .join('\n')}
            </code>
            <p>
              Each iteration repeats this rule. Small changes grow into big
              differences.
            </p>
          </div>
        </>
      }
    >
      <svg
        ref={svgRef}
        className="generative-svg fractal-svg"
        viewBox={geometry.viewBox}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`${PRESETS[preset].label} fractal at ${params.iterations} iterations`}
      >
        <path
          d={geometry.path}
          fill="none"
          stroke={style.strokeColor}
          strokeWidth={style.strokeWidth}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </StudioLayout>
  )
}
