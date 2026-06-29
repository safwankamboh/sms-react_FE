import {
  BookOpen,
  CalendarCheck,
  GraduationCap,
  LayoutDashboard,
  ReceiptText,
  School,
  Settings,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { APP_NAME } from '../../utils/constants'
import { classNames } from '../../utils/helpers'

const navigation = [
  { name: 'Overview', icon: LayoutDashboard, to: '/', enabled: true },
  { name: 'Students', icon: GraduationCap },
  { name: 'Teachers', icon: Users },
  { name: 'Classes & Subjects', icon: BookOpen },
  { name: 'Attendance', icon: CalendarCheck },
  { name: 'Exams', icon: School },
  { name: 'Fees', icon: ReceiptText },
  { name: 'Users & Roles', icon: ShieldCheck },
]

function SidebarContent({ onClose }) {
  return (
    <div className="flex h-full flex-col bg-slate-950 text-slate-300">
      <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-brand-500 text-white shadow-lg shadow-brand-500/20">
            <GraduationCap size={22} />
          </div>
          <div>
            <p className="text-lg font-bold tracking-tight text-white">{APP_NAME}</p>
            <p className="text-xs text-slate-400">School management</p>
          </div>
        </div>
        <button
          type="button"
          className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
          onClick={onClose}
          aria-label="Close navigation"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="scrollbar-thin flex-1 space-y-1 overflow-y-auto px-4 py-6">
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Workspace
        </p>
        {navigation.map((item) => {
          const Icon = item.icon

          if (!item.enabled) {
            return (
              <div
                key={item.name}
                className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-500"
                title="Available in a later module"
              >
                <Icon size={19} />
                <span>{item.name}</span>
                <span className="ml-auto rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium uppercase">
                  Soon
                </span>
              </div>
            )
          }

          return (
            <NavLink
              key={item.name}
              to={item.to}
              end
              onClick={onClose}
              className={({ isActive }) =>
                classNames(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-950/30'
                    : 'hover:bg-white/5 hover:text-white',
                )
              }
            >
              <Icon size={19} />
              {item.name}
            </NavLink>
          )
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
          <Settings size={18} className="text-slate-400" />
          <div>
            <p className="text-xs font-medium text-slate-200">Frontend foundation</p>
            <p className="text-[11px] text-slate-500">Module 1 active</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 lg:block">
        <SidebarContent onClose={onClose} />
      </aside>

      <div
        className={classNames(
          'fixed inset-0 z-50 lg:hidden',
          isOpen ? 'pointer-events-auto' : 'pointer-events-none',
        )}
        aria-hidden={!isOpen}
      >
        <button
          type="button"
          className={classNames(
            'absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity',
            isOpen ? 'opacity-100' : 'opacity-0',
          )}
          onClick={onClose}
          aria-label="Close navigation overlay"
        />
        <aside
          className={classNames(
            'absolute inset-y-0 left-0 w-[min(18rem,85vw)] shadow-2xl transition-transform duration-300',
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
