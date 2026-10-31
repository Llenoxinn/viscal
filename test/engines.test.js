import test from 'node:test'
import assert from 'node:assert/strict'
import { computeLissajous, LISS_PRESETS } from '../src/engines/lissajous.js'
import { expandLSystem, turtleWalk, PRESETS } from '../src/engines/lsystem.js'
import {
  createGrid,
  seedGrid,
  stepGrid,
  renderGrid,
  RD_PRESETS
} from '../src/engines/grayscott.js'
import { colormapGreen, colormapYellow } from '../src/utils/colormap.js'
import { forbiddenPaths } from '../scripts/repo-paths.mjs'

test('Lissajous presets stay within their amplitudes and close at integer frequencies', () => {
  for (const preset of Object.values(LISS_PRESETS)) {
    const { x, y } = computeLissajous({
      ...preset,
      A: 0.8,
      B: 0.6,
      points: 1000
    })
    assert.equal(x.length, 1001)
    assert.ok(x.every((value) => Math.abs(value) <= 0.800001))
    assert.ok(y.every((value) => Math.abs(value) <= 0.600001))
    assert.ok(Math.abs(x[0] - x.at(-1)) < 0.00001)
    assert.ok(Math.abs(y[0] - y.at(-1)) < 0.00001)
  }
  assert.throws(
    () => computeLissajous({ a: 3, b: 2, delta: 0, points: 0 }),
    RangeError
  )
})

test('L-system expansion is bounded before allocating an oversized result', () => {
  assert.equal(expandLSystem('A', { A: 'AB', B: 'A' }, 3), 'ABAAB')
  assert.throws(() => expandLSystem('F', { F: 'FFFFFFFFFF' }, 8), /too large/)
  assert.throws(() => expandLSystem('F', {}, -1), RangeError)
})

test('Sierpinski draws G as a forward command and forms a closed triangle', () => {
  const { segments } = turtleWalk('F-G-G', 120, 5)
  assert.equal(segments.length, 3)
  assert.ok(Math.abs(segments.at(-1).x2) < 0.00001)
  assert.ok(Math.abs(segments.at(-1).y2) < 0.00001)
})

test('Every fractal preset produces finite geometry, including Dragon at 12 iterations', () => {
  for (const preset of Object.values(PRESETS)) {
    assert.ok(preset.iterations <= preset.maxIterations)
    const result = turtleWalk(
      expandLSystem(preset.axiom, preset.rules, preset.iterations),
      preset.angle,
      preset.stepSize
    )
    assert.ok(result.segments.length > 0)
    assert.ok(Object.values(result.bounds).every(Number.isFinite))
  }
  assert.deepEqual(turtleWalk('X', 90).bounds, {
    minX: 0,
    minY: 0,
    maxX: 0,
    maxY: 0
  })
  assert.throws(() => turtleWalk(']', 90), /unmatched/)
  assert.throws(() => turtleWalk('[F', 90), /unmatched/)
})

test('Reaction diffusion preserves a uniform field across wrapped boundaries', () => {
  const state = createGrid(8, 6)
  state.a.fill(1)
  state.b.fill(0)
  stepGrid(state, { steps: 10 })
  assert.ok(state.a.every((value) => value === 1))
  assert.ok(state.b.every((value) => value === 0))
})

test('Diffusion uses the stable weighted stencil and reusable buffers', () => {
  const state = createGrid(8, 8)
  state.a.fill(1)
  state.b.fill(0)
  state.b[4 * 8 + 4] = 0.5
  const aBuffer = state.a.buffer
  const nextBuffer = state.nextA.buffer
  stepGrid(state, { Da: 1, Db: 0.5, f: 0, k: 0, steps: 1 })
  assert.ok(Math.abs(state.b[4 * 8 + 5] - 0.05) < 0.000001)
  assert.ok(Math.abs(state.b[3 * 8 + 3] - 0.0125) < 0.000001)
  assert.equal(state.a.buffer, nextBuffer)
  stepGrid(state, { steps: 1 })
  assert.equal(state.a.buffer, aBuffer)
})

test('All simulation presets remain finite and develop nonuniform patterns', () => {
  for (const preset of Object.values(RD_PRESETS)) {
    const state = createGrid(40, 30)
    stepGrid(state, { ...preset, Da: 2, Db: 1, steps: 150 })
    assert.ok(
      state.a.every(
        (value) => Number.isFinite(value) && value >= 0 && value <= 1
      )
    )
    assert.ok(
      state.b.every(
        (value) => Number.isFinite(value) && value >= 0 && value <= 1
      )
    )
    assert.ok(Math.max(...state.b) > Math.min(...state.b))
  }
})

test('Adding a seed clips to grid boundaries and rendering reuses image data', () => {
  const state = createGrid(10, 10)
  state.b.fill(0)
  seedGrid(state, 0, 0, 3)
  assert.ok(state.b[0] > 0)
  assert.equal(state.b[99], 0)
  let allocations = 0
  const context = {
    createImageData: (w, h) => {
      allocations++
      return { data: new Uint8ClampedArray(w * h * 4) }
    },
    putImageData: () => {}
  }
  renderGrid(context, state, colormapGreen)
  renderGrid(context, state, colormapGreen)
  assert.equal(allocations, 1)
  assert.equal(state.imageData.data[3], 255)
})

test('Repository hygiene catches nested dependencies and secrets but keeps the lockfile and example', () => {
  assert.deepEqual(
    forbiddenPaths([
      'node_modules/react/index.js',
      'demo/node_modules/a.js',
      'dist/index.html',
      'output/playwright/test.png',
      '.env',
      '.env.production',
      'debug.log',
      'config.local',
      '.env.example',
      'src/App.jsx',
      'package-lock.json'
    ]),
    [
      'node_modules/react/index.js',
      'demo/node_modules/a.js',
      'dist/index.html',
      'output/playwright/test.png',
      '.env',
      '.env.production',
      'debug.log',
      'config.local'
    ]
  )
})

test('Electric yellow palette clamps endpoints and keeps every channel in range', () => {
  assert.deepEqual(colormapYellow(0), [20, 20, 20])
  assert.deepEqual(colormapYellow(1), [255, 255, 0])
  assert.deepEqual(colormapYellow(-1), colormapYellow(0))
  assert.deepEqual(colormapYellow(2), colormapYellow(1))
  for (let index = 0; index <= 255; index++) {
    assert.ok(
      colormapYellow(index / 255).every(
        (value) => Number.isInteger(value) && value >= 0 && value <= 255
      )
    )
  }
})
