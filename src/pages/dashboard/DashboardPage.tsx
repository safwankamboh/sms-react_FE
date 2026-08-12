import { useEffect } from 'react'
import { GraduationCap, Users, BookOpen, CalendarCheck, TrendingUp, School, DollarSign } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchStudents } from '../../store/slices/studentsSlice'
import { fetchTeachers } from '../../store/slices/teachersSlice'
import { fetchGlobalClasses } from '../../store/slices/classesSlice'
import { fetchCourses } from '../../store/slices/coursesSlice'
import Card from '../../components/common/Card'
import PageHeader from '../../components/common/PageHeader'
import Badge from '../../components/common/Badge'
import { formatCurrency } from '../../utils/helpers'

function StatCard({ label, value, icon: Icon, sub }: { label: string; value: string | number; icon: React.ElementType; sub?: string }) {
  return (
    <Card as="div" className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
          {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
        </div>
        <div className="flex size-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          <Icon size={22} />
        </div>
      </div>
    </Card>
  )
}

function DashboardPage() {
  const dispatch = useAppDispatch()
  const students = useAppSelector((s) => s.students.pagination.total)
  const teachers = useAppSelector((s) => s.teachers.pagination.total)
  const classes = useAppSelector((s) => s.classes.classes.length)
  const courses = useAppSelector((s) => s.courses.pagination.total)
  const user = useAppSelector((s) => s.auth.user)

  useEffect(() => {
    dispatch(fetchStudents(1))
    dispatch(fetchTeachers(1))
    dispatch(fetchGlobalClasses())
    dispatch(fetchCourses(1))
  }, [dispatch])

  const stats = [
    { label: 'Total Students', value: students, icon: GraduationCap, sub: 'enrolled this year' },
    { label: 'Total Teachers', value: teachers, icon: Users, sub: 'active staff' },
    { label: 'Total Classes', value: classes, icon: School, sub: 'across all grades' },
    { label: 'Total Courses', value: courses, icon: BookOpen, sub: 'in curriculum' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Dashboard"
        title={`Welcome back, ${user?.name?.split(' ')[0] ?? 'Admin'}`}
        description="Here's an overview of your school management system."
        actions={<Badge variant="success">System Active</Badge>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card as="div" className="p-5 sm:p-6">
          <h2 className="mb-4 text-base font-semibold text-slate-900">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Add Student', href: '/students', icon: GraduationCap },
              { label: 'Add Teacher', href: '/teachers', icon: Users },
              { label: 'Mark Attendance', href: '/attendance', icon: CalendarCheck },
              { label: 'Generate Fees', href: '/financial/fees', icon: DollarSign },
              { label: 'Manage Classes', href: '/administrator/classes', icon: School },
              { label: 'Exam Schedule', href: '/exams', icon: TrendingUp },
            ].map((action) => {
              const Icon = action.icon
              return (
                <a
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:bg-slate-900 hover:text-white"
                >
                  <Icon size={17} />
                  {action.label}
                </a>
              )
            })}
          </div>
        </Card>

        <Card as="div" className="p-5 sm:p-6">
          <h2 className="mb-4 text-base font-semibold text-slate-900">System Info</h2>
          <dl className="space-y-3">
            {[
              { term: 'Logged In As', desc: user?.name ?? '—' },
              { term: 'Email', desc: user?.email ?? '—' },
              { term: 'Role', desc: user?.role_id === 1 ? 'Administrator' : user?.role_id === 2 ? 'Teacher' : 'Student' },
              { term: 'API Endpoint', desc: import.meta.env.VITE_API_BASE_URL ?? 'http://sms.test/api/v1' },
            ].map((item) => (
              <div key={item.term} className="flex justify-between text-sm">
                <dt className="font-medium text-slate-500">{item.term}</dt>
                <dd className="text-slate-900 truncate max-w-[60%] text-right">{item.desc}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage
