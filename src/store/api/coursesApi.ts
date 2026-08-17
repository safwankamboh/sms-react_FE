import { api } from '../api'
import type { AssignCourse, AssignCourseFormData, ClassSection, Course, NewClass, PaginationMeta, Teacher } from '../../types'
import { toPaginationMeta } from '../../utils/helpers'

interface CourseScheduleResult {
  AssignCourses: AssignCourse[]
  Class: NewClass
  Section: ClassSection
}

interface AssignCourseFormOptions {
  Class: NewClass
  Courses: Course[]
  Teachers: Teacher[]
  Section: ClassSection
}

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

    getCourseSchedule: builder.query<CourseScheduleResult, { classId: number; sectionId: number }>({
      query: ({ classId, sectionId }) => ({ url: `/manage-courses/course-schedule/class/${classId}/section/${sectionId}`, method: 'GET' }),
      providesTags: ['AssignedCourse'],
    }),

    getAssignCourseForm: builder.query<AssignCourseFormOptions, { classId: number; sectionId: number }>({
      query: ({ classId, sectionId }) => ({ url: `/manage-courses/create/${classId}/${sectionId}`, method: 'GET' }),
    }),

    assignCourse: builder.mutation<AssignCourse, { classId: number; payload: AssignCourseFormData }>({
      query: ({ classId, payload }) => ({ url: `/manage-courses/${classId}/assign`, method: 'POST', data: payload }),
      invalidatesTags: ['AssignedCourse'],
    }),

    updateAssignCourse: builder.mutation<AssignCourse, { classId: number; sectionId: number; assignCourseId: number; payload: AssignCourseFormData }>({
      query: ({ classId, sectionId, assignCourseId, payload }) => ({
        url: `/manage-courses/${classId}/section/${sectionId}/update/${assignCourseId}`, method: 'POST', data: payload,
      }),
      invalidatesTags: ['AssignedCourse'],
    }),

    deleteAssignCourse: builder.mutation<void, number>({
      query: (assignCourseId) => ({ url: `/manage-courses/${assignCourseId}/delete`, method: 'GET' }),
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
  useGetCourseScheduleQuery,
  useGetAssignCourseFormQuery,
  useAssignCourseMutation,
  useUpdateAssignCourseMutation,
  useDeleteAssignCourseMutation,
} = coursesApi
