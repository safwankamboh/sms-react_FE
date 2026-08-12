import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Student, PaginatedResponse } from '../../types'
import axiosClient from '../../api/axiosClient'

interface StudentsState {
  list: Student[]
  trash: Student[]
  current: Student | null
  pagination: { currentPage: number; lastPage: number; total: number; from: number; to: number }
  loading: boolean
  error: string | null
}

const initialState: StudentsState = {
  list: [],
  trash: [],
  current: null,
  pagination: { currentPage: 1, lastPage: 1, total: 0, from: 0, to: 0 },
  loading: false,
  error: null,
}

export const fetchStudents = createAsyncThunk('students/fetchAll', async (page = 1, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.get(`/student/students?page=${page}`)
    return data
  } catch (err) { return rejectWithValue(err) }
})

export const fetchTrashStudents = createAsyncThunk('students/fetchTrash', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.get('/student/trash-students-data')
    return data
  } catch (err) { return rejectWithValue(err) }
})

export const saveStudent = createAsyncThunk('students/save', async (payload: FormData | Record<string, unknown>, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.post('/student/save', payload)
    return data
  } catch (err) { return rejectWithValue(err) }
})

export const updateStudent = createAsyncThunk('students/update', async ({ classId, studentId, payload }: { classId: number; studentId: number; payload: Record<string, unknown> }, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.post(`/student/update/${classId}/${studentId}`, payload)
    return data
  } catch (err) { return rejectWithValue(err) }
})

export const softDeleteStudent = createAsyncThunk('students/softDelete', async ({ classId, studentId }: { classId: number; studentId: number }, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.get(`/student/soft-delete/${classId}/${studentId}`)
    return { studentId, data }
  } catch (err) { return rejectWithValue(err) }
})

export const restoreStudent = createAsyncThunk('students/restore', async ({ classId, studentId }: { classId: number; studentId: number }, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.get(`/student/restore-student/${classId}/${studentId}`)
    return { studentId, data }
  } catch (err) { return rejectWithValue(err) }
})

const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    clearCurrent(state) { state.current = null },
    clearError(state) { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false
        const p = action.payload as PaginatedResponse<Student>
        state.list = p.data
        state.pagination = { currentPage: p.current_page, lastPage: p.last_page, total: p.total, from: p.from, to: p.to }
      })
      .addCase(fetchStudents.rejected, (state, action) => { state.loading = false; state.error = (action.payload as { message?: string })?.message ?? 'Failed' })
      .addCase(fetchTrashStudents.fulfilled, (state, action) => {
        const p = action.payload as PaginatedResponse<Student>
        state.trash = Array.isArray(p) ? p : (p.data ?? [])
      })
      .addCase(softDeleteStudent.fulfilled, (state, action) => {
        state.list = state.list.filter((s) => s.id !== action.payload.studentId)
      })
      .addCase(restoreStudent.fulfilled, (state, action) => {
        state.trash = state.trash.filter((s) => s.id !== action.payload.studentId)
      })
  },
})

export const { clearCurrent, clearError } = studentsSlice.actions
export default studentsSlice.reducer
