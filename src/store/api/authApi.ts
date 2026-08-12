import { api } from '../api'
import type { AcademicYear, AuthUser, LoginPayload } from '../../types'

interface LoginResponseEnvelope {
  data: {
    user: AuthUser
    accessToken: string
    refreshToken: string
    activeAcademicYear: AcademicYear | null
  }
}

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponseEnvelope['data'], LoginPayload>({
      query: (payload) => ({ url: '/auth/sign-in', method: 'POST', data: payload }),
      transformResponse: (response: LoginResponseEnvelope) => response.data,
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
