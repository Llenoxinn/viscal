/**
 * lsystem.js
 * L-system string rewriting + turtle graphics.
 * Pure JS — no React, no DOM.
 */

export function expandLSystem(axiom, rules, iterations) {
  if (!Number.isInteger(iterations) || iterations < 0 || iterations > 16)
    throw new RangeError('Iterations must be between 0 and 16.')
  const limit = 500_000
  if (axiom.length > limit)
    throw new RangeError('This pattern is too large. Reduce the iterations.')
  let current = axiom
  for (let i = 0; i < iterations; i++) {
    let next = ''
    for (const char of current) {
      const replacement = rules[char] ?? char
      if (next.length + replacement.length > limit)
        throw new RangeError(
          'This pattern is too large. Reduce the iterations.'
        )
      next += replacement
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
export function turtleWalk(
  str,
  angle,
  stepSize = 5,
  start = { x: 0, y: 0, heading: 90 }
) {
  if (
    ![angle, stepSize, start.x, start.y, start.heading].every(
      Number.isFinite
    ) ||
    stepSize <= 0
  )
    throw new RangeError('Use a finite angle and positive step length.')
  const DEG = Math.PI / 180
  let x = start.x
  let y = start.y
  let heading = start.heading
  const stack = []
  const segments = []

  for (const char of str) {
    switch (char) {
      case 'F':
      case 'G': {
        const nx = x + stepSize * Math.cos(heading * DEG)
        const ny = y - stepSize * Math.sin(heading * DEG)
        segments.push({ x1: x, y1: y, x2: nx, y2: ny })
        x = nx
        y = ny
        break
      }
      case 'f':
        x += stepSize * Math.cos(heading * DEG)
        y -= stepSize * Math.sin(heading * DEG)
        break
      case '+':
        heading += angle
        break
      case '-':
        heading -= angle
        break
      case '[':
        stack.push({ x, y, heading })
        break
      case ']': {
        const saved = stack.pop()
        if (!saved)
          throw new Error('The pattern contains an unmatched closing bracket.')
        x = saved.x
        y = saved.y
        heading = saved.heading
        break
      }
      case '|':
        heading += 180
        break
    }
  }

  if (stack.length)
    throw new Error('The pattern contains an unmatched opening bracket.')
  if (!segments.length)
    return {
      segments,
      bounds: { minX: start.x, minY: start.y, maxX: start.x, maxY: start.y }
    }

  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity
  for (const { x1, y1, x2, y2 } of segments) {
    minX = Math.min(minX, x1, x2)
    minY = Math.min(minY, y1, y2)
    maxX = Math.max(maxX, x1, x2)
    maxY = Math.max(maxY, y1, y2)
  }

  return { segments, bounds: { minX, minY, maxX, maxY } }
}

export const PRESETS = {
  plant: {
    label: 'Botanical · Plant',
    axiom: 'X',
    rules: { X: 'F+[[X]-X]-F[-FX]+X', F: 'FF' },
    angle: 25,
    iterations: 5,
    stepSize: 4,
    maxIterations: 7
  },
  sierpinski: {
    label: 'Sierpinski triangle',
    axiom: 'F-G-G',
    rules: { F: 'F-G+F+G-F', G: 'GG' },
    angle: 120,
    iterations: 6,
    stepSize: 5,
    maxIterations: 8
  },
  koch: {
    label: 'Koch curve',
    axiom: 'F',
    rules: { F: 'F+F-F-F+F' },
    angle: 90,
    iterations: 4,
    stepSize: 5,
    maxIterations: 7
  },
  dragon: {
    label: 'Dragon curve',
    axiom: 'FX',
    rules: { X: 'X+YF+', Y: '-FX-Y' },
    angle: 90,
    iterations: 12,
    stepSize: 5,
    maxIterations: 15
  },
  hilbert: {
    label: 'Hilbert curve',
    axiom: 'A',
    rules: { A: '+BF-AFA-FB+', B: '-AF+BFB+FA-' },
    angle: 90,
    iterations: 6,
    stepSize: 6,
    maxIterations: 8
  }
}
