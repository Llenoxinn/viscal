/**
 * colormap.js
 * Maps t ∈ [0, 1] to [r, g, b] (each 0–255).
 */

export function colormapGreen(t) {
  return [
    Math.round(t * 30),
    Math.round(t * 200 + (1 - t) * 10),
    Math.round(t * 80)
  ]
}

export function colormapThermal(t) {
  return [
    Math.round(Math.min(255, t * 3 * 255)),
    Math.round(Math.min(255, Math.max(0, (t - 0.33) * 3 * 255))),
    Math.round(Math.min(255, Math.max(0, 255 - t * 3 * 255)))
  ]
}

export function colormapGray(t) {
  const v = Math.round(t * 255)
  return [v, v, v]
}

export function colormapYellow(t) {
  const value = 20 + Math.round(Math.max(0, Math.min(1, t)) * 235)
  return [value, value, Math.round(20 * (1 - Math.max(0, Math.min(1, t))))]
}

export const COLORMAPS = {
  yellow: { label: 'Electric yellow', fn: colormapYellow },
  green: { label: 'Acid green', fn: colormapGreen },
  thermal: { label: 'Thermal', fn: colormapThermal },
  gray: { label: 'Grayscale', fn: colormapGray }
}
