import { api } from '../api'
import type { AttendanceReport, NewClass, PaginationMeta, Student, StudentHistory, StudentStatus } from '../../types'
import { toPaginationMeta } from '../../utils/helpers'

interface StudentEditResult {
  Student: Student
  Classes: NewClass[]
}

interface StudentProfileResult {
  Class: NewClass
  Student: Student
}

interface SaveStudentResult {
  Student: Student
  Enrollment: unknown
  StudentTuitionFee: unknown
}

export const studentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query<{ data: Student[]; meta: PaginationMeta }, { page: number; search?: string; status?: string }>({
      query: ({ page, search, status }) => ({ url: '/student/students', method: 'GET', params: { page, search, status } }),
      transformResponse: (data: Student[], meta) => ({ data, meta: toPaginationMeta(meta?.Meta) }),
      providesTags: ['Student'],
    }),

    getTrashStudents: builder.query<Student[], void>({
      query: () => ({ url: '/student/trash-students-data', method: 'GET' }),
      providesTags: ['StudentTrash'],
    }),

    getStudentEdit: builder.query<Student, { classId: number; studentId: number }>({
      query: ({ classId, studentId }) => ({ url: `/student/edit/${classId}/${studentId}`, method: 'GET' }),
      transformResponse: (data: StudentEditResult) => data.Student,
      providesTags: ['Student'],
    }),

    getStudentProfile: builder.query<Student, { classId: number; studentId: number }>({
      query: ({ classId, studentId }) => ({ url: `/student/profile/${classId}/student/${studentId}`, method: 'GET' }),
      transformResponse: (data: StudentProfileResult) => data.Student,
      providesTags: ['Student'],
    }),

    getStudentsByClass: builder.query<Student[], number>({
      query: (classId) => ({ url: '/student/students', method: 'GET', params: { class_id: classId } }),
      providesTags: ['Student'],
    }),

    saveStudent: builder.mutation<Student, FormData>({
      query: (payload) => ({ url: '/student/save', method: 'POST', data: payload }),
      transformResponse: (data: SaveStudentResult) => data.Student,
      invalidatesTags: ['Student'],
    }),

    updateStudent: builder.mutation<Student, { classId: number; studentId: number; payload: FormData }>({
      query: ({ classId, studentId, payload }) => ({
        url: `/student/update/${classId}/${studentId}`, method: 'POST', data: payload,
      }),
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

    // Phase 4b — lifecycle status change, distinct from the active/inactive
    // toggle above: covers every transition (transferred/withdrawn/
    // graduated too), with a required reason, gated behind its own
    // students.change_status permission.
    changeStudentStatus: builder.mutation<Student, { studentId: number; status: StudentStatus; reason?: string }>({
      query: ({ studentId, ...body }) => ({ url: `/student/${studentId}/status`, method: 'POST', data: body }),
      invalidatesTags: ['Student', 'StudentTrash'],
    }),

    correctGrNumber: builder.mutation<Student, { studentId: number; gr_number: string; reason: string }>({
      query: ({ studentId, ...body }) => ({ url: `/student/${studentId}/gr-number`, method: 'PATCH', data: body }),
      invalidatesTags: ['Student'],
    }),

    getStudentHistory: builder.query<StudentHistory, number>({
      query: (studentId) => ({ url: `/student/${studentId}/history`, method: 'GET' }),
      providesTags: ['Student'],
    }),

    submitAttendance: builder.mutation<void, { classId: string; sectionId: string; date: string; attendance: { student_id: number; status: string }[] }>({
      query: ({ classId, ...body }) => ({
        url: `/student/attendance-monitring/attendance-sheet/class/${classId}/attendance-submit`,
        method: 'POST',
        data: body,
      }),
    }),

    getAttendanceReport: builder.query<AttendanceReport, { classId: string; date?: string; studentId?: string }>({
      query: ({ classId, date, studentId }) => ({
        url: `/student/attendance-monitring/attendance-view/class/${classId}`,
        method: 'GET',
        params: { date, student_id: studentId },
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
  useChangeStudentStatusMutation,
  useCorrectGrNumberMutation,
  useGetStudentHistoryQuery,
  useSubmitAttendanceMutation,
  useGetAttendanceReportQuery,
} = studentsApi
