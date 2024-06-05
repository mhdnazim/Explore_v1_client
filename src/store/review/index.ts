import { Dispatch, PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import toast from "react-hot-toast"

interface Redux {
    getState : any,
    dispatch : Dispatch<any>
}

export interface ReviewState {
    data : []  ,
    params: {},
    reviewData : []
    viewReview: {}
    loading : boolean,
    error : string | null | any
    redirect: boolean
}

const initialState: ReviewState = {
    data: [],
    params: {},
    viewReview: {},
    reviewData : [],
    loading: false,
    error: "", 
    redirect: false
}

interface DataParams {
    tour_and_activity: string
}

interface viewParams {
    reviewer: string
    tour_and_activity: string
}

interface Id {
    user : string | null
}


// add review 
export const AddReviewAction = createAsyncThunk(
    'review/AddReviewAction',
    async (data: any , { getState, dispatch}: Redux) => {
    const storedToken = localStorage.getItem('access_token')
        const headers = {
            headers: {
                Authorization: `Bearer ${storedToken}`
            }
        }

    const response =await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/review/add`,data, headers)
    
    return response.data
  },
)

// edit review 

export const editReviewAction = createAsyncThunk(
    'review/editReviewAction',
    async (data : any, { getState, dispatch}: Redux) => {
        const storedToken = localStorage.getItem('access_token')
        const response = await axios.patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/review/edit`, data, {
          headers: {Authorization: `Bearer ${storedToken}` } })

          return response.data
    }
)

// list review 

export const listReviewAction = createAsyncThunk(
    'review/listReviewAction',
    async ( params: DataParams ) => {
        const storedToken = localStorage.getItem('access_token')

        const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/review/list`, params, {
        headers: {Authorization: `Bearer ${storedToken}` } })

        return response.data
    }
)

// view review 

export const viewReviewAction = createAsyncThunk(
    'review/viewReviewAction',
    async ( params: viewParams ) => {
        const storedToken = localStorage.getItem('access_token')

        const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/review/view`, params, {
        headers: {Authorization: `Bearer ${storedToken}` } })

        return response.data
    }
)



export const reviewSlice = createSlice({
    name: 'review',
    initialState,
    reducers: {
      // standard reducer logic, with auto-generated action types per reducer
    },
    extraReducers: (builder) => {
      // Add reducers for additional action types here, and handle loading state as needed
      builder
    .addCase(AddReviewAction.fulfilled, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = ""
        toast.success('Review added...')
    })
    .addCase(AddReviewAction.pending, (state) => {
        state.loading = true
    })
    .addCase(AddReviewAction.rejected, (state, payload:PayloadAction<any>) => {
        state.loading = false
        state.error = payload
        toast.error('Already Reviewed')
    })
    .addCase(listReviewAction.fulfilled, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = ""
        state.reviewData = action.payload.data
        state.redirect = false
    })
    .addCase(listReviewAction.pending, (state) => {
        state.loading = true
        state.redirect = true
    })
    .addCase(listReviewAction.rejected, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = action.payload
        state.redirect = false
        // state.data = []
    })
    .addCase(viewReviewAction.fulfilled, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = ""
        state.viewReview = action.payload.data
    })
    .addCase(viewReviewAction.pending, (state) => {
        state.loading = true
    })
    .addCase(viewReviewAction.rejected, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = action.payload
        // state.data = []
    })
    .addCase(editReviewAction.fulfilled, (state) => {
        state.loading = false
        state.error = ""
        toast.success('Review edited...')
    })
    .addCase(editReviewAction.pending, (state) => {
        state.loading = true
    })
    .addCase(editReviewAction.rejected, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = action.payload
    })
    },
  })
  
  
  export default reviewSlice.reducer;