import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Teacher, PaginatedResponse } from '../../types'
import axiosClient from '../../api/axiosClient'

interface TeachersState {
  list: Teacher[]
  trash: Teacher[]
  current: Teacher | null
  pagination: { currentPage: number; lastPage: number; total: number; from: number; to: number }
  loading: boolean
  error: string | null
}

const initialState: TeachersState = {
  list: [], trash: [], current: null,
  pagination: { currentPage: 1, lastPage: 1, total: 0, from: 0, to: 0 },
  loading: false, error: null,
}

export const fetchTeachers = createAsyncThunk('teachers/fetchAll', async (page = 1, { rejectWithValue }) => {
  try { const { data } = await axiosClient.get(`/teacher/teachers?page=${page}`); return data }
  catch (err) { return rejectWithValue(err) }
})

export const fetchTrashTeachers = createAsyncThunk('teachers/fetchTrash', async (_, { rejectWithValue }) => {
  try { const { data } = await axiosClient.get('/teacher/trash-data'); return data }
  catch (err) { return rejectWithValue(err) }
})

export const saveTeacher = createAsyncThunk('teachers/save', async (payload: Record<string, unknown>, { rejectWithValue }) => {
  try { const { data } = await axiosClient.post('/teacher/save', payload); return data }
  catch (err) { return rejectWithValue(err) }
})

export const updateTeacher = createAsyncThunk('teachers/update', async ({ teacherId, payload }: { teacherId: number; payload: Record<string, unknown> }, { rejectWithValue }) => {
  try { const { data } = await axiosClient.post(`/teacher/update/${teacherId}`, payload); return data }
  catch (err) { return rejectWithValue(err) }
})

export const softDeleteTeacher = createAsyncThunk('teachers/softDelete', async (teacherId: number, { rejectWithValue }) => {
  try { const { data } = await axiosClient.get(`/teacher/soft-delete/${teacherId}`); return { teacherId, data } }
  catch (err) { return rejectWithValue(err) }
})

export const restoreTeacher = createAsyncThunk('teachers/restore', async (teacherId: number, { rejectWithValue }) => {
  try { const { data } = await axiosClient.get(`/teacher/restore/${teacherId}`); return { teacherId, data } }
  catch (err) { return rejectWithValue(err) }
})

const teachersSlice = createSlice({
  name: 'teachers', initialState,
  reducers: {
    setCurrent(state, action) { state.current = action.payload },
    clearCurrent(state) { state.current = null },
    clearError(state) { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeachers.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.loading = false
        const p = action.payload as PaginatedResponse<Teacher>
        state.list = p.data
        state.pagination = { currentPage: p.current_page, lastPage: p.last_page, total: p.total, from: p.from, to: p.to }
      })
      .addCase(fetchTeachers.rejected, (state, action) => { state.loading = false; state.error = (action.payload as { message?: string })?.message ?? 'Failed' })
      .addCase(fetchTrashTeachers.fulfilled, (state, action) => {
        const p = action.payload as PaginatedResponse<Teacher>
        state.trash = Array.isArray(p) ? p : (p.data ?? [])
      })
      .addCase(softDeleteTeacher.fulfilled, (state, action) => { state.list = state.list.filter((t) => t.id !== action.payload.teacherId) })
      .addCase(restoreTeacher.fulfilled, (state, action) => { state.trash = state.trash.filter((t) => t.id !== action.payload.teacherId) })
  },
})

export const { setCurrent, clearCurrent, clearError } = teachersSlice.actions
export default teachersSlice.reducer
