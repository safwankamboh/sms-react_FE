import { GraduationCap } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useLogoutMutation } from '../../store/api/authApi'
import AcademicYearPicker from '../../components/academicYear/AcademicYearPicker'
import { APP_NAME } from '../../utils/constants'
import type { AcademicYear } from '../../types'

function SelectAcademicYearPage() {
  const { user, refreshToken, activeAcademicYear, setActiveAcademicYear, logout } = useAuth()
  const [logoutMutation] = useLogoutMutation()

  const handleSelect = (year: AcademicYear) => {
    setActiveAcademicYear(year)
    // Full reload (not client-side navigate) guarantees every RTK Query
    // cache entry is dropped and every page refetches under the new
    // X-Academic-Year-Id header — no risk of a stale cached tag slipping through.
    window.location.assign('/')
  }

  const handleLogout = async () => {
    try {
      if (refreshToken) await logoutMutation({ refreshToken }).unwrap()
    } catch {
      // proceed to clear local session regardless
    }
    logout()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-black text-white shadow-lg">
            <GraduationCap size={28} />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">{APP_NAME}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {user ? `Welcome, ${user.Username}. ` : ''}Choose the academic year you want to work in.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <AcademicYearPicker selectedId={activeAcademicYear?.Id} onSelect={handleSelect} />
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="mx-auto mt-6 block text-xs font-medium text-slate-400 transition hover:text-slate-600"
        >
          Not you? Sign out
        </button>
      </div>
    </div>
  )
}

export default SelectAcademicYearPage
