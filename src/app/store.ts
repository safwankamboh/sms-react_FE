import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import studentsReducer from '../features/students/studentsSlice'
import teachersReducer from '../features/teachers/teachersSlice'
import classesReducer from '../features/classes/classesSlice'
import academicYearReducer from '../features/academicYear/academicYearSlice'
import coursesReducer from '../features/courses/coursesSlice'
import financialReducer from '../features/financial/financialSlice'
import examsReducer from '../features/exams/examsSlice'

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
