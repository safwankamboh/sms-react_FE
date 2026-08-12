import { api } from '../api'
import type { PaginatedResponse, Teacher } from '../../types'

export const teachersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTeachers: builder.query<PaginatedResponse<Teacher>, number>({
      query: (page) => ({ url: '/teacher/teachers', method: 'GET', params: { page } }),
      providesTags: ['Teacher'],
    }),

    getTrashTeachers: builder.query<Teacher[], void>({
      query: () => ({ url: '/teacher/trash-data', method: 'GET' }),
      transformResponse: (response: Teacher[] | { data: Teacher[] }) =>
        Array.isArray(response) ? response : (response.data ?? []),
      providesTags: ['TeacherTrash'],
    }),

    getTeacherEdit: builder.query<Teacher, number>({
      query: (teacherId) => ({ url: `/teacher/edit/${teacherId}`, method: 'GET' }),
      transformResponse: (response: Teacher | { data: Teacher }) => ('data' in response ? response.data : response),
      providesTags: ['Teacher'],
    }),

    getTeacherProfile: builder.query<Teacher, number>({
      query: (teacherId) => ({ url: `/teacher/profile/${teacherId}`, method: 'GET' }),
      transformResponse: (response: Teacher | { data: Teacher }) => ('data' in response ? response.data : response),
      providesTags: ['Teacher'],
    }),

    saveTeacher: builder.mutation<unknown, Record<string, unknown>>({
      query: (payload) => ({ url: '/teacher/save', method: 'POST', data: payload }),
      invalidatesTags: ['Teacher'],
    }),

    updateTeacher: builder.mutation<unknown, { teacherId: number; payload: Record<string, unknown> }>({
      query: ({ teacherId, payload }) => ({ url: `/teacher/update/${teacherId}`, method: 'POST', data: payload }),
      invalidatesTags: ['Teacher'],
    }),

    softDeleteTeacher: builder.mutation<void, number>({
      query: (teacherId) => ({ url: `/teacher/soft-delete/${teacherId}`, method: 'GET' }),
      invalidatesTags: ['Teacher', 'TeacherTrash'],
    }),

    restoreTeacher: builder.mutation<void, number>({
      query: (teacherId) => ({ url: `/teacher/restore/${teacherId}`, method: 'GET' }),
      invalidatesTags: ['Teacher', 'TeacherTrash'],
    }),
  }),
})

export const {
  useGetTeachersQuery,
  useGetTrashTeachersQuery,
  useGetTeacherEditQuery,
  useGetTeacherProfileQuery,
  useSaveTeacherMutation,
  useUpdateTeacherMutation,
  useSoftDeleteTeacherMutation,
  useRestoreTeacherMutation,
} = teachersApi
