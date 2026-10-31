import { useRef } from 'react'
import Icon, { CurveMark } from './Icon'

export default function Sidebar() {
  const dialogRef = useRef(null)
  return (
    <>
      <header className="app-header">
        <a className="brand" href="./" aria-label="Viscal home">
          <CurveMark />
          <span>
            viscal<span className="brand-dot">.</span>
          </span>
        </a>
        <span className="header-caption">
          A playground for mathematical beauty
        </span>
        <div className="header-actions">
          <button
            className="text-button"
            onClick={() => dialogRef.current.showModal()}
          >
            <Icon name="info" />
            <span>Behind the shapes</span>
          </button>
          <a
            className="text-button source-link"
            href="https://github.com/Llenoxinn/viscal"
            target="_blank"
            rel="noreferrer"
          >
            Source code
            <Icon name="arrow" size={16} />
          </a>
        </div>
      </header>
      <dialog
        ref={dialogRef}
        className="about-dialog"
        aria-labelledby="about-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close()
        }}
      >
        <div className="dialog-heading">
          <span className="eyebrow">THE BEAUTY OF A SIMPLE RULE</span>
          <button
            className="icon-button"
            aria-label="Close explanation"
            onClick={() => dialogRef.current.close()}
          >
            <Icon name="close" />
          </button>
        </div>
        <h2 id="about-title">Math, made visible.</h2>
        <p>
          Viscal turns small mathematical rules into things worth looking at.
          Pick an engine, change a few numbers, and see what emerges.
        </p>
        <h3>Lissajous curves</h3>
        <p>
          Two sine waves, one for each axis. Their frequencies and phase offset
          weave a closed, repeating path.
        </p>
        <h3>L-Systems</h3>
        <p>
          A short string grows by repeating a set of replacement rules. A
          virtual pen follows the result to draw plants and fractals.
        </p>
        <h3>Reaction diffusion</h3>
        <p>
          Two virtual chemicals react and spread through a grid. The Gray–Scott
          model produces spots, stripes, and organic patterns. Paint on the
          canvas to add a seed, or use the centered seed button.
        </p>
        <p className="dialog-note">
          Everything is generated in your browser. Your artwork stays on your
          device.
        </p>
      </dialog>
    </>
  )
}
