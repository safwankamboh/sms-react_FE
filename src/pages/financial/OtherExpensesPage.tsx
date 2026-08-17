import { useState } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import {
  useGetExpensesQuery, useSaveExpenseMutation, useUpdateExpenseMutation, useDeleteExpenseMutation,
} from '../../store/api/financialApi'
import { Table, Button, Modal, Input, DatePicker, PageHeader, ConfirmDialog } from '../../components/common'
import type { Column } from '../../components/common/Table'
import type { OtherExpanse } from '../../types'
import { formatCurrency, formatDate } from '../../utils/helpers'

const defaultForm = { expanse_name: '', expanse_amount: '', billing_date: '' }

function OtherExpensesPage() {
  const { data: expenses = [], isFetching: loading } = useGetExpensesQuery()
  const [saveExpense, { isLoading: saving }] = useSaveExpenseMutation()
  const [updateExpense, { isLoading: updating }] = useUpdateExpenseMutation()
  const [deleteExpense, { isLoading: deleting }] = useDeleteExpenseMutation()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(defaultForm)
  const [error, setError] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const openAdd = () => { setEditingId(null); setForm(defaultForm); setError(''); setModalOpen(true) }
  const openEdit = (row: OtherExpanse) => {
    setEditingId(row.Id)
    setForm({ expanse_name: row.ExpanseName, expanse_amount: String(row.ExpanseAmount), billing_date: row.BillingDate })
    setError('')
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('')
    try {
      if (editingId) await updateExpense({ expanseId: editingId, payload: form }).unwrap()
      else await saveExpense(form).unwrap()
      setModalOpen(false)
    } catch (err) {
      setError((err as { message?: string })?.message ?? 'Failed to save.')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await deleteExpense(deleteId)
    setDeleteId(null)
  }

  const columns: Column<OtherExpanse>[] = [
    { key: 'expanse_name', header: 'Expense', render: (r) => <span className="font-medium text-slate-900">{r.ExpanseName}</span> },
    { key: 'expanse_amount', header: 'Amount', render: (r) => formatCurrency(r.ExpanseAmount) },
    { key: 'billing_date', header: 'Billing Date', render: (r) => formatDate(r.BillingDate) },
    { key: 'actions', header: 'Actions', render: (r) => (
      <div className="flex gap-1">
        <Button size="sm" variant="ghost" icon={<Edit2 size={14} />} onClick={() => openEdit(r)}>{null}</Button>
        <Button size="sm" variant="ghost" icon={<Trash2 size={14} />} className="text-rose-500 hover:text-rose-700" onClick={() => setDeleteId(r.Id)}>{null}</Button>
      </div>
    )},
  ]

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Financial" title="Other Expenses" description="Track miscellaneous school expenses."
        actions={<Button icon={<Plus size={16} />} onClick={openAdd}>Add Expense</Button>}
      />

      <Table columns={columns} data={expenses} loading={loading} emptyTitle="No expenses found" />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Expense' : 'Add Expense'}
        footer={<div className="flex justify-end gap-3"><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={() => document.querySelector<HTMLFormElement>('#expense-form')?.requestSubmit()} loading={saving || updating}>Save</Button></div>}
      >
        <form id="expense-form" onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <Input label="Expense Name" required value={form.expanse_name} onChange={(e) => setForm((p) => ({ ...p, expanse_name: e.target.value }))} placeholder="e.g. Stationery" className="sm:col-span-2" />
          <Input label="Amount" required value={form.expanse_amount} onChange={(e) => setForm((p) => ({ ...p, expanse_amount: e.target.value.replace(/[^0-9.]/g, '') }))} placeholder="0" />
          <DatePicker label="Billing Date" required value={form.billing_date} onChange={(e) => setForm((p) => ({ ...p, billing_date: e.target.value }))} />
          {error && <p className="sm:col-span-2 rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">{error}</p>}
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title="Delete Expense" description="This expense will be permanently deleted." confirmLabel="Delete" />
    </div>
  )
}

export default OtherExpensesPage
