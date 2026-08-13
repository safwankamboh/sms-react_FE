import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit2 } from 'lucide-react'
import { useGetStudentProfileQuery } from '../../store/api/studentsApi'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import Loader from '../../components/common/Loader'
import PageHeader from '../../components/common/PageHeader'
import { formatDate, getInitials } from '../../utils/helpers'

function Field({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-slate-900">{value ?? '—'}</dd>
    </div>
  )
}

function StudentProfilePage() {
  const { classId, studentId } = useParams()
  const navigate = useNavigate()
  const { data: student, isFetching: loading, isError } = useGetStudentProfileQuery({ classId: Number(classId), studentId: Number(studentId) })

  useEffect(() => {
    if (isError) navigate('/students')
  }, [isError, navigate])

  if (loading) return <Loader fullPage />
  if (!student) return null

  const fullName = `${student.FirstName} ${student.LastName}`

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Students"
        title="Student Profile"
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate('/students')}>Back</Button>
            <Button icon={<Edit2 size={16} />} onClick={() => navigate(`/students/${classId}/${studentId}/edit`)}>Edit</Button>
          </div>
        }
      />

      <Card className="p-6">
        <div className="flex items-start gap-5">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-xl font-bold text-white">
            {getInitials(fullName)}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900">{fullName}</h2>
            <p className="text-sm text-slate-500">{student.User?.Email ?? '—'}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {student.Class && <Badge>{student.Class.ClassName}</Badge>}
              {student.Section && <Badge variant="info">{student.Section.SectionName}</Badge>}
              {student.Gender && <Badge variant="default">{student.Gender}</Badge>}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <h3 className="mb-4 font-semibold text-slate-900">Personal Information</h3>
          <dl className="grid grid-cols-2 gap-4">
            <Field label="Date of Birth" value={formatDate(student.Dob)} />
            <Field label="Gender" value={student.Gender} />
            <Field label="Religion" value={student.Religion} />
            <Field label="Nationality" value={student.Nationality} />
            <Field label="Contact Number" value={student.ContactNumber} />
            <Field label="Address" value={student.Address} />
          </dl>
        </Card>

        <Card className="p-5 sm:p-6">
          <h3 className="mb-4 font-semibold text-slate-900">Guardian Information</h3>
          <dl className="grid grid-cols-2 gap-4">
            <Field label="Guardian" value={student.Guardian} />
            <Field label="Relation" value={student.Relation} />
            <Field label="Occupation" value={student.Occupation} />
            <Field label="Guardian NIC" value={student.NationalId} />
          </dl>
        </Card>

        <Card className="p-5 sm:p-6">
          <h3 className="mb-4 font-semibold text-slate-900">Academic Information</h3>
          <dl className="grid grid-cols-2 gap-4">
            <Field label="Class" value={student.Class?.ClassName} />
            <Field label="Section" value={student.Section?.SectionName} />
            <Field label="Academic Year" value={student.AcademicYear?.Name} />
            <Field label="Previous School" value={student.LastSchool} />
            <Field label="Enrolled On" value={formatDate(student.CreatedAt)} />
          </dl>
        </Card>
      </div>
    </div>
  )
}

export default StudentProfilePage
