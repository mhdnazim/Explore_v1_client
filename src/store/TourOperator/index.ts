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
    operatorData : []
    loading : boolean,
    error : string | null | any
}

const initialState: ReviewState = {
    data: [],
    params: {},
    operatorData : [],
    loading: false,
    error: ""
}

interface Id {
    user : string | null
}


// list review 

export const listOperatorAction = createAsyncThunk(
    'tourOperator/listOperatorAction',
    async (data: any) => {
        const storedToken = localStorage.getItem('access_token')

        const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/touroperator/list`, data, {
        headers: {Authorization: `Bearer ${storedToken}` } })

        return response.data
    }
)



export const operatorSlice = createSlice({
    name: 'tour',
    initialState,
    reducers: {
      // standard reducer logic, with auto-generated action types per reducer
    },
    extraReducers: (builder) => {
      // Add reducers for additional action types here, and handle loading state as needed
      builder
    .addCase(listOperatorAction.fulfilled, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = ""
        state.data = action.payload.data
    })
    .addCase(listOperatorAction.pending, (state) => {
        state.loading = true
    })
    .addCase(listOperatorAction.rejected, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = action.payload
        // state.data = []
    })
    },
  })
  
  
  export default operatorSlice.reducer;