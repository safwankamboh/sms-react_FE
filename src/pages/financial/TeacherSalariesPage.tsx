import { useState } from 'react'
import { Eye } from 'lucide-react'
import {
  useGetTeacherSalariesQuery, useLazyGetTeachersOutstandingsQuery, useGenerateTeacherSalaryMutation,
  useGetTeacherSalaryDetailQuery, usePayTeacherSalaryMutation,
} from '../../store/api/financialApi'
import { useGetTeachersQuery } from '../../store/api/teachersApi'
import { Card, Button, Modal, Input, PageHeader, Table, Loader, EmptyState } from '../../components/common'
import type { Column } from '../../components/common/Table'
import type { TeacherSalary, TeacherSalaryOutstanding } from '../../types'
import { formatCurrency } from '../../utils/helpers'

function SalariesTab() {
  const { data: salaries = [], isFetching: loading } = useGetTeacherSalariesQuery()
  const { data: teachersPage } = useGetTeachersQuery(1)
  const teacherName = (teacherId: number) => {
    const t = teachersPage?.data.find((x) => x.Id === teacherId)
    return t ? [t.FirstName, t.LastName].filter(Boolean).join(' ') : `Teacher #${teacherId}`
  }

  const [detailTeacherId, setDetailTeacherId] = useState<number | null>(null)
  const { data: detail, isFetching: loadingDetail } = useGetTeacherSalaryDetailQuery(detailTeacherId ?? 0, { skip: !detailTeacherId })
  const [payTeacherSalary, { isLoading: paying }] = usePayTeacherSalaryMutation()

  const [payMonthId, setPayMonthId] = useState<number | null>(null)
  const [payForm, setPayForm] = useState({ salary_amount: '', bonus_amount: '', bonus_reason: '', payment_amount: '' })
  const [payError, setPayError] = useState('')

  const columns: Column<TeacherSalary>[] = [
    { key: 'teacher', header: 'Teacher', render: (r) => teacherName(r.TeacherId) },
    { key: 'salary_amount', header: 'Total Salary', render: (r) => formatCurrency(r.SalaryAmount) },
    { key: 'paying_amount', header: 'Total Paid', render: (r) => formatCurrency(r.PayingAmount) },
    { key: 'actions', header: 'Actions', render: (r) => (
      <Button size="sm" variant="ghost" icon={<Eye size={14} />} onClick={() => setDetailTeacherId(r.TeacherId)}>View</Button>
    )},
  ]

  const openPay = (row: { month_id?: number; salary_amount: number }) => {
    if (!row.month_id) return
    setPayMonthId(row.month_id)
    setPayForm({ salary_amount: String(row.salary_amount), bonus_amount: '', bonus_reason: '', payment_amount: String(row.salary_amount) })
    setPayError('')
  }

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault(); setPayError('')
    if (!detailTeacherId || !payMonthId) return
    try {
      await payTeacherSalary({ teacherId: detailTeacherId, monthId: payMonthId, payload: payForm }).unwrap()
      setPayMonthId(null)
    } catch (err) {
      setPayError((err as { message?: string })?.message ?? 'Failed to pay.')
    }
  }

  return (
    <div className="space-y-4">
      <Table columns={columns} data={salaries} loading={loading} emptyTitle="No salaries generated yet" />

      <Modal open={!!detailTeacherId} onClose={() => setDetailTeacherId(null)} title={`Monthly Salary — ${detailTeacherId ? teacherName(detailTeacherId) : ''}`} size="lg">
        {loadingDetail ? <Loader /> : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Month</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Salary</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(detail?.Salaries ?? []).map((row, i) => (
                  <tr key={i}>
                    <td className="px-3 py-2.5 text-sm text-slate-900">{row.month}</td>
                    <td className="px-3 py-2.5 text-sm text-slate-600">{formatCurrency(row.salary_amount)}</td>
                    <td className="px-3 py-2.5 text-sm text-slate-600">{row.status}</td>
                    <td className="px-3 py-2.5">
                      {row.status === 'Unpaid' && row.month_id && (
                        <Button size="sm" variant="secondary" onClick={() => openPay(row)}>Pay</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>

      <Modal open={!!payMonthId} onClose={() => setPayMonthId(null)} title="Pay Teacher Salary"
        footer={<div className="flex justify-end gap-3"><Button variant="secondary" onClick={() => setPayMonthId(null)}>Cancel</Button><Button onClick={() => document.querySelector<HTMLFormElement>('#pay-salary-form')?.requestSubmit()} loading={paying}>Pay</Button></div>}
      >
        <form id="pay-salary-form" onSubmit={handlePay} className="grid gap-4 sm:grid-cols-2">
          <Input label="Salary Amount" value={payForm.salary_amount} disabled />
          <Input label="Bonus Amount" value={payForm.bonus_amount} onChange={(e) => setPayForm((p) => ({ ...p, bonus_amount: e.target.value.replace(/[^0-9.]/g, '') }))} placeholder="0" />
          <Input label="Bonus Reason" value={payForm.bonus_reason} onChange={(e) => setPayForm((p) => ({ ...p, bonus_reason: e.target.value }))} className="sm:col-span-2" />
          <Input label="Payment Amount" required value={payForm.payment_amount} onChange={(e) => setPayForm((p) => ({ ...p, payment_amount: e.target.value.replace(/[^0-9.]/g, '') }))} className="sm:col-span-2" />
          {payError && <p className="sm:col-span-2 rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">{payError}</p>}
        </form>
      </Modal>
    </div>
  )
}

function GenerateTab() {
  const [month, setMonth] = useState('')
  const [fetchOutstandings, { data: outstandings, isFetching }] = useLazyGetTeachersOutstandingsQuery()
  const [generateTeacherSalary, { isLoading: saving }] = useGenerateTeacherSalaryMutation()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleFetch = () => {
    if (!month) return
    setError(''); setSuccess('')
    fetchOutstandings(month)
  }

  const handleGenerate = async () => {
    if (!outstandings || outstandings.length === 0) return
    setError(''); setSuccess('')
    try {
      await generateTeacherSalary(outstandings).unwrap()
      setSuccess('Salaries generated successfully.')
    } catch (err) {
      setError((err as { message?: string })?.message ?? 'Failed to generate.')
    }
  }

  const columns: Column<TeacherSalaryOutstanding>[] = [
    { key: 'teacher_name', header: 'Teacher', render: (r) => r.teacher_name },
    { key: 'salary_amount', header: 'Salary', render: (r) => formatCurrency(r.salary_amount) },
    { key: 'month', header: 'Month', render: (r) => r.month },
  ]

  return (
    <div className="space-y-4">
      <Card className="p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Input type="month" label="Month" value={month} onChange={(e) => setMonth(e.target.value)} />
          <div className="flex items-end">
            <Button onClick={handleFetch} disabled={!month} loading={isFetching} className="w-full">Check Outstanding</Button>
          </div>
        </div>
      </Card>

      {error && <p className="rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">{error}</p>}
      {success && <p className="rounded-xl bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{success}</p>}

      {outstandings && (
        outstandings.length === 0 ? (
          <EmptyState title="Nothing to generate" description="Salaries for this month are already generated for every teacher." />
        ) : (
          <>
            <Table columns={columns} data={outstandings} emptyTitle="No outstanding salaries" />
            <div className="flex justify-end">
              <Button onClick={handleGenerate} loading={saving}>Generate {outstandings.length} Salaries</Button>
            </div>
          </>
        )
      )}
    </div>
  )
}

function TeacherSalariesPage() {
  const [tab, setTab] = useState<'salaries' | 'generate'>('salaries')

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Financial" title="Teacher Salaries" description="Generate and manage teacher salary payments."
        actions={
          <div className="flex gap-2">
            <Button variant={tab === 'salaries' ? 'primary' : 'secondary'} size="sm" onClick={() => setTab('salaries')}>Salaries</Button>
            <Button variant={tab === 'generate' ? 'primary' : 'secondary'} size="sm" onClick={() => setTab('generate')}>Generate</Button>
          </div>
        }
      />
      {tab === 'salaries' ? <SalariesTab /> : <GenerateTab />}
    </div>
  )
}

export default TeacherSalariesPage
