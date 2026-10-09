import { useEffect, useState } from 'react'

// Types `lines` one character at a time. Returns the text typed so far.
export default function useTypingLines(lines, { speed = 28, pause = 350 } = {}) {
  const [typed, setTyped] = useState([])
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setTyped(lines)
      setDone(true)
      return undefined
    }
    let cancelled = false
    let timer
    let line = 0
    let char = 0
    const tick = () => {
      if (cancelled) return
      if (line >= lines.length) {
        setDone(true)
        return
      }
      char += 1
      // Capture now: the updater may run after `line`/`char` have moved on.
      const idx = line
      const text = lines[idx].slice(0, char)
      setTyped((prev) => {
        const next = prev.slice(0, idx)
        next[idx] = text
        return next
      })
      if (char >= lines[line].length) {
        line += 1
        char = 0
        timer = setTimeout(tick, pause)
      } else {
        timer = setTimeout(tick, speed)
      }
    }
    timer = setTimeout(tick, 500)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { typed, done }
}
