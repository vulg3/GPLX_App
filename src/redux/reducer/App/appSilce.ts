import { Mode } from "@/src/core/const/mode"
import { createSlice } from "@reduxjs/toolkit"

interface AppState {
    isLoading: boolean
    mode: Mode
}

const initialState: AppState = {
    isLoading: false,
    mode: Mode.dark,
}

const appSlice = createSlice({
    initialState: initialState,
    name: "app",
    reducers: {
        updateState: (state, action) => {
            return { ...state, ...action.payload }
        },
    },
})

export const appActions = appSlice.actions
export default appSlice.reducer
