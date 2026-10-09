// Visual slot for a future GLB model (e.g. <model-viewer src="/models/product.glb">).
export default function ProductViewerPlaceholder() {
  return (
    <div className="glass glow-border overflow-hidden">
      <div className="relative flex h-64 items-center justify-center bg-gradient-to-br from-blue/10 via-surface2 to-violet/10 sm:h-80">
        <div className="absolute h-44 w-44 animate-spin360 rounded-full border border-dashed border-accent/40 sm:h-56 sm:w-56" />
        <div className="absolute h-28 w-28 rounded-full border border-line sm:h-36 sm:w-36" />
        <div className="relative text-center">
          <p className="font-mono text-sm text-accent">360° viewer</p>
          <p className="mt-1 text-xs text-muted">GLB model slot — drop in a .glb to enable</p>
        </div>
      </div>
      <p className="border-t border-line px-5 py-3 text-xs text-muted">
        Demo placeholder: connect a GLB model here to preview rotation and the 12+ animation states.
      </p>
    </div>
  )
}
