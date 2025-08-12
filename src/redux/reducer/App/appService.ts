import { apiService } from "../../apiService"

export class AppEndPoint {}

export const appService = apiService.injectEndpoints({
    endpoints: (build) => ({}),
    overrideExisting: false,
})

export const {} = appService
