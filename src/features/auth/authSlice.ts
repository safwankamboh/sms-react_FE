import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthUser, LoginPayload } from '../../types'
import { AUTH_TOKEN_KEY } from '../../utils/constants'
import axiosClient from '../../api/axiosClient'

interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const savedToken = localStorage.getItem(AUTH_TOKEN_KEY)

const initialState: AuthState = {
  user: null,
  token: savedToken,
  isAuthenticated: Boolean(savedToken),
  loading: false,
  error: null,
}

export const login = createAsyncThunk(
  'auth/login',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post('/auth/sign-in', payload)
      return data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem(AUTH_TOKEN_KEY)
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ token: string; user: AuthUser }>) => {
        state.loading = false
        state.token = action.payload.token
        state.user = action.payload.user
        state.isAuthenticated = true
        localStorage.setItem(AUTH_TOKEN_KEY, action.payload.token)
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as { message?: string })?.message ?? 'Login failed.'
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
