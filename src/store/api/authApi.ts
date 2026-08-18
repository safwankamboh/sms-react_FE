import { api } from '../api'
import type { AcademicYear, AuthUser, LoginPayload } from '../../types'

interface LoginResult {
  User: AuthUser
  AccessToken: string
  RefreshToken: string
  ActiveAcademicYear: AcademicYear | null
  // Every permission this user holds + every module they can actually do
  // something in (already enabled-for-school AND permitted, resolved
  // server-side — see App\Models\User::accessibleModuleSlugs()). UX gating
  // only; every backend endpoint enforces its own authorization regardless.
  Permissions: string[]
  Modules: string[]
}

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResult, LoginPayload>({
      query: (payload) => ({ url: '/auth/sign-in', method: 'POST', data: payload }),
    }),

    // Fire-and-forget on the caller's side: revokes the access + refresh
    // token server-side. axiosClient's own silent 401->refresh flow handles
    // expiry; this is only for an explicit "Logout" click.
    logout: builder.mutation<void, { refreshToken: string }>({
      query: ({ refreshToken }) => ({ url: '/auth/logout', method: 'POST', data: { refresh_token: refreshToken } }),
    }),
  }),
})

export const { useLoginMutation, useLogoutMutation } = authApi
