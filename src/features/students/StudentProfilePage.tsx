import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Edit2, User } from 'lucide-react'
import axiosClient from '../../api/axiosClient'
import type { Student } from '../../types'
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
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosClient.get(`/student/profile/${classId}/student/${studentId}`)
      .then(({ data }) => setStudent(data?.data ?? data))
      .catch(() => navigate('/students'))
      .finally(() => setLoading(false))
  }, [classId, studentId, navigate])

  if (loading) return <Loader fullPage />
  if (!student) return null

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Students"
        title="Student Profile"
        actions={
          <div className="flex gap-2">
            <Button as={Link} to="/students" variant="secondary" icon={ArrowLeft}>Back</Button>
            <Button as={Link} to={`/students/${classId}/${studentId}/edit`} icon={Edit2}>Edit</Button>
          </div>
        }
      />

      <Card as="div" className="p-6">
        <div className="flex items-start gap-5">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-xl font-bold text-white">
            {getInitials(student.user?.name ?? 'S')}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900">{student.user?.name ?? '—'}</h2>
            <p className="text-sm text-slate-500">{student.user?.email ?? '—'}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {student.newclass && <Badge>{student.newclass.class_name}</Badge>}
              {student.class_section && <Badge variant="info">{student.class_section.section_name}</Badge>}
              {student.gender && <Badge variant="default">{student.gender}</Badge>}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card as="div" className="p-5 sm:p-6">
          <h3 className="mb-4 font-semibold text-slate-900">Personal Information</h3>
          <dl className="grid grid-cols-2 gap-4">
            <Field label="Roll No" value={student.roll_no} />
            <Field label="Date of Birth" value={formatDate(student.dob)} />
            <Field label="Gender" value={student.gender} />
            <Field label="Phone" value={student.phone} />
            <Field label="Father Name" value={student.father_name} />
            <Field label="Address" value={student.address} />
          </dl>
        </Card>

        <Card as="div" className="p-5 sm:p-6">
          <h3 className="mb-4 font-semibold text-slate-900">Academic Information</h3>
          <dl className="grid grid-cols-2 gap-4">
            <Field label="Class" value={student.newclass?.class_name} />
            <Field label="Section" value={student.class_section?.section_name} />
            <Field label="Academic Year" value={student.academic_year?.year} />
            <Field label="Enrolled On" value={formatDate(student.created_at)} />
          </dl>
        </Card>
      </div>
    </div>
  )
}

export default StudentProfilePage
