// Turns the backend's {"error": {message, details}} payload (or any axios error)
// into a human-readable message plus a field-level error map.
export function parseApiError(err) {
  if (!err.response) {
    return { message: 'Cannot reach the API. Is the backend running?', fields: {} }
  }
  const payload = err.response.data?.error
  const fields = {}
  const details = payload?.details
  if (details && typeof details === 'object') {
    for (const [key, val] of Object.entries(details)) {
      fields[key] = Array.isArray(val) ? val.join(' ') : String(val)
    }
  }
  return {
    message: payload?.message || err.message || 'Something went wrong.',
    fields,
  }
}
