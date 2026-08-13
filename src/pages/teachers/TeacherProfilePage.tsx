import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit2 } from 'lucide-react'
import { useGetTeacherProfileQuery } from '../../store/api/teachersApi'
import { Card, Button, Loader, PageHeader, Badge } from '../../components/common'
import { formatCurrency, getInitials } from '../../utils/helpers'

function Field({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-slate-900">{value ?? '—'}</dd>
    </div>
  )
}

function TeacherProfilePage() {
  const { teacherId } = useParams()
  const navigate = useNavigate()
  const { data: teacher, isFetching: loading, isError } = useGetTeacherProfileQuery(Number(teacherId))

  useEffect(() => {
    if (isError) navigate('/teachers')
  }, [isError, navigate])

  if (loading) return <Loader fullPage />
  if (!teacher) return null

  const fullName = [teacher.first_name, teacher.last_name].filter(Boolean).join(' ')

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Teachers" title="Teacher Profile"
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate('/teachers')}>Back</Button>
            <Button icon={<Edit2 size={16} />} onClick={() => navigate(`/teachers/${teacherId}/edit`)}>Edit</Button>
          </div>
        }
      />

      <Card className="p-6">
        <div className="flex items-start gap-5">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-xl font-bold text-white">
            {getInitials(fullName)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{fullName || '—'}</h2>
            <p className="text-sm text-slate-500">{teacher.user?.email ?? '—'}</p>
            <div className="mt-2 flex gap-2">
              {teacher.subject_specialization && <Badge>{teacher.subject_specialization}</Badge>}
              {teacher.quailification && <Badge variant="info">{teacher.quailification}</Badge>}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <h3 className="mb-4 font-semibold text-slate-900">Personal Details</h3>
          <dl className="grid grid-cols-2 gap-4">
            <Field label="Phone" value={teacher.contact_number} />
            <Field label="Gender" value={teacher.gender} />
            <Field label="National ID" value={teacher.national_id} />
            <Field label="Address" value={teacher.address} />
          </dl>
        </Card>
        <Card className="p-5 sm:p-6">
          <h3 className="mb-4 font-semibold text-slate-900">Employment Details</h3>
          <dl className="grid grid-cols-2 gap-4">
            <Field label="Salary" value={formatCurrency(teacher.salary_amount)} />
            <Field label="Experience" value={teacher.experience} />
            <Field label="Qualification" value={teacher.quailification} />
            <Field label="Specialization" value={teacher.subject_specialization} />
          </dl>
        </Card>
      </div>
    </div>
  )
}

export default TeacherProfilePage
