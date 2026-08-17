import { api } from '../api'
import type { DashboardSummary } from '../../types'

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardSummary: builder.query<DashboardSummary, void>({
      query: () => ({ url: '/dashboard/summary', method: 'GET' }),
      providesTags: ['Student', 'Teacher', 'Class', 'Course', 'AcademicYear'],
    }),
  }),
})

export const { useGetDashboardSummaryQuery } = dashboardApi
