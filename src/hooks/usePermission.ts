import { useAuth } from '../context/AuthContext'

// UX gating only (menu/route/button visibility) — never the real check.
// Every backend endpoint enforces its own authorization regardless of what
// this returns (Phase 3 plan §M, Rule 12).
export function usePermission(permission: string): boolean {
  const { hasPermission } = useAuth()
  return hasPermission(permission)
}

export function useModule(module: string): boolean {
  const { hasModule } = useAuth()
  return hasModule(module)
}
