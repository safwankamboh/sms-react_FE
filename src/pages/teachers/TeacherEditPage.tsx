import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useAppDispatch } from '../../store/hooks'
import { updateTeacher } from '../../store/slices/teachersSlice'
import axiosClient from '../../api/axiosClient'
import type { Teacher } from '../../types'
import { FormWrapper, Input, Select, DatePicker, Button, PageHeader, Loader } from '../../components/common'
import { GENDERS } from '../../utils/constants'

function TeacherEditPage() {
  const { teacherId } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', designation: '', qualification: '', dob: '', gender: '', phone: '', address: '', salary: '', joining_date: '' })

  useEffect(() => {
    axiosClient.get(`/teacher/edit/${teacherId}`)
      .then(({ data }) => {
        const t: Teacher = data?.data ?? data
        setForm({ name: t.user?.name ?? '', email: t.user?.email ?? '', designation: t.designation ?? '', qualification: t.qualification ?? '', dob: t.dob ?? '', gender: t.gender ?? '', phone: t.phone ?? '', address: t.address ?? '', salary: t.salary ? String(t.salary) : '', joining_date: t.joining_date ?? '' })
      })
      .catch(() => navigate('/teachers'))
      .finally(() => setLoading(false))
  }, [teacherId, navigate])

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((p) => ({ ...p, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError('')
    const result = await dispatch(updateTeacher({ teacherId: Number(teacherId), payload: form as Record<string, unknown> }))
    setSaving(false)
    if (updateTeacher.fulfilled.match(result)) navigate(`/teachers/${teacherId}/profile`)
    else setError((result.payload as { message?: string })?.message ?? 'Update failed.')
  }

  if (loading) return <Loader fullPage />

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Teachers" title="Edit Teacher" actions={<Button as={Link} to={`/teachers/${teacherId}/profile`} variant="secondary" icon={ArrowLeft}>Back</Button>} />
      <FormWrapper title="Teacher Information" onSubmit={handleSubmit}
        actions={<><Button type="button" variant="secondary" onClick={() => navigate(-1)}>Cancel</Button><Button type="submit" loading={saving}>Update Teacher</Button></>}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Full Name" required value={form.name} onChange={f('name')} />
          <Input label="Email" type="email" required value={form.email} onChange={f('email')} />
          <Input label="Designation" value={form.designation} onChange={f('designation')} />
          <Input label="Qualification" value={form.qualification} onChange={f('qualification')} />
          <Input label="Phone" value={form.phone} onChange={f('phone')} />
          <Input label="Salary (PKR)" type="number" value={form.salary} onChange={f('salary')} />
          <Select label="Gender" value={form.gender} options={GENDERS} onChange={f('gender')} placeholder="Select gender" />
          <DatePicker label="Date of Birth" value={form.dob} onChange={f('dob')} />
          <DatePicker label="Joining Date" value={form.joining_date} onChange={f('joining_date')} />
          <Input label="Address" value={form.address} onChange={f('address')} className="sm:col-span-2" />
          {error && <p className="sm:col-span-2 rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">{error}</p>}
        </div>
      </FormWrapper>
    </div>
  )
}

export default TeacherEditPage
