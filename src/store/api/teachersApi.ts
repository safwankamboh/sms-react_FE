import { api } from '../api'
import type { PaginationMeta, Teacher } from '../../types'
import { toPaginationMeta } from '../../utils/helpers'

export const teachersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTeachers: builder.query<{ data: Teacher[]; meta: PaginationMeta }, number>({
      query: (page) => ({ url: '/teacher/teachers', method: 'GET', params: { page } }),
      transformResponse: (data: Teacher[], meta) => ({ data, meta: toPaginationMeta(meta?.Meta) }),
      providesTags: ['Teacher'],
    }),

    getTrashTeachers: builder.query<Teacher[], void>({
      query: () => ({ url: '/teacher/trash-data', method: 'GET' }),
      providesTags: ['TeacherTrash'],
    }),

    getTeacherEdit: builder.query<Teacher, number>({
      query: (teacherId) => ({ url: `/teacher/edit/${teacherId}`, method: 'GET' }),
      providesTags: ['Teacher'],
    }),

    getTeacherProfile: builder.query<Teacher, number>({
      query: (teacherId) => ({ url: `/teacher/profile/${teacherId}`, method: 'GET' }),
      providesTags: ['Teacher'],
    }),

    saveTeacher: builder.mutation<Teacher, Record<string, unknown>>({
      query: (payload) => ({ url: '/teacher/save', method: 'POST', data: payload }),
      invalidatesTags: ['Teacher'],
    }),

    updateTeacher: builder.mutation<Teacher, { teacherId: number; payload: Record<string, unknown> }>({
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
