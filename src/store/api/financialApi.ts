import { api } from '../api'
import type {
  ClassFeeSummary,
  FeeCollectionRow,
  OtherExpanse,
  OtherExpanseFormData,
  StudentFeeOutstanding,
  TeacherSalary,
  TeacherSalaryMonthRow,
  TeacherSalaryOutstanding,
} from '../../types'

interface MonthOption {
  value: string
  name: string
}

interface FeeCollectionDetail {
  Fesses: FeeCollectionRow[]
  ClassId: number
  StudentId: number
}

interface TeacherSalaryDetail {
  Salaries: TeacherSalaryMonthRow[]
  TeacherId: number
}

export const financialApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getExpenses: builder.query<OtherExpanse[], void>({
      query: () => ({ url: '/financial/other-expanses', method: 'GET' }),
      providesTags: ['OtherExpense'],
    }),

    saveExpense: builder.mutation<OtherExpanse, OtherExpanseFormData>({
      query: (payload) => ({ url: '/financial/other-expanses/generate-expanse', method: 'POST', data: payload }),
      invalidatesTags: ['OtherExpense'],
    }),

    updateExpense: builder.mutation<OtherExpanse, { expanseId: number; payload: OtherExpanseFormData }>({
      query: ({ expanseId, payload }) => ({ url: `/financial/other-expanses/update-expanse/${expanseId}`, method: 'POST', data: payload }),
      invalidatesTags: ['OtherExpense'],
    }),

    deleteExpense: builder.mutation<void, number>({
      query: (expanseId) => ({ url: `/financial/other-expanses/delete-expanse/${expanseId}`, method: 'GET' }),
      invalidatesTags: ['OtherExpense'],
    }),

    getTeacherSalaries: builder.query<TeacherSalary[], void>({
      query: () => ({ url: '/financial/teachers-salaries', method: 'GET' }),
      providesTags: ['TeacherSalary'],
    }),

    getTeachersOutstandings: builder.query<TeacherSalaryOutstanding[], string>({
      query: (month) => ({ url: '/financial/teachers-salaries/teachers-salary-generate', method: 'GET', params: { month } }),
      providesTags: ['TeacherSalary'],
    }),

    generateTeacherSalary: builder.mutation<unknown, TeacherSalaryOutstanding[]>({
      query: (payload) => ({ url: '/financial/teachers-salaries/teachers-salary-save', method: 'POST', data: payload }),
      invalidatesTags: ['TeacherSalary'],
    }),

    getTeacherSalaryDetail: builder.query<TeacherSalaryDetail, number>({
      query: (teacherId) => ({ url: `/financial/teachers-salaries/teacher-salary/${teacherId}`, method: 'GET' }),
      providesTags: ['TeacherSalary'],
    }),

    payTeacherSalary: builder.mutation<TeacherSalary, { teacherId: number; monthId: number; payload: { salary_amount: string; bonus_amount?: string; bonus_reason?: string; payment_amount: string } }>({
      query: ({ teacherId, monthId, payload }) => ({
        url: `/financial/teachers-salaries/teacher-salary/${teacherId}/month/${monthId}/pay`, method: 'POST', data: payload,
      }),
      invalidatesTags: ['TeacherSalary'],
    }),

    getMonthsForGenerateFee: builder.query<MonthOption[], number>({
      query: (classId) => ({ url: '/financial/student-fee-form/getmonth', method: 'GET', params: { class_id: classId } }),
    }),

    getOutstandingStudentwise: builder.query<StudentFeeOutstanding[], { classId: number; month: string }>({
      query: ({ classId, month }) => ({ url: '/financial/student-fee-generate', method: 'GET', params: { class_id: classId, month } }),
      providesTags: ['StudentFee'],
    }),

    saveGeneratedStudentFees: builder.mutation<unknown, StudentFeeOutstanding[]>({
      query: (payload) => ({ url: '/financial/student-fee-save', method: 'POST', data: payload }),
      invalidatesTags: ['StudentFee'],
    }),

    getStudentFees: builder.query<ClassFeeSummary, number>({
      query: (classId) => ({ url: `/financial/class/${classId}`, method: 'GET' }),
      providesTags: ['StudentFee'],
    }),

    getFeeCollectionDetail: builder.query<FeeCollectionDetail, { classId: number; studentId: number }>({
      query: ({ classId, studentId }) => ({ url: `/financial/student-fee-collect/class/${classId}/student/${studentId}`, method: 'GET' }),
      providesTags: ['StudentFee'],
    }),

    payStudentFee: builder.mutation<unknown, { classId: number; studentId: number; monthId: number; payload: { receiving_amount: string; discount_amount?: string; discount_reason?: string; payable_amount: string } }>({
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
  useGetTeachersOutstandingsQuery,
  useLazyGetTeachersOutstandingsQuery,
  useGenerateTeacherSalaryMutation,
  useGetTeacherSalaryDetailQuery,
  usePayTeacherSalaryMutation,
  useGetMonthsForGenerateFeeQuery,
  useLazyGetMonthsForGenerateFeeQuery,
  useGetOutstandingStudentwiseQuery,
  useLazyGetOutstandingStudentwiseQuery,
  useSaveGeneratedStudentFeesMutation,
  useGetStudentFeesQuery,
  useGetFeeCollectionDetailQuery,
  usePayStudentFeeMutation,
} = financialApi
