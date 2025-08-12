import { envApp } from "@/src/core/utils/utils"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const apiService = createApi({
  reducerPath: "apiService",
  baseQuery: fetchBaseQuery({
    baseUrl: envApp.BASEURL,
    credentials: "include", 
    prepareHeaders(headers) {
      headers.set("Content-Type", "application/json")
      headers.set("Accept", "application/json")
      return headers
    },
  }),
  endpoints: () => ({}),
})
