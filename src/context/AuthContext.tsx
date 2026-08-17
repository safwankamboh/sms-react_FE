import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { AcademicYear, AuthUser } from '../types'
import { ACTIVE_ACADEMIC_YEAR_KEY, AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../utils/constants'

interface Session {
  user: AuthUser
  token: string
  refreshToken: string
}

interface AuthContextType {
  user: AuthUser | null
  token: string | null
  refreshToken: string | null
  activeAcademicYear: AcademicYear | null
  isAuthenticated: boolean
  setSession: (session: Session) => void
  setActiveAcademicYear: (year: AcademicYear) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function readStoredAcademicYear(): AcademicYear | null {
  const raw = localStorage.getItem(ACTIVE_ACADEMIC_YEAR_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AcademicYear
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(AUTH_TOKEN_KEY))
  const [refreshToken, setRefreshToken] = useState<string | null>(() => localStorage.getItem(REFRESH_TOKEN_KEY))
  const [activeAcademicYear, setActiveAcademicYearState] = useState<AcademicYear | null>(() => readStoredAcademicYear())

  const logout = () => {
    setUser(null)
    setToken(null)
    setRefreshToken(null)
    setActiveAcademicYearState(null)
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(ACTIVE_ACADEMIC_YEAR_KEY)
  }

  const setSession = (session: Session) => {
    setUser(session.user)
    setToken(session.token)
    setRefreshToken(session.refreshToken)
    localStorage.setItem(AUTH_TOKEN_KEY, session.token)
    localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken)

    // A fresh login always requires re-picking the academic year, even if
    // one was picked in a previous session.
    setActiveAcademicYearState(null)
    localStorage.removeItem(ACTIVE_ACADEMIC_YEAR_KEY)
  }

  const setActiveAcademicYear = (year: AcademicYear) => {
    setActiveAcademicYearState(year)
    localStorage.setItem(ACTIVE_ACADEMIC_YEAR_KEY, JSON.stringify(year))
  }

  // axiosClient dispatches this when a silent token refresh fails (the
  // refresh token itself is expired/revoked) — it lives below React, so a
  // DOM event is how it tells the app the session is truly dead.
  useEffect(() => {
    const handleSessionExpired = () => logout()
    window.addEventListener('auth:session-expired', handleSessionExpired)
    return () => window.removeEventListener('auth:session-expired', handleSessionExpired)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        refreshToken,
        activeAcademicYear,
        isAuthenticated: Boolean(token),
        setSession,
        setActiveAcademicYear,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
