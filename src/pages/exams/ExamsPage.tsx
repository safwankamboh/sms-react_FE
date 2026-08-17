import { useMemo, useState } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import {
  useGetExamTypesQuery, useSaveExamTypeMutation, useUpdateExamTypeMutation, useDeleteExamTypeMutation,
  useGetExamScheduleQuery, useGetExamScheduleFormQuery, useSaveExamScheduleMutation,
} from '../../store/api/examsApi'
import { useGetGlobalClassesQuery } from '../../store/api/classesApi'
import { Card, Button, Modal, Input, Select, DatePicker, PageHeader, Table, Loader, EmptyState, ConfirmDialog } from '../../components/common'
import type { Column } from '../../components/common/Table'
import type { ExamSchedule, ExamType } from '../../types'
import { formatDate } from '../../utils/helpers'

function ExamTypesTab() {
  const { data: examTypes = [], isFetching: loading } = useGetExamTypesQuery()
  const [saveExamType, { isLoading: saving }] = useSaveExamTypeMutation()
  const [updateExamType, { isLoading: updating }] = useUpdateExamTypeMutation()
  const [deleteExamType, { isLoading: deleting }] = useDeleteExamTypeMutation()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [examType, setExamType] = useState('')
  const [error, setError] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const openAdd = () => { setEditingId(null); setExamType(''); setError(''); setModalOpen(true) }
  const openEdit = (row: ExamType) => { setEditingId(row.Id); setExamType(row.ExamType); setError(''); setModalOpen(true) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('')
    try {
      if (editingId) await updateExamType({ examTypeId: editingId, payload: { exam_type: examType } }).unwrap()
      else await saveExamType({ exam_type: examType }).unwrap()
      setModalOpen(false)
    } catch (err) {
      setError((err as { message?: string })?.message ?? 'Failed to save.')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await deleteExamType(deleteId)
    setDeleteId(null)
  }

  const columns: Column<ExamType>[] = [
    { key: 'exam_type', header: 'Exam Type', render: (r) => <span className="font-medium text-slate-900">{r.ExamType}</span> },
    { key: 'created_at', header: 'Created', render: (r) => formatDate(r.CreatedAt) },
    { key: 'actions', header: 'Actions', render: (r) => (
      <div className="flex gap-1">
        <Button size="sm" variant="ghost" icon={<Edit2 size={14} />} onClick={() => openEdit(r)}>{null}</Button>
        <Button size="sm" variant="ghost" icon={<Trash2 size={14} />} className="text-rose-500 hover:text-rose-700" onClick={() => setDeleteId(r.Id)}>{null}</Button>
      </div>
    )},
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button icon={<Plus size={16} />} onClick={openAdd}>Add Exam Type</Button>
      </div>
      <Table columns={columns} data={examTypes} loading={loading} emptyTitle="No exam types found" />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Exam Type' : 'Add Exam Type'}
        footer={<div className="flex justify-end gap-3"><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={() => document.querySelector<HTMLFormElement>('#exam-type-form')?.requestSubmit()} loading={saving || updating}>Save</Button></div>}
      >
        <form id="exam-type-form" onSubmit={handleSubmit}>
          <Input label="Exam Type" required value={examType} onChange={(e) => setExamType(e.target.value)} placeholder="e.g. Midterm" />
          {error && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">{error}</p>}
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title="Delete Exam Type" description="This exam type will be permanently deleted." confirmLabel="Delete" />
    </div>
  )
}

function ExamScheduleTab() {
  const { data: classes = [] } = useGetGlobalClassesQuery()
  const { data: examTypes = [] } = useGetExamTypesQuery()
  const [classId, setClassId] = useState('')

  const { data: schedules = [], isFetching: loadingSchedules } = useGetExamScheduleQuery(Number(classId), { skip: !classId })
  const { data: formOptions } = useGetExamScheduleFormQuery(Number(classId), { skip: !classId })
  const [saveExamSchedule, { isLoading: saving }] = useSaveExamScheduleMutation()

  const [modalOpen, setModalOpen] = useState(false)
  const [examTypeId, setExamTypeId] = useState('')
  const [examDate, setExamDate] = useState('')
  const [selectedCourseIds, setSelectedCourseIds] = useState<number[]>([])
  const [error, setError] = useState('')

  const examTypeName = useMemo(() => {
    const map: Record<number, string> = {}
    examTypes.forEach((t) => { map[t.Id] = t.ExamType })
    return map
  }, [examTypes])

  const courseName = useMemo(() => {
    const map: Record<number, string> = {}
    formOptions?.Courses.forEach((c) => { if (c.CourseId) map[c.CourseId] = c.Course?.CourseName ?? `#${c.CourseId}` })
    return map
  }, [formOptions])

  const teacherName = useMemo(() => {
    const map: Record<number, string> = {}
    formOptions?.Teachers.forEach((t) => { map[t.Id] = [t.FirstName, t.LastName].filter(Boolean).join(' ') })
    return map
  }, [formOptions])

  const openAdd = () => {
    setExamTypeId('')
    setExamDate('')
    setSelectedCourseIds([])
    setError('')
    setModalOpen(true)
  }

  const toggleCourse = (assignCourseId: number) => {
    setSelectedCourseIds((p) => (p.includes(assignCourseId) ? p.filter((id) => id !== assignCourseId) : [...p, assignCourseId]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('')
    const rows = (formOptions?.Courses ?? [])
      .filter((c) => selectedCourseIds.includes(c.Id))
      .map((c) => ({
        exam_type: examTypeId,
        course: String(c.CourseId ?? ''),
        class: classId,
        teacher: String(c.TeacherId ?? ''),
        section: c.ClassSectionId ?? '',
        exam_date: examDate,
      }))
    if (rows.length === 0) {
      setError('Select at least one course.')
      return
    }
    try {
      await saveExamSchedule({ exam_schedule: rows }).unwrap()
      setModalOpen(false)
    } catch (err) {
      setError((err as { message?: string })?.message ?? 'Failed to save.')
    }
  }

  const columns: Column<ExamSchedule>[] = [
    { key: 'exam_type', header: 'Exam Type', render: (r) => examTypeName[r.ExamTypeId] ?? '—' },
    { key: 'course', header: 'Course', render: (r) => courseName[r.CourseId] ?? '—' },
    { key: 'teacher', header: 'Teacher', render: (r) => teacherName[r.ExamTeacherId] ?? '—' },
    { key: 'exam_date', header: 'Date', render: (r) => formatDate(r.ExamDate) },
  ]

  return (
    <div className="space-y-4">
      <Card className="p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Select label="Class" value={classId} options={classes.map((c) => ({ value: c.Id, label: c.ClassName }))} onChange={(e) => setClassId(e.target.value)} placeholder="Select class" />
          <div className="flex items-end sm:col-start-3">
            <Button icon={<Plus size={16} />} onClick={openAdd} disabled={!classId} className="w-full">Add Schedule</Button>
          </div>
        </div>
      </Card>

      {!classId ? (
        <EmptyState title="Pick a class" description="Choose a class above to view and add its exam schedule." />
      ) : loadingSchedules ? (
        <Loader />
      ) : (
        <Table columns={columns} data={schedules} emptyTitle="No exam schedule found for this class" />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Exam Schedule" size="lg"
        footer={<div className="flex justify-end gap-3"><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={() => document.querySelector<HTMLFormElement>('#exam-schedule-form')?.requestSubmit()} loading={saving}>Save</Button></div>}
      >
        <form id="exam-schedule-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Exam Type" required value={examTypeId} options={examTypes.map((t) => ({ value: t.Id, label: t.ExamType }))} onChange={(e) => setExamTypeId(e.target.value)} placeholder="Select exam type" />
            <DatePicker label="Exam Date" required value={examDate} onChange={(e) => setExamDate(e.target.value)} />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">Courses</p>
            <div className="max-h-64 space-y-1 overflow-y-auto rounded-xl border border-slate-200 p-2">
              {(formOptions?.Courses ?? []).length === 0 ? (
                <p className="px-2 py-3 text-sm text-slate-400">No courses assigned to this class yet.</p>
              ) : formOptions?.Courses.map((c) => (
                <label key={c.Id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-slate-50">
                  <input type="checkbox" checked={selectedCourseIds.includes(c.Id)} onChange={() => toggleCourse(c.Id)} />
                  <span className="text-slate-900">{c.Course?.CourseName ?? '—'}</span>
                  <span className="text-slate-400">— {c.Teacher ? [c.Teacher.FirstName, c.Teacher.LastName].filter(Boolean).join(' ') : '—'}</span>
                </label>
              ))}
            </div>
          </div>
          {error && <p className="rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">{error}</p>}
        </form>
      </Modal>
    </div>
  )
}

function ExamsPage() {
  const [tab, setTab] = useState<'types' | 'schedule'>('types')

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Academic" title="Exams" description="Manage exam types and class exam schedules."
        actions={
          <div className="flex gap-2">
            <Button variant={tab === 'types' ? 'primary' : 'secondary'} size="sm" onClick={() => setTab('types')}>Exam Types</Button>
            <Button variant={tab === 'schedule' ? 'primary' : 'secondary'} size="sm" onClick={() => setTab('schedule')}>Exam Schedule</Button>
          </div>
        }
      />
      {tab === 'types' ? <ExamTypesTab /> : <ExamScheduleTab />}
    </div>
  )
}

export default ExamsPage
