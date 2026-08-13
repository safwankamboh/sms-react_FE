import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useGetTeacherEditQuery, useUpdateTeacherMutation } from '../../store/api/teachersApi'
import { FormWrapper, Input, Select, Button, PageHeader, Loader } from '../../components/common'
import { GENDERS } from '../../utils/constants'

function TeacherEditPage() {
  const { teacherId } = useParams()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', quailification: '', subject_specialization: '', experience: '', gender: '', contact_number: '', address: '', salary_amount: '' })

  const { data: teacher, isFetching: loading, isError } = useGetTeacherEditQuery(Number(teacherId))
  const [updateTeacher, { isLoading: saving }] = useUpdateTeacherMutation()

  useEffect(() => {
    if (isError) navigate('/teachers')
  }, [isError, navigate])

  useEffect(() => {
    if (!teacher) return
    setForm({ name: [teacher.FirstName, teacher.LastName].filter(Boolean).join(' '), email: teacher.User?.Email ?? '', quailification: teacher.Quailification ?? '', subject_specialization: teacher.SubjectSpecialization ?? '', experience: teacher.Experience ?? '', gender: teacher.Gender ?? '', contact_number: teacher.ContactNumber ?? '', address: teacher.Address ?? '', salary_amount: teacher.SalaryAmount ? String(teacher.SalaryAmount) : '' })
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
          <Input label="Qualification" value={form.quailification} onChange={f('quailification')} />
          <Input label="Subject Specialization" value={form.subject_specialization} onChange={f('subject_specialization')} />
          <Input label="Experience" value={form.experience} onChange={f('experience')} />
          <Input label="Phone" value={form.contact_number} onChange={f('contact_number')} />
          <Input label="Salary (PKR)" type="number" value={form.salary_amount} onChange={f('salary_amount')} />
          <Select label="Gender" value={form.gender} options={GENDERS} onChange={f('gender')} placeholder="Select gender" />
          <Input label="Address" value={form.address} onChange={f('address')} className="sm:col-span-2" />
          {error && <p className="sm:col-span-2 rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">{error}</p>}
        </div>
      </FormWrapper>
    </div>
  )
}

export default TeacherEditPage
