import { api } from '../api'
import type { RolloverCandidate, RolloverDecisionInput, RolloverResult } from '../../types'

export const rolloverApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRolloverCandidates: builder.query<
      RolloverCandidate[],
      { fromAcademicYearId: number; classId: number; classSectionId?: number }
    >({
      query: ({ fromAcademicYearId, classId, classSectionId }) => ({
        url: '/adminstrator/academic-years/rollover/candidates',
        method: 'GET',
        params: {
          from_academic_year_id: fromAcademicYearId,
          class_id: classId,
          class_section_id: classSectionId,
        },
      }),
      providesTags: ['AcademicYearRollover'],
    }),

    submitRollover: builder.mutation<
      RolloverResult,
      { fromAcademicYearId: number; toAcademicYearId: number; decisions: RolloverDecisionInput[] }
    >({
      query: ({ fromAcademicYearId, toAcademicYearId, decisions }) => ({
        url: '/adminstrator/academic-years/rollover',
        method: 'POST',
        data: {
          from_academic_year_id: fromAcademicYearId,
          to_academic_year_id: toAcademicYearId,
          decisions,
        },
      }),
      invalidatesTags: ['Student', 'AcademicYearRollover'],
    }),
  }),
})

export const {
  useLazyGetRolloverCandidatesQuery,
  useSubmitRolloverMutation,
} = rolloverApi
