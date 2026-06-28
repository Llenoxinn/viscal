/**
 * grayscott.js
 * Gray-Scott reaction-diffusion simulation.
 * dA/dt = Da·∇²A − A·B² + f·(1−A)
 * dB/dt = Db·∇²B + A·B² − (f+k)·B
 */

export function createGrid(width, height) {
  const size = width * height
  const a = new Float32Array(size).fill(1)
  const b = new Float32Array(size).fill(0)

  const cx = Math.floor(width / 2)
  const cy = Math.floor(height / 2)
  const r  = 20

  for (let y = cy - r; y < cy + r; y++) {
    for (let x = cx - r; x < cx + r; x++) {
      if (x >= 0 && x < width && y >= 0 && y < height) {
        const i = y * width + x
        a[i] = 0.5 + (Math.random() - 0.5) * 0.1
        b[i] = 0.25 + (Math.random() - 0.5) * 0.1
      }
    }
  }
  return { a, b, width, height }
}

function lap(grid, idx, w, h) {
  const x = idx % w
  const y = Math.floor(idx / w)
  const l = x > 0     ? idx - 1      : idx + (w - 1)
  const r = x < w - 1 ? idx + 1      : idx - (w - 1)
  const u = y > 0     ? idx - w      : idx + w * (h - 1)
  const d = y < h - 1 ? idx + w      : idx - w * (h - 1)
  return grid[l] + grid[r] + grid[u] + grid[d] - 4 * grid[idx]
}

export function stepGrid(state, params) {
  const { Da = 1.0, Db = 0.5, f = 0.055, k = 0.062, dt = 1.0, steps = 8 } = params
  const { a, b, width: w, height: h } = state
  const size = w * h
  const na = new Float32Array(size)
  const nb = new Float32Array(size)

  for (let s = 0; s < steps; s++) {
    for (let i = 0; i < size; i++) {
      const ai = a[i], bi = b[i]
      const rxn = ai * bi * bi
      na[i] = Math.max(0, Math.min(1, ai + dt * (Da * lap(a, i, w, h) - rxn + f * (1 - ai))))
      nb[i] = Math.max(0, Math.min(1, bi + dt * (Db * lap(b, i, w, h) + rxn - (f + k) * bi)))
    }
    a.set(na); b.set(nb)
  }
}

export function renderGrid(ctx, state, colormap) {
  const { b, width: w, height: h } = state
  const img = ctx.createImageData(w, h)
  const d = img.data
  for (let i = 0; i < b.length; i++) {
    const [r, g, bv] = colormap(b[i])
    const px = i * 4
    d[px] = r; d[px+1] = g; d[px+2] = bv; d[px+3] = 255
  }
  ctx.putImageData(img, 0, 0)
}

export const RD_PRESETS = {
  spots:   { label: 'Spots',   f: 0.035, k: 0.065 },
  stripes: { label: 'Stripes', f: 0.022, k: 0.051 },
  worms:   { label: 'Worms',   f: 0.078, k: 0.061 },
  coral:   { label: 'Coral',   f: 0.058, k: 0.065 },
  mitosis: { label: 'Mitosis', f: 0.028, k: 0.062 },
}