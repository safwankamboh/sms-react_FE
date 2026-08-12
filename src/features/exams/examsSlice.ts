import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { ExamType, ExamSchedule } from '../../types'
import axiosClient from '../../api/axiosClient'

interface ExamsState {
  types: ExamType[]
  schedules: ExamSchedule[]
  loading: boolean
  error: string | null
}

const initialState: ExamsState = { types: [], schedules: [], loading: false, error: null }

export const fetchExamTypes = createAsyncThunk('exams/fetchTypes', async (_, { rejectWithValue }) => {
  try { const { data } = await axiosClient.get('/exams'); return data }
  catch (err) { return rejectWithValue(err) }
})

export const saveExamType = createAsyncThunk('exams/saveType', async (payload: { exam_name: string }, { rejectWithValue }) => {
  try { const { data } = await axiosClient.post('/exams/exam-typeForm/submit', payload); return data }
  catch (err) { return rejectWithValue(err) }
})

export const updateExamType = createAsyncThunk('exams/updateType', async ({ examTypeId, payload }: { examTypeId: number; payload: { exam_name: string } }, { rejectWithValue }) => {
  try { const { data } = await axiosClient.post(`/exams/update-exam-typeForm/submit/${examTypeId}`, payload); return data }
  catch (err) { return rejectWithValue(err) }
})

export const deleteExamType = createAsyncThunk('exams/deleteType', async (examTypeId: number, { rejectWithValue }) => {
  try { const { data } = await axiosClient.get(`/exams/delete-exam-typeForm/${examTypeId}`); return { examTypeId, data } }
  catch (err) { return rejectWithValue(err) }
})

export const fetchExamSchedule = createAsyncThunk('exams/fetchSchedule', async (classId: number, { rejectWithValue }) => {
  try { const { data } = await axiosClient.get(`/exams/exam-schedule-class/${classId}`); return data }
  catch (err) { return rejectWithValue(err) }
})

export const saveExamSchedule = createAsyncThunk('exams/saveSchedule', async (payload: Record<string, unknown>, { rejectWithValue }) => {
  try { const { data } = await axiosClient.post('/exams/exam-schedule-class', payload); return data }
  catch (err) { return rejectWithValue(err) }
})

const examsSlice = createSlice({
  name: 'exams', initialState,
  reducers: { clearError(state) { state.error = null } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExamTypes.pending, (state) => { state.loading = true })
      .addCase(fetchExamTypes.fulfilled, (state, action) => {
        state.loading = false
        const p = action.payload
        state.types = Array.isArray(p) ? p : (p?.data ?? [])
      })
      .addCase(fetchExamTypes.rejected, (state) => { state.loading = false })
      .addCase(deleteExamType.fulfilled, (state, action) => { state.types = state.types.filter((t) => t.id !== action.payload.examTypeId) })
      .addCase(fetchExamSchedule.fulfilled, (state, action) => {
        const p = action.payload
        state.schedules = Array.isArray(p) ? p : (p?.data ?? [])
      })
      .addCase(saveExamType.fulfilled, (state, action) => {
        if (action.payload?.data) state.types.push(action.payload.data)
      })
  },
})

export const { clearError } = examsSlice.actions
export default examsSlice.reducer
