import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useGetAttendanceReportQuery } from '../../store/api/studentsApi'
import { Card, Button, Input, PageHeader, Loader, Badge } from '../../components/common'

const STATUS_LABEL: Record<string, string> = { P: 'Present', A: 'Absent', L: 'Leave', '-': 'No record' }

function AttendanceReportPage() {
  const { classId } = useParams()
  const navigate = useNavigate()
  const [month, setMonth] = useState('')

  const { data: report, isFetching: loading } = useGetAttendanceReportQuery({
    classId: classId ?? '',
    date: month ? `${month}-01` : undefined,
  })

  const rows = report?.results ?? []

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Academic" title="Attendance Report" description={report?.class ? `Monthly attendance for ${report.class.ClassName}` : 'Monthly attendance record'}
        actions={<Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate('/attendance')}>Back</Button>}
      />

      <Card className="p-5 sm:p-6">
        <Input type="month" label="Month" value={month} onChange={(e) => setMonth(e.target.value)} className="max-w-xs" />
      </Card>

      {report && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Present</p>
            <p className="mt-1 text-2xl font-bold text-emerald-600">{report.totalPresentCount}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Absent</p>
            <p className="mt-1 text-2xl font-bold text-rose-600">{report.totalAbsentCount}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Leave</p>
            <p className="mt-1 text-2xl font-bold text-amber-600">{report.totalLeaveCount}</p>
          </Card>
        </div>
      )}

      {loading ? (
        <Loader />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="sticky left-0 bg-slate-50 px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Student</th>
                  {(report?.days ?? []).map((day) => (
                    <th key={day} className="px-2 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">{day}</th>
                  ))}
                  <th className="px-3 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">P</th>
                  <th className="px-3 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">A</th>
                  <th className="px-3 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.length === 0 ? (
                  <tr><td colSpan={(report?.days?.length ?? 0) + 4} className="px-5 py-10 text-center text-sm text-slate-400">No attendance records found.</td></tr>
                ) : rows.map((row) => {
                  const cells = row as unknown as Record<string, string | number | undefined>
                  return (
                    <tr key={row.student_id}>
                      <td className="sticky left-0 bg-white px-5 py-2.5 text-sm font-medium text-slate-900">{row.student_name}</td>
                      {(report?.days ?? []).map((day) => {
                        const value = String(cells[`day_${day}`] ?? '-')
                        return (
                          <td key={day} className="px-2 py-2.5 text-center text-xs" title={STATUS_LABEL[value] ?? value}>
                            {value === 'P' ? <Badge variant="success">P</Badge> : value === 'A' ? <Badge variant="danger">A</Badge> : value === 'L' ? <Badge variant="warning">L</Badge> : <span className="text-slate-300">—</span>}
                          </td>
                        )
                      })}
                      <td className="px-3 py-2.5 text-center text-sm text-slate-600">{row.total_present}</td>
                      <td className="px-3 py-2.5 text-center text-sm text-slate-600">{row.total_absent}</td>
                      <td className="px-3 py-2.5 text-center text-sm text-slate-600">{row.total_leave}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}

export default AttendanceReportPage
