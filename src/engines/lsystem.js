/**
 * lsystem.js
 * L-system string rewriting + turtle graphics.
 * Pure JS — no React, no DOM.
 */

export function expandLSystem(axiom, rules, iterations) {
  let current = axiom
  for (let i = 0; i < iterations; i++) {
    let next = ''
    for (const char of current) {
      next += rules[char] ?? char
    }
    current = next
  }
  return current
}

/**
 * @param {string} str
 * @param {number} angle     - degrees
 * @param {number} stepSize  - SVG units
 * @param {{ x: number, y: number, heading: number }} start
 * @returns {{ segments: Array<{x1,y1,x2,y2}>, bounds: {minX,minY,maxX,maxY} }}
 */
export function turtleWalk(str, angle, stepSize = 5, start = { x: 0, y: 0, heading: 90 }) {
  const DEG = Math.PI / 180
  let x = start.x
  let y = start.y
  let heading = start.heading
  const stack = []
  const segments = []

  for (const char of str) {
    switch (char) {
      case 'F': {
        const nx = x + stepSize * Math.cos(heading * DEG)
        const ny = y - stepSize * Math.sin(heading * DEG)
        segments.push({ x1: x, y1: y, x2: nx, y2: ny })
        x = nx; y = ny
        break
      }
      case 'f':
        x += stepSize * Math.cos(heading * DEG)
        y -= stepSize * Math.sin(heading * DEG)
        break
      case '+': heading += angle; break
      case '-': heading -= angle; break
      case '[': stack.push({ x, y, heading }); break
      case ']': { const s = stack.pop(); x = s.x; y = s.y; heading = s.heading; break }
      case '|': heading += 180; break
    }
  }

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  for (const { x1, y1, x2, y2 } of segments) {
    minX = Math.min(minX, x1, x2)
    minY = Math.min(minY, y1, y2)
    maxX = Math.max(maxX, x1, x2)
    maxY = Math.max(maxY, y1, y2)
  }

  return { segments, bounds: { minX, minY, maxX, maxY } }
}

export const PRESETS = {
  plant:     { label: 'Plant',       axiom: 'X',     rules: { X: 'F+[[X]-X]-F[-FX]+X', F: 'FF' },       angle: 25,  iterations: 5, stepSize: 4 },
  sierpinski:{ label: 'Sierpinski',  axiom: 'F-G-G', rules: { F: 'F-G+F+G-F', G: 'GG' },               angle: 120, iterations: 6, stepSize: 5 },
  koch:      { label: 'Koch curve',  axiom: 'F',     rules: { F: 'F+F-F-F+F' },                         angle: 90,  iterations: 4, stepSize: 5 },
  dragon:    { label: 'Dragon curve',axiom: 'FX',    rules: { X: 'X+YF+', Y: '-FX-Y' },                 angle: 90,  iterations: 12, stepSize: 5 },
  hilbert:   { label: 'Hilbert curve',axiom: 'A',    rules: { A: '+BF-AFA-FB+', B: '-AF+BFB+FA-' },     angle: 90,  iterations: 6, stepSize: 6 },
}