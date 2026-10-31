/**
 * lissajous.js
 * Pure math engine — no React, no DOM.
 * x(t) = A * sin(a*t + delta)
 * y(t) = B * sin(b*t)
 */

/**
 * @param {object} params
 * @param {number} params.a       - x frequency
 * @param {number} params.b       - y frequency
 * @param {number} params.delta   - phase offset in radians
 * @param {number} params.A       - x amplitude [0,1]
 * @param {number} params.B       - y amplitude [0,1]
 * @param {number} params.points  - sample count
 * @returns {{ x: Float32Array, y: Float32Array }} normalized to [-1, 1]
 */
export function computeLissajous({ a, b, delta, A = 1, B = 1, points = 2000 }) {
  if (
    ![a, b, delta, A, B].every(Number.isFinite) ||
    !Number.isInteger(points) ||
    points < 1 ||
    points > 100_000
  ) {
    throw new RangeError(
      'Use finite curve parameters and 1–100,000 sample points.'
    )
  }
  const xs = new Float32Array(points + 1)
  const ys = new Float32Array(points + 1)
  for (let i = 0; i <= points; i++) {
    const t = (i / points) * 2 * Math.PI
    xs[i] = A * Math.sin(a * t + delta)
    ys[i] = B * Math.sin(b * t)
  }
  return { x: xs, y: ys }
}

export const LISS_PRESETS = {
  weave: { label: 'Weave · 5 : 4', a: 5, b: 4, delta: 1.57 },
  orbit: { label: 'Orbit · 3 : 2', a: 3, b: 2, delta: 0.78 },
  bloom: { label: 'Bloom · 7 : 6', a: 7, b: 6, delta: 1.57 },
  ribbon: { label: 'Ribbon · 2 : 3', a: 2, b: 3, delta: 0 },
  harmony: { label: 'Harmony · 9 : 8', a: 9, b: 8, delta: 0.78 }
}
