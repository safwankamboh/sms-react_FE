import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useGetAttendanceReportQuery, useGetStudentsByClassQuery } from '../../store/api/studentsApi'
import { Card, Button, Select, PageHeader, Loader } from '../../components/common'

function AttendanceReportPage() {
  const { classId } = useParams()
  const navigate = useNavigate()

  const [studentId, setStudentId] = useState('')
  const [month, setMonth] = useState('')
  const [appliedStudentId, setAppliedStudentId] = useState('')
  const [appliedMonth, setAppliedMonth] = useState('')

  const { data: students = [] } = useGetStudentsByClassQuery(Number(classId), { skip: !classId })

  const { data: report, isFetching: loading } = useGetAttendanceReportQuery({
    classId: classId ?? '',
    date: appliedMonth ? `${appliedMonth}-01` : undefined,
    studentId: appliedStudentId || undefined,
  })

  const handleFilter = () => {
    setAppliedStudentId(studentId)
    setAppliedMonth(month)
  }

  const rows = report?.Results ?? []
  const days = report?.Days ?? []

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Academic" title="Attendance Report" description={report?.Class ? `Monthly attendance for ${report.Class.ClassName}` : 'Monthly attendance record'}
        actions={<Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate('/attendance')}>Back</Button>}
      />

      <Card className="p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto_auto] sm:items-end">
          <Select
            label="Student"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            options={students.map((s) => ({ value: s.Id, label: `${s.FirstName} ${s.LastName}` }))}
            placeholder="-- All Students --"
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Search By Date</label>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100 sm:w-auto"
            />
          </div>
          <Button onClick={handleFilter}>Filter</Button>
        </div>
      </Card>

      {loading ? (
        <Loader />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Full Name</th>
                  {days.map((day) => (
                    <th key={day} className="px-2 py-3 text-center text-xs font-semibold text-slate-500">{day}</th>
                  ))}
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Total Present</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Total Absent</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Total Leave</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.length === 0 ? (
                  <tr><td colSpan={days.length + 5} className="px-5 py-10 text-center text-sm text-slate-400">No attendance records found.</td></tr>
                ) : rows.map((row, index) => {
                  const cells = row as unknown as Record<string, string | number | undefined>
                  return (
                    <tr key={row.StudentId}>
                      <td className="px-4 py-2.5 text-slate-500">{index + 1}</td>
                      <td className="px-4 py-2.5 font-medium text-slate-900">{row.StudentName}</td>
                      {days.map((day) => (
                        <td key={day} className="px-2 py-2.5 text-center text-slate-500">{String(cells[`Day${day}`] ?? '-')}</td>
                      ))}
                      <td className="px-4 py-2.5 text-center font-semibold text-slate-900">{row.TotalPresent}</td>
                      <td className="px-4 py-2.5 text-center text-slate-600">{row.TotalAbsent}</td>
                      <td className="px-4 py-2.5 text-center text-slate-600">{row.TotalLeave}</td>
                    </tr>
                  )
                })}
              </tbody>
              {rows.length > 0 && (
                <tfoot>
                  <tr className="border-t-2 border-slate-200 bg-slate-50 font-semibold">
                    <td colSpan={2 + days.length} className="px-4 py-3 text-center text-slate-700">Total</td>
                    <td className="px-4 py-3 text-center text-slate-900">{report?.TotalPresentCount}</td>
                    <td className="px-4 py-3 text-center text-slate-900">{report?.TotalAbsentCount}</td>
                    <td className="px-4 py-3 text-center text-slate-900">{report?.TotalLeaveCount}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}

export default AttendanceReportPage
