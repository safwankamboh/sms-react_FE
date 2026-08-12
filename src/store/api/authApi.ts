import { api } from '../api'
import type { AcademicYear, AuthUser, LoginPayload } from '../../types'

interface LoginResponseEnvelope {
  data: {
    user: AuthUser
    accessToken: string
    activeAcademicYear: AcademicYear | null
  }
}

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponseEnvelope['data'], LoginPayload>({
      query: (payload) => ({ url: '/auth/sign-in', method: 'POST', data: payload }),
      transformResponse: (response: LoginResponseEnvelope) => response.data,
    }),
  }),
})

export const { useLoginMutation } = authApi
