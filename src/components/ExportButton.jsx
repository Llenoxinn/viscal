import { exportPNG, exportSVG, exportHighResPNG } from '../hooks/useExport'

/**
 * ExportButton
 * Renders PNG / SVG / 2x export buttons.
 * Pass canvasRef for PNG engines, svgRef for L-system.
 *
 * @param {React.RefObject} canvasRef - canvas element ref (Lissajous, RD)
 * @param {React.RefObject} svgRef    - svg element ref (L-system)
 * @param {string}          filename  - base filename without extension
 */
export default function ExportButton({ canvasRef, svgRef, filename = 'viscal' }) {
  return (
    <div className="absolute bottom-4 right-4 flex gap-2 z-10">
      {canvasRef && (
        <>
          <button
            onClick={() => exportPNG(canvasRef, filename)}
            className="px-3 py-1.5 text-xs font-mono bg-black/60 backdrop-blur-sm border border-border text-muted hover:text-accent hover:border-accent rounded transition-colors"
          >
            png
          </button>
          <button
            onClick={() => exportHighResPNG(canvasRef, filename)}
            className="px-3 py-1.5 text-xs font-mono bg-black/60 backdrop-blur-sm border border-border text-muted hover:text-accent hover:border-accent rounded transition-colors"
          >
            png 2x
          </button>
        </>
      )}
      {svgRef && (
        <button
          onClick={() => exportSVG(svgRef, filename)}
          className="px-3 py-1.5 text-xs font-mono bg-black/60 backdrop-blur-sm border border-border text-muted hover:text-accent hover:border-accent rounded transition-colors"
        >
          svg
        </button>
      )}
    </div>
  )
}
