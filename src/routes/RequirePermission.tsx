import { Navigate, Outlet } from 'react-router-dom'
import { usePermission } from '../hooks/usePermission'

// Route-level UX gating — hides a page the user has no reason to see.
// NOT a security boundary: the backend enforces its own authorization on
// every request regardless (Phase 3 plan §M, Rule 12).
function RequirePermission({ permission }: { permission: string }) {
  const allowed = usePermission(permission)
  return allowed ? <Outlet /> : <Navigate to="/" replace />
}

export default RequirePermission
