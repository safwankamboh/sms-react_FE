import { api } from '../api'
import type { AcademicYear, PaginationMeta, TuitionFee } from '../../types'
import { toPaginationMeta } from '../../utils/helpers'

interface TuitionFeeResult {
  TuitionFeeses: TuitionFee[]
  ClassId: number
}

export const academicYearApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAcademicYears: builder.query<{ data: AcademicYear[]; meta: PaginationMeta }, number>({
      query: (page) => ({ url: '/adminstrator/academic-years', method: 'GET', params: { page } }),
      transformResponse: (data: AcademicYear[], meta) => ({ data, meta: toPaginationMeta(meta?.Meta) }),
      providesTags: ['AcademicYear'],
    }),

    getAllAcademicYears: builder.query<AcademicYear[], void>({
      query: () => ({ url: '/adminstrator/academic-years/all', method: 'GET' }),
      providesTags: ['AcademicYear'],
    }),

    saveAcademicYear: builder.mutation<AcademicYear, { academic_year_name: string; academic_year_start: string; academic_year_end: string }>({
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

    generateTuitionFee: builder.mutation<void, { class_fees: { class_id: number; class_fee_amount: string; admission_fee_amount: string }[] }>({
      query: (payload) => ({ url: '/adminstrator/tuition-fee/generate', method: 'PUT', data: payload }),
      invalidatesTags: ['TuitionFee'],
    }),

    updateTuitionFee: builder.mutation<void, { classId: number; tuition_fees: { id: number; amount: string; admission_fee: string }[] }>({
      query: ({ classId, ...body }) => ({ url: `/adminstrator/tuition-fee/update/${classId}`, method: 'POST', data: body }),
      invalidatesTags: ['TuitionFee'],
    }),
  }),
})

export const {
  useGetAcademicYearsQuery,
  useGetAllAcademicYearsQuery,
  useSaveAcademicYearMutation,
  useSetDefaultAcademicYearMutation,
  useGetTuitionFeeQuery,
  useGenerateTuitionFeeMutation,
  useUpdateTuitionFeeMutation,
} = academicYearApi
