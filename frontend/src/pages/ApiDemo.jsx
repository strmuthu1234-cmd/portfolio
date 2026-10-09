import { useState } from 'react'
import Section from '../components/Section'
import Modal from '../components/Modal'
import EmployeeForm from '../components/EmployeeForm'
import StatusBadge from '../components/StatusBadge'
import Pagination from '../components/Pagination'
import { AsyncBoundary } from '../components/States'
import useFetch from '../hooks/useFetch'
import { employeesApi } from '../services/resources'
import { API_BASE_URL } from '../services/api'
import { formatDate, initials } from '../utils/format'
import { parseApiError } from '../utils/errors'

const PAGE_SIZE = 6
const ENDPOINTS = [
  ['GET', '/api/employees/'],
  ['POST', '/api/employees/'],
  ['GET', '/api/employees/:id/'],
  ['PATCH', '/api/employees/:id/'],
  ['DELETE', '/api/employees/:id/'],
]
const METHOD_COLOR = {
  GET: 'text-ok',
  POST: 'text-accent',
  PATCH: 'text-yellow-300',
  DELETE: 'text-red-400',
}

export default function ApiDemo() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [modal, setModal] = useState(null) // {mode: 'add'|'edit'|'view', employee?}
  const [notice, setNotice] = useState('')

  const state = useFetch(
    () => employeesApi.list({ page, page_size: PAGE_SIZE, search: search || undefined, status: status || undefined }),
    [page, search, status],
  )

  const close = () => setModal(null)
  const saved = (msg) => {
    close()
    setNotice(msg)
    state.reload()
  }

  const remove = async (emp) => {
    if (!window.confirm(`Delete ${emp.name}?`)) return
    try {
      await employeesApi.remove(emp.id)
      // Step back a page if we just deleted the last row on this page.
      if (state.data.results.length === 1 && page > 1) setPage(page - 1)
      else state.reload()
      setNotice(`${emp.name} deleted.`)
    } catch (err) {
      setNotice(parseApiError(err).message)
    }
  }

  const docsUrl = API_BASE_URL.replace(/\/api\/?$/, '') + '/api/docs/'

  return (
    <Section
      eyebrow="API Demo"
      title="Employee API — live CRUD"
      subtitle="This table talks to the Django REST Framework backend in real time."
    >
      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <div className="glass p-5 lg:col-span-2">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">Endpoints</p>
          <ul className="grid gap-1.5 font-mono text-sm sm:grid-cols-2">
            {ENDPOINTS.map(([m, p]) => (
              <li key={m + p}>
                <span className={`inline-block w-16 font-semibold ${METHOD_COLOR[m]}`}>{m}</span>
                <span className="text-muted">{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="glass flex flex-col justify-between p-5">
          <p className="text-sm text-muted">Full request/response schemas, try-it-out included.</p>
          <a href={docsUrl} target="_blank" rel="noreferrer" className="btn-ghost mt-4">
            Open Swagger docs ↗
          </a>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="search"
          className="input max-w-xs"
          placeholder="Search name, email…"
          aria-label="Search employees"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
        />
        <select
          className="input w-auto"
          aria-label="Filter by status"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value)
            setPage(1)
          }}
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="on_leave">On Leave</option>
          <option value="inactive">Inactive</option>
        </select>
        <button type="button" className="btn-primary ml-auto" onClick={() => setModal({ mode: 'add' })}>
          + Add Employee
        </button>
      </div>

      {notice && (
        <p className="mb-4 animate-fade-in rounded-xl border border-ok/30 bg-ok/10 px-4 py-2 text-sm text-ok" role="status">
          {notice}
        </p>
      )}

      <AsyncBoundary
        state={state}
        isEmpty={(d) => !d.results.length}
        emptyProps={{
          title: 'No employees found',
          hint: search || status ? 'Try clearing the filters.' : 'Add the first employee to get started.',
        }}
      >
        {(d) => (
          <div className="glass overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b border-line bg-surface2/60 text-xs uppercase tracking-wider text-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium">Employee</th>
                    <th className="px-4 py-3 font-medium">Department</th>
                    <th className="px-4 py-3 font-medium">Designation</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {d.results.map((emp) => (
                    <tr key={emp.id} className="transition hover:bg-surface2/40">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-white">
                            {initials(emp.name)}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-medium">{emp.name}</p>
                            <p className="truncate text-xs text-muted">{emp.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted">{emp.department}</td>
                      <td className="px-4 py-3 text-muted">{emp.designation}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={emp.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button type="button" className="btn-ghost btn-sm" onClick={() => setModal({ mode: 'view', employee: emp })}>
                            View
                          </button>
                          <button type="button" className="btn-ghost btn-sm" onClick={() => setModal({ mode: 'edit', employee: emp })}>
                            Edit
                          </button>
                          <button type="button" className="btn-danger btn-sm" onClick={() => remove(emp)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-line px-4 pb-4">
              <Pagination page={page} count={d.count} pageSize={PAGE_SIZE} onChange={setPage} />
            </div>
          </div>
        )}
      </AsyncBoundary>

      <Modal open={modal?.mode === 'add'} onClose={close} title="Add employee">
        <EmployeeForm onCancel={close} onSaved={(e) => saved(`${e.name} added.`)} />
      </Modal>
      <Modal open={modal?.mode === 'edit'} onClose={close} title="Edit employee">
        {modal?.mode === 'edit' && (
          <EmployeeForm employee={modal.employee} onCancel={close} onSaved={(e) => saved(`${e.name} updated.`)} />
        )}
      </Modal>
      <Modal open={modal?.mode === 'view'} onClose={close} title="Employee details">
        {modal?.mode === 'view' && (
          <dl className="space-y-4 text-sm">
            {[
              ['ID', modal.employee.id],
              ['Name', modal.employee.name],
              ['Email', modal.employee.email],
              ['Department', modal.employee.department],
              ['Designation', modal.employee.designation],
              ['Join date', formatDate(modal.employee.join_date)],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-line pb-3">
                <dt className="text-muted">{k}</dt>
                <dd className="text-right font-medium">{v}</dd>
              </div>
            ))}
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Status</dt>
              <dd>
                <StatusBadge status={modal.employee.status} />
              </dd>
            </div>
          </dl>
        )}
      </Modal>
    </Section>
  )
}
