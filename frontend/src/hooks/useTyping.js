import { useState, useCallback, useMemo } from 'react'
import useTimer from './useTimer'

export default function useTyping(targetText) {
  const [typed, setTyped] = useState('')
  const [finished, setFinished] = useState(false)
  const { seconds, start, stop, reset: resetTimer } = useTimer()

  const handleChange = useCallback(
    (value) => {
      if (finished) return
      if (value.length > targetText.length) return
      if (value.length > 0 && typed.length === 0) start()
      setTyped(value)
      if (value.length === targetText.length) {
        setFinished(true)
        stop()
      }
    },
    [finished, targetText, typed, start, stop]
  )

  const reset = useCallback(() => {
    setTyped('')
    setFinished(false)
    resetTimer()
  }, [resetTimer])

  const stats = useMemo(() => {
    let correct = 0
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === targetText[i]) correct++
    }
    const accuracy = typed.length
      ? Math.round((correct / typed.length) * 100)
      : 100
    const minutes = seconds / 60
    const wpm = minutes > 0 ? Math.round(correct / 5 / minutes) : 0
    return { correct, errors: typed.length - correct, accuracy, wpm }
  }, [typed, targetText, seconds])

  return { typed, finished, seconds, stats, handleChange, reset }
}
