import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: 'School Management System',
  apiStatus: 'idle',
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setApiStatus: (state, action) => {
      state.apiStatus = action.payload
    },
  },
})

export const { setApiStatus } = appSlice.actions
export default appSlice.reducer
