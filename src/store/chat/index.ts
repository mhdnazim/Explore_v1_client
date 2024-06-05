import { Dispatch, PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import toast from "react-hot-toast"

interface Redux {
    getState : any,
    dispatch : Dispatch<any>
}

interface ChatsData{
    _id: string
    user: {
      _id: string
      first_name: string
      last_name: string
    }
    tour_operator: string
    send_by: string
    receive_by: string
    message: string
  }
  

export interface ChatState {
    data : []  
    params: {}
    userData: []
    chats: ChatsData[]
    loading : boolean
    error : string | null | any
    redirect: boolean
}

const initialState: ChatState = {
    data: [],
    params: {},
    userData: [],
    chats: [{
        _id: "",
        user: {
          _id: "",
          first_name: "",
          last_name: "",
        },
        tour_operator: "",
        send_by: "",
        receive_by: "",
        message: ""
      }],
    loading: false,
    error: "", 
    redirect: false
}



interface Id {
    user : string | null
}


// add chat 
export const AddChatAction = createAsyncThunk(
    'chat/AddChatAction',
    async (data: any , { getState, dispatch}: Redux) => {
    const storedToken = localStorage.getItem('access_token')
        const headers = {
            headers: {
                Authorization: `Bearer ${storedToken}`
            }
        }

    const response =await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/chat/add`,data, headers)
    
    return response.data
  },
)

// list chats
export const listChatsAction = createAsyncThunk(
    'chat/listChatsAction',
    async (data: any , { getState, dispatch}: Redux) => {
    const storedToken = localStorage.getItem('access_token')
        const headers = {
            headers: {
                Authorization: `Bearer ${storedToken}`
            }
        }

    const response =await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/chat/list`,data, headers)
    
    return response.data
  },
)

// list chats for operator
export const listChatsForOperator = createAsyncThunk(
    'chat/listChatsForOperator',
    async (data: any , { getState, dispatch}: Redux) => {
    const storedToken = localStorage.getItem('access_token')
        const headers = {
            headers: {
                Authorization: `Bearer ${storedToken}`
            }
        }

    const response =await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/chat/chatlist`,data, headers)
    
    return response.data
  },
)



export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
      // standard reducer logic, with auto-generated action types per reducer
    },
    extraReducers: (builder) => {
      // Add reducers for additional action types here, and handle loading state as needed
      builder
    .addCase(AddChatAction.fulfilled, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = ""
        state.redirect = true
    })
    .addCase(AddChatAction.pending, (state) => {
        state.loading = true
    })
    .addCase(AddChatAction.rejected, (state, payload:PayloadAction<any>) => {
        state.loading = false
        state.error = payload
    })
    // .addCase(listUsersByTourOperator.fulfilled, (state, action:PayloadAction<any>) => {
    //     state.loading = false
    //     state.error = ""
    //     state.userData = action.payload.data
    //     state.redirect = false
    // })
    // .addCase(listUsersByTourOperator.pending, (state) => {
    //     state.loading = true
    //     state.redirect = false
    // })
    // .addCase(listUsersByTourOperator.rejected, (state, payload:PayloadAction<any>) => {
    //     state.loading = false
    //     state.error = payload
    //     state.redirect = false
    // })
    .addCase(listChatsForOperator.fulfilled, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = ""
        state.userData = action.payload.data
        state.redirect = false
    })
    .addCase(listChatsForOperator.pending, (state) => {
        state.loading = true
        state.redirect = false
    })
    .addCase(listChatsForOperator.rejected, (state, payload:PayloadAction<any>) => {
        state.loading = false
        state.error = payload
        state.redirect = false
    })
    .addCase(listChatsAction.fulfilled, (state, action:PayloadAction<any>) => {
        state.loading = false
        state.error = ""
        state.chats = action.payload.data
        state.redirect = false
    })
    .addCase(listChatsAction.pending, (state) => {
        state.loading = true
        state.redirect = false
    })
    .addCase(listChatsAction.rejected, (state, payload:PayloadAction<any>) => {
        state.loading = false
        state.error = payload
        state.redirect = false
    })
    },
  })
  
  
  export default chatSlice.reducer;