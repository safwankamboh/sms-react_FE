import { useState } from 'react'
import { Eye } from 'lucide-react'
import { useGetGlobalClassesQuery } from '../../store/api/classesApi'
import {
  useGetStudentFeesQuery, useGetFeeCollectionDetailQuery, usePayStudentFeeMutation,
  useLazyGetMonthsForGenerateFeeQuery, useLazyGetOutstandingStudentwiseQuery, useSaveGeneratedStudentFeesMutation,
} from '../../store/api/financialApi'
import { Card, Button, Modal, Input, Select, PageHeader, Table, Loader, EmptyState } from '../../components/common'
import type { Column } from '../../components/common/Table'
import type { StudentFeeOutstanding, StudentWithFeeTotals } from '../../types'
import { formatCurrency } from '../../utils/helpers'

function CollectTab() {
  const { data: classes = [] } = useGetGlobalClassesQuery()
  const [classId, setClassId] = useState('')

  const { data: summary, isFetching: loading } = useGetStudentFeesQuery(Number(classId), { skip: !classId })

  const [detailStudentId, setDetailStudentId] = useState<number | null>(null)
  const { data: detail, isFetching: loadingDetail } = useGetFeeCollectionDetailQuery(
    { classId: Number(classId), studentId: detailStudentId ?? 0 },
    { skip: !detailStudentId },
  )
  const [payStudentFee, { isLoading: paying }] = usePayStudentFeeMutation()

  const [payMonthId, setPayMonthId] = useState<number | null>(null)
  const [payForm, setPayForm] = useState({ receiving_amount: '', discount_amount: '', discount_reason: '', payable_amount: '' })
  const [payError, setPayError] = useState('')

  const columns: Column<StudentWithFeeTotals>[] = [
    { key: 'name', header: 'Student', render: (s) => `${s.FirstName} ${s.LastName}` },
    { key: 'total_fee', header: 'Total Fee', render: (s) => formatCurrency(s.TotalFee) },
    { key: 'total_received', header: 'Received', render: (s) => formatCurrency(s.TotalReceived) },
    { key: 'outstanding', header: 'Outstanding', render: (s) => formatCurrency(s.TotalFee - s.TotalReceived) },
    { key: 'actions', header: 'Actions', render: (s) => (
      <Button size="sm" variant="ghost" icon={<Eye size={14} />} onClick={() => setDetailStudentId(s.Id)}>Collect</Button>
    )},
  ]

  const openPay = (row: { month_id?: number; fee_amount: number }) => {
    if (!row.month_id) return
    setPayMonthId(row.month_id)
    setPayForm({ receiving_amount: String(row.fee_amount), discount_amount: '', discount_reason: '', payable_amount: String(row.fee_amount) })
    setPayError('')
  }

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault(); setPayError('')
    if (!classId || !detailStudentId || !payMonthId) return
    try {
      await payStudentFee({ classId: Number(classId), studentId: detailStudentId, monthId: payMonthId, payload: payForm }).unwrap()
      setPayMonthId(null)
    } catch (err) {
      setPayError((err as { message?: string })?.message ?? 'Failed to pay.')
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-5 sm:p-6">
        <Select label="Class" value={classId} options={classes.map((c) => ({ value: c.Id, label: c.ClassName }))} onChange={(e) => setClassId(e.target.value)} placeholder="Select class" />
      </Card>

      {!classId ? (
        <EmptyState title="Pick a class" description="Choose a class above to view student fee balances." />
      ) : loading ? (
        <Loader />
      ) : (
        <Table columns={columns} data={summary?.Students ?? []} emptyTitle="No students found" />
      )}

      <Modal open={!!detailStudentId} onClose={() => setDetailStudentId(null)} title="Fee Collection" size="lg">
        {loadingDetail ? <Loader /> : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Month</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Fee</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Received</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(detail?.Fesses ?? []).map((row, i) => (
                  <tr key={i}>
                    <td className="px-3 py-2.5 text-sm text-slate-900">{row.month}</td>
                    <td className="px-3 py-2.5 text-sm text-slate-600">{formatCurrency(row.fee_amount)}</td>
                    <td className="px-3 py-2.5 text-sm text-slate-600">{formatCurrency(row.receiving_amount)}</td>
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

      <Modal open={!!payMonthId} onClose={() => setPayMonthId(null)} title="Collect Student Fee"
        footer={<div className="flex justify-end gap-3"><Button variant="secondary" onClick={() => setPayMonthId(null)}>Cancel</Button><Button onClick={() => document.querySelector<HTMLFormElement>('#pay-fee-form')?.requestSubmit()} loading={paying}>Collect</Button></div>}
      >
        <form id="pay-fee-form" onSubmit={handlePay} className="grid gap-4 sm:grid-cols-2">
          <Input label="Payable Amount" value={payForm.payable_amount} disabled />
          <Input label="Discount Amount" value={payForm.discount_amount} onChange={(e) => setPayForm((p) => ({ ...p, discount_amount: e.target.value.replace(/[^0-9.]/g, '') }))} placeholder="0" />
          <Input label="Discount Reason" value={payForm.discount_reason} onChange={(e) => setPayForm((p) => ({ ...p, discount_reason: e.target.value }))} className="sm:col-span-2" />
          <Input label="Receiving Amount" required value={payForm.receiving_amount} onChange={(e) => setPayForm((p) => ({ ...p, receiving_amount: e.target.value.replace(/[^0-9.]/g, '') }))} className="sm:col-span-2" />
          {payError && <p className="sm:col-span-2 rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">{payError}</p>}
        </form>
      </Modal>
    </div>
  )
}

function GenerateTab() {
  const { data: classes = [] } = useGetGlobalClassesQuery()
  const [classId, setClassId] = useState('')
  const [month, setMonth] = useState('')

  const [fetchMonths, { data: months = [], isFetching: loadingMonths }] = useLazyGetMonthsForGenerateFeeQuery()
  const [fetchOutstandings, { data: outstandings, isFetching: loadingOutstandings }] = useLazyGetOutstandingStudentwiseQuery()
  const [saveGeneratedStudentFees, { isLoading: saving }] = useSaveGeneratedStudentFeesMutation()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleClassChange = (val: string) => {
    setClassId(val); setMonth(''); setError(''); setSuccess('')
    if (val) fetchMonths(Number(val))
  }

  const handleMonthChange = (val: string) => {
    setMonth(val); setError(''); setSuccess('')
    if (val) fetchOutstandings({ classId: Number(classId), month: val })
  }

  const handleGenerate = async () => {
    if (!outstandings || outstandings.length === 0) return
    setError(''); setSuccess('')
    try {
      await saveGeneratedStudentFees(outstandings).unwrap()
      setSuccess('Student fees generated successfully.')
    } catch (err) {
      setError((err as { message?: string })?.message ?? 'Failed to generate.')
    }
  }

  const columns: Column<StudentFeeOutstanding>[] = [
    { key: 'student_name', header: 'Student', render: (r) => r.student_name },
    { key: 'class_fee_amount', header: 'Fee', render: (r) => formatCurrency(r.class_fee_amount) },
    { key: 'month', header: 'Month', render: (r) => r.month },
  ]

  return (
    <div className="space-y-4">
      <Card className="p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Class" value={classId} options={classes.map((c) => ({ value: c.Id, label: c.ClassName }))} onChange={(e) => handleClassChange(e.target.value)} placeholder="Select class" />
          <Select label="Month" value={month} options={months.map((m) => ({ value: m.value, label: m.name }))} onChange={(e) => handleMonthChange(e.target.value)} placeholder={loadingMonths ? 'Loading…' : 'Select month'} disabled={!classId || loadingMonths} />
        </div>
      </Card>

      {error && <p className="rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">{error}</p>}
      {success && <p className="rounded-xl bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{success}</p>}

      {loadingOutstandings ? <Loader /> : outstandings && (
        outstandings.length === 0 ? (
          <EmptyState title="Nothing to generate" description="Fees for this month are already generated for every student in this class." />
        ) : (
          <>
            <Table columns={columns} data={outstandings} emptyTitle="No outstanding fees" />
            <div className="flex justify-end">
              <Button onClick={handleGenerate} loading={saving}>Generate {outstandings.length} Fees</Button>
            </div>
          </>
        )
      )}
    </div>
  )
}

function StudentFeesPage() {
  const [tab, setTab] = useState<'collect' | 'generate'>('collect')

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Financial" title="Student Fees" description="Collect and generate student tuition fees."
        actions={
          <div className="flex gap-2">
            <Button variant={tab === 'collect' ? 'primary' : 'secondary'} size="sm" onClick={() => setTab('collect')}>Collect</Button>
            <Button variant={tab === 'generate' ? 'primary' : 'secondary'} size="sm" onClick={() => setTab('generate')}>Generate</Button>
          </div>
        }
      />
      {tab === 'collect' ? <CollectTab /> : <GenerateTab />}
    </div>
  )
}

export default StudentFeesPage
