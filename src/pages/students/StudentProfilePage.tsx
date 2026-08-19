import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit2, History, ShieldAlert, Hash } from 'lucide-react'
import { useGetStudentProfileQuery } from '../../store/api/studentsApi'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import Can from '../../components/common/Can'
import Loader from '../../components/common/Loader'
import PageHeader from '../../components/common/PageHeader'
import ChangeStudentStatusModal from '../../components/students/ChangeStudentStatusModal'
import CorrectGrNumberModal from '../../components/students/CorrectGrNumberModal'
import type { StudentStatus } from '../../types'
import { formatDate, getInitials } from '../../utils/helpers'

const STATUS_BADGE_VARIANT: Record<StudentStatus, 'success' | 'default' | 'info' | 'warning'> = {
  active: 'success',
  inactive: 'default',
  transferred: 'info',
  withdrawn: 'warning',
  graduated: 'success',
}

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
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [grNumberModalOpen, setGrNumberModalOpen] = useState(false)

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
            <Can permission="students.view_profile">
              <Button variant="secondary" icon={<History size={16} />} onClick={() => navigate(`/students/${classId}/${studentId}/history`)}>History</Button>
            </Can>
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
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{fullName}</h2>
              <Badge variant={STATUS_BADGE_VARIANT[student.Status]}>{student.Status}</Badge>
            </div>
            <p className="text-sm text-slate-500">{student.GrNumber} · {student.User?.Email ?? '—'}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {student.Class && <Badge>{student.Class.ClassName}</Badge>}
              {student.Section && <Badge variant="info">{student.Section.SectionName}</Badge>}
              {student.Gender && <Badge variant="default">{student.Gender}</Badge>}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Can permission="students.change_status">
                <Button size="sm" variant="secondary" icon={<ShieldAlert size={14} />} onClick={() => setStatusModalOpen(true)}>Change Status</Button>
              </Can>
              <Can permission="students.correct_gr_number">
                <Button size="sm" variant="secondary" icon={<Hash size={14} />} onClick={() => setGrNumberModalOpen(true)}>Correct GR Number</Button>
              </Can>
            </div>
          </div>
        </div>
      </Card>

      <ChangeStudentStatusModal
        open={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        studentId={student.Id}
        currentStatus={student.Status}
      />
      <CorrectGrNumberModal
        open={grNumberModalOpen}
        onClose={() => setGrNumberModalOpen(false)}
        studentId={student.Id}
        currentGrNumber={student.GrNumber}
      />

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
