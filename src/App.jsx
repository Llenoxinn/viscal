import { lazy, Suspense, useState } from 'react'
import LissajousCanvas from './components/LissajousCanvas'
import Sidebar from './components/Sidebar'
import EngineSelector from './components/EngineSelector'
import Icon from './components/Icon'

const LSystemCanvas = lazy(() => import('./components/LSystemCanvas'))
const RDCanvas = lazy(() => import('./components/RDCanvas'))
const COMPONENTS = {
  lissajous: LissajousCanvas,
  lsystem: LSystemCanvas,
  rd: RDCanvas
}

export default function App() {
  const [engine, setEngine] = useState('lissajous')
  const [visited, setVisited] = useState(['lissajous'])

  function selectEngine(key) {
    setEngine(key)
    setVisited((previous) =>
      previous.includes(key) ? previous : [...previous, key]
    )
  }

  return (
    <div className="app-shell">
      <a href="#studio" className="skip-link">
        Skip to studio
      </a>
      <Sidebar />
      <main className="main-content">
        <section className="intro" aria-labelledby="intro-title">
          <div className="intro-copy">
            <h1 id="intro-title">
              A little math.
              <br />
              <span>A wild imagination.</span>
            </h1>
            <p>Play with curves. Grow a fractal. See what happens.</p>
            <a className="button intro-button" href="#studio">
              Explore the studio
              <Icon name="arrow" size={17} />
            </a>
          </div>
          <div className="intro-art" aria-hidden="true">
            <img
              src="/artwork/trefoil-knot.webp"
              alt=""
              width="640"
              height="640"
              fetchPriority="high"
            />
          </div>
        </section>
        <div id="studio" className="studio-section" tabIndex={-1}>
          <EngineSelector active={engine} onChange={selectEngine} />
          {Object.keys(COMPONENTS).map((key) => {
            const Component = COMPONENTS[key]
            return (
              <section
                key={key}
                id={`panel-${key}`}
                role="tabpanel"
                aria-labelledby={`tab-${key}`}
                hidden={engine !== key}
              >
                {visited.includes(key) && (
                  <Suspense
                    fallback={
                      <output className="studio-loading">
                        Preparing your canvas…
                      </output>
                    }
                  >
                    <Component active={engine === key} />
                  </Suspense>
                )}
              </section>
            )
          })}
        </div>
        <footer className="app-footer">
          <a className="footer-brand" href="#intro-title">
            viscal<span>.</span>
          </a>
          <span>Mathematical art for curious minds.</span>
          <a
            href="https://github.com/Llenoxinn"
            target="_blank"
            rel="noreferrer"
          >
            Made by Llenoxinn
            <Icon name="arrow" size={14} />
          </a>
        </footer>
      </main>
    </div>
  )
}
