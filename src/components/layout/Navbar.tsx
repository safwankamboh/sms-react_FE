import { LogOut, Menu } from 'lucide-react'
import { useUI } from '../../hooks/useUI'
import { useAuth } from '../../context/AuthContext'
import { useLogoutMutation } from '../../store/api/authApi'
import { getInitials } from '../../utils/helpers'

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
          <div className="hidden h-7 w-px bg-slate-200 sm:block" />
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center bg-slate-900 text-sm font-bold text-white">
              {user ? getInitials(user.username) : 'SA'}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-slate-800">{user?.username ?? 'Admin'}</p>
              <p className="text-xs text-slate-500">{user?.email ?? ''}</p>
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
