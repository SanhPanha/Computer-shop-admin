import { configureStore } from '@reduxjs/toolkit'
import tokenSlice from './feature/auth/authSlice'
import userSlice from './feature/userProfile/userSlice'


// create store
export const makeStore = () => {
  return configureStore({
    reducer: {
        auth:tokenSlice,
        userProfile:userSlice
    },
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>

export type AppDispatch = AppStore['dispatch']