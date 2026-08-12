/**
 * RTK Query base API. Every module injects its endpoints onto this via
 * `api.injectEndpoints({...})` in `src/store/api/<module>Api.ts` — see
 * `studentsApi.ts` for the reference shape (query/mutation + tags).
 *
 * No createAsyncThunk anywhere in this app: all server data goes through
 * this cache instead of hand-rolled loading/error/list state in slices.
 */
import { createApi, type BaseQueryFn } from '@reduxjs/toolkit/query/react'
import type { AxiosRequestConfig } from 'axios'
import axiosClient, { type NormalizedError } from '../api/axiosClient'

const axiosBaseQuery =
  (): BaseQueryFn<AxiosRequestConfig, unknown, NormalizedError> =>
  async ({ url, method, data, params, headers }) => {
    try {
      const result = await axiosClient({ url, method, data, params, headers })
      return { data: result.data }
    } catch (error) {
      return { error: error as NormalizedError }
    }
  }

export const api = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    'Student', 'StudentTrash',
    'Teacher', 'TeacherTrash',
    'Class', 'Section',
    'AcademicYear', 'TuitionFee',
    'Course', 'CourseTrash', 'AssignedCourse',
    'OtherExpense', 'TeacherSalary', 'StudentFee',
    'ExamType', 'ExamSchedule',
  ],
  endpoints: () => ({}),
})

export default api
