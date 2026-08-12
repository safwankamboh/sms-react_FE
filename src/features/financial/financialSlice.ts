import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { StudentTuitionFee, TeacherSalary, OtherExpanse } from '../../types'
import axiosClient from '../../api/axiosClient'

interface FinancialState {
  studentFees: StudentTuitionFee[]
  teacherSalaries: TeacherSalary[]
  expenses: OtherExpanse[]
  loading: boolean
  error: string | null
}

const initialState: FinancialState = { studentFees: [], teacherSalaries: [], expenses: [], loading: false, error: null }

export const fetchExpenses = createAsyncThunk('financial/fetchExpenses', async (_, { rejectWithValue }) => {
  try { const { data } = await axiosClient.get('/financial/other-expanses'); return data }
  catch (err) { return rejectWithValue(err) }
})

export const saveExpense = createAsyncThunk('financial/saveExpense', async (payload: Record<string, unknown>, { rejectWithValue }) => {
  try { const { data } = await axiosClient.post('/financial/other-expanses/generate-expanse', payload); return data }
  catch (err) { return rejectWithValue(err) }
})

export const updateExpense = createAsyncThunk('financial/updateExpense', async ({ expanseId, payload }: { expanseId: number; payload: Record<string, unknown> }, { rejectWithValue }) => {
  try { const { data } = await axiosClient.post(`/financial/other-expanses/update-expanse/${expanseId}`, payload); return data }
  catch (err) { return rejectWithValue(err) }
})

export const deleteExpense = createAsyncThunk('financial/deleteExpense', async (expanseId: number, { rejectWithValue }) => {
  try { const { data } = await axiosClient.get(`/financial/other-expanses/delete-expanse/${expanseId}`); return { expanseId, data } }
  catch (err) { return rejectWithValue(err) }
})

export const fetchTeacherSalaries = createAsyncThunk('financial/fetchSalaries', async (_, { rejectWithValue }) => {
  try { const { data } = await axiosClient.get('/financial/teachers-salaries'); return data }
  catch (err) { return rejectWithValue(err) }
})

export const generateTeacherSalary = createAsyncThunk('financial/generateSalary', async (payload: Record<string, unknown>, { rejectWithValue }) => {
  try { const { data } = await axiosClient.post('/financial/teachers-salaries/teachers-salary-save', payload); return data }
  catch (err) { return rejectWithValue(err) }
})

export const payTeacherSalary = createAsyncThunk('financial/paySalary', async ({ teacherId, monthId, payload }: { teacherId: number; monthId: number; payload: Record<string, unknown> }, { rejectWithValue }) => {
  try { const { data } = await axiosClient.post(`/financial/teachers-salaries/teacher-salary/${teacherId}/month/${monthId}/pay`, payload); return data }
  catch (err) { return rejectWithValue(err) }
})

export const fetchStudentFees = createAsyncThunk('financial/fetchStudentFees', async (classId: number, { rejectWithValue }) => {
  try { const { data } = await axiosClient.get(`/financial/class/${classId}`); return data }
  catch (err) { return rejectWithValue(err) }
})

export const payStudentFee = createAsyncThunk('financial/payStudentFee', async ({ classId, studentId, monthId, payload }: { classId: number; studentId: number; monthId: number; payload: Record<string, unknown> }, { rejectWithValue }) => {
  try { const { data } = await axiosClient.post(`/financial/student-fee-collect/class/${classId}/student/${studentId}/pay/${monthId}`, payload); return data }
  catch (err) { return rejectWithValue(err) }
})

const financialSlice = createSlice({
  name: 'financial', initialState,
  reducers: { clearError(state) { state.error = null } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => { state.loading = true })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false
        const p = action.payload
        state.expenses = Array.isArray(p) ? p : (p?.data ?? [])
      })
      .addCase(fetchExpenses.rejected, (state) => { state.loading = false })
      .addCase(deleteExpense.fulfilled, (state, action) => { state.expenses = state.expenses.filter((e) => e.id !== action.payload.expanseId) })
      .addCase(fetchTeacherSalaries.fulfilled, (state, action) => {
        const p = action.payload
        state.teacherSalaries = Array.isArray(p) ? p : (p?.data ?? [])
      })
      .addCase(fetchStudentFees.fulfilled, (state, action) => {
        const p = action.payload
        state.studentFees = Array.isArray(p) ? p : (p?.data ?? [])
      })
  },
})

export const { clearError } = financialSlice.actions
export default financialSlice.reducer
