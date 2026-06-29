import axios from 'axios'
import { API_BASE_URL, AUTH_TOKEN_KEY } from '../utils/constants'

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
  timeout: 15000,
})

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalizedError = {
      status: error.response?.status ?? null,
      message:
        error.response?.data?.message ??
        error.message ??
        'Something went wrong. Please try again.',
      errors: error.response?.data?.errors ?? {},
      originalError: error,
    }

    return Promise.reject(normalizedError)
  },
)

export default axiosClient
