import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useGetTeacherEditQuery, useUpdateTeacherMutation } from '../../store/api/teachersApi'
import { FormWrapper, Input, Select, DatePicker, Button, PageHeader, Loader } from '../../components/common'
import { GENDERS } from '../../utils/constants'

function TeacherEditPage() {
  const { teacherId } = useParams()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', designation: '', qualification: '', dob: '', gender: '', phone: '', address: '', salary: '', joining_date: '' })

  const { data: teacher, isFetching: loading, isError } = useGetTeacherEditQuery(Number(teacherId))
  const [updateTeacher, { isLoading: saving }] = useUpdateTeacherMutation()

  useEffect(() => {
    if (isError) navigate('/teachers')
  }, [isError, navigate])

  useEffect(() => {
    if (!teacher) return
    setForm({ name: teacher.user?.username ?? '', email: teacher.user?.email ?? '', designation: teacher.designation ?? '', qualification: teacher.qualification ?? '', dob: teacher.dob ?? '', gender: teacher.gender ?? '', phone: teacher.phone ?? '', address: teacher.address ?? '', salary: teacher.salary ? String(teacher.salary) : '', joining_date: teacher.joining_date ?? '' })
  }, [teacher])

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((p) => ({ ...p, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('')
    try {
      await updateTeacher({ teacherId: Number(teacherId), payload: form }).unwrap()
      navigate(`/teachers/${teacherId}/profile`)
    } catch (err) {
      setError((err as { message?: string })?.message ?? 'Update failed.')
    }
  }

  if (loading) return <Loader fullPage />

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Teachers" title="Edit Teacher" actions={<Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate(`/teachers/${teacherId}/profile`)}>Back</Button>} />
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
