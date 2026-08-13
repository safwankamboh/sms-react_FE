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

    saveClass: builder.mutation<NewClass, { new_class: string }>({
      query: (payload) => ({ url: '/adminstrator/classes/save', method: 'POST', data: payload }),
      invalidatesTags: ['Class'],
    }),

    addClassBreak: builder.mutation<void, { from_time: string; to_time: string }>({
      query: (payload) => ({ url: '/adminstrator/class-break', method: 'POST', data: payload }),
    }),
  }),
})

export const {
  useGetClassesQuery,
  useGetGlobalClassesQuery,
  useGetSectionsQuery,
  useLazyGetSectionsQuery,
  useSaveClassMutation,
  useAddClassBreakMutation,
} = classesApi
