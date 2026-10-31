export function createGrid(width, height) {
  if (
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width < 3 ||
    height < 3 ||
    width * height > 1_000_000
  )
    throw new RangeError(
      'Use grid dimensions of at least 3 and at most 1,000,000 cells.'
    )
  const size = width * height
  const state = {
    a: new Float32Array(size).fill(1),
    b: new Float32Array(size),
    nextA: new Float32Array(size),
    nextB: new Float32Array(size),
    width,
    height
  }
  const radius = Math.max(1, Math.min(width, height) * 0.055)
  for (const [x, y] of [
    [0.5, 0.5],
    [0.25, 0.3],
    [0.75, 0.7],
    [0.3, 0.75],
    [0.7, 0.25]
  ])
    seedGrid(state, x * width, y * height, radius)
  return state
}

export function seedGrid(state, cx, cy, radius = 6) {
  if (
    ![cx, cy, radius].every(Number.isFinite) ||
    radius <= 0 ||
    radius > Math.max(state.width, state.height)
  )
    return
  const { width, height, a, b } = state
  for (
    let y = Math.max(0, Math.floor(cy - radius));
    y <= Math.min(height - 1, Math.ceil(cy + radius));
    y++
  ) {
    for (
      let x = Math.max(0, Math.floor(cx - radius));
      x <= Math.min(width - 1, Math.ceil(cx + radius));
      x++
    ) {
      if ((x - cx) ** 2 + (y - cy) ** 2 > radius ** 2) continue
      const index = y * width + x
      a[index] = 0.5
      b[index] = 0.25 + Math.random() * 0.05
    }
  }
}

export function stepGrid(state, params) {
  const { Da = 1, Db = 0.5, f = 0.035, k = 0.065, dt = 1, steps = 8 } = params
  if (
    ![Da, Db, f, k, dt].every(Number.isFinite) ||
    Math.min(Da, Db, f, k, dt) < 0 ||
    !Number.isInteger(steps) ||
    steps < 0 ||
    steps > 1000
  )
    throw new RangeError('Invalid simulation parameters.')
  const { width: w, height: h } = state
  const timestep = Math.min(dt, 1 / Math.max(1, Da, Db))
  for (let step = 0; step < steps; step++) {
    const { a, b, nextA, nextB } = state
    for (let y = 0; y < h; y++) {
      const row = y * w
      const up = (y === 0 ? h - 1 : y - 1) * w
      const down = (y === h - 1 ? 0 : y + 1) * w
      for (let x = 0; x < w; x++) {
        const i = row + x
        const left = x === 0 ? w - 1 : x - 1
        const right = x === w - 1 ? 0 : x + 1
        const ai = a[i],
          bi = b[i]
        // The weighted nine-point stencil is stable at the default timestep.
        const lapA =
          -ai +
          0.2 * (a[row + left] + a[row + right] + a[up + x] + a[down + x]) +
          0.05 *
            (a[up + left] + a[up + right] + a[down + left] + a[down + right])
        const lapB =
          -bi +
          0.2 * (b[row + left] + b[row + right] + b[up + x] + b[down + x]) +
          0.05 *
            (b[up + left] + b[up + right] + b[down + left] + b[down + right])
        const reaction = ai * bi * bi
        nextA[i] = Math.max(
          0,
          Math.min(1, ai + timestep * (Da * lapA - reaction + f * (1 - ai)))
        )
        nextB[i] = Math.max(
          0,
          Math.min(1, bi + timestep * (Db * lapB + reaction - (f + k) * bi))
        )
      }
    }
    state.a = state.nextA
    state.b = state.nextB
    state.nextA = a
    state.nextB = b
  }
}

const palettes = new WeakMap()
export function renderGrid(ctx, state, colormap) {
  if (!state.imageData)
    state.imageData = ctx.createImageData(state.width, state.height)
  let palette = palettes.get(colormap)
  if (!palette) {
    palette = new Uint8ClampedArray(256 * 3)
    for (let i = 0; i < 256; i++) palette.set(colormap(i / 255), i * 3)
    palettes.set(colormap, palette)
  }
  const pixels = state.imageData.data
  for (let i = 0; i < state.b.length; i++) {
    const color = Math.min(255, Math.round(state.b[i] * 2.5 * 255)) * 3
    const pixel = i * 4
    pixels[pixel] = palette[color]
    pixels[pixel + 1] = palette[color + 1]
    pixels[pixel + 2] = palette[color + 2]
    pixels[pixel + 3] = 255
  }
  ctx.putImageData(state.imageData, 0, 0)
}

export const RD_PRESETS = {
  spots: { label: 'Spots', f: 0.035, k: 0.065 },
  stripes: { label: 'Stripes', f: 0.022, k: 0.051 },
  worms: { label: 'Worms', f: 0.078, k: 0.061 },
  coral: { label: 'Coral', f: 0.058, k: 0.065 },
  mitosis: { label: 'Mitosis', f: 0.028, k: 0.062 }
}
