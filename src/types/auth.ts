export interface AuthUser {
  id: number
  role_id: number
  username: string
  email: string
  email_verified_at: string | null
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface LoginPayload {
  email: string
  password: string
}
