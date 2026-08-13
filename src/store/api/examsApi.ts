import { api } from '../api'
import type { ExamSchedule, ExamType } from '../../types'

export const examsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getExamTypes: builder.query<ExamType[], void>({
      query: () => ({ url: '/exams', method: 'GET' }),
      providesTags: ['ExamType'],
    }),

    saveExamType: builder.mutation<ExamType, { exam_name: string }>({
      query: (payload) => ({ url: '/exams/exam-typeForm/submit', method: 'POST', data: payload }),
      invalidatesTags: ['ExamType'],
    }),

    updateExamType: builder.mutation<ExamType, { examTypeId: number; payload: { exam_name: string } }>({
      query: ({ examTypeId, payload }) => ({ url: `/exams/update-exam-typeForm/submit/${examTypeId}`, method: 'POST', data: payload }),
      invalidatesTags: ['ExamType'],
    }),

    deleteExamType: builder.mutation<void, number>({
      query: (examTypeId) => ({ url: `/exams/delete-exam-typeForm/${examTypeId}`, method: 'GET' }),
      invalidatesTags: ['ExamType'],
    }),

    getExamSchedule: builder.query<ExamSchedule[], number>({
      query: (classId) => ({ url: `/exams/exam-schedule-class/${classId}`, method: 'GET' }),
      providesTags: ['ExamSchedule'],
    }),

    saveExamSchedule: builder.mutation<unknown, Record<string, unknown>>({
      query: (payload) => ({ url: '/exams/exam-schedule-class', method: 'POST', data: payload }),
      invalidatesTags: ['ExamSchedule'],
    }),
  }),
})

export const {
  useGetExamTypesQuery,
  useSaveExamTypeMutation,
  useUpdateExamTypeMutation,
  useDeleteExamTypeMutation,
  useGetExamScheduleQuery,
  useSaveExamScheduleMutation,
} = examsApi
