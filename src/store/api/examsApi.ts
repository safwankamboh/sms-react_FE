import { api } from '../api'
import type { AssignCourse, ClassSection, ExamSchedule, ExamScheduleFormData, ExamType, Teacher } from '../../types'

interface ExamScheduleFormOptions {
  Courses: AssignCourse[]
  Teachers: Teacher[]
  ExamType: ExamType | null
  MinDate: string | null
  MaxDate: string | null
  ClassSections: ClassSection[]
}

export const examsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getExamTypes: builder.query<ExamType[], void>({
      query: () => ({ url: '/exams', method: 'GET' }),
      providesTags: ['ExamType'],
    }),

    saveExamType: builder.mutation<ExamType, { exam_type: string }>({
      query: (payload) => ({ url: '/exams/exam-typeForm/submit', method: 'POST', data: payload }),
      invalidatesTags: ['ExamType'],
    }),

    updateExamType: builder.mutation<ExamType, { examTypeId: number; payload: { exam_type: string } }>({
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

    getExamScheduleForm: builder.query<ExamScheduleFormOptions, number>({
      query: (classId) => ({ url: `/exams/exam-schedule-class/${classId}/form`, method: 'GET' }),
    }),

    saveExamSchedule: builder.mutation<unknown, ExamScheduleFormData>({
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
  useGetExamScheduleFormQuery,
  useSaveExamScheduleMutation,
} = examsApi
