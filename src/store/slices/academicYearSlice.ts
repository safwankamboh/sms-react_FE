import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { AcademicYear, TuitionFee } from '../../types'
import axiosClient from '../../api/axiosClient'

interface AcademicYearState {
  years: AcademicYear[]
  tuitionFees: TuitionFee[]
  loading: boolean
  error: string | null
}

const initialState: AcademicYearState = { years: [], tuitionFees: [], loading: false, error: null }

export const fetchAcademicYears = createAsyncThunk('academicYear/fetchAll', async (_, { rejectWithValue }) => {
  try { const { data } = await axiosClient.get('/adminstrator/academic-years'); return data }
  catch (err) { return rejectWithValue(err) }
})

export const saveAcademicYear = createAsyncThunk('academicYear/save', async (payload: { year: string }, { rejectWithValue }) => {
  try { const { data } = await axiosClient.post('/adminstrator/academic-years/save', payload); return data }
  catch (err) { return rejectWithValue(err) }
})

export const setDefaultYear = createAsyncThunk('academicYear/setDefault', async (id: number, { rejectWithValue }) => {
  try { const { data } = await axiosClient.get(`/adminstrator/academic-years/academic-year-set-default/${id}`); return { id, data } }
  catch (err) { return rejectWithValue(err) }
})

export const fetchTuitionFee = createAsyncThunk('academicYear/fetchTuitionFee', async (classId: number, { rejectWithValue }) => {
  try { const { data } = await axiosClient.get(`/adminstrator/tuition-fee/edit/${classId}`); return data }
  catch (err) { return rejectWithValue(err) }
})

const academicYearSlice = createSlice({
  name: 'academicYear', initialState,
  reducers: { clearError(state) { state.error = null } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAcademicYears.pending, (state) => { state.loading = true })
      .addCase(fetchAcademicYears.fulfilled, (state, action) => {
        state.loading = false
        const p = action.payload
        state.years = Array.isArray(p) ? p : (p?.data ?? [])
      })
      .addCase(fetchAcademicYears.rejected, (state) => { state.loading = false })
      .addCase(saveAcademicYear.fulfilled, (state, action) => {
        if (action.payload?.data) state.years.push(action.payload.data)
      })
      .addCase(setDefaultYear.fulfilled, (state, action) => {
        state.years = state.years.map((y) => ({ ...y, is_default: y.id === action.payload.id ? 1 : 0 }))
      })
      .addCase(fetchTuitionFee.fulfilled, (state, action) => {
        const p = action.payload
        state.tuitionFees = Array.isArray(p) ? p : (p?.data ?? [])
      })
  },
})

export const { clearError } = academicYearSlice.actions
export default academicYearSlice.reducer
