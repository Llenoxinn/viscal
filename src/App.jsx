import { lazy, Suspense, useState } from 'react'
import LissajousCanvas from './components/LissajousCanvas'
import Sidebar from './components/Sidebar'
import EngineSelector from './components/EngineSelector'

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
      <main id="studio" className="main-content">
        <div className="intro">
          <div>
            <p className="eyebrow">
              <svg className="tiny-star" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M8 0v16M0 8h16M2.3 2.3l11.4 11.4M2.3 13.7 13.7 2.3" />
              </svg>{' '}
              MATH MEETS IMAGINATION
            </p>
            <h1>
              A few numbers.
              <br className="mobile-break" />{' '}
              <span>Infinite possibilities.</span>
            </h1>
            <p className="intro-description">
              Explore the patterns hiding in plain sight. Tweak, experiment,
              make it yours.
            </p>
          </div>
          <span className="studio-label">
            <span className="status-dot" /> GENERATIVE STUDIO / 01
          </span>
        </div>
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
                    <div
                      className="studio-workspace studio-loading"
                      role="status"
                    >
                      Preparing your canvas…
                    </div>
                  }
                >
                  <Component active={engine === key} />
                </Suspense>
              )}
            </section>
          )
        })}
        <footer className="app-footer">
          <span>
            Built for curiosity. Made by{' '}
            <a
              href="https://github.com/Llenoxinn"
              target="_blank"
              rel="noreferrer"
            >
              Llenoxinn ↗
            </a>
          </span>
          <span>NO RIGHT ANSWERS. JUST GOOD EXPERIMENTS.</span>
        </footer>
      </main>
    </div>
  )
}
