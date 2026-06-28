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
 * @returns {{ x: number[], y: number[] }} normalized to [-1, 1]
 */
export function computeLissajous({ a, b, delta, A = 1, B = 1, points = 2000 }) {
  const xs = []
  const ys = []
  for (let i = 0; i <= points; i++) {
    const t = (i / points) * 2 * Math.PI
    xs.push(A * Math.sin(a * t + delta))
    ys.push(B * Math.sin(b * t))
  }
  return { x: xs, y: ys }
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {{ x: number[], y: number[] }} points
 * @param {{ strokeColor?: string, strokeWidth?: number, alpha?: number }} style
 */
export function drawLissajous(ctx, points, style = {}) {
  const { strokeColor = '#b5f0a5', strokeWidth = 1.5, alpha = 1 } = style
  const { width, height } = ctx.canvas
  const cx = width / 2
  const cy = height / 2
  const scaleX = width * 0.45
  const scaleY = height * 0.45

  ctx.clearRect(0, 0, width, height)
  ctx.globalAlpha = alpha
  ctx.strokeStyle = strokeColor
  ctx.lineWidth = strokeWidth
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()

  for (let i = 0; i < points.x.length; i++) {
    const px = cx + points.x[i] * scaleX
    const py = cy + points.y[i] * scaleY
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }

  ctx.stroke()
  ctx.globalAlpha = 1
}