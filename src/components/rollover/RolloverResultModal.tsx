import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'
import { Modal, Button, Badge, EmptyState } from '../common'
import type { RolloverResult } from '../../types'

interface RolloverResultModalProps {
  open: boolean
  onClose: () => void
  result: RolloverResult | null
  // GrNumber/Name lookup for the ids in the result — the result payload
  // itself only carries StudentId, not identity, so the page passes the
  // candidate list it just submitted for display purposes.
  studentLookup: Record<number, { grNumber: string; name: string }>
}

function StudentLine({ studentId, lookup, right }: { studentId: number; lookup: RolloverResultModalProps['studentLookup']; right?: React.ReactNode }) {
  const info = lookup[studentId]
  return (
    <div className="flex items-center justify-between px-4 py-2.5 text-sm">
      <div>
        <span className="font-medium text-slate-900">{info?.name ?? `Student #${studentId}`}</span>
        {info?.grNumber && <span className="ml-2 text-xs text-slate-500">{info.grNumber}</span>}
      </div>
      {right}
    </div>
  )
}

function RolloverResultModal({ open, onClose, result, studentLookup }: RolloverResultModalProps) {
  if (!result) return null

  return (
    <Modal open={open} onClose={onClose} title="Rollover Result" size="lg" footer={<div className="flex justify-end"><Button onClick={onClose}>Done</Button></div>}>
      <div className="space-y-6">
        <section>
          <div className="mb-2 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <h3 className="text-sm font-semibold text-slate-900">Processed ({result.Processed.length})</h3>
          </div>
          {result.Processed.length === 0 ? (
            <p className="px-1 text-xs text-slate-400">No students were newly processed.</p>
          ) : (
            <div className="divide-y divide-slate-100 border border-slate-200">
              {result.Processed.map((row) => (
                <StudentLine key={row.StudentId} studentId={row.StudentId} lookup={studentLookup} right={<Badge variant="success">Enrollment #{row.EnrollmentId}</Badge>} />
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-2 flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-600" />
            <h3 className="text-sm font-semibold text-slate-900">Already Processed ({result.AlreadyProcessed.length})</h3>
          </div>
          {result.AlreadyProcessed.length === 0 ? (
            <p className="px-1 text-xs text-slate-400">None.</p>
          ) : (
            <div className="divide-y divide-slate-100 border border-slate-200">
              {result.AlreadyProcessed.map((row) => (
                <StudentLine key={row.StudentId} studentId={row.StudentId} lookup={studentLookup} right={<Badge variant="warning">Already had an enrollment for this year</Badge>} />
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-2 flex items-center gap-2">
            <XCircle size={16} className="text-rose-600" />
            <h3 className="text-sm font-semibold text-slate-900">Rejected ({result.Rejected.length})</h3>
          </div>
          {result.Rejected.length === 0 ? (
            <p className="px-1 text-xs text-slate-400">None.</p>
          ) : (
            <div className="divide-y divide-slate-100 border border-slate-200">
              {result.Rejected.map((row) => (
                <StudentLine key={row.StudentId} studentId={row.StudentId} lookup={studentLookup} right={<Badge variant="danger">{row.Reason}</Badge>} />
              ))}
            </div>
          )}
        </section>

        {result.Processed.length === 0 && result.AlreadyProcessed.length === 0 && result.Rejected.length === 0 && (
          <EmptyState compact title="Nothing was submitted" />
        )}
      </div>
    </Modal>
  )
}

export default RolloverResultModal
