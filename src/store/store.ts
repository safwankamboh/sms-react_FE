import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import studentsReducer from './slices/studentsSlice'
import teachersReducer from './slices/teachersSlice'
import classesReducer from './slices/classesSlice'
import academicYearReducer from './slices/academicYearSlice'
import coursesReducer from './slices/coursesSlice'
import financialReducer from './slices/financialSlice'
import examsReducer from './slices/examsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    students: studentsReducer,
    teachers: teachersReducer,
    classes: classesReducer,
    academicYear: academicYearReducer,
    courses: coursesReducer,
    financial: financialReducer,
    exams: examsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
