import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { tasksAPI } from './services/tasksAPI'

export const store = configureStore({
    reducer: {
        [tasksAPI.reducerPath]: tasksAPI.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(tasksAPI.middleware),
})

setupListeners(store.dispatch)

export default store
