import { LogOut, Menu } from 'lucide-react'
import { useUI } from '../../hooks/useUI'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { logout } from '../../store/slices/authSlice'
import { getInitials } from '../../utils/helpers'

function Navbar() {
  const { toggleSidebar } = useUI()
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
        <button
          type="button"
          onClick={toggleSidebar}
          className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={19} />
        </button>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden h-7 w-px bg-slate-200 sm:block" />
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
              {user ? getInitials(user.name) : 'SA'}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-slate-800">{user?.name ?? 'Admin'}</p>
              <p className="text-xs text-slate-500">{user?.email ?? ''}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => dispatch(logout())}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
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
