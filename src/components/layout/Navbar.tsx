import { useEffect, useRef, useState } from 'react'
import { Calendar, ChevronDown, LogOut, Menu } from 'lucide-react'
import { useUI } from '../../hooks/useUI'
import { useAuth } from '../../context/AuthContext'
import { useLogoutMutation } from '../../store/api/authApi'
import { useGetAllAcademicYearsQuery } from '../../store/api/academicYearApi'
import { getInitials, classNames } from '../../utils/helpers'
import type { AcademicYear } from '../../types'

function AcademicYearSwitcher() {
  const { activeAcademicYear, setActiveAcademicYear } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { data: years = [] } = useGetAllAcademicYearsQuery(undefined, { skip: !isOpen })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (year: AcademicYear) => {
    setIsOpen(false)
    if (year.Id === activeAcademicYear?.Id) return
    setActiveAcademicYear(year)
    // Full reload so every cached query refetches under the new
    // X-Academic-Year-Id header.
    window.location.assign('/')
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-2 border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        <Calendar size={15} className="text-slate-400" />
        <span className="hidden sm:inline">{activeAcademicYear?.Name ?? 'Academic Year'}</span>
        <ChevronDown size={14} className="text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-40 mt-2 w-56 border border-slate-200 bg-white py-1 shadow-lg">
          {years.length === 0 && <p className="px-3 py-2 text-xs text-slate-400">Loading...</p>}
          {years.map((year) => (
            <button
              key={year.Id}
              type="button"
              onClick={() => handleSelect(year)}
              className={classNames(
                'flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-slate-50',
                year.Id === activeAcademicYear?.Id ? 'font-semibold text-slate-900' : 'text-slate-600',
              )}
            >
              {year.Name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function Navbar() {
  const { toggleSidebar } = useUI()
  const { user, refreshToken, logout } = useAuth()
  const [logoutMutation] = useLogoutMutation()

  const handleLogout = async () => {
    if (refreshToken) {
      try {
        await logoutMutation({ refreshToken }).unwrap()
      } catch {
        // best-effort server-side revoke — clear the local session regardless
      }
    }
    logout()
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
        <button
          type="button"
          onClick={toggleSidebar}
          className="border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={19} />
        </button>

        <div className="ml-auto flex items-center gap-3">
          <AcademicYearSwitcher />
          <div className="hidden h-7 w-px bg-slate-200 sm:block" />
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center bg-slate-900 text-sm font-bold text-white">
              {user ? getInitials(user.Username) : 'SA'}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-slate-800">{user?.Username ?? 'Admin'}</p>
              <p className="text-xs text-slate-500">{user?.Email ?? ''}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
