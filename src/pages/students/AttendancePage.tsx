import { useState } from 'react'
import { useGetGlobalClassesQuery, useGetSectionsQuery } from '../../store/api/classesApi'
import { useLazyGetStudentsByClassQuery, useSubmitAttendanceMutation } from '../../store/api/studentsApi'
import type { AttendanceRecord } from '../../types'
import { Card, PageHeader, Select, Button, Loader } from '../../components/common'
import { formatDate } from '../../utils/helpers'

type Status = 'present' | 'absent' | 'late'

function AttendancePage() {
  const [classId, setClassId] = useState('')
  const [sectionId, setSectionId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [attendance, setAttendance] = useState<Record<number, Status>>({})
  const [success, setSuccess] = useState(false)

  const { data: classes = [] } = useGetGlobalClassesQuery()
  const { data: sections = [] } = useGetSectionsQuery(Number(classId), { skip: !classId })
  const [loadStudents, { data: students = [], isFetching: loading }] = useLazyGetStudentsByClassQuery()
  const [submitAttendance, { isLoading: submitting }] = useSubmitAttendanceMutation()

  const handleClassChange = (val: string) => {
    setClassId(val); setSectionId(''); setAttendance({})
  }

  const handleLoadStudents = async () => {
    if (!classId) return
    const list = await loadStudents(Number(classId)).unwrap()
    const init: Record<number, Status> = {}
    list.forEach((s) => { init[s.Id] = 'present' })
    setAttendance(init)
  }

  const handleSubmit = async () => {
    const records: AttendanceRecord[] = Object.entries(attendance).map(([id, status]) => ({
      student_id: Number(id), status,
    }))
    await submitAttendance({ classId, sectionId, date, attendance: records }).unwrap()
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  const toggleStatus = (studentId: number, status: Status) => {
    setAttendance((p) => ({ ...p, [studentId]: status }))
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Academic" title="Attendance" description="Mark daily student attendance by class." />

      <Card className="p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-4">
          <Select label="Class" value={classId} options={classes.map((c) => ({ value: c.Id, label: c.ClassName }))} onChange={(e) => handleClassChange(e.target.value)} placeholder="Select class" />
          <Select label="Section" value={sectionId} options={sections.map((s) => ({ value: s.Id, label: s.SectionName }))} onChange={(e) => setSectionId(e.target.value)} placeholder="Select section" />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-100" />
          </div>
          <div className="flex items-end">
            <Button onClick={handleLoadStudents} disabled={!classId} className="w-full">Load Students</Button>
          </div>
        </div>
      </Card>

      {loading && <Loader />}

      {students.length > 0 && (
        <>
          <Card className="overflow-hidden">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="font-semibold text-slate-900">Attendance Sheet — {formatDate(date)}</h2>
              <p className="text-sm text-slate-500">{students.length} students</p>
            </div>
            <div className="divide-y divide-slate-100">
              {students.map((student) => {
                const status = attendance[student.Id] ?? 'present'
                return (
                  <div key={student.Id} className="flex items-center justify-between px-5 py-3.5">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{student.FirstName} {student.LastName}</p>
                      <p className="text-xs text-slate-500">Guardian: {student.Guardian ?? '—'}</p>
                    </div>
                    <div className="flex gap-2">
                      {(['present', 'absent', 'late'] as Status[]).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleStatus(student.Id, s)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${status === s ? (s === 'present' ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300' : s === 'absent' ? 'bg-rose-100 text-rose-700 ring-1 ring-rose-300' : 'bg-amber-100 text-amber-700 ring-1 ring-amber-300') : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {success && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 border border-emerald-200">Attendance submitted successfully!</p>}

          <div className="flex justify-end">
            <Button onClick={handleSubmit} loading={submitting}>Submit Attendance</Button>
          </div>
        </>
      )}
    </div>
  )
}

export default AttendancePage
