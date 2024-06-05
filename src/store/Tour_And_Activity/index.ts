import { Dispatch, PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import toast from "react-hot-toast"

interface Redux {
    getState : any,
    dispatch : Dispatch<any>
}

export interface TourState {
    myTours: []
    data : []  ,
    params: {},
    tourData : {}
    loading : boolean,
    error : string | null
    redirect: boolean
}

const initialState: TourState = {
    myTours: [],
    data: [],
    params: {},
    tourData : {},
    loading: false,
    error: "",
    redirect: false
}

interface DataParams {
    search : string,
    duration : number | string,
    fromPrice : number | string,
    toPrice : number | string,
    activity_type: string
    tour_operator: string
    latitude: any
    longitude: any
}

interface Id {
    _id : string
}


// list My Tour/Activity 

export const myToursAction = createAsyncThunk(
    'tour/myToursAction',
    async ( tour_operator: any ) => {
        const storedToken = localStorage.getItem('access_token')

        const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/toursandactivities/mytours`, tour_operator, {
        headers: {Authorization: `Bearer ${storedToken}` } })

        return response.data
    }
)
// list Tour/Activity 

export const listTourAction = createAsyncThunk(
    'tour/listTourAction',
    async (params: DataParams) => {
        const storedToken = localStorage.getItem('access_token')

        const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/toursandactivities/list`, params, {
        headers: {Authorization: `Bearer ${storedToken}` } })

        return response.data
    }
)

// view Tour/Activity 

export const viewTourAction = createAsyncThunk(
    'book/viewBookAction',
    async (_id: Id) => {
        const storedToken = localStorage.getItem('access_token')
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/toursandactivities/view`, _id , {
        headers: {Authorization: `Bearer ${storedToken}` } })

        console.log( response.data," response.data")
        return response.data
    }
)


// addTour/Activity

export const AddTourAction = createAsyncThunk(
    'tour/AddTourAction',
    async (data: any , { getState, dispatch}: Redux) => {
    console.log(data, "from redux")
    const storedToken = localStorage.getItem('access_token')
        const headers = {
            headers: {
                Authorization: `Bearer ${storedToken}`,
                "content-type": "multipart/form-data"
            }
        }

    const response =await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/toursandactivities/add`,data, headers)
    
    return response.data
  },
)

// edit Tour 

export const EditTourAction = createAsyncThunk(
    'tour/EditTourAction',
    async (data: any,{ getState, dispatch}: Redux) => {
    const storedToken = localStorage.getItem('access_token')
    const headers = {
        headers: {
            Authorization: `Bearer ${storedToken}`,
            "content-type": "multipart/form-data"
        }
    }
    const response = await axios.patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/toursandactivities/edit`, data, headers)

    return response.data
}
) 

export const EditItineraryAction = createAsyncThunk(
    'tour/EditItineraryAction',
    async (data: any,{ getState, dispatch}: Redux) => {
    const storedToken = localStorage.getItem('access_token')
    const headers = {
        headers: {
            Authorization: `Bearer ${storedToken}`
        }
    }
    const response = await axios.patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/toursandactivities/edititinerary`, data, headers)

    return response.data
}
) 

export const AddItineraryAction = createAsyncThunk(
    'tour/AddItineraryAction',
    async (data: any,{ getState, dispatch}: Redux) => {
    const storedToken = localStorage.getItem('access_token')
    const headers = {
        headers: {
            Authorization: `Bearer ${storedToken}`
        }
    }
    const response = await axios.patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/toursandactivities/additinerary`, data, headers)

    return response.data
}
) 

export const DeleteItineraryAction = createAsyncThunk(
    'tour/DeleteItineraryAction',
    async ( _id: string,{ getState, dispatch}: Redux) => {
    const storedToken = localStorage.getItem('access_token')
    const headers = {
        headers: {
            Authorization: `Bearer ${storedToken}`
        }
    }
    const response = await axios.patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/toursandactivities/deleteitinerary`,  {_id} , headers)

    return response.data
}
) 

// delete Tour 

export const deleteTourAction = createAsyncThunk(
    'tour/deleteTourAction',
     async (_id : any) => {
        const storedToken = localStorage.getItem('access_token')
        
        const response = await axios.patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/toursandactivities/delete`, _id, {headers: {
                Authorization: `Bearer ${storedToken}`
            }})

        return response.data
})

// hide Tour 

export const hideTourAction = createAsyncThunk(
    'tour/hideTourAction',
     async (_id : any) => {
        const storedToken = localStorage.getItem('access_token')
        
        const response = await axios.patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/toursandactivities/hide`, _id, {headers: {
                Authorization: `Bearer ${storedToken}`
            }})

        return response.data
})




export const tourSlice = createSlice({
    name: 'tour',
    initialState,
    reducers: {
      // standard reducer logic, with auto-generated action types per reducer
    },
    extraReducers: (builder) => {
      // Add reducers for additional action types here, and handle loading state as needed
      builder
    .addCase(myToursAction.fulfilled, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = ""
        state.myTours = action.payload.data
        state.redirect = false
    })
    .addCase(myToursAction.pending, (state) => {
        state.loading = true
        state.redirect = false
    })
    .addCase(myToursAction.rejected, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = action.payload
        state.redirect = false
        // state.data = []
    })
    .addCase(listTourAction.fulfilled, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = ""
        state.data = action.payload.data
        state.redirect = false
    })
    .addCase(listTourAction.pending, (state) => {
        state.loading = true
        state.redirect = false
    })
    .addCase(listTourAction.rejected, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = action.payload
        state.redirect = false
        // state.data = []
    })
    .addCase(viewTourAction.fulfilled, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = ""
        state.tourData = action.payload.data
        state.redirect = false
    })
    .addCase(viewTourAction.pending, (state) => {
        state.loading = true
        state.redirect = false
    })
    .addCase(viewTourAction.rejected, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = action.payload
        state.redirect = false
    })
    .addCase(AddTourAction.fulfilled, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = ""
        state.redirect = true
        toast.success("Tour added")
    })
    .addCase(AddTourAction.pending, (state) => {
        state.loading = true
    })
    .addCase(AddTourAction.rejected, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = action.payload
        toast.error("Operation failed")
    })
    .addCase(EditTourAction.fulfilled, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = ""
        state.redirect = true
        toast.success("Tour edited successfully...")
    })
    .addCase(EditTourAction.pending, (state) => {
        state.loading = true
        state.redirect = false
    })
    .addCase(EditTourAction.rejected, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = action.payload
        toast.error("Operation failed. Try again...")
    })
    .addCase(EditItineraryAction.fulfilled, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = ""
        state.redirect = true
        toast.success("Itinerary edited successfully...")
    })
    .addCase(EditItineraryAction.pending, (state) => {
        state.redirect = false
        state.loading = true
    })
    .addCase(EditItineraryAction.rejected, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = action.payload
    })
    .addCase(AddItineraryAction.fulfilled, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = ""
        state.redirect = true
        toast.success("Itinerary added successfully...")
    })
    .addCase(AddItineraryAction.pending, (state) => {
        state.redirect = false
        state.loading = true
    })
    .addCase(AddItineraryAction.rejected, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = action.payload
    })
    .addCase(DeleteItineraryAction.fulfilled, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = ""
        state.redirect = true
        toast.success("Itinerary deleted successfully...")

    })
    .addCase(DeleteItineraryAction.pending, (state) => {
        state.redirect = false
        state.loading = true
    })
    .addCase(DeleteItineraryAction.rejected, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = action.payload
    })
    .addCase(deleteTourAction.fulfilled, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = ""
        toast.success("Tour deleted successfully...")
    })
    .addCase(deleteTourAction.pending, (state) => {
        state.loading = true
    })
    .addCase(deleteTourAction.rejected, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = action.payload
        state.data = []
    })
    .addCase(hideTourAction.fulfilled, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = ""
        state.redirect = true
        toast.success("Successful")
    })
    .addCase(hideTourAction.pending, (state) => {
        state.loading = true
        state.redirect = false
    })
    .addCase(hideTourAction.rejected, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = action.payload
        state.data = []
    })
    },
  })
  
  
  export default tourSlice.reducer;