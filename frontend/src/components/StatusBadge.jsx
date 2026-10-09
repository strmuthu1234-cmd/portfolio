import { STATUS_LABELS } from '../utils/format'

const STYLES = {
  active: 'border-ok/30 bg-ok/10 text-ok',
  on_leave: 'border-yellow-400/30 bg-yellow-400/10 text-yellow-300',
  inactive: 'border-line bg-surface2 text-muted',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${STYLES[status] || STYLES.inactive}`}>
      {STATUS_LABELS[status] || status}
    </span>
  )
}
