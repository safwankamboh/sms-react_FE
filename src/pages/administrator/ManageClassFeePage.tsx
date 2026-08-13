import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useGetTuitionFeeQuery, useUpdateTuitionFeeMutation } from '../../store/api/academicYearApi'
import { Card, Button, Input, PageHeader, Loader } from '../../components/common'
import { formatMonthYear } from '../../utils/helpers'

interface FeeRow {
  amount: string
  admissionFee: string
}

function ManageClassFeePage() {
  const navigate = useNavigate()
  const { classId } = useParams()
  const { data: fees = [], isFetching: loading } = useGetTuitionFeeQuery(Number(classId))
  const [updateTuitionFee, { isLoading: saving }] = useUpdateTuitionFeeMutation()

  const [rows, setRows] = useState<Record<number, FeeRow>>({})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    setRows((prev) => {
      const next = { ...prev }
      fees.forEach((fee) => {
        if (!next[fee.Id]) next[fee.Id] = { amount: String(fee.Amount ?? ''), admissionFee: String(fee.AdmissionFee ?? '') }
      })
      return next
    })
  }, [fees])

  const setRow = (feeId: number, key: keyof FeeRow, value: string) => {
    setRows((p) => ({ ...p, [feeId]: { ...p[feeId], [key]: value } }))
  }

  const handleSubmit = async () => {
    setError(''); setSuccess(false)
    try {
      await updateTuitionFee({
        classId: Number(classId),
        tuition_fees: fees
          .filter((fee) => !fee.Disabled)
          .map((fee) => ({
            id: fee.Id,
            amount: rows[fee.Id]?.amount ?? '',
            admission_fee: rows[fee.Id]?.admissionFee ?? '',
          })),
      }).unwrap()
      setSuccess(true)
    } catch (err) {
      setError((err as { message?: string })?.message ?? 'Failed to update tuition fees.')
    }
  }

  if (loading) return <Loader fullPage />

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Administrator" title="Manage Fee" description="Edit monthly tuition fees for this class."
        actions={<Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate('/administrator/classes')}>Back</Button>}
      />

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-900">Monthly Fees</h2>
          <Button size="sm" onClick={handleSubmit} loading={saving}>Save</Button>
        </div>

        {error && <p className="mx-5 mt-4 rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">{error}</p>}
        {success && <p className="mx-5 mt-4 rounded-xl bg-emerald-50 px-4 py-2 text-sm text-emerald-700">Tuition fees updated successfully.</p>}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Month</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Class Fee / Month</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Admission Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fees.map((fee) => (
                <tr key={fee.Id}>
                  <td className="px-5 py-3 text-sm font-medium text-slate-900">{formatMonthYear(fee.ApplyDate)}</td>
                  <td className="px-5 py-3">
                    {fee.Disabled ? (
                      <span className="text-sm text-slate-500">{fee.Amount}</span>
                    ) : (
                      <Input value={rows[fee.Id]?.amount ?? ''} onChange={(e) => setRow(fee.Id, 'amount', e.target.value.replace(/[^0-9.]/g, ''))} />
                    )}
                  </td>
                  <td className="px-5 py-3">
                    {fee.Disabled ? (
                      <span className="text-sm text-slate-500">{fee.AdmissionFee}</span>
                    ) : (
                      <Input value={rows[fee.Id]?.admissionFee ?? ''} onChange={(e) => setRow(fee.Id, 'admissionFee', e.target.value.replace(/[^0-9.]/g, ''))} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default ManageClassFeePage
