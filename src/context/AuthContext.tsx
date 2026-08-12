import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { AcademicYear, AuthUser } from '../types'
import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../utils/constants'

interface Session {
  user: AuthUser
  token: string
  refreshToken: string
  activeAcademicYear: AcademicYear | null
}

interface AuthContextType {
  user: AuthUser | null
  token: string | null
  refreshToken: string | null
  activeAcademicYear: AcademicYear | null
  isAuthenticated: boolean
  setSession: (session: Session) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(AUTH_TOKEN_KEY))
  const [refreshToken, setRefreshToken] = useState<string | null>(() => localStorage.getItem(REFRESH_TOKEN_KEY))
  const [activeAcademicYear, setActiveAcademicYear] = useState<AcademicYear | null>(null)

  const logout = () => {
    setUser(null)
    setToken(null)
    setRefreshToken(null)
    setActiveAcademicYear(null)
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  }

  const setSession = (session: Session) => {
    setUser(session.user)
    setToken(session.token)
    setRefreshToken(session.refreshToken)
    setActiveAcademicYear(session.activeAcademicYear)
    localStorage.setItem(AUTH_TOKEN_KEY, session.token)
    localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken)
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
      value={{ user, token, refreshToken, activeAcademicYear, isAuthenticated: Boolean(token), setSession, logout }}
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
