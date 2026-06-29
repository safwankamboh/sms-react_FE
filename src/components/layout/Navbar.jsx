import { Bell, ChevronDown, Menu, Search } from 'lucide-react'
import { useUI } from '../../hooks/useUI'

function Navbar() {
  const { toggleSidebar } = useUI()

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="flex h-20 items-center gap-4 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={toggleSidebar}
          className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>

        <div className="relative hidden max-w-md flex-1 md:block">
          <Search
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            placeholder="Search will be enabled with modules..."
            disabled
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-500 outline-none"
          />
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute right-2 top-2 size-2 rounded-full border-2 border-white bg-brand-500" />
          </button>

          <div className="hidden h-8 w-px bg-slate-200 sm:block" />
          <button
            type="button"
            className="flex items-center gap-3 rounded-xl p-1.5 hover:bg-slate-50"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white">
              SA
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-slate-800">School Admin</p>
              <p className="text-xs text-slate-500">Setup preview</p>
            </div>
            <ChevronDown size={16} className="hidden text-slate-400 sm:block" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
