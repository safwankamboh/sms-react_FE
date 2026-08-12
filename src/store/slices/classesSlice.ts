import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { NewClass, ClassSection } from '../../types'
import axiosClient from '../../api/axiosClient'

interface ClassesState {
  classes: NewClass[]
  sections: ClassSection[]
  loading: boolean
  sectionsLoading: boolean
  error: string | null
}

const initialState: ClassesState = { classes: [], sections: [], loading: false, sectionsLoading: false, error: null }

export const fetchClasses = createAsyncThunk('classes/fetchAll', async (_, { rejectWithValue }) => {
  try { const { data } = await axiosClient.get('/adminstrator/classes'); return data }
  catch (err) { return rejectWithValue(err) }
})

export const fetchGlobalClasses = createAsyncThunk('classes/fetchGlobal', async (_, { rejectWithValue }) => {
  try { const { data } = await axiosClient.get('/global/get-classes'); return data }
  catch (err) { return rejectWithValue(err) }
})

export const fetchSections = createAsyncThunk('classes/fetchSections', async (classId: number, { rejectWithValue }) => {
  try { const { data } = await axiosClient.get(`/global/class-sections/${classId}`); return data }
  catch (err) { return rejectWithValue(err) }
})

export const saveClass = createAsyncThunk('classes/save', async (payload: { class_name: string }, { rejectWithValue }) => {
  try { const { data } = await axiosClient.post('/adminstrator/classes/save', payload); return data }
  catch (err) { return rejectWithValue(err) }
})

const classesSlice = createSlice({
  name: 'classes', initialState,
  reducers: { clearSections(state) { state.sections = [] } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClasses.pending, (state) => { state.loading = true })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload
        state.classes = Array.isArray(payload) ? payload : (payload?.data ?? [])
      })
      .addCase(fetchClasses.rejected, (state) => { state.loading = false })
      .addCase(fetchGlobalClasses.fulfilled, (state, action) => {
        const payload = action.payload
        state.classes = Array.isArray(payload) ? payload : (payload?.data ?? [])
      })
      .addCase(fetchSections.pending, (state) => { state.sectionsLoading = true })
      .addCase(fetchSections.fulfilled, (state, action) => {
        state.sectionsLoading = false
        const payload = action.payload
        state.sections = Array.isArray(payload) ? payload : (payload?.data ?? [])
      })
      .addCase(fetchSections.rejected, (state) => { state.sectionsLoading = false })
      .addCase(saveClass.fulfilled, (state, action) => {
        if (action.payload?.data) state.classes.push(action.payload.data)
      })
  },
})

export const { clearSections } = classesSlice.actions
export default classesSlice.reducer
