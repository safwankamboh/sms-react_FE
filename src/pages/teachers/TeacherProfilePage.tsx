import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Edit2 } from 'lucide-react'
import { useGetTeacherProfileQuery } from '../../store/api/teachersApi'
import { Card, Button, Loader, PageHeader, Badge } from '../../components/common'
import { formatDate, formatCurrency, getInitials } from '../../utils/helpers'

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

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Teachers" title="Teacher Profile"
        actions={
          <div className="flex gap-2">
            <Button as={Link} to="/teachers" variant="secondary" icon={ArrowLeft}>Back</Button>
            <Button as={Link} to={`/teachers/${teacherId}/edit`} icon={Edit2}>Edit</Button>
          </div>
        }
      />

      <Card as="div" className="p-6">
        <div className="flex items-start gap-5">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-xl font-bold text-white">
            {getInitials(teacher.user?.username ?? 'T')}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{teacher.user?.username ?? '—'}</h2>
            <p className="text-sm text-slate-500">{teacher.user?.email ?? '—'}</p>
            <div className="mt-2 flex gap-2">
              {teacher.designation && <Badge>{teacher.designation}</Badge>}
              {teacher.qualification && <Badge variant="info">{teacher.qualification}</Badge>}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card as="div" className="p-5 sm:p-6">
          <h3 className="mb-4 font-semibold text-slate-900">Personal Details</h3>
          <dl className="grid grid-cols-2 gap-4">
            <Field label="Phone" value={teacher.phone} />
            <Field label="Gender" value={teacher.gender} />
            <Field label="Date of Birth" value={formatDate(teacher.dob)} />
            <Field label="Address" value={teacher.address} />
          </dl>
        </Card>
        <Card as="div" className="p-5 sm:p-6">
          <h3 className="mb-4 font-semibold text-slate-900">Employment Details</h3>
          <dl className="grid grid-cols-2 gap-4">
            <Field label="Salary" value={formatCurrency(teacher.salary)} />
            <Field label="Joining Date" value={formatDate(teacher.joining_date)} />
            <Field label="Qualification" value={teacher.qualification} />
            <Field label="Designation" value={teacher.designation} />
          </dl>
        </Card>
      </div>
    </div>
  )
}

export default TeacherProfilePage
