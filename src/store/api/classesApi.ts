import { api } from '../api'
import type { ClassSection, NewClass } from '../../types'

const asList = <T>(response: T[] | { data: T[] }): T[] => (Array.isArray(response) ? response : response.data)

export const classesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getClasses: builder.query<NewClass[], void>({
      query: () => ({ url: '/adminstrator/classes', method: 'GET' }),
      transformResponse: asList<NewClass>,
      providesTags: ['Class'],
    }),

    getGlobalClasses: builder.query<NewClass[], void>({
      query: () => ({ url: '/global/get-classes', method: 'GET' }),
      transformResponse: asList<NewClass>,
      providesTags: ['Class'],
    }),

    getSections: builder.query<ClassSection[], number>({
      query: (classId) => ({ url: `/global/class-sections/${classId}`, method: 'GET' }),
      transformResponse: asList<ClassSection>,
      providesTags: ['Section'],
    }),

    saveClass: builder.mutation<NewClass, { class_name: string }>({
      query: (payload) => ({ url: '/adminstrator/classes/save', method: 'POST', data: payload }),
      transformResponse: (response: { data: NewClass }) => response.data,
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
