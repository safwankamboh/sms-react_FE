import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { API_BASE_URL, AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../utils/constants'

export interface NormalizedError {
  status: number | null
  message: string
  errors: Record<string, string[]>
}

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retried?: boolean
}

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { Accept: 'application/json' },
  timeout: 15000,
})

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Concurrent 401s share one in-flight refresh call instead of each firing
// their own — the second, third, etc. requests just await this promise.
let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
  if (!refreshToken) return null

  try {
    // Plain axios, not axiosClient — this must not go through the
    // interceptor above (no point attaching an expired access token) or
    // recurse back into this same 401 handler.
    const { data } = await axios.post(
      `${API_BASE_URL}/auth/refresh-token`,
      { refresh_token: refreshToken },
      { headers: { Accept: 'application/json' } },
    )
    localStorage.setItem(AUTH_TOKEN_KEY, data.Data.AccessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, data.Data.RefreshToken)
    return data.Data.AccessToken as string
  } catch {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    // AuthContext listens for this to clear session state and bounce to
    // /login — axiosClient sits below React, so a DOM event is the bridge.
    window.dispatchEvent(new Event('auth:session-expired'))
    return null
  }
}

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ Message?: string; Errors?: Record<string, string[]> }>) => {
    const originalRequest = error.config as RetriableConfig | undefined
    const isAuthRoute = originalRequest?.url?.includes('/auth/sign-in') || originalRequest?.url?.includes('/auth/refresh-token')

    if (error.response?.status === 401 && originalRequest && !originalRequest._retried && !isAuthRoute) {
      originalRequest._retried = true
      refreshPromise ??= refreshAccessToken().finally(() => { refreshPromise = null })
      const newToken = await refreshPromise

      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return axiosClient(originalRequest)
      }
    }

    const normalizedError: NormalizedError = {
      status: error.response?.status ?? null,
      message: error.response?.data?.Message ?? error.message ?? 'Something went wrong.',
      errors: error.response?.data?.Errors ?? {},
    }
    return Promise.reject(normalizedError)
  },
)

export default axiosClient
