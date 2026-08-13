export interface AuthUser {
  Id: number
  RoleId: number
  Username: string
  Email: string
  EmailVerifiedAt: string | null
  DeletedAt: string | null
  CreatedAt: string
  UpdatedAt: string
}

export interface LoginPayload {
  email: string
  password: string
}
