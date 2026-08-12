import { useEffect, useState } from 'react'
import { Plus, Eye, Trash2, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { fetchTeachers, saveTeacher, softDeleteTeacher, fetchTrashTeachers, restoreTeacher } from './teachersSlice'
import { Table, Button, Modal, Input, Select, DatePicker, PageHeader, Badge, Pagination, ConfirmDialog } from '../../components/common'
import type { Column } from '../../components/common/Table'
import type { Teacher } from '../../types'
import { formatDate, formatCurrency } from '../../utils/helpers'
import { GENDERS } from '../../utils/constants'

const defaultForm = { name: '', email: '', password: '', designation: '', qualification: '', dob: '', gender: '', phone: '', address: '', salary: '', joining_date: '' }

function TeachersPage() {
  const dispatch = useAppDispatch()
  const { list, trash, pagination, loading } = useAppSelector((s) => s.teachers)
  const [tab, setTab] = useState<'active' | 'trash'>('active')
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => { dispatch(fetchTeachers(1)) }, [dispatch])
  useEffect(() => { if (tab === 'trash') dispatch(fetchTrashTeachers()) }, [tab, dispatch])

  const f = (k: keyof typeof defaultForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((p) => ({ ...p, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError('')
    const result = await dispatch(saveTeacher(form as Record<string, unknown>))
    setSaving(false)
    if (saveTeacher.fulfilled.match(result)) { setAddOpen(false); setForm(defaultForm); dispatch(fetchTeachers(1)) }
    else setError((result.payload as { message?: string })?.message ?? 'Failed to save.')
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    await dispatch(softDeleteTeacher(deleteId))
    setDeleting(false); setDeleteId(null)
  }

  const columns: Column<Teacher>[] = [
    { key: 'name', header: 'Teacher', render: (t) => (
      <div>
        <p className="font-medium text-slate-900">{t.user?.name ?? '—'}</p>
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
    { key: 'name', header: 'Teacher', render: (t) => t.user?.name ?? '—' },
    { key: 'designation', header: 'Designation', render: (t) => t.designation ?? '—' },
    { key: 'actions', header: 'Actions', render: (t) => (
      <Button size="sm" variant="secondary" icon={RotateCcw} onClick={() => dispatch(restoreTeacher(t.id)).then(() => dispatch(fetchTrashTeachers()))}>Restore</Button>
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
          <Table columns={columns} data={list} loading={loading} emptyTitle="No teachers found" />
          <Pagination currentPage={pagination.currentPage} lastPage={pagination.lastPage} onPageChange={(p) => dispatch(fetchTeachers(p))} total={pagination.total} from={pagination.from} to={pagination.to} />
        </>
      ) : (
        <Table columns={trashColumns} data={trash} loading={loading} emptyTitle="Trash is empty" />
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
