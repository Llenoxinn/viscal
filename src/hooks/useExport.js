/**
 * useExport.js
 * Provides export functions for Canvas (PNG) and SVG elements.
 */

/**
 * Download a canvas as a PNG file.
 * @param {React.RefObject<HTMLCanvasElement>} canvasRef
 * @param {string} filename - without extension
 */
export function exportPNG(canvasRef, filename = 'viscal') {
  const canvas = canvasRef?.current
  if (!canvas) return
  canvas.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.png`
    a.click()
    URL.revokeObjectURL(url)
  }, 'image/png')
}

/**
 * Download an SVG element as an .svg file.
 * @param {React.RefObject<SVGElement>} svgRef
 * @param {string} filename - without extension
 */
export function exportSVG(svgRef, filename = 'viscal') {
  const svg = svgRef?.current
  if (!svg) return

  const clone = svg.cloneNode(true)
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  bg.setAttribute('width', '100%')
  bg.setAttribute('height', '100%')
  bg.setAttribute('fill', '#0a0a0a')
  clone.insertBefore(bg, clone.firstChild)

  const serializer = new XMLSerializer()
  const svgStr = serializer.serializeToString(clone)
  const blob = new Blob([svgStr], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.svg`
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Export canvas as high-resolution PNG by rendering at 2x scale.
 * @param {React.RefObject<HTMLCanvasElement>} canvasRef
 * @param {string} filename
 */
export function exportHighResPNG(canvasRef, filename = 'viscal') {
  const canvas = canvasRef?.current
  if (!canvas) return

  const scale = 2
  const offscreen = document.createElement('canvas')
  offscreen.width  = canvas.width  * scale
  offscreen.height = canvas.height * scale
  const ctx = offscreen.getContext('2d')
  ctx.scale(scale, scale)
  ctx.drawImage(canvas, 0, 0)

  offscreen.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}@2x.png`
    a.click()
    URL.revokeObjectURL(url)
  }, 'image/png')
}
