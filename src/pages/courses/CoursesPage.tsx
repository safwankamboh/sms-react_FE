import { useState } from 'react'
import { Plus, Edit2, Trash2, RotateCcw } from 'lucide-react'
import {
  useGetCoursesQuery, useGetTrashCoursesQuery, useSaveCourseMutation,
  useUpdateCourseMutation, useSoftDeleteCourseMutation, useRestoreCourseMutation,
} from '../../store/api/coursesApi'
import { Table, Button, Modal, Input, PageHeader, Pagination, ConfirmDialog } from '../../components/common'
import type { Column } from '../../components/common/Table'
import type { Course } from '../../types'
import { formatDate } from '../../utils/helpers'

const defaultForm = { course_name: '', course_code: '' }

function CoursesPage() {
  const [tab, setTab] = useState<'active' | 'trash'>('active')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(defaultForm)
  const [error, setError] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { data: coursesPage, isFetching: loadingCourses } = useGetCoursesQuery(page)
  const { data: trash = [], isFetching: loadingTrash } = useGetTrashCoursesQuery(undefined, { skip: tab !== 'trash' })
  const [saveCourse, { isLoading: saving }] = useSaveCourseMutation()
  const [updateCourse, { isLoading: updating }] = useUpdateCourseMutation()
  const [softDeleteCourse, { isLoading: deleting }] = useSoftDeleteCourseMutation()
  const [restoreCourse] = useRestoreCourseMutation()

  const list = coursesPage?.data ?? []

  const openAdd = () => {
    setEditingId(null)
    setForm(defaultForm)
    setError('')
    setModalOpen(true)
  }

  const openEdit = (course: Course) => {
    setEditingId(course.Id)
    setForm({ course_name: course.CourseName, course_code: course.CourseCode ?? '' })
    setError('')
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('')
    try {
      if (editingId) {
        await updateCourse({ courseId: editingId, payload: form }).unwrap()
      } else {
        await saveCourse(form).unwrap()
      }
      setModalOpen(false)
    } catch (err) {
      setError((err as { message?: string })?.message ?? 'Failed to save.')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await softDeleteCourse(deleteId)
    setDeleteId(null)
  }

  const columns: Column<Course>[] = [
    { key: 'course_name', header: 'Course', render: (c) => <span className="font-medium text-slate-900">{c.CourseName}</span> },
    { key: 'course_code', header: 'Code', render: (c) => c.CourseCode ?? '—' },
    { key: 'created_at', header: 'Created', render: (c) => formatDate(c.CreatedAt) },
    { key: 'actions', header: 'Actions', render: (c) => (
      <div className="flex gap-1">
        <Button size="sm" variant="ghost" icon={<Edit2 size={14} />} onClick={() => openEdit(c)}>{null}</Button>
        <Button size="sm" variant="ghost" icon={<Trash2 size={14} />} className="text-rose-500 hover:text-rose-700" onClick={() => setDeleteId(c.Id)}>{null}</Button>
      </div>
    )},
  ]

  const trashColumns: Column<Course>[] = [
    { key: 'course_name', header: 'Course', render: (c) => c.CourseName },
    { key: 'course_code', header: 'Code', render: (c) => c.CourseCode ?? '—' },
    { key: 'actions', header: 'Actions', render: (c) => (
      <Button size="sm" variant="secondary" icon={<RotateCcw size={14} />} onClick={() => restoreCourse(c.Id)}>Restore</Button>
    )},
  ]

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Academic" title="Courses" description="Manage the courses offered by the school."
        actions={
          <div className="flex gap-2">
            <Button variant={tab === 'active' ? 'primary' : 'secondary'} size="sm" onClick={() => setTab('active')}>Active</Button>
            <Button variant={tab === 'trash' ? 'primary' : 'secondary'} size="sm" onClick={() => setTab('trash')}>Trash</Button>
            <Button icon={<Plus size={16} />} onClick={openAdd}>Add Course</Button>
          </div>
        }
      />

      {tab === 'active' ? (
        <>
          <Table columns={columns} data={list} loading={loadingCourses} emptyTitle="No courses found" />
          <Pagination currentPage={coursesPage?.meta.currentPage ?? 1} lastPage={coursesPage?.meta.lastPage ?? 1} onPageChange={setPage} total={coursesPage?.meta.total ?? 0} from={coursesPage?.meta.from ?? 0} to={coursesPage?.meta.to ?? 0} />
        </>
      ) : (
        <Table columns={trashColumns} data={trash} loading={loadingTrash} emptyTitle="Trash is empty" />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Course' : 'Add New Course'}
        footer={<div className="flex justify-end gap-3"><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={() => document.querySelector<HTMLFormElement>('#course-form')?.requestSubmit()} loading={saving || updating}>Save Course</Button></div>}
      >
        <form id="course-form" onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <Input label="Course Name" required value={form.course_name} onChange={(e) => setForm((p) => ({ ...p, course_name: e.target.value }))} placeholder="e.g. Mathematics" />
          <Input label="Course Code" value={form.course_code} onChange={(e) => setForm((p) => ({ ...p, course_code: e.target.value }))} placeholder="e.g. MATH-101" />
          {error && <p className="sm:col-span-2 rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">{error}</p>}
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title="Move to Trash" description="Course will be moved to trash. You can restore later." confirmLabel="Move to Trash" />
    </div>
  )
}

export default CoursesPage
