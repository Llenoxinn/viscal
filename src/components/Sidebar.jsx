import { useState } from 'react'

/**
 * Sidebar
 * Collapsible left panel. Contains the Viscal wordmark and info.
 */
export default function Sidebar() {
  const [open, setOpen] = useState(true)

  return (
    <aside
      className={`flex flex-col border-r border-border bg-panel transition-all duration-200
        ${open ? 'w-56' : 'w-10'}`}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between px-3 py-4 text-muted hover:text-white transition-colors"
        title={open ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {open && (
          <span className="font-mono text-sm tracking-widest text-white">
            VISCAL
          </span>
        )}
        <span className="text-xs">{open ? '\u2039' : '\u203a'}</span>
      </button>

      {open && (
        <div className="px-3 flex flex-col gap-5 mt-2">
          <div>
            <p className="text-xs text-muted font-mono leading-relaxed">
              A browser-based generative art playground. Create parametric visuals driven by
              math — Lissajous curves, L-Systems, and reaction-diffusion simulations.
            </p>
          </div>

          <div className="border-t border-border pt-4 flex flex-col gap-3">
            <div>
              <p className="text-[10px] text-muted font-mono uppercase tracking-widest">Engines</p>
              <ul className="mt-1.5 flex flex-col gap-1">
                <li className="text-xs text-accent font-mono">\u25c6 Lissajous</li>
                <li className="text-xs text-accent font-mono">\u25c6 L-System</li>
                <li className="text-xs text-accent font-mono">\u25c6 React-Diff</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-4 mt-auto">
            <p className="text-[10px] text-muted font-mono leading-relaxed">
              Made with love by Llenoxinn
            </p>
            <p className="text-[10px] text-muted font-mono mt-1">v1.0.0</p>
          </div>
        </div>
      )}
    </aside>
  )
}
