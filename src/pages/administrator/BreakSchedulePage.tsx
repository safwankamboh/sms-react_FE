import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useGetTimeSlotsQuery } from '../../store/api/commonApi'
import { useAddClassBreakMutation } from '../../store/api/classesApi'
import { FormWrapper, Select, Button, PageHeader } from '../../components/common'

function BreakSchedulePage() {
  const navigate = useNavigate()
  const [fromTime, setFromTime] = useState('')
  const [toTime, setToTime] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Full slot list drives the From select; re-fetching with `from` narrows
  // the To select down to slots after the chosen From time, matching the
  // Blade reference's from-change -> re-populate-to-options behavior.
  const { data: fromSlots = {} } = useGetTimeSlotsQuery()
  const { data: toSlots = {} } = useGetTimeSlotsQuery(fromTime ? { from: fromTime } : undefined, { skip: !fromTime })

  const [addClassBreak, { isLoading: saving }] = useAddClassBreakMutation()

  const toOptions = (slots: Record<string, string>) =>
    Object.entries(slots).map(([value, label]) => ({ value, label }))

  const handleFromChange = (value: string) => {
    setFromTime(value)
    setToTime('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setSuccess(false)
    try {
      await addClassBreak({ from_time: fromTime, to_time: toTime }).unwrap()
      setSuccess(true)
    } catch (err) {
      setError((err as { message?: string })?.message ?? 'Failed to update break timing.')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Administrator" title="Break Schedule" description="Set a break period applied to every class."
        actions={<Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate('/')}>Back</Button>}
      />

      <FormWrapper title="Class Break" onSubmit={handleSubmit}
        actions={<Button type="submit" loading={saving}>Submit</Button>}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="From Time" required value={fromTime} options={toOptions(fromSlots)} onChange={(e) => handleFromChange(e.target.value)} placeholder="Select start time" />
          <Select label="To Time" required value={toTime} options={toOptions(toSlots)} onChange={(e) => setToTime(e.target.value)} placeholder="Select end time" disabled={!fromTime} />
          {error && <p className="sm:col-span-2 rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">{error}</p>}
          {success && <p className="sm:col-span-2 rounded-xl bg-emerald-50 px-4 py-2 text-sm text-emerald-700">Break timing updated successfully.</p>}
        </div>
      </FormWrapper>
    </div>
  )
}

export default BreakSchedulePage
