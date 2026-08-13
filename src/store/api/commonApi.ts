import { api } from '../api'

interface TimeSlotsResult {
  TimeSlots: Record<string, string>
}

export const commonApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Returns a map of "HH:mm:ss" -> "h:mm A" label, one entry per interval
    // between `from` and `to` (server-side defaults when omitted). Used to
    // drive the Break Schedule page's From/To selects.
    getTimeSlots: builder.query<Record<string, string>, { from?: string; to?: string } | void>({
      query: (payload) => ({ url: '/get-time-slots', method: 'POST', data: payload ?? {} }),
      transformResponse: (data: TimeSlotsResult) => data.TimeSlots,
    }),
  }),
})

export const { useGetTimeSlotsQuery } = commonApi
