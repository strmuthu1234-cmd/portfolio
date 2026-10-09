const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Each validator returns an error map; empty object means valid.
export function validateContact(v) {
  const e = {}
  if (!v.name.trim()) e.name = 'Name is required.'
  if (!EMAIL_RE.test(v.email)) e.email = 'Enter a valid email address.'
  if (!v.subject.trim()) e.subject = 'Subject is required.'
  if (v.message.trim().length < 10) e.message = 'Message must be at least 10 characters.'
  return e
}

export function validateEmployee(v) {
  const e = {}
  if (!v.name.trim()) e.name = 'Name is required.'
  if (!EMAIL_RE.test(v.email)) e.email = 'Enter a valid email address.'
  if (!v.department.trim()) e.department = 'Department is required.'
  if (!v.designation.trim()) e.designation = 'Designation is required.'
  if (!v.join_date) e.join_date = 'Join date is required.'
  return e
}

export function validateLogin(v) {
  const e = {}
  if (!v.username.trim()) e.username = 'Username is required.'
  if (!v.password) e.password = 'Password is required.'
  return e
}
