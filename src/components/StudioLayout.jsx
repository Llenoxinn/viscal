import { useState } from 'react'
import Icon from './Icon'

export default function StudioLayout({
  children,
  controls,
  title,
  subtitle,
  equation,
  stats,
  onReset,
  onRandomize,
  exports,
  toolbar,
  hint,
  error
}) {
  const [grid, setGrid] = useState(true)
  return (
    <div className="studio-workspace">
      <div className="preview-panel">
        <div className="preview-toolbar">
          <div className="preview-title">
            <span className="status-dot" />
            <span>Live preview</span>
            <span className="preview-slash">/</span>
            <span className="preview-engine">{title}</span>
          </div>
          <div className="preview-actions">
            <button
              className={`icon-button ${grid ? 'is-active' : ''}`}
              aria-label="Show canvas grid"
              aria-pressed={grid}
              title="Toggle canvas grid"
              onClick={() => setGrid(!grid)}
            >
              <Icon name="grid" size={16} />
            </button>
            {exports}
          </div>
        </div>
        <div className={`artboard ${grid ? 'with-grid' : ''}`}>
          <span className="canvas-label">
            VISCAL — EXPERIMENT{' '}
            {title === 'Lissajous'
              ? '001'
              : title === 'L-System'
                ? '002'
                : '003'}
          </span>
          <div className="artwork">{children}</div>
          <div className="canvas-bottom">
            <span className="canvas-hint">
              {hint || 'A little adjustment can change everything.'}
            </span>
            {toolbar}
          </div>
          {error && (
            <p role="alert" className="canvas-error">
              {error}
            </p>
          )}
        </div>
        <div className="preview-footer">
          <span className="equation">{equation}</span>
          <span>{stats}</span>
        </div>
      </div>
      <aside className="parameters-panel" aria-label={`${title} controls`}>
        <div className="parameters-heading">
          <div>
            <span className="eyebrow">YOUR EXPERIMENT</span>
            <h2>{title}</h2>
          </div>
          <Icon name="sliders" />
        </div>
        <p className="parameters-description">{subtitle}</p>
        <div className="parameters-body">{controls}</div>
        <div className="parameter-actions">
          <button className="button button-primary" onClick={onRandomize}>
            <Icon name="shuffle" size={16} />
            Surprise me
          </button>
          <button
            className="icon-button reset-button"
            aria-label={`Reset ${title} parameters`}
            title="Reset to defaults"
            onClick={onReset}
          >
            <Icon name="reset" size={17} />
          </button>
        </div>
      </aside>
    </div>
  )
}
