import { api } from '../api'
import type { AssignCourse, ClassSection, NewClass } from '../../types'

interface ClassTimetable {
  Days: string[]
  AssignCourses: AssignCourse[]
  ClassId: number
}

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

    createSection: builder.mutation<ClassSection, { classId: number; new_section: string }>({
      query: ({ classId, ...payload }) => ({ url: `/adminstrator/sections/${classId}/save`, method: 'POST', data: payload }),
      invalidatesTags: ['Section'],
    }),

    saveClass: builder.mutation<NewClass, { new_class: string }>({
      query: (payload) => ({ url: '/adminstrator/classes/save', method: 'POST', data: payload }),
      invalidatesTags: ['Class'],
    }),

    addClassBreak: builder.mutation<void, { from_time: string; to_time: string }>({
      query: (payload) => ({ url: '/adminstrator/class-break', method: 'POST', data: payload }),
    }),

    getClassTimetable: builder.query<ClassTimetable, { classId: number; sectionId: number }>({
      query: ({ classId, sectionId }) => ({ url: `/adminstrator/classes/${classId}/sections/${sectionId}/timetable`, method: 'GET' }),
    }),
  }),
})

export const {
  useGetClassesQuery,
  useGetGlobalClassesQuery,
  useGetSectionsQuery,
  useLazyGetSectionsQuery,
  useCreateSectionMutation,
  useSaveClassMutation,
  useAddClassBreakMutation,
  useGetClassTimetableQuery,
} = classesApi
