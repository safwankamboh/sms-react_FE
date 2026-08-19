import { useEffect, useState } from 'react'
import { Repeat } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useGetAllAcademicYearsQuery } from '../../store/api/academicYearApi'
import { useGetGlobalClassesQuery, useGetSectionsQuery } from '../../store/api/classesApi'
import { useLazyGetRolloverCandidatesQuery, useSubmitRolloverMutation } from '../../store/api/rolloverApi'
import { Card, PageHeader, Select, Button, Loader, Input, EmptyState } from '../../components/common'
import RolloverResultModal from '../../components/rollover/RolloverResultModal'
import type { RolloverCandidate, RolloverDecision, RolloverDecisionInput, RolloverResult } from '../../types'

const DECISION_OPTIONS: { value: RolloverDecision; label: string }[] = [
  { value: 'promoted', label: 'Promote' },
  { value: 'retained', label: 'Retain' },
  { value: 'transferred', label: 'Transfer' },
]

interface RolloverRowProps {
  candidate: RolloverCandidate
  decision: RolloverDecisionInput
  onChange: (studentId: number, patch: Partial<RolloverDecisionInput>) => void
  classes: { Id: number; ClassName: string }[]
}

// Its own component (not inlined in a .map()) so the per-row "sections for
// the currently selected destination class" query can be a normal hook
// call — each row is a separate component instance, so this doesn't
// violate the rules of hooks the way calling useGetSectionsQuery inside a
// loop body would.
function RolloverRow({ candidate, decision, onChange, classes }: RolloverRowProps) {
  const { data: sections = [] } = useGetSectionsQuery(decision.to_class_id, { skip: !decision.to_class_id })

  const handleDecisionChange = (next: RolloverDecision) => {
    if (next === 'retained') {
      onChange(candidate.StudentId, {
        decision: next,
        to_class_id: candidate.CurrentClassId,
        to_class_section_id: candidate.CurrentClassSectionId ?? 0,
      })
    } else if (next === 'promoted') {
      onChange(candidate.StudentId, {
        decision: next,
        to_class_id: candidate.SuggestedClassId ?? candidate.CurrentClassId,
        to_class_section_id: 0,
      })
    } else {
      onChange(candidate.StudentId, { decision: next, to_class_id: 0, to_class_section_id: 0 })
    }
  }

  return (
    <tr>
      <td className="whitespace-nowrap px-5 py-3 text-sm">
        <p className="font-medium text-slate-900">{candidate.Name}</p>
        <p className="text-xs text-slate-500">{candidate.GrNumber}</p>
      </td>
      <td className="whitespace-nowrap px-5 py-3 text-sm text-slate-600">
        {candidate.CurrentClassSectionName ? `Class — ${candidate.CurrentClassSectionName}` : '—'}
      </td>
      <td className="px-5 py-3">
        <Select
          value={decision.decision}
          options={DECISION_OPTIONS}
          onChange={(e) => handleDecisionChange(e.target.value as RolloverDecision)}
          placeholder=""
        />
      </td>
      <td className="px-5 py-3">
        <Select
          value={decision.to_class_id || ''}
          options={classes.map((c) => ({ value: c.Id, label: c.ClassName }))}
          onChange={(e) => onChange(candidate.StudentId, { to_class_id: Number(e.target.value), to_class_section_id: 0 })}
          placeholder="Select class"
        />
      </td>
      <td className="px-5 py-3">
        <Select
          value={decision.to_class_section_id || ''}
          options={sections.map((s) => ({ value: s.Id, label: s.SectionName }))}
          onChange={(e) => onChange(candidate.StudentId, { to_class_section_id: Number(e.target.value) })}
          placeholder="Select section"
          disabled={!decision.to_class_id}
        />
      </td>
      <td className="px-5 py-3">
        <Input
          value={decision.remarks ?? ''}
          onChange={(e) => onChange(candidate.StudentId, { remarks: e.target.value })}
          placeholder="Optional"
        />
      </td>
    </tr>
  )
}

function AcademicYearRolloverPage() {
  const { activeAcademicYear } = useAuth()
  const { data: years = [] } = useGetAllAcademicYearsQuery()
  const { data: classes = [] } = useGetGlobalClassesQuery()

  const [fromYearId, setFromYearId] = useState(() => (activeAcademicYear ? String(activeAcademicYear.Id) : ''))
  const [toYearId, setToYearId] = useState('')
  const [classId, setClassId] = useState('')

  const [loadCandidates, { data: candidates = [], isFetching: loading }] = useLazyGetRolloverCandidatesQuery()
  const [submitRollover, { isLoading: submitting }] = useSubmitRolloverMutation()

  const [rows, setRows] = useState<Record<number, RolloverDecisionInput>>({})
  const [error, setError] = useState('')
  const [result, setResult] = useState<RolloverResult | null>(null)

  useEffect(() => {
    const seeded: Record<number, RolloverDecisionInput> = {}
    candidates.forEach((c) => {
      seeded[c.StudentId] = {
        student_id: c.StudentId,
        decision: c.SuggestedClassId ? 'promoted' : 'retained',
        to_class_id: c.SuggestedClassId ?? c.CurrentClassId,
        to_class_section_id: c.SuggestedClassId ? 0 : (c.CurrentClassSectionId ?? 0),
        remarks: '',
      }
    })
    setRows(seeded)
  }, [candidates])

  const handleRowChange = (studentId: number, patch: Partial<RolloverDecisionInput>) => {
    setRows((prev) => ({ ...prev, [studentId]: { ...prev[studentId], ...patch } }))
  }

  const handleLoad = async () => {
    setError('')
    if (!fromYearId || !classId) return
    await loadCandidates({ fromAcademicYearId: Number(fromYearId), classId: Number(classId) })
  }

  const handleSubmit = async () => {
    setError('')
    if (!toYearId) {
      setError('Select a destination academic year.')
      return
    }
    if (fromYearId === toYearId) {
      setError('Destination academic year must be different from the source year.')
      return
    }
    const decisions = Object.values(rows)
    const incomplete = decisions.find((d) => !d.to_class_id || !d.to_class_section_id)
    if (incomplete) {
      setError('Every student needs a destination class and section before submitting.')
      return
    }
    try {
      const res = await submitRollover({
        fromAcademicYearId: Number(fromYearId),
        toAcademicYearId: Number(toYearId),
        decisions,
      }).unwrap()
      setResult(res)
    } catch (err) {
      setError((err as { message?: string })?.message ?? 'Failed to process rollover.')
    }
  }

  const studentLookup = Object.fromEntries(
    candidates.map((c) => [c.StudentId, { grNumber: c.GrNumber, name: c.Name }]),
  )

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Administrator"
        title="Academic-Year Rollover"
        description="Bulk promote, retain, or transfer students into a new academic year. Prior-year records are never modified."
      />

      <Card className="p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-4">
          <Select
            label="From Year"
            value={fromYearId}
            options={years.map((y) => ({ value: y.Id, label: y.Name }))}
            onChange={(e) => setFromYearId(e.target.value)}
            placeholder="Select year"
          />
          <Select
            label="To Year"
            value={toYearId}
            options={years.filter((y) => String(y.Id) !== fromYearId).map((y) => ({ value: y.Id, label: y.Name }))}
            onChange={(e) => setToYearId(e.target.value)}
            placeholder="Select year"
          />
          <Select
            label="Class"
            value={classId}
            options={classes.map((c) => ({ value: c.Id, label: c.ClassName }))}
            onChange={(e) => setClassId(e.target.value)}
            placeholder="Select class"
          />
          <div className="flex items-end">
            <Button onClick={handleLoad} disabled={!fromYearId || !classId} className="w-full">Load Students</Button>
          </div>
        </div>
      </Card>

      {error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p>}

      {loading && <Loader />}

      {!loading && candidates.length > 0 && (
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="font-semibold text-slate-900">Candidates</h2>
              <p className="text-sm text-slate-500">{candidates.length} students</p>
            </div>
            <Button icon={<Repeat size={16} />} onClick={handleSubmit} loading={submitting}>Promote Students</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Student</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Current</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Decision</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">To Class</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">To Section</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {candidates.map((candidate) => {
                  const decision = rows[candidate.StudentId]
                  if (!decision) return null
                  return (
                    <RolloverRow key={candidate.StudentId} candidate={candidate} decision={decision} onChange={handleRowChange} classes={classes} />
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {!loading && candidates.length === 0 && (
        <EmptyState title="No candidates loaded" description="Pick a source year and class, then Load Students." compact />
      )}

      <RolloverResultModal
        open={Boolean(result)}
        onClose={() => setResult(null)}
        result={result}
        studentLookup={studentLookup}
      />
    </div>
  )
}

export default AcademicYearRolloverPage
