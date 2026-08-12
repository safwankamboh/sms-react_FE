import { createContext, useContext, useState, type ReactNode } from 'react'
import type { AcademicYear, AuthUser } from '../types'
import { AUTH_TOKEN_KEY } from '../utils/constants'

interface Session {
  user: AuthUser
  token: string
  activeAcademicYear: AcademicYear | null
}

interface AuthContextType {
  user: AuthUser | null
  token: string | null
  activeAcademicYear: AcademicYear | null
  isAuthenticated: boolean
  setSession: (session: Session) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(AUTH_TOKEN_KEY))
  const [activeAcademicYear, setActiveAcademicYear] = useState<AcademicYear | null>(null)

  const setSession = (session: Session) => {
    setUser(session.user)
    setToken(session.token)
    setActiveAcademicYear(session.activeAcademicYear)
    localStorage.setItem(AUTH_TOKEN_KEY, session.token)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    setActiveAcademicYear(null)
    localStorage.removeItem(AUTH_TOKEN_KEY)
  }

  return (
    <AuthContext.Provider
      value={{ user, token, activeAcademicYear, isAuthenticated: Boolean(token), setSession, logout }}
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
