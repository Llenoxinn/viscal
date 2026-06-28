import { useState } from 'react'
import LissajousCanvas from './components/LissajousCanvas'
import LSystemCanvas from './components/LSystemCanvas'
import RDCanvas from './components/RDCanvas'
import Sidebar from './components/Sidebar'
import EngineSelector from './components/EngineSelector'

/**
 * App — root layout.
 * Sidebar | EngineSelector / Canvas area
 */
export default function App() {
  const [engine, setEngine] = useState('lissajous')

  return (
    <div className="flex h-screen w-screen bg-canvas overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <EngineSelector active={engine} onChange={setEngine} />

        <div className="flex-1 relative overflow-hidden">
          <div className={engine === 'lissajous' ? 'absolute inset-0' : 'hidden'}>
            <LissajousCanvas />
          </div>
          <div className={engine === 'lsystem' ? 'absolute inset-0' : 'hidden'}>
            <LSystemCanvas />
          </div>
          <div className={engine === 'rd' ? 'absolute inset-0' : 'hidden'}>
            <RDCanvas />
          </div>
        </div>
      </main>
    </div>
  )
}
