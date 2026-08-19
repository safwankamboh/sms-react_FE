import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useGetStudentHistoryQuery } from '../../store/api/studentsApi'
import { Card, Button, Badge, PageHeader, Loader, Table, EmptyState } from '../../components/common'
import type { Column } from '../../components/common/Table'
import type { StudentStatus, StudentStatusHistoryEntry } from '../../types'
import { formatDate } from '../../utils/helpers'

const STATUS_BADGE_VARIANT: Record<StudentStatus, 'success' | 'default' | 'info' | 'warning'> = {
  active: 'success',
  inactive: 'default',
  transferred: 'info',
  withdrawn: 'warning',
  graduated: 'success',
}

const DECISION_LABEL: Record<string, string> = {
  promoted: 'Promoted',
  retained: 'Retained',
  transferred: 'Transferred',
  new_admission: 'New Admission',
}

function StudentHistoryPage() {
  const { classId, studentId } = useParams()
  const navigate = useNavigate()
  const { data: history, isFetching: loading, isError } = useGetStudentHistoryQuery(Number(studentId))

  const statusColumns: Column<StudentStatusHistoryEntry>[] = [
    { key: 'status', header: 'Status', render: (h) => <Badge variant={STATUS_BADGE_VARIANT[h.Status]}>{h.Status}</Badge> },
    { key: 'effective_date', header: 'Effective Date', render: (h) => formatDate(h.EffectiveDate) },
    { key: 'reason', header: 'Reason', render: (h) => h.Reason ?? '—' },
  ]

  if (loading) return <Loader fullPage />
  if (isError || !history) {
    return <EmptyState title="Couldn't load history" description="This student's history could not be fetched." compact />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Students"
        title="Academic & Status History"
        description={`${history.Student.GrNumber} · ${history.Student.FirstName} ${history.Student.LastName}`}
        actions={
          <Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate(`/students/${classId}/${studentId}/profile`)}>
            Back to Profile
          </Button>
        }
      />

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Academic Timeline</h2>
        {history.Timeline.length === 0 ? (
          <EmptyState compact title="No enrollment history yet" />
        ) : (
          <div className="space-y-3">
            {history.Timeline.map((entry) => (
              <Card key={entry.Enrollment.Id} className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-900">{entry.Enrollment.AcademicYear?.Name ?? `Year #${entry.Enrollment.AcademicYearId}`}</p>
                    <p className="text-sm text-slate-500">
                      {entry.Enrollment.Class?.ClassName ?? '—'}
                      {entry.Enrollment.ClassSection ? ` — ${entry.Enrollment.ClassSection.SectionName}` : ''}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default">{entry.Enrollment.Status}</Badge>
                    {entry.Enrollment.PromotionStatus && (
                      <Badge variant="info">{DECISION_LABEL[entry.Enrollment.PromotionStatus] ?? entry.Enrollment.PromotionStatus}</Badge>
                    )}
                  </div>
                </div>
                {entry.Promotion && (
                  <div className="mt-3 border-t border-slate-100 pt-3 text-sm text-slate-500">
                    <p>
                      {DECISION_LABEL[entry.Promotion.Decision] ?? entry.Promotion.Decision} on {formatDate(entry.Promotion.ProcessedAt)}
                      {entry.Promotion.ProcessedBy ? ` by ${entry.Promotion.ProcessedBy.Username}` : ''}
                    </p>
                    {entry.Promotion.Remarks && <p className="mt-1 italic">"{entry.Promotion.Remarks}"</p>}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Status History</h2>
        <Table columns={statusColumns} data={history.StatusHistory} emptyTitle="No status changes recorded" rowKey="Id" />
      </div>
    </div>
  )
}

export default StudentHistoryPage
