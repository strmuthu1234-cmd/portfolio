// Admin-friendly text format for architecture flows, one flow per line:
//   System architecture: React.js > REST API > Django REST Framework > PostgreSQL
export function flowsToText(flows = []) {
  return flows.map((f) => `${f.title}: ${f.steps.join(' > ')}`).join('\n')
}

export function textToFlows(text) {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const idx = line.indexOf(':')
      if (idx < 1) throw new Error(`Flow "${line}" must look like "Title: step > step".`)
      const steps = line
        .slice(idx + 1)
        .split('>')
        .map((s) => s.trim())
        .filter(Boolean)
      if (!steps.length) throw new Error(`Flow "${line}" needs at least one step.`)
      return { title: line.slice(0, idx).trim(), steps }
    })
}

export const splitList = (text, sep) =>
  text
    .split(sep)
    .map((s) => s.trim())
    .filter(Boolean)
