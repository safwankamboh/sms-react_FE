import { api } from '../api'
import type { PaginatedResponse, Student } from '../../types'

interface SaveStudentResponse {
  success: boolean
  message: string
  data: { student: Student }
}

interface StudentEditResponse {
  student: Student
  classes: unknown[]
}

interface StudentProfileResponse {
  class: unknown
  student: Student
}

export const studentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query<PaginatedResponse<Student>, number>({
      query: (page) => ({ url: '/student/students', method: 'GET', params: { page } }),
      providesTags: ['Student'],
    }),

    getTrashStudents: builder.query<Student[], void>({
      query: () => ({ url: '/student/trash-students-data', method: 'GET' }),
      transformResponse: (response: { students?: PaginatedResponse<Student> }) => response.students?.data ?? [],
      providesTags: ['StudentTrash'],
    }),

    getStudentEdit: builder.query<Student, { classId: number; studentId: number }>({
      query: ({ classId, studentId }) => ({ url: `/student/edit/${classId}/${studentId}`, method: 'GET' }),
      transformResponse: (response: StudentEditResponse) => response.student,
      providesTags: ['Student'],
    }),

    getStudentProfile: builder.query<Student, { classId: number; studentId: number }>({
      query: ({ classId, studentId }) => ({ url: `/student/profile/${classId}/student/${studentId}`, method: 'GET' }),
      transformResponse: (response: StudentProfileResponse) => response.student,
      providesTags: ['Student'],
    }),

    getStudentsByClass: builder.query<Student[], number>({
      query: (classId) => ({ url: '/student/students', method: 'GET', params: { class_id: classId } }),
      transformResponse: (response: PaginatedResponse<Student> | Student[]) =>
        Array.isArray(response) ? response : response.data,
      providesTags: ['Student'],
    }),

    saveStudent: builder.mutation<SaveStudentResponse['data'], FormData>({
      query: (payload) => ({ url: '/student/save', method: 'POST', data: payload }),
      transformResponse: (response: SaveStudentResponse) => response.data,
      invalidatesTags: ['Student'],
    }),

    updateStudent: builder.mutation<Student, { classId: number; studentId: number; payload: FormData }>({
      query: ({ classId, studentId, payload }) => ({
        url: `/student/update/${classId}/${studentId}`, method: 'POST', data: payload,
      }),
      transformResponse: (response: { data: { student: Student } }) => response.data.student,
      invalidatesTags: ['Student'],
    }),

    softDeleteStudent: builder.mutation<void, { classId: number; studentId: number }>({
      query: ({ classId, studentId }) => ({ url: `/student/soft-delete/${classId}/${studentId}`, method: 'GET' }),
      invalidatesTags: ['Student', 'StudentTrash'],
    }),

    restoreStudent: builder.mutation<void, { classId: number; studentId: number }>({
      query: ({ classId, studentId }) => ({ url: `/student/restore-student/${classId}/${studentId}`, method: 'GET' }),
      invalidatesTags: ['Student', 'StudentTrash'],
    }),

    submitAttendance: builder.mutation<void, { classId: string; sectionId: string; date: string; attendance: { student_id: number; status: string }[] }>({
      query: ({ classId, ...body }) => ({
        url: `/student/attendance-monitring/attendance-sheet/class/${classId}/attendance-submit`,
        method: 'POST',
        data: body,
      }),
    }),
  }),
})

export const {
  useGetStudentsQuery,
  useGetTrashStudentsQuery,
  useGetStudentEditQuery,
  useGetStudentProfileQuery,
  useGetStudentsByClassQuery,
  useLazyGetStudentsByClassQuery,
  useSaveStudentMutation,
  useUpdateStudentMutation,
  useSoftDeleteStudentMutation,
  useRestoreStudentMutation,
  useSubmitAttendanceMutation,
} = studentsApi
