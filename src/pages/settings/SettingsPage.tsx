import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PageHeader, Card, Button } from '../../components/common'
import AcademicYearPicker from '../../components/academicYear/AcademicYearPicker'
import { useAuth } from '../../context/AuthContext'
import type { AcademicYear } from '../../types'

function SettingsPage() {
  const navigate = useNavigate()
  const { activeAcademicYear, setActiveAcademicYear } = useAuth()

  const handleSelect = (year: AcademicYear) => {
    if (year.Id === activeAcademicYear?.Id) return
    setActiveAcademicYear(year)
    // Full reload so every cached query refetches under the new
    // X-Academic-Year-Id header, same as the post-login picker.
    window.location.assign('/settings')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Settings"
        title="Settings"
        description="Manage which academic year you're currently working in for this session."
      />

      <Card className="p-5">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Working academic year</h2>
            <p className="text-sm text-slate-500">
              This only affects what you see in this session — it doesn't change the school-wide default.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={<ArrowRight size={14} />}
            onClick={() => navigate('/administrator/academic-years')}
          >
            Manage academic years
          </Button>
        </div>

        <AcademicYearPicker selectedId={activeAcademicYear?.Id} onSelect={handleSelect} />
      </Card>
    </div>
  )
}

export default SettingsPage
