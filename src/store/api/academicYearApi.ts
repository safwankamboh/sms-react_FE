import { api } from '../api'
import type { AcademicYear, TuitionFee } from '../../types'

interface TuitionFeeResult {
  TuitionFeeses: TuitionFee[]
  ClassId: number
}

export const academicYearApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAcademicYears: builder.query<AcademicYear[], void>({
      query: () => ({ url: '/adminstrator/academic-years', method: 'GET' }),
      providesTags: ['AcademicYear'],
    }),

    saveAcademicYear: builder.mutation<AcademicYear, { year: string }>({
      query: (payload) => ({ url: '/adminstrator/academic-years/save', method: 'POST', data: payload }),
      invalidatesTags: ['AcademicYear'],
    }),

    setDefaultAcademicYear: builder.mutation<void, number>({
      query: (id) => ({ url: `/adminstrator/academic-years/academic-year-set-default/${id}`, method: 'GET' }),
      invalidatesTags: ['AcademicYear'],
    }),

    getTuitionFee: builder.query<TuitionFee[], number>({
      query: (classId) => ({ url: `/adminstrator/tuition-fee/edit/${classId}`, method: 'GET' }),
      transformResponse: (data: TuitionFeeResult) => data.TuitionFeeses,
      providesTags: ['TuitionFee'],
    }),
  }),
})

export const {
  useGetAcademicYearsQuery,
  useSaveAcademicYearMutation,
  useSetDefaultAcademicYearMutation,
  useGetTuitionFeeQuery,
} = academicYearApi
