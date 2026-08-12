import { api } from '../api'
import type { OtherExpanse, StudentTuitionFee, TeacherSalary } from '../../types'

const asList = <T>(response: T[] | { data: T[] }): T[] => (Array.isArray(response) ? response : (response.data ?? []))

export const financialApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getExpenses: builder.query<OtherExpanse[], void>({
      query: () => ({ url: '/financial/other-expanses', method: 'GET' }),
      transformResponse: asList<OtherExpanse>,
      providesTags: ['OtherExpense'],
    }),

    saveExpense: builder.mutation<unknown, Record<string, unknown>>({
      query: (payload) => ({ url: '/financial/other-expanses/generate-expanse', method: 'POST', data: payload }),
      invalidatesTags: ['OtherExpense'],
    }),

    updateExpense: builder.mutation<unknown, { expanseId: number; payload: Record<string, unknown> }>({
      query: ({ expanseId, payload }) => ({ url: `/financial/other-expanses/update-expanse/${expanseId}`, method: 'POST', data: payload }),
      invalidatesTags: ['OtherExpense'],
    }),

    deleteExpense: builder.mutation<void, number>({
      query: (expanseId) => ({ url: `/financial/other-expanses/delete-expanse/${expanseId}`, method: 'GET' }),
      invalidatesTags: ['OtherExpense'],
    }),

    getTeacherSalaries: builder.query<TeacherSalary[], void>({
      query: () => ({ url: '/financial/teachers-salaries', method: 'GET' }),
      transformResponse: asList<TeacherSalary>,
      providesTags: ['TeacherSalary'],
    }),

    generateTeacherSalary: builder.mutation<unknown, Record<string, unknown>>({
      query: (payload) => ({ url: '/financial/teachers-salaries/teachers-salary-save', method: 'POST', data: payload }),
      invalidatesTags: ['TeacherSalary'],
    }),

    payTeacherSalary: builder.mutation<unknown, { teacherId: number; monthId: number; payload: Record<string, unknown> }>({
      query: ({ teacherId, monthId, payload }) => ({
        url: `/financial/teachers-salaries/teacher-salary/${teacherId}/month/${monthId}/pay`, method: 'POST', data: payload,
      }),
      invalidatesTags: ['TeacherSalary'],
    }),

    getStudentFees: builder.query<StudentTuitionFee[], number>({
      query: (classId) => ({ url: `/financial/class/${classId}`, method: 'GET' }),
      transformResponse: asList<StudentTuitionFee>,
      providesTags: ['StudentFee'],
    }),

    payStudentFee: builder.mutation<unknown, { classId: number; studentId: number; monthId: number; payload: Record<string, unknown> }>({
      query: ({ classId, studentId, monthId, payload }) => ({
        url: `/financial/student-fee-collect/class/${classId}/student/${studentId}/pay/${monthId}`, method: 'POST', data: payload,
      }),
      invalidatesTags: ['StudentFee'],
    }),
  }),
})

export const {
  useGetExpensesQuery,
  useSaveExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useGetTeacherSalariesQuery,
  useGenerateTeacherSalaryMutation,
  usePayTeacherSalaryMutation,
  useGetStudentFeesQuery,
  usePayStudentFeeMutation,
} = financialApi
