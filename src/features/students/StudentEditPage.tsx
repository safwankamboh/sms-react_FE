import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { updateStudent } from './studentsSlice'
import { fetchGlobalClasses, fetchSections } from '../classes/classesSlice'
import { fetchAcademicYears } from '../academicYear/academicYearSlice'
import axiosClient from '../../api/axiosClient'
import type { Student } from '../../types'
import { FormWrapper, Input, Select, DatePicker, Button, PageHeader, Loader } from '../../components/common'
import { GENDERS } from '../../utils/constants'

function StudentEditPage() {
  const { classId, studentId } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { classes, sections } = useAppSelector((s) => s.classes)
  const { years } = useAppSelector((s) => s.academicYear)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', email: '', class_id: '', section_id: '', academic_year_id: '',
    roll_no: '', dob: '', gender: '', father_name: '', phone: '', address: '',
  })

  useEffect(() => {
    dispatch(fetchGlobalClasses())
    dispatch(fetchAcademicYears())
    axiosClient.get(`/student/edit/${classId}/${studentId}`)
      .then(({ data }) => {
        const s: Student = data?.data ?? data
        setForm({
          name: s.user?.name ?? '',
          email: s.user?.email ?? '',
          class_id: String(s.class_id),
          section_id: String(s.section_id),
          academic_year_id: String(s.academic_year_id),
          roll_no: s.roll_no ?? '',
          dob: s.dob ?? '',
          gender: s.gender ?? '',
          father_name: s.father_name ?? '',
          phone: s.phone ?? '',
          address: s.address ?? '',
        })
        if (s.class_id) dispatch(fetchSections(s.class_id))
      })
      .catch(() => navigate('/students'))
      .finally(() => setLoading(false))
  }, [classId, studentId, dispatch, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true); setError('')
    const result = await dispatch(updateStudent({ classId: Number(classId), studentId: Number(studentId), payload: form }))
    setSaving(false)
    if (updateStudent.fulfilled.match(result)) navigate(`/students/${classId}/${studentId}/profile`)
    else setError((result.payload as { message?: string })?.message ?? 'Update failed.')
  }

  if (loading) return <Loader fullPage />

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Students"
        title="Edit Student"
        actions={<Button as={Link} to={`/students/${classId}/${studentId}/profile`} variant="secondary" icon={ArrowLeft}>Back</Button>}
      />

      <FormWrapper title="Student Information" onSubmit={handleSubmit}
        actions={<><Button type="button" variant="secondary" onClick={() => navigate(-1)}>Cancel</Button><Button type="submit" loading={saving}>Update Student</Button></>}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Full Name" required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          <Input label="Roll No" value={form.roll_no} onChange={(e) => setForm((p) => ({ ...p, roll_no: e.target.value }))} />
          <Select label="Class" required value={form.class_id} options={classes.map((c) => ({ value: c.id, label: c.class_name }))} onChange={(e) => { setForm((p) => ({ ...p, class_id: e.target.value, section_id: '' })); dispatch(fetchSections(Number(e.target.value))) }} placeholder="Select class" />
          <Select label="Section" required value={form.section_id} options={sections.map((s) => ({ value: s.id, label: s.section_name }))} onChange={(e) => setForm((p) => ({ ...p, section_id: e.target.value }))} placeholder="Select section" />
          <Select label="Academic Year" required value={form.academic_year_id} options={years.map((y) => ({ value: y.id, label: y.year }))} onChange={(e) => setForm((p) => ({ ...p, academic_year_id: e.target.value }))} placeholder="Select year" />
          <Select label="Gender" value={form.gender} options={GENDERS} onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value }))} placeholder="Select gender" />
          <DatePicker label="Date of Birth" value={form.dob} onChange={(e) => setForm((p) => ({ ...p, dob: e.target.value }))} />
          <Input label="Father Name" value={form.father_name} onChange={(e) => setForm((p) => ({ ...p, father_name: e.target.value }))} />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
          <Input label="Address" value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} className="sm:col-span-2" />
          {error && <p className="sm:col-span-2 rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">{error}</p>}
        </div>
      </FormWrapper>
    </div>
  )
}

export default StudentEditPage
