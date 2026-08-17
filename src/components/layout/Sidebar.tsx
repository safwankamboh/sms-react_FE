import {
  BookOpen,
  CalendarCheck,
  GraduationCap,
  LayoutDashboard,
  ReceiptText,
  School,
  Users,
  X,
  Layers,
  DollarSign,
  ClipboardList,
  Building2,
  BookMarked,
  Banknote,
  TrendingDown,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { APP_NAME } from '../../utils/constants'
import { classNames } from '../../utils/helpers'

interface NavItem {
  name: string
  to: string
  icon: React.ElementType
  end?: boolean
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    label: 'Workspace',
    items: [
      { name: 'Dashboard', to: '/', icon: LayoutDashboard, end: true },
    ],
  },
  {
    label: 'Academic',
    items: [
      { name: 'Students', to: '/students', icon: GraduationCap, end: true },
      { name: 'Teachers', to: '/teachers', icon: Users, end: true },
      { name: 'Attendance', to: '/attendance', icon: CalendarCheck, end: true },
      { name: 'Classes', to: '/administrator/classes', icon: Building2, end: true },
      { name: 'Courses', to: '/courses', icon: BookOpen },
      { name: 'Assign Courses', to: '/manage-courses', icon: BookMarked },
      { name: 'Exams', to: '/exams', icon: School },
    ],
  },
  {
    label: 'Financial',
    items: [
      { name: 'Student Fees', to: '/financial/fees', icon: ReceiptText },
      { name: 'Teacher Salaries', to: '/financial/salaries', icon: Banknote },
      { name: 'Other Expenses', to: '/financial/expenses', icon: TrendingDown },
    ],
  },
  {
    label: 'Administrator',
    items: [
      { name: 'Acadmic Year', to: '/administrator/academic-years/create', icon: Layers },
      { name: 'Manage Acadmic Year', to: '/administrator/academic-years', icon: Layers, end: true },
      { name: 'Tution Fee', to: '/administrator/tuition-fee', icon: DollarSign },
      { name: 'Create New Class', to: '/administrator/classes/create', icon: Building2 },
      { name: 'Break Schedule', to: '/administrator/break-schedule', icon: ClipboardList },
    ],
  },
]

function SidebarContent({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-black text-slate-300">
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center bg-white text-black">
            <GraduationCap size={19} />
          </div>
          <div>
            <p className="text-base font-bold tracking-tight text-white">{APP_NAME}</p>
            <p className="text-[11px] text-slate-500">School Management</p>
          </div>
        </div>
        <button
          type="button"
          className="p-1.5 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
          onClick={onClose}
          aria-label="Close navigation"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="scrollbar-thin flex-1 space-y-5 overflow-y-auto px-3 py-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    end={item.end}
                    onClick={onClose}
                    className={({ isActive }) =>
                      classNames(
                        'flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-white text-black'
                          : 'text-slate-400 hover:bg-white/10 hover:text-white',
                      )
                    }
                  >
                    <Icon size={17} />
                    {item.name}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  )
}

function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        <SidebarContent />
      </aside>
      <div
        className={classNames('fixed inset-0 z-50 lg:hidden', isOpen ? 'pointer-events-auto' : 'pointer-events-none')}
        aria-hidden={!isOpen}
      >
        <button
          type="button"
          className={classNames('absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity', isOpen ? 'opacity-100' : 'opacity-0')}
          onClick={onClose}
          aria-label="Close overlay"
        />
        <aside
          className={classNames(
            'absolute inset-y-0 left-0 w-64 shadow-2xl transition-transform duration-300',
            isOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <SidebarContent onClose={onClose} />
        </aside>
      </div>
    </>
  )
}

export default Sidebar
