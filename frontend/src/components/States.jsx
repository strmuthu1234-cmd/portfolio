export function Spinner({ label = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12 text-sm text-muted" role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-accent" />
      {label}
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="glass border-red-500/30 p-6 text-center" role="alert">
      <p className="text-sm text-red-300">{message || 'Something went wrong.'}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-ghost btn-sm mt-4">
          Try again
        </button>
      )}
    </div>
  )
}

export function EmptyState({ title = 'Nothing here yet', hint, action }) {
  return (
    <div className="glass p-10 text-center">
      <p className="font-medium">{title}</p>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

// Wraps a useFetch result: spinner → error → empty → children(data)
export function AsyncBoundary({ state, isEmpty, emptyProps, children }) {
  if (state.loading && !state.data) return <Spinner />
  if (state.error) return <ErrorState message={state.error} onRetry={state.reload} />
  if (!state.data || isEmpty?.(state.data)) return <EmptyState {...emptyProps} />
  return children(state.data)
}
