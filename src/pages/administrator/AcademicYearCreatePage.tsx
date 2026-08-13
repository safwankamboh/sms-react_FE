import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useSaveAcademicYearMutation } from '../../store/api/academicYearApi'
import { FormWrapper, Input, DatePicker, Button, PageHeader } from '../../components/common'

const defaultForm = { academic_year_name: '', academic_year_start: '', academic_year_end: '' }

function AcademicYearCreatePage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(defaultForm)
  const [error, setError] = useState('')
  const [saveAcademicYear, { isLoading: saving }] = useSaveAcademicYearMutation()

  const f = (k: keyof typeof defaultForm) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, [k]: e.target.value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await saveAcademicYear(form).unwrap()
      navigate('/administrator/academic-years')
    } catch (err) {
      setError((err as { message?: string })?.message ?? 'Failed to create academic year.')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Administrator" title="Academic Year" description="Create a new academic year."
        actions={<Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate('/administrator/academic-years')}>Back</Button>}
      />

      <FormWrapper title="Academic Year Details" onSubmit={handleSubmit}
        actions={
          <>
            <Button type="button" variant="secondary" onClick={() => navigate('/administrator/academic-years')}>Cancel</Button>
            <Button type="submit" loading={saving}>Submit</Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <Input label="Name Of Academic Year" required value={form.academic_year_name} onChange={f('academic_year_name')} placeholder="e.g. 2025-2026" />
          <DatePicker label="Start Of Academic Year" required value={form.academic_year_start} onChange={f('academic_year_start')} />
          <DatePicker label="End Of Academic Year" required value={form.academic_year_end} onChange={f('academic_year_end')} />
          {error && <p className="sm:col-span-3 rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">{error}</p>}
        </div>
      </FormWrapper>
    </div>
  )
}

export default AcademicYearCreatePage
