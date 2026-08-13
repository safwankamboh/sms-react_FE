import { api } from '../api'
import type { AssignCourse, Course, PaginationMeta } from '../../types'
import { toPaginationMeta } from '../../utils/helpers'

export const coursesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query<{ data: Course[]; meta: PaginationMeta }, number>({
      query: (page) => ({ url: '/course/courses', method: 'GET', params: { page } }),
      transformResponse: (data: Course[], meta) => ({ data, meta: toPaginationMeta(meta?.Meta) }),
      providesTags: ['Course'],
    }),

    getTrashCourses: builder.query<Course[], void>({
      query: () => ({ url: '/course/trash-data', method: 'GET' }),
      providesTags: ['CourseTrash'],
    }),

    saveCourse: builder.mutation<Course, { course_name: string; course_code?: string }>({
      query: (payload) => ({ url: '/course/save', method: 'POST', data: payload }),
      invalidatesTags: ['Course'],
    }),

    updateCourse: builder.mutation<Course, { courseId: number; payload: Record<string, unknown> }>({
      query: ({ courseId, payload }) => ({ url: `/course/update/${courseId}`, method: 'POST', data: payload }),
      invalidatesTags: ['Course'],
    }),

    softDeleteCourse: builder.mutation<void, number>({
      query: (courseId) => ({ url: `/course/soft-delete/${courseId}`, method: 'GET' }),
      invalidatesTags: ['Course', 'CourseTrash'],
    }),

    restoreCourse: builder.mutation<void, number>({
      query: (courseId) => ({ url: `/course/restore/${courseId}`, method: 'GET' }),
      invalidatesTags: ['Course', 'CourseTrash'],
    }),

    getAssignedCourses: builder.query<AssignCourse[], void>({
      query: () => ({ url: '/manage-courses', method: 'GET' }),
      providesTags: ['AssignedCourse'],
    }),

    assignCourse: builder.mutation<unknown, Record<string, unknown>>({
      query: (payload) => ({ url: '/manage-courses/save', method: 'POST', data: payload }),
      invalidatesTags: ['AssignedCourse'],
    }),
  }),
})

export const {
  useGetCoursesQuery,
  useGetTrashCoursesQuery,
  useSaveCourseMutation,
  useUpdateCourseMutation,
  useSoftDeleteCourseMutation,
  useRestoreCourseMutation,
  useGetAssignedCoursesQuery,
  useAssignCourseMutation,
} = coursesApi
