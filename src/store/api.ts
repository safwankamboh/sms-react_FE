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
import type { ApiResponse, RawPaginationMeta } from '../types/common'

// Every backend response is the envelope { Success, Message, Data, Meta, Errors }
// (see `ApiResponse<T>` in types/common.ts). The base query unwraps `Data`
// once here so individual endpoints don't have to — `Meta` (pagination info)
// is still available to any endpoint via the second argument of
// `transformResponse(data, meta)`. RTK Query's BaseQueryFn requires an
// object (not a bare nullable) for its Meta type param, hence the wrapper.
interface ApiQueryMeta {
  Meta: RawPaginationMeta | null
}

const axiosBaseQuery =
  (): BaseQueryFn<AxiosRequestConfig, unknown, NormalizedError, object, ApiQueryMeta> =>
  async ({ url, method, data, params, headers }) => {
    try {
      const result = await axiosClient<ApiResponse>({ url, method, data, params, headers })
      return { data: result.data.Data, meta: { Meta: result.data.Meta } }
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
