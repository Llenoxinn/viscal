const BACKGROUND = '#111411'

function downloadBlob(blob, filename) {
  if (!blob)
    throw new Error('The browser could not create an image. Try again.')
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.append(link)
  link.click()
  link.remove()
  // Let the browser consume the download before releasing its URL.
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function serializeSVG(svg, width, height, strokeScale = 1) {
  const clone = svg.cloneNode(true)
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  clone.setAttribute('width', width)
  clone.setAttribute('height', height)
  clone.removeAttribute('class')
  for (const path of clone.querySelectorAll(
    '[vector-effect="non-scaling-stroke"]'
  ))
    path.setAttribute(
      'stroke-width',
      Number(path.getAttribute('stroke-width')) * strokeScale
    )
  const { x, y, width: vbWidth, height: vbHeight } = svg.viewBox.baseVal
  const background = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'rect'
  )
  for (const [key, value] of Object.entries({
    x,
    y,
    width: vbWidth,
    height: vbHeight,
    fill: BACKGROUND
  }))
    background.setAttribute(key, value)
  clone.prepend(background)
  return new XMLSerializer().serializeToString(clone)
}

export function exportSVG(svgRef, filename = 'viscal') {
  const svg = svgRef?.current
  if (!svg) throw new Error('No artwork is available yet.')
  const { width, height } = svg.getBoundingClientRect()
  downloadBlob(
    new Blob([serializeSVG(svg, Math.round(width), Math.round(height))], {
      type: 'image/svg+xml'
    }),
    `${filename}.svg`
  )
}

export async function exportPNG(ref, filename = 'viscal', scale = 1) {
  const source = ref?.current
  if (!source) throw new Error('No artwork is available yet.')
  const isSVG = source instanceof SVGElement
  const bounds = source.getBoundingClientRect()
  const width = Math.round(isSVG ? bounds.width : source.width)
  const height = Math.round(isSVG ? bounds.height : source.height)
  if (!width || !height) throw new Error('The artwork has no visible size.')
  const canvas = document.createElement('canvas')
  canvas.width = width * scale
  canvas.height = height * scale
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas is unavailable in this browser.')
  context.fillStyle = BACKGROUND
  context.fillRect(0, 0, canvas.width, canvas.height)

  if (isSVG) {
    // Rasterize the vector at the target size; do not upscale a low-resolution bitmap.
    const blob = new Blob(
      [serializeSVG(source, canvas.width, canvas.height, scale)],
      { type: 'image/svg+xml' }
    )
    const url = URL.createObjectURL(blob)
    try {
      const image = new Image()
      image.src = url
      await image.decode()
      context.drawImage(image, 0, 0)
    } finally {
      URL.revokeObjectURL(url)
    }
  } else {
    context.imageSmoothingEnabled = false
    context.drawImage(source, 0, 0, canvas.width, canvas.height)
  }
  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, 'image/png')
  )
  downloadBlob(blob, `${filename}${scale === 2 ? '@2x' : ''}.png`)
}
