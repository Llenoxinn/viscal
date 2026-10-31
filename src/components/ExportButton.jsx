import { useId, useState } from 'react'
import { exportPNG, exportSVG } from '../hooks/useExport'
import Icon from './Icon'

export default function ExportButton({
  canvasRef,
  svgRef,
  filename = 'viscal',
  disabled = false
}) {
  const id = useId()
  const [format, setFormat] = useState('png')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  async function download() {
    setBusy(true)
    setMessage('')
    try {
      if (format === 'svg') exportSVG(svgRef, filename)
      else
        await exportPNG(
          svgRef || canvasRef,
          filename,
          format === 'png2' ? 2 : 1
        )
      setMessage('Artwork downloaded.')
    } catch (error) {
      setMessage(`Export failed. ${error.message}`)
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className="export-control">
      <label htmlFor={id} className="sr-only">
        Export format
      </label>
      <select
        id={id}
        value={format}
        onChange={(event) => setFormat(event.target.value)}
        aria-label="Export format"
      >
        <option value="png">PNG</option>
        <option value="png2">PNG 2×</option>
        {svgRef && <option value="svg">SVG</option>}
      </select>
      <button
        className="button export-button"
        onClick={download}
        disabled={busy || disabled}
      >
        <Icon name="download" size={15} />
        <span>{busy ? 'Exporting…' : 'Export'}</span>
      </button>
      <output className="export-status sr-only">{message}</output>
      {message.startsWith('Export failed') && (
        <span className="export-error">{message}</span>
      )}
    </div>
  )
}
