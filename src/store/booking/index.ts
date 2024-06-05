import { Dispatch, PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import toast from "react-hot-toast"

interface Redux {
    getState : any,
    dispatch : Dispatch<any>
}

export interface BookingState {
    data : []  ,
    params: {},
    tourData : {}
    loading : boolean,
    error : string | null
    redirect: boolean
    sessionId: string
}

const initialState: BookingState = {
    data: [],
    params: {},
    tourData : {},
    loading: false,
    error: "",
    redirect: false,
    sessionId: ""
}

interface Id {
    user : string | null
}


// add booking 
export const AddBookingAction = createAsyncThunk(
    'booking/AddBookingAction',
    async (data: any , { getState, dispatch}: Redux) => {
    const storedToken = localStorage.getItem('access_token')
        const headers = {
            headers: {
                Authorization: `Bearer ${storedToken}`
            }
        }

    const response =await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/booking/add`,data, headers)
    
    return response.data
  },
)

// list Booking 

export const listBookingAction = createAsyncThunk(
    'booking/listBookingAction',
    async ( user: Id ) => {
        const storedToken = localStorage.getItem('access_token')

        const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/booking/list`, user, {
        headers: {Authorization: `Bearer ${storedToken}` } })

        return response.data
    }
)

// cancel booking 

export const EditBookingAction = createAsyncThunk(
    'booking/EditBookingAction',
    async (data: any,{ getState, dispatch}: Redux) => {
    const storedToken = localStorage.getItem('access_token')
    const headers = {
        headers: {
            Authorization: `Bearer ${storedToken}`
        }
    }
    const response = await axios.patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/booking/edit`, data, headers)

    return response.data
}
) 

// cancel booking 

export const CancelBookingAction = createAsyncThunk(
    'booking/CancelBookingAction',
    async (booking_id: any,{ getState, dispatch}: Redux) => {
    const storedToken = localStorage.getItem('access_token')
    const headers = {
        headers: {
            Authorization: `Bearer ${storedToken}`
        }
    }
    const response = await axios.patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/booking/cancel`, booking_id, headers)

    return response.data
}
) 

// cancel booking 

export const ApproveBookingAction = createAsyncThunk(
    'booking/ApproveBookingAction',
    async (booking_id: any,{ getState, dispatch}: Redux) => {
    const storedToken = localStorage.getItem('access_token')
    const headers = {
        headers: {
            Authorization: `Bearer ${storedToken}`
        }
    }
    const response = await axios.patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/booking/approve`, booking_id, headers)

    return response.data
}
) 

// complete booking 

export const completeBookingAction = createAsyncThunk(
    'booking/completeBookingAction',
    async (booking_id: any,{ getState, dispatch}: Redux) => {
    const storedToken = localStorage.getItem('access_token')
    const headers = {
        headers: {
            Authorization: `Bearer ${storedToken}`
        }
    }
    const response = await axios.patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/booking/complete`, booking_id, headers)

    return response.data
}
) 

// complete payment 

export const completePaymentAction = createAsyncThunk(
    'booking/completePaymentAction',
    async (Booking_id: any,{ getState, dispatch}: Redux) => {
    const storedToken = localStorage.getItem('access_token')
    console.log(Booking_id, "from redux")
    const headers = {
        headers: {
            Authorization: `Bearer ${storedToken}`
        }
    }
    const response = await axios.patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/booking/completepayment`, Booking_id, headers)

    return response.data
}
) 


//  booking failed

export const bookingFailedAction = createAsyncThunk(
    'booking/bookingFailedAction',
    async (Booking_id: any,{ getState, dispatch}: Redux) => {
    console.log(Booking_id, "from redux")
    const storedToken = localStorage.getItem('access_token')
    const headers = {
        headers: {
            Authorization: `Bearer ${storedToken}`
        }
    }
    const response = await axios.patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/booking/paymentfailed`, Booking_id, headers)

    return response.data
}
) 


export const bookingSlice = createSlice({
    name: 'tour',
    initialState,
    reducers: {
      // standard reducer logic, with auto-generated action types per reducer
    },
    extraReducers: (builder) => {
      // Add reducers for additional action types here, and handle loading state as needed
      builder
    .addCase(AddBookingAction.fulfilled, (state, action:PayloadAction<any>) => {
        if ( ! action.payload.status ) {
            toast.loading("Booking already in que..", {
                duration: 3000,
              })
        } else {
            toast.success("Booking Placed...")
        }
        state.loading = false
        state.error = ""
        state.redirect = true
        state.sessionId = action.payload.sessionId
    })
    .addCase(AddBookingAction.pending, (state) => {
        state.loading = true
    })
    .addCase(AddBookingAction.rejected, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = action.payload
    })
    .addCase(EditBookingAction.fulfilled, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = ""
        state.redirect = true
        state.sessionId = action.payload.sessionId
        toast.success("Booking details successfully edited...")
    })
    .addCase(EditBookingAction.pending, (state) => {
        state.loading = true
    })
    .addCase(EditBookingAction.rejected, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = action.payload
    })
    .addCase(listBookingAction.fulfilled, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = ""
        state.data = action.payload.data
        state.redirect = false
    })
    .addCase(listBookingAction.pending, (state) => {
        state.loading = true
        state.redirect = false
    })
    .addCase(listBookingAction.rejected, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = action.payload
        state.redirect = false
    })
    .addCase(CancelBookingAction.fulfilled, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = ""
        state.redirect = true
    })
    .addCase(CancelBookingAction.pending, (state) => {
        state.loading = true
    })
    .addCase(CancelBookingAction.rejected, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = action.payload
        state.data = []
    })
    .addCase(ApproveBookingAction.fulfilled, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = ""
        state.redirect = true
    })
    .addCase(ApproveBookingAction.pending, (state) => {
        state.loading = true
    })
    .addCase(ApproveBookingAction.rejected, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = action.payload
        state.data = []
    })
    .addCase(completeBookingAction.fulfilled, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = ""
        state.redirect = true
    })
    .addCase(completeBookingAction.pending, (state) => {
        state.loading = true
    })
    .addCase(completeBookingAction.rejected, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = action.payload
        state.data = []
    })
    .addCase(completePaymentAction.fulfilled, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = ""
        state.redirect = true
    })
    .addCase(completePaymentAction.pending, (state) => {
        state.loading = true
    })
    .addCase(completePaymentAction.rejected, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = action.payload
        state.data = []
    })
    .addCase(bookingFailedAction.fulfilled, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = ""
        state.redirect = true
    })
    .addCase(bookingFailedAction.pending, (state) => {
        state.loading = true
    })
    .addCase(bookingFailedAction.rejected, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = action.payload
        state.data = []
    })
    },
  })
  
  
  export default bookingSlice.reducer;