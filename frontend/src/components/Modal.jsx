import { useEffect } from 'react'

// Right-hand drawer on desktop, bottom-sheet-like full width on mobile.
export default function Modal({ open, onClose, title, children, wide = false }) {
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 animate-fade-in bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative flex h-full w-full animate-slide-up flex-col border-l border-line bg-surface ${
          wide ? 'sm:max-w-2xl' : 'sm:max-w-md'
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button type="button" onClick={onClose} className="btn-ghost btn-sm" aria-label="Close">
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  )
}
