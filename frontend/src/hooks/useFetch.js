import { useCallback, useEffect, useState } from 'react'
import { parseApiError } from '../utils/errors'

// Runs `fn` on mount (and whenever `deps` change). Returns {data, loading, error, reload}.
export default function useFetch(fn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null })
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    setState((s) => ({ ...s, loading: true, error: null }))
    fn()
      .then((data) => !cancelled && setState({ data, loading: false, error: null }))
      .catch((err) => !cancelled && setState({ data: null, loading: false, error: parseApiError(err).message }))
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick])

  const reload = useCallback(() => setTick((t) => t + 1), [])
  return { ...state, reload }
}
