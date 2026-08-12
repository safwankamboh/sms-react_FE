import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Course, AssignCourse, PaginatedResponse } from '../../types'
import axiosClient from '../../api/axiosClient'

interface CoursesState {
  list: Course[]
  trash: Course[]
  assigned: AssignCourse[]
  pagination: { currentPage: number; lastPage: number; total: number; from: number; to: number }
  loading: boolean
  error: string | null
}

const initialState: CoursesState = {
  list: [], trash: [], assigned: [],
  pagination: { currentPage: 1, lastPage: 1, total: 0, from: 0, to: 0 },
  loading: false, error: null,
}

export const fetchCourses = createAsyncThunk('courses/fetchAll', async (page = 1, { rejectWithValue }) => {
  try { const { data } = await axiosClient.get(`/course/courses?page=${page}`); return data }
  catch (err) { return rejectWithValue(err) }
})

export const fetchTrashCourses = createAsyncThunk('courses/fetchTrash', async (_, { rejectWithValue }) => {
  try { const { data } = await axiosClient.get('/course/trash-data'); return data }
  catch (err) { return rejectWithValue(err) }
})

export const saveCourse = createAsyncThunk('courses/save', async (payload: { course_name: string; course_code?: string }, { rejectWithValue }) => {
  try { const { data } = await axiosClient.post('/course/save', payload); return data }
  catch (err) { return rejectWithValue(err) }
})

export const updateCourse = createAsyncThunk('courses/update', async ({ courseId, payload }: { courseId: number; payload: Record<string, unknown> }, { rejectWithValue }) => {
  try { const { data } = await axiosClient.post(`/course/update/${courseId}`, payload); return data }
  catch (err) { return rejectWithValue(err) }
})

export const softDeleteCourse = createAsyncThunk('courses/softDelete', async (courseId: number, { rejectWithValue }) => {
  try { const { data } = await axiosClient.get(`/course/soft-delete/${courseId}`); return { courseId, data } }
  catch (err) { return rejectWithValue(err) }
})

export const restoreCourse = createAsyncThunk('courses/restore', async (courseId: number, { rejectWithValue }) => {
  try { const { data } = await axiosClient.get(`/course/restore/${courseId}`); return { courseId, data } }
  catch (err) { return rejectWithValue(err) }
})

export const fetchAssignedCourses = createAsyncThunk('courses/fetchAssigned', async (_, { rejectWithValue }) => {
  try { const { data } = await axiosClient.get('/manage-courses'); return data }
  catch (err) { return rejectWithValue(err) }
})

export const assignCourse = createAsyncThunk('courses/assign', async (payload: Record<string, unknown>, { rejectWithValue }) => {
  try { const { data } = await axiosClient.post('/manage-courses/save', payload); return data }
  catch (err) { return rejectWithValue(err) }
})

const coursesSlice = createSlice({
  name: 'courses', initialState,
  reducers: { clearError(state) { state.error = null } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => { state.loading = true })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false
        const p = action.payload as PaginatedResponse<Course>
        state.list = p.data
        state.pagination = { currentPage: p.current_page, lastPage: p.last_page, total: p.total, from: p.from, to: p.to }
      })
      .addCase(fetchCourses.rejected, (state) => { state.loading = false })
      .addCase(fetchTrashCourses.fulfilled, (state, action) => {
        const p = action.payload
        state.trash = Array.isArray(p) ? p : (p?.data ?? [])
      })
      .addCase(softDeleteCourse.fulfilled, (state, action) => { state.list = state.list.filter((c) => c.id !== action.payload.courseId) })
      .addCase(restoreCourse.fulfilled, (state, action) => { state.trash = state.trash.filter((c) => c.id !== action.payload.courseId) })
      .addCase(fetchAssignedCourses.fulfilled, (state, action) => {
        const p = action.payload
        state.assigned = Array.isArray(p) ? p : (p?.data ?? [])
      })
      .addCase(saveCourse.fulfilled, (state, action) => {
        if (action.payload?.data) state.list.unshift(action.payload.data)
      })
  },
})

export const { clearError } = coursesSlice.actions
export default coursesSlice.reducer
