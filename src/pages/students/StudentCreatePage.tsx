import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useSaveStudentMutation } from '../../store/api/studentsApi'
import { useGetGlobalClassesQuery, useGetSectionsQuery } from '../../store/api/classesApi'
import { useAuth } from '../../context/AuthContext'
import { FormWrapper, Input, Select, DatePicker, FileInput, Button, PageHeader } from '../../components/common'
import type { StudentCreateFormData } from '../../types'
import { GENDERS, RELIGIONS } from '../../utils/constants'

const defaultForm: StudentCreateFormData = {
  first_name: '', last_name: '', guardian: '', relation: '', occupation: '', national_id: '',
  dob: '', gender: '', religion: '', address: '', nationality: '', contact_number: '',
  class_id: '', class_section_id: '', pre_school: '',
  user_name: '', email: '', password: '', cpassword: '',
  photograph: null, nic: null, last_school_certificate: null,
}

function StudentCreatePage() {
  const navigate = useNavigate()
  const { activeAcademicYear } = useAuth()

  const [form, setForm] = useState<StudentCreateFormData>(defaultForm)
  const [error, setError] = useState('')

  const { data: classes = [] } = useGetGlobalClassesQuery()
  const { data: sections = [] } = useGetSectionsQuery(Number(form.class_id), { skip: !form.class_id })
  const [saveStudent, { isLoading: saving }] = useSaveStudentMutation()

  const setField = <K extends keyof StudentCreateFormData>(key: K, value: StudentCreateFormData[K]) => {
    setForm((p) => ({ ...p, [key]: value }))
  }

  const handleClassChange = (classId: string) => {
    setField('class_id', classId)
    setField('class_section_id', '')
  }

  const handleFileChange = (key: 'photograph' | 'nic' | 'last_school_certificate') => (e: ChangeEvent<HTMLInputElement>) => {
    setField(key, e.target.files?.[0] ?? null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.cpassword) {
      setError('Password and Confirm Password do not match.')
      return
    }
    if (!activeAcademicYear) {
      setError('No active academic year is configured. Please contact an administrator.')
      return
    }

    const payload = new FormData()
    payload.append('academic_year_id', String(activeAcademicYear.Id))
    payload.append('first_name', form.first_name)
    payload.append('last_name', form.last_name)
    payload.append('guardian', form.guardian)
    payload.append('relation', form.relation)
    payload.append('occupation', form.occupation)
    payload.append('national_id', form.national_id)
    payload.append('dob', form.dob)
    payload.append('gender', form.gender)
    payload.append('religion', form.religion)
    payload.append('address', form.address)
    payload.append('nationality', form.nationality)
    payload.append('contact_number', form.contact_number)
    payload.append('class_id', form.class_id)
    payload.append('class_section_id', form.class_section_id)
    payload.append('pre_school', form.pre_school)
    payload.append('user_name', form.user_name)
    payload.append('email', form.email)
    payload.append('password', form.password)
    if (form.photograph) payload.append('photograph', form.photograph)
    if (form.nic) payload.append('nic', form.nic)
    if (form.last_school_certificate) payload.append('last_school_certificate', form.last_school_certificate)

    try {
      await saveStudent(payload).unwrap()
      navigate('/students')
    } catch (err) {
      setError((err as { message?: string })?.message ?? 'Failed to create student.')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Academic"
        title="Create Student"
        description="Register a new student and their guardian & enrollment details."
        actions={<Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate('/students')}>Back</Button>}
      />

      <FormWrapper
        title="Student Information"
        onSubmit={handleSubmit}
        actions={
          <>
            <Button type="button" variant="secondary" onClick={() => navigate('/students')}>Cancel</Button>
            <Button type="submit" loading={saving}>Create Student</Button>
          </>
        }
      >
        <div className="space-y-6">
          {error && <p className="rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">{error}</p>}

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Student Details</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="First Name" required value={form.first_name} onChange={(e) => setField('first_name', e.target.value)} />
              <Input label="Last Name" required value={form.last_name} onChange={(e) => setField('last_name', e.target.value)} />
              <DatePicker label="Date of Birth" required value={form.dob} onChange={(e) => setField('dob', e.target.value)} />
              <Select label="Gender" required value={form.gender} options={GENDERS} onChange={(e) => setField('gender', e.target.value)} placeholder="Select gender" />
              <Select label="Religion" required value={form.religion} options={RELIGIONS} onChange={(e) => setField('religion', e.target.value)} placeholder="Select religion" />
              <Input label="Nationality" required value={form.nationality} onChange={(e) => setField('nationality', e.target.value)} />
              <Input label="Address" required value={form.address} onChange={(e) => setField('address', e.target.value)} className="sm:col-span-2" />
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Guardian Details</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Father / Guardian Name" required value={form.guardian} onChange={(e) => setField('guardian', e.target.value)} />
              <Input label="Relation with Guardian" required value={form.relation} onChange={(e) => setField('relation', e.target.value)} placeholder="e.g. Father" />
              <Input label="Occupation (Father / Guardian)" required value={form.occupation} onChange={(e) => setField('occupation', e.target.value)} />
              <Input label="Parent or Guardian NIC" required value={form.national_id} onChange={(e) => setField('national_id', e.target.value.replace(/[^0-9]/g, ''))} />
              <Input label="Contact Number" required value={form.contact_number} onChange={(e) => setField('contact_number', e.target.value.replace(/[^0-9]/g, ''))} />
              <Input label="Last School (if transfer)" value={form.pre_school} onChange={(e) => setField('pre_school', e.target.value)} />
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Class Enrollment</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Select label="Enroll in Class" required value={form.class_id} options={classes.map((c) => ({ value: c.Id, label: c.ClassName }))} onChange={(e) => handleClassChange(e.target.value)} placeholder="Select class" />
              <Select label="Class Section" required value={form.class_section_id} options={sections.map((s) => ({ value: s.Id, label: s.SectionName }))} onChange={(e) => setField('class_section_id', e.target.value)} placeholder="Select section" disabled={!form.class_id} />
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Documents</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <FileInput label="Photograph" accept=".jpg,.jpeg,.png" fileName={form.photograph?.name} onChange={handleFileChange('photograph')} hint="jpg, jpeg or png, max 2MB" />
              <FileInput label="Birth Certificate or NIC" fileName={form.nic?.name} onChange={handleFileChange('nic')} />
              <FileInput label="Last School Certificate" fileName={form.last_school_certificate?.name} onChange={handleFileChange('last_school_certificate')} />
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Login Credentials</h3>
            <p className="mb-3 text-xs text-slate-500">Used to sign the student in to their account.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="User Name" required value={form.user_name} onChange={(e) => setField('user_name', e.target.value)} />
              <Input label="Email" type="email" required value={form.email} onChange={(e) => setField('email', e.target.value)} />
              <Input label="Password" type="password" required value={form.password} onChange={(e) => setField('password', e.target.value)} />
              <Input label="Confirm Password" type="password" required value={form.cpassword} onChange={(e) => setField('cpassword', e.target.value)} />
            </div>
          </div>
        </div>
      </FormWrapper>
    </div>
  )
}

export default StudentCreatePage
