import { useState } from 'react'
import { Plus, Eye, Trash2, RotateCcw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  useGetTeachersQuery, useGetTrashTeachersQuery, useSaveTeacherMutation,
  useSoftDeleteTeacherMutation, useRestoreTeacherMutation,
} from '../../store/api/teachersApi'
import { Table, Button, Modal, Input, Select, PageHeader, Pagination, ConfirmDialog } from '../../components/common'
import type { Column } from '../../components/common/Table'
import type { Teacher } from '../../types'
import { formatCurrency } from '../../utils/helpers'
import { GENDERS } from '../../utils/constants'

const defaultForm = { name: '', email: '', password: '', quailification: '', subject_specialization: '', experience: '', gender: '', contact_number: '', address: '', salary_amount: '' }

function TeachersPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<'active' | 'trash'>('active')
  const [page, setPage] = useState(1)
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const [error, setError] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { data: teachersPage, isFetching: loadingTeachers } = useGetTeachersQuery(page)
  const { data: trash = [], isFetching: loadingTrash } = useGetTrashTeachersQuery(undefined, { skip: tab !== 'trash' })
  const [saveTeacher, { isLoading: saving }] = useSaveTeacherMutation()
  const [softDeleteTeacher, { isLoading: deleting }] = useSoftDeleteTeacherMutation()
  const [restoreTeacher] = useRestoreTeacherMutation()

  const list = teachersPage?.data ?? []

  const teacherName = (t: Teacher) => [t.FirstName, t.LastName].filter(Boolean).join(' ') || '—'

  const f = (k: keyof typeof defaultForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((p) => ({ ...p, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('')
    try {
      await saveTeacher(form).unwrap()
      setAddOpen(false); setForm(defaultForm)
    } catch (err) {
      setError((err as { message?: string })?.message ?? 'Failed to save.')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await softDeleteTeacher(deleteId)
    setDeleteId(null)
  }

  const columns: Column<Teacher>[] = [
    { key: 'name', header: 'Teacher', render: (t) => (
      <div>
        <p className="font-medium text-slate-900">{teacherName(t)}</p>
        <p className="text-xs text-slate-400">{t.User?.Email ?? ''}</p>
      </div>
    )},
    { key: 'subject_specialization', header: 'Specialization', render: (t) => t.SubjectSpecialization ?? '—' },
    { key: 'quailification', header: 'Qualification', render: (t) => t.Quailification ?? '—' },
    { key: 'salary_amount', header: 'Salary', render: (t) => formatCurrency(t.SalaryAmount) },
    { key: 'contact_number', header: 'Phone', render: (t) => t.ContactNumber ?? '—' },
    { key: 'experience', header: 'Experience', render: (t) => t.Experience ?? '—' },
    { key: 'actions', header: 'Actions', render: (t) => (
      <div className="flex gap-1">
        <Button size="sm" variant="ghost" icon={<Eye size={14} />} onClick={() => navigate(`/teachers/${t.Id}/profile`)}>{null}</Button>
        <Button size="sm" variant="ghost" icon={<Trash2 size={14} />} className="text-rose-500 hover:text-rose-700" onClick={() => setDeleteId(t.Id)}>{null}</Button>
      </div>
    )},
  ]

  const trashColumns: Column<Teacher>[] = [
    { key: 'name', header: 'Teacher', render: teacherName },
    { key: 'quailification', header: 'Qualification', render: (t) => t.Quailification ?? '—' },
    { key: 'actions', header: 'Actions', render: (t) => (
      <Button size="sm" variant="secondary" icon={<RotateCcw size={14} />} onClick={() => restoreTeacher(t.Id)}>Restore</Button>
    )},
  ]

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Academic" title="Teachers" description="Manage teaching staff profiles and records."
        actions={
          <div className="flex gap-2">
            <Button variant={tab === 'active' ? 'primary' : 'secondary'} size="sm" onClick={() => setTab('active')}>Active</Button>
            <Button variant={tab === 'trash' ? 'primary' : 'secondary'} size="sm" onClick={() => setTab('trash')}>Trash</Button>
            <Button icon={<Plus size={16} />} onClick={() => setAddOpen(true)}>Add Teacher</Button>
          </div>
        }
      />

      {tab === 'active' ? (
        <>
          <Table columns={columns} data={list} loading={loadingTeachers} emptyTitle="No teachers found" />
          <Pagination currentPage={teachersPage?.meta.currentPage ?? 1} lastPage={teachersPage?.meta.lastPage ?? 1} onPageChange={setPage} total={teachersPage?.meta.total ?? 0} from={teachersPage?.meta.from ?? 0} to={teachersPage?.meta.to ?? 0} />
        </>
      ) : (
        <Table columns={trashColumns} data={trash} loading={loadingTrash} emptyTitle="Trash is empty" />
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add New Teacher" size="lg"
        footer={<div className="flex justify-end gap-3"><Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button><Button onClick={() => document.querySelector<HTMLFormElement>('#add-teacher-form')?.requestSubmit()} loading={saving}>Save Teacher</Button></div>}
      >
        <form id="add-teacher-form" onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <Input label="Full Name" required value={form.name} onChange={f('name')} placeholder="Teacher full name" />
          <Input label="Email" type="email" required value={form.email} onChange={f('email')} placeholder="teacher@school.com" />
          <Input label="Password" type="password" required value={form.password} onChange={f('password')} placeholder="••••••••" />
          <Input label="Qualification" value={form.quailification} onChange={f('quailification')} placeholder="e.g. M.Sc Mathematics" />
          <Input label="Subject Specialization" value={form.subject_specialization} onChange={f('subject_specialization')} placeholder="e.g. Mathematics" />
          <Input label="Experience" value={form.experience} onChange={f('experience')} placeholder="e.g. 5 years" />
          <Input label="Phone" value={form.contact_number} onChange={f('contact_number')} placeholder="+92..." />
          <Input label="Salary (PKR)" type="number" value={form.salary_amount} onChange={f('salary_amount')} placeholder="e.g. 50000" />
          <Select label="Gender" value={form.gender} options={GENDERS} onChange={f('gender')} placeholder="Select gender" />
          <Input label="Address" value={form.address} onChange={f('address')} placeholder="Home address" className="sm:col-span-2" />
          {error && <p className="sm:col-span-2 rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">{error}</p>}
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title="Move to Trash" description="Teacher will be moved to trash. You can restore later." confirmLabel="Move to Trash" />
    </div>
  )
}

export default TeachersPage
