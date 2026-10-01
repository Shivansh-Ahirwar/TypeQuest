import { useState, useRef, useCallback, useEffect } from 'react'

export default function useTimer() {
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef(null)

  const start = useCallback(() => setRunning(true), [])
  const stop = useCallback(() => setRunning(false), [])
  const reset = useCallback(() => {
    setRunning(false)
    setSeconds(0)
  }, [])

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setSeconds((s) => s + 1)
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [running])

  return { seconds, running, start, stop, reset }
}
