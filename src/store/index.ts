'use client'
import { configureStore } from '@reduxjs/toolkit'
import { tourSlice } from './Tour_And_Activity'
import { bookingSlice } from './booking'
import { reviewSlice } from './review'
import { operatorSlice } from './TourOperator'
import { chatSlice } from './chat'

export const store = configureStore({
  reducer: {
    tour : tourSlice.reducer,
    booking: bookingSlice.reducer,
    review: reviewSlice.reducer,
    tourOperator: operatorSlice.reducer,
    chat: chatSlice.reducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch