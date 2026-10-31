import { useEffect, useRef } from 'react'

export function useAnimationLoop(callback, running = true) {
  const callbackRef = useRef(callback)
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])
  useEffect(() => {
    if (!running) return
    let frame
    let previous = 0
    const tick = (time) => {
      // Keep simulation speed and CPU use independent of high-refresh-rate displays.
      if (time - previous >= 1000 / 30) {
        callbackRef.current()
        previous = time
      }
      frame = requestAnimationFrame(tick)
    }
    const syncVisibility = () => {
      cancelAnimationFrame(frame)
      if (!document.hidden) {
        previous = 0
        frame = requestAnimationFrame(tick)
      }
    }
    syncVisibility()
    document.addEventListener('visibilitychange', syncVisibility)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('visibilitychange', syncVisibility)
    }
  }, [running])
}
