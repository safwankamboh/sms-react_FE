import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useGetClassTimetableQuery } from '../../store/api/classesApi'
import { Card, Button, PageHeader, Loader, EmptyState, Badge } from '../../components/common'

function ClassTimetablePage() {
  const { classId, sectionId } = useParams()
  const navigate = useNavigate()
  const { data: timetable, isFetching: loading } = useGetClassTimetableQuery({ classId: Number(classId), sectionId: Number(sectionId) })

  const rows = [...(timetable?.AssignCourses ?? [])].sort((a, b) => a.FromTime.localeCompare(b.FromTime))

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Administrator" title="Class Timetable" description="Daily schedule for this class section — courses recur every school day at the same time."
        actions={<Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate(`/administrator/classes/${classId}/sections`)}>Back</Button>}
      />

      {loading ? (
        <Loader />
      ) : rows.length === 0 ? (
        <EmptyState title="No schedule yet" description="No courses have been assigned to this section." />
      ) : (
        <Card className="overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Time</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Course</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Teacher</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.Id}>
                  <td className="px-5 py-3 text-sm font-medium text-slate-900">{row.FromTime} – {row.ToTime}</td>
                  <td className="px-5 py-3 text-sm text-slate-600">
                    {row.IsBreak ? <Badge variant="warning">Break</Badge> : (row.Course?.CourseName ?? '—')}
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600">
                    {row.IsBreak ? '—' : (row.Teacher ? [row.Teacher.FirstName, row.Teacher.LastName].filter(Boolean).join(' ') : '—')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}

export default ClassTimetablePage
