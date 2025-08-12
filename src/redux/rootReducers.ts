import { combineReducers } from "redux"
import appReducer from "./reducer/App/appSilce"

export const rootReducer = combineReducers({
    app: appReducer,
})
