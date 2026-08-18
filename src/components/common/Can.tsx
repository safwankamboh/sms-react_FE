import type { ReactNode } from 'react'
import { usePermission } from '../../hooks/usePermission'

interface CanProps {
  permission: string
  children: ReactNode
  fallback?: ReactNode
}

// Inline UX gating for a button/menu item/section — e.g.
// `<Can permission="students.create"><Button>Add Student</Button></Can>`.
// NOT a security boundary: the backend enforces its own authorization on
// every request regardless (Phase 3 plan §M, Rule 12).
function Can({ permission, children, fallback = null }: CanProps) {
  const allowed = usePermission(permission)
  return allowed ? <>{children}</> : <>{fallback}</>
}

export default Can
