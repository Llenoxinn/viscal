import { useEffect, useRef } from 'react'

/**
 * useAnimationLoop
 * Calls `callback` every animation frame while `running` is true.
 * @param {function} callback - called with no args each frame
 * @param {boolean}  running  - pause/resume control
 */
export function useAnimationLoop(callback, running = true) {
  const rafRef = useRef(null)
  const cbRef  = useRef(callback)

  useEffect(() => { cbRef.current = callback }, [callback])

  useEffect(() => {
    if (!running) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      return
    }
    const tick = () => {
      cbRef.current()
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [running])
}
