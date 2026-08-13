import { api } from '../api'
import type { ClassSection, NewClass } from '../../types'

export const classesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getClasses: builder.query<NewClass[], void>({
      query: () => ({ url: '/adminstrator/classes', method: 'GET' }),
      providesTags: ['Class'],
    }),

    getGlobalClasses: builder.query<NewClass[], void>({
      query: () => ({ url: '/global/get-classes', method: 'GET' }),
      providesTags: ['Class'],
    }),

    getSections: builder.query<ClassSection[], number>({
      query: (classId) => ({ url: `/global/class-sections/${classId}`, method: 'GET' }),
      providesTags: ['Section'],
    }),

    saveClass: builder.mutation<NewClass, { class_name: string }>({
      query: (payload) => ({ url: '/adminstrator/classes/save', method: 'POST', data: payload }),
      invalidatesTags: ['Class'],
    }),
  }),
})

export const {
  useGetClassesQuery,
  useGetGlobalClassesQuery,
  useGetSectionsQuery,
  useLazyGetSectionsQuery,
  useSaveClassMutation,
} = classesApi
