import { useEffect, useState } from 'react'
import { Plus, Eye, Trash2, RotateCcw, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchStudents, saveStudent, softDeleteStudent, fetchTrashStudents, restoreStudent } from '../../store/slices/studentsSlice'
import { fetchGlobalClasses, fetchSections } from '../../store/slices/classesSlice'
import { fetchAcademicYears } from '../../store/slices/academicYearSlice'
import { Table, Button, Modal, Input, Select, DatePicker, PageHeader, Badge, Pagination, ConfirmDialog } from '../../components/common'
import type { Column } from '../../components/common/Table'
import type { Student } from '../../types'
import { formatDate } from '../../utils/helpers'
import { GENDERS } from '../../utils/constants'

const defaultForm = { name: '', email: '', password: '', class_id: '', section_id: '', academic_year_id: '', roll_no: '', dob: '', gender: '', father_name: '', phone: '', address: '' }

function StudentsPage() {
  const dispatch = useAppDispatch()
  const { list, pagination, loading } = useAppSelector((s) => s.students)
  const { classes, sections } = useAppSelector((s) => s.classes)
  const { years } = useAppSelector((s) => s.academicYear)

  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [deleteId, setDeleteId] = useState<{ classId: number; studentId: number } | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [tab, setTab] = useState<'active' | 'trash'>('active')

  const { trash } = useAppSelector((s) => s.students)

  useEffect(() => {
    dispatch(fetchStudents(1))
    dispatch(fetchGlobalClasses())
    dispatch(fetchAcademicYears())
  }, [dispatch])

  useEffect(() => {
    if (tab === 'trash') dispatch(fetchTrashStudents())
  }, [tab, dispatch])

  const handleClassChange = (classId: string) => {
    setForm((p) => ({ ...p, class_id: classId, section_id: '' }))
    if (classId) dispatch(fetchSections(Number(classId)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true); setError('')
    const result = await dispatch(saveStudent(form))
    setSaving(false)
    if (saveStudent.fulfilled.match(result)) { setAddOpen(false); setForm(defaultForm); dispatch(fetchStudents(1)) }
    else setError((result.payload as { message?: string })?.message ?? 'Failed to save student.')
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    await dispatch(softDeleteStudent(deleteId))
    setDeleting(false); setDeleteId(null)
  }

  const handleRestore = async (student: Student) => {
    await dispatch(restoreStudent({ classId: student.class_id, studentId: student.id }))
    dispatch(fetchTrashStudents())
  }

  const columns: Column<Student>[] = [
    { key: 'name', header: 'Name', render: (s) => (
      <div className="flex items-center gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
          <User size={14} />
        </div>
        <div>
          <p className="font-medium text-slate-900">{s.user?.name ?? '—'}</p>
          <p className="text-xs text-slate-400">{s.user?.email ?? ''}</p>
        </div>
      </div>
    )},
    { key: 'roll_no', header: 'Roll No', render: (s) => s.roll_no ?? '—' },
    { key: 'class', header: 'Class', render: (s) => s.newclass?.class_name ?? '—' },
    { key: 'section', header: 'Section', render: (s) => s.class_section?.section_name ?? '—' },
    { key: 'gender', header: 'Gender', render: (s) => s.gender ? <Badge>{s.gender}</Badge> : '—' },
    { key: 'dob', header: 'DOB', render: (s) => formatDate(s.dob) },
    { key: 'actions', header: 'Actions', render: (s) => (
      <div className="flex items-center gap-1">
        <Link to={`/students/${s.class_id}/${s.id}/profile`}>
          <Button size="sm" variant="ghost" icon={Eye} title="View Profile" />
        </Link>
        <Button size="sm" variant="ghost" icon={Trash2} className="text-rose-500 hover:bg-rose-50" onClick={() => setDeleteId({ classId: s.class_id, studentId: s.id })} title="Delete" />
      </div>
    )},
  ]

  const trashColumns: Column<Student>[] = [
    { key: 'name', header: 'Name', render: (s) => s.user?.name ?? '—' },
    { key: 'class', header: 'Class', render: (s) => s.newclass?.class_name ?? '—' },
    { key: 'deleted', header: 'Deleted At', render: (s) => formatDate(s.deleted_at) },
    { key: 'actions', header: 'Actions', render: (s) => (
      <Button size="sm" variant="secondary" icon={RotateCcw} onClick={() => handleRestore(s)}>Restore</Button>
    )},
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Academic"
        title="Students"
        description="Manage student registrations, profiles and records."
        actions={
          <div className="flex gap-2">
            <Button variant={tab === 'active' ? 'primary' : 'secondary'} size="sm" onClick={() => setTab('active')}>Active</Button>
            <Button variant={tab === 'trash' ? 'primary' : 'secondary'} size="sm" onClick={() => setTab('trash')}>Trash</Button>
            <Button icon={Plus} onClick={() => setAddOpen(true)}>Add Student</Button>
          </div>
        }
      />

      {tab === 'active' ? (
        <>
          <Table columns={columns} data={list} loading={loading} emptyTitle="No students found" />
          <Pagination currentPage={pagination.currentPage} lastPage={pagination.lastPage} onPageChange={(p) => dispatch(fetchStudents(p))} total={pagination.total} from={pagination.from} to={pagination.to} />
        </>
      ) : (
        <Table columns={trashColumns} data={trash} loading={loading} emptyTitle="Trash is empty" />
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add New Student" size="lg"
        footer={<div className="flex justify-end gap-3"><Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button><Button form="add-student-form" type="submit" loading={saving}>Save Student</Button></div>}
      >
        <form id="add-student-form" onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <Input label="Full Name" placeholder="Student full name" required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          <Input label="Email" type="email" placeholder="student@email.com" required value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          <Input label="Password" type="password" placeholder="••••••••" required value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} />
          <Input label="Roll No" placeholder="e.g. 101" value={form.roll_no} onChange={(e) => setForm((p) => ({ ...p, roll_no: e.target.value }))} />
          <Select label="Class" required value={form.class_id} options={classes.map((c) => ({ value: c.id, label: c.class_name }))} onChange={(e) => handleClassChange(e.target.value)} placeholder="Select class" />
          <Select label="Section" required value={form.section_id} options={sections.map((s) => ({ value: s.id, label: s.section_name }))} onChange={(e) => setForm((p) => ({ ...p, section_id: e.target.value }))} placeholder="Select section" />
          <Select label="Academic Year" required value={form.academic_year_id} options={years.map((y) => ({ value: y.id, label: y.year }))} onChange={(e) => setForm((p) => ({ ...p, academic_year_id: e.target.value }))} placeholder="Select year" />
          <Select label="Gender" value={form.gender} options={GENDERS} onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value }))} placeholder="Select gender" />
          <DatePicker label="Date of Birth" value={form.dob} onChange={(e) => setForm((p) => ({ ...p, dob: e.target.value }))} />
          <Input label="Father Name" placeholder="Father's name" value={form.father_name} onChange={(e) => setForm((p) => ({ ...p, father_name: e.target.value }))} />
          <Input label="Phone" placeholder="+92..." value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
          <Input label="Address" placeholder="Home address" value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} className="sm:col-span-2" />
          {error && <p className="sm:col-span-2 text-sm text-rose-600 bg-rose-50 rounded-xl px-4 py-2">{error}</p>}
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title="Move to Trash" description="This student will be moved to trash. You can restore them later." confirmLabel="Move to Trash" />
    </div>
  )
}

export default StudentsPage
