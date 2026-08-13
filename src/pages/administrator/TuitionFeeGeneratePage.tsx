import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useGetGlobalClassesQuery } from '../../store/api/classesApi'
import { useGenerateTuitionFeeMutation } from '../../store/api/academicYearApi'
import { Card, Button, Input, PageHeader, Loader } from '../../components/common'

interface FeeRow {
  classFee: string
  admissionFee: string
}

function TuitionFeeGeneratePage() {
  const navigate = useNavigate()
  const { data: classes = [], isFetching: loading } = useGetGlobalClassesQuery()
  const [generateTuitionFee, { isLoading: saving }] = useGenerateTuitionFeeMutation()

  const [rows, setRows] = useState<Record<number, FeeRow>>({})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    setRows((prev) => {
      const next = { ...prev }
      classes.forEach((c) => {
        if (!next[c.Id]) next[c.Id] = { classFee: '', admissionFee: '' }
      })
      return next
    })
  }, [classes])

  const setRow = (classId: number, key: keyof FeeRow, value: string) => {
    setRows((p) => ({ ...p, [classId]: { ...p[classId], [key]: value } }))
  }

  const applyToAll = () => {
    const first = classes[0]
    const source = first && rows[first.Id]
    if (!source) return
    setRows((p) => {
      const next = { ...p }
      classes.forEach((c) => { next[c.Id] = { ...source } })
      return next
    })
  }

  const handleSubmit = async () => {
    setError(''); setSuccess(false)
    try {
      await generateTuitionFee({
        class_fees: classes.map((c) => ({
          class_id: c.Id,
          class_fee_amount: rows[c.Id]?.classFee ?? '',
          admission_fee_amount: rows[c.Id]?.admissionFee ?? '',
        })),
      }).unwrap()
      setSuccess(true)
    } catch (err) {
      setError((err as { message?: string })?.message ?? 'Failed to generate tuition fees.')
    }
  }

  if (loading) return <Loader fullPage />

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Administrator" title="Tuition Fee" description="Generate monthly tuition fees for all classes."
        actions={<Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate('/administrator/classes')}>Back</Button>}
      />

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-900">Class Fees</h2>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={applyToAll}>Apply First Row to All</Button>
            <Button size="sm" onClick={handleSubmit} loading={saving}>Save</Button>
          </div>
        </div>

        {error && <p className="mx-5 mt-4 rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">{error}</p>}
        {success && <p className="mx-5 mt-4 rounded-xl bg-emerald-50 px-4 py-2 text-sm text-emerald-700">Tuition fees generated successfully.</p>}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Class</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Class Fee / Month</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Admission Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classes.map((c) => (
                <tr key={c.Id}>
                  <td className="px-5 py-3 text-sm font-medium text-slate-900">{c.ClassName}</td>
                  <td className="px-5 py-3">
                    <Input value={rows[c.Id]?.classFee ?? ''} onChange={(e) => setRow(c.Id, 'classFee', e.target.value.replace(/[^0-9.]/g, ''))} placeholder="0" />
                  </td>
                  <td className="px-5 py-3">
                    <Input value={rows[c.Id]?.admissionFee ?? ''} onChange={(e) => setRow(c.Id, 'admissionFee', e.target.value.replace(/[^0-9.]/g, ''))} placeholder="0" />
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

export default TuitionFeeGeneratePage
