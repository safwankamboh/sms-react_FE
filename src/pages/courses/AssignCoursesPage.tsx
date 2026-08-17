import { useState } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { useGetGlobalClassesQuery } from '../../store/api/classesApi'
import { useGetTimeSlotsQuery } from '../../store/api/commonApi'
import {
  useGetCourseScheduleQuery, useGetAssignCourseFormQuery,
  useAssignCourseMutation, useUpdateAssignCourseMutation, useDeleteAssignCourseMutation,
} from '../../store/api/coursesApi'
import { Card, Button, Modal, Select, PageHeader, Loader, EmptyState, ConfirmDialog } from '../../components/common'
import type { AssignCourse } from '../../types'

const defaultForm = { course: '', teacher: '', from_time: '', to_time: '' }

function AssignCoursesPage() {
  const [classId, setClassId] = useState('')
  const [sectionId, setSectionId] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<AssignCourse | null>(null)
  const [form, setForm] = useState(defaultForm)
  const [error, setError] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { data: classes = [] } = useGetGlobalClassesQuery()
  const sections = classes.find((c) => String(c.Id) === classId)?.ClassSections ?? []

  const hasSelection = Boolean(classId && sectionId)
  const { data: schedule, isFetching: loadingSchedule } = useGetCourseScheduleQuery(
    { classId: Number(classId), sectionId: Number(sectionId) },
    { skip: !hasSelection },
  )
  const { data: formOptions } = useGetAssignCourseFormQuery(
    { classId: Number(classId), sectionId: Number(sectionId) },
    { skip: !hasSelection },
  )
  const { data: fromSlots = {} } = useGetTimeSlotsQuery()
  const { data: toSlots = {} } = useGetTimeSlotsQuery(form.from_time ? { from: form.from_time } : undefined, { skip: !form.from_time })

  const [assignCourse, { isLoading: saving }] = useAssignCourseMutation()
  const [updateAssignCourse, { isLoading: updating }] = useUpdateAssignCourseMutation()
  const [deleteAssignCourse, { isLoading: deleting }] = useDeleteAssignCourseMutation()

  const toOptions = (slots: Record<string, string>) => Object.entries(slots).map(([value, label]) => ({ value, label }))

  const handleClassChange = (val: string) => {
    setClassId(val); setSectionId('')
  }

  const openAdd = () => {
    setEditing(null)
    setForm(defaultForm)
    setError('')
    setModalOpen(true)
  }

  const openEdit = (row: AssignCourse) => {
    setEditing(row)
    setForm({
      course: String(row.CourseId ?? ''),
      teacher: String(row.TeacherId ?? ''),
      from_time: row.FromTime,
      to_time: row.ToTime,
    })
    setError('')
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('')
    const payload = { ...form, class_section_id: sectionId }
    try {
      if (editing) {
        await updateAssignCourse({ classId: Number(classId), sectionId: Number(sectionId), assignCourseId: editing.Id, payload }).unwrap()
      } else {
        await assignCourse({ classId: Number(classId), payload }).unwrap()
      }
      setModalOpen(false)
    } catch (err) {
      setError((err as { message?: string })?.message ?? 'Failed to save.')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await deleteAssignCourse(deleteId)
    setDeleteId(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Academic" title="Assign Courses" description="Assign courses and teachers to a class section's schedule." />

      <Card className="p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Select label="Class" value={classId} options={classes.map((c) => ({ value: c.Id, label: c.ClassName }))} onChange={(e) => handleClassChange(e.target.value)} placeholder="Select class" />
          <Select label="Section" value={sectionId} options={sections.map((s) => ({ value: s.Id, label: s.SectionName }))} onChange={(e) => setSectionId(e.target.value)} placeholder="Select section" disabled={!classId} />
          <div className="flex items-end">
            <Button icon={<Plus size={16} />} onClick={openAdd} disabled={!hasSelection} className="w-full">Assign Course</Button>
          </div>
        </div>
      </Card>

      {!hasSelection ? (
        <EmptyState title="Pick a class and section" description="Choose a class and section above to view its course schedule." />
      ) : loadingSchedule ? (
        <Loader />
      ) : (
        <Card className="overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Course</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Teacher</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">From</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">To</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(schedule?.AssignCourses ?? []).length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-400">No courses assigned yet.</td></tr>
              ) : schedule?.AssignCourses.map((row) => (
                <tr key={row.Id}>
                  <td className="px-5 py-3 text-sm font-medium text-slate-900">{row.Course?.CourseName ?? '—'}</td>
                  <td className="px-5 py-3 text-sm text-slate-600">{row.Teacher ? [row.Teacher.FirstName, row.Teacher.LastName].filter(Boolean).join(' ') : '—'}</td>
                  <td className="px-5 py-3 text-sm text-slate-600">{row.FromTime}</td>
                  <td className="px-5 py-3 text-sm text-slate-600">{row.ToTime}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" icon={<Edit2 size={14} />} onClick={() => openEdit(row)}>{null}</Button>
                      <Button size="sm" variant="ghost" icon={<Trash2 size={14} />} className="text-rose-500 hover:text-rose-700" onClick={() => setDeleteId(row.Id)}>{null}</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Assigned Course' : 'Assign Course'}
        footer={<div className="flex justify-end gap-3"><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={() => document.querySelector<HTMLFormElement>('#assign-course-form')?.requestSubmit()} loading={saving || updating}>Save</Button></div>}
      >
        <form id="assign-course-form" onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <Select label="Course" required value={form.course} options={(formOptions?.Courses ?? []).map((c) => ({ value: c.Id, label: c.CourseName }))} onChange={(e) => setForm((p) => ({ ...p, course: e.target.value }))} placeholder="Select course" />
          <Select label="Teacher" required value={form.teacher} options={(formOptions?.Teachers ?? []).map((t) => ({ value: t.Id, label: [t.FirstName, t.LastName].filter(Boolean).join(' ') }))} onChange={(e) => setForm((p) => ({ ...p, teacher: e.target.value }))} placeholder="Select teacher" />
          <Select label="From Time" required value={form.from_time} options={toOptions(fromSlots)} onChange={(e) => setForm((p) => ({ ...p, from_time: e.target.value, to_time: '' }))} placeholder="Select start time" />
          <Select label="To Time" required value={form.to_time} options={toOptions(toSlots)} onChange={(e) => setForm((p) => ({ ...p, to_time: e.target.value }))} placeholder="Select end time" disabled={!form.from_time} />
          {error && <p className="sm:col-span-2 rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">{error}</p>}
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title="Remove Course" description="This will remove the course from the schedule." confirmLabel="Remove" />
    </div>
  )
}

export default AssignCoursesPage
