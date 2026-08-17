import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function RequireAcademicYear() {
  const { activeAcademicYear } = useAuth()
  return activeAcademicYear ? <Outlet /> : <Navigate to="/select-academic-year" replace />
}

export default RequireAcademicYear
