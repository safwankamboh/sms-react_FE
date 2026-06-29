import { Outlet } from 'react-router-dom'
import { useUI } from '../../hooks/useUI'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

function DashboardLayout() {
  const { isSidebarOpen, closeSidebar } = useUI()

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <div className="lg:pl-72">
        <Navbar />
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
