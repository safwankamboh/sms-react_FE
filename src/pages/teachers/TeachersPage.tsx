import { useState } from 'react'
import { Plus, Eye, Trash2, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  useGetTeachersQuery, useGetTrashTeachersQuery, useSaveTeacherMutation,
  useSoftDeleteTeacherMutation, useRestoreTeacherMutation,
} from '../../store/api/teachersApi'
import { Table, Button, Modal, Input, Select, DatePicker, PageHeader, Pagination, ConfirmDialog } from '../../components/common'
import type { Column } from '../../components/common/Table'
import type { Teacher } from '../../types'
import { formatDate, formatCurrency } from '../../utils/helpers'
import { GENDERS } from '../../utils/constants'

const defaultForm = { name: '', email: '', password: '', designation: '', qualification: '', dob: '', gender: '', phone: '', address: '', salary: '', joining_date: '' }

function TeachersPage() {
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
        <p className="font-medium text-slate-900">{t.user?.username ?? '—'}</p>
        <p className="text-xs text-slate-400">{t.user?.email ?? ''}</p>
      </div>
    )},
    { key: 'designation', header: 'Designation', render: (t) => t.designation ?? '—' },
    { key: 'qualification', header: 'Qualification', render: (t) => t.qualification ?? '—' },
    { key: 'salary', header: 'Salary', render: (t) => formatCurrency(t.salary) },
    { key: 'phone', header: 'Phone', render: (t) => t.phone ?? '—' },
    { key: 'joining_date', header: 'Joined', render: (t) => formatDate(t.joining_date) },
    { key: 'actions', header: 'Actions', render: (t) => (
      <div className="flex gap-1">
        <Link to={`/teachers/${t.id}/profile`}><Button size="sm" variant="ghost" icon={Eye} title="View" /></Link>
        <Button size="sm" variant="ghost" icon={Trash2} className="text-rose-500 hover:bg-rose-50" onClick={() => setDeleteId(t.id)} title="Delete" />
      </div>
    )},
  ]

  const trashColumns: Column<Teacher>[] = [
    { key: 'name', header: 'Teacher', render: (t) => t.user?.username ?? '—' },
    { key: 'designation', header: 'Designation', render: (t) => t.designation ?? '—' },
    { key: 'actions', header: 'Actions', render: (t) => (
      <Button size="sm" variant="secondary" icon={RotateCcw} onClick={() => restoreTeacher(t.id)}>Restore</Button>
    )},
  ]

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Academic" title="Teachers" description="Manage teaching staff profiles and records."
        actions={
          <div className="flex gap-2">
            <Button variant={tab === 'active' ? 'primary' : 'secondary'} size="sm" onClick={() => setTab('active')}>Active</Button>
            <Button variant={tab === 'trash' ? 'primary' : 'secondary'} size="sm" onClick={() => setTab('trash')}>Trash</Button>
            <Button icon={Plus} onClick={() => setAddOpen(true)}>Add Teacher</Button>
          </div>
        }
      />

      {tab === 'active' ? (
        <>
          <Table columns={columns} data={list} loading={loadingTeachers} emptyTitle="No teachers found" />
          <Pagination currentPage={teachersPage?.current_page ?? 1} lastPage={teachersPage?.last_page ?? 1} onPageChange={setPage} total={teachersPage?.total ?? 0} from={teachersPage?.from ?? 0} to={teachersPage?.to ?? 0} />
        </>
      ) : (
        <Table columns={trashColumns} data={trash} loading={loadingTrash} emptyTitle="Trash is empty" />
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add New Teacher" size="lg"
        footer={<div className="flex justify-end gap-3"><Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button><Button form="add-teacher-form" type="submit" loading={saving}>Save Teacher</Button></div>}
      >
        <form id="add-teacher-form" onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <Input label="Full Name" required value={form.name} onChange={f('name')} placeholder="Teacher full name" />
          <Input label="Email" type="email" required value={form.email} onChange={f('email')} placeholder="teacher@school.com" />
          <Input label="Password" type="password" required value={form.password} onChange={f('password')} placeholder="••••••••" />
          <Input label="Designation" value={form.designation} onChange={f('designation')} placeholder="e.g. Senior Teacher" />
          <Input label="Qualification" value={form.qualification} onChange={f('qualification')} placeholder="e.g. M.Sc Mathematics" />
          <Input label="Phone" value={form.phone} onChange={f('phone')} placeholder="+92..." />
          <Input label="Salary (PKR)" type="number" value={form.salary} onChange={f('salary')} placeholder="e.g. 50000" />
          <Select label="Gender" value={form.gender} options={GENDERS} onChange={f('gender')} placeholder="Select gender" />
          <DatePicker label="Date of Birth" value={form.dob} onChange={f('dob')} />
          <DatePicker label="Joining Date" value={form.joining_date} onChange={f('joining_date')} />
          <Input label="Address" value={form.address} onChange={f('address')} placeholder="Home address" className="sm:col-span-2" />
          {error && <p className="sm:col-span-2 rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">{error}</p>}
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title="Move to Trash" description="Teacher will be moved to trash. You can restore later." confirmLabel="Move to Trash" />
    </div>
  )
}

export default TeachersPage
