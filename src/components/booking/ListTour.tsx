'use client'
import { Chip } from '@mui/material'
import Card from '@mui/material/Card'
import EditBooking from './EditBooking'
import ViewBooking from './ViewBooking'
import { useRouter } from 'next/navigation'
import { Button, Grid } from '@mui/material'
import CardMedia from '@mui/material/CardMedia'
import { AppDispatch, RootState } from '@/store'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import AddReview from '../review/AddOrEditReview'
import React, { useEffect, useState } from 'react'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import { useDispatch, useSelector } from 'react-redux'
import { AddComment, Cancel, Done, Edit, Visibility } from '@mui/icons-material'
import { ApproveBookingAction, CancelBookingAction, completeBookingAction } from '@/store/booking'

interface Props {
    fetchBookings: BookingData[]
}

interface BookingData {
    _id: string
    user: {
        _id: string
        first_name: string
        last_name: string
    }
    tour_operator: {
        _id: string
    }
    tour_and_activity: {
        _id: string
        title: string
        highlight: string
        destination: string
        price: number
    }
    phone_number: number
    email: string
    pickup_point: string
    special_requirements: string
    date: Date
    time: string
    no_of_persons: number
    payment_mode: string
    payment_status: boolean
    status: string
    total_cost: number
  }

const ListTourCard = ({ fetchBookings }: Props ) => {
    const [getRole, setGetRole] = useState<string | null>("")
    const [open, setOpen] = useState<boolean>(false)
    const [edit, setEdit] = useState<boolean>(false)
    const [ view, setView ] = useState<boolean>(false)
    const [reviewTrip, setReviewTrip] = useState<BookingData>({
        _id: "",
        user: {
            _id: "",
            first_name: "",
            last_name: ""
        },
        tour_operator: {
          _id: ""
        },
        tour_and_activity:{
          _id: "",
          title: "",
          highlight:  "",
          destination: "",
          price: 0
        },
        phone_number: 0,
        email: "",
        pickup_point: "",
        special_requirements: "",
        date: new Date(),
        time: "",
        no_of_persons: 0,
        payment_mode: "",
        payment_status: false,
        total_cost: 0,
        status: ""
      }
      )

    const router = useRouter()

    const useAppDispatch: any = useDispatch.withTypes<AppDispatch>()
    const useAppSelector = useSelector.withTypes<RootState>()

    const dispatch = useAppDispatch();

    const handleClickCancel = ( Booking_id: string ) => {
        if ( Booking_id ){
            dispatch(CancelBookingAction({Booking_id}));
        }
    }

    const handleClickEdit = ( item: BookingData ) => {
        if ( item._id ){
            setEdit(true)
            setReviewTrip(item)
        }
    }

    

    const handleClickApprove = ( Booking_id: string ) => {
        if ( Booking_id ){
            dispatch(ApproveBookingAction({Booking_id}));
        }
    }

    const handleClickView = ( item: BookingData ) => {
        if ( item._id ){
            setView(true)
            setReviewTrip(item)
        }
    }

    const handleClickComplete = ( Booking_id: string ) => {
        if ( Booking_id ){
            dispatch(completeBookingAction({Booking_id}));
        }
    }

    useEffect(() => {
        const user_id = localStorage.getItem('user_Id')
        const user_role = localStorage.getItem('role')
        setGetRole(user_role)
    }, [ getRole])

    useEffect(() => {
    const Today = new Date().toISOString()
    const formattedDate = new Date(Today)
    {fetchBookings.map((items) => {
            const isDate = items.date
            const nextDate = new Date(isDate)
            const isBefore =  nextDate < formattedDate
            const isApproved = items.status === "approved"
            // console.log(isBefore,"isBefore",isApproved,"isApproved")
            if ( isBefore && isApproved ){
                handleClickComplete(items._id)
            }
    })}
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[fetchBookings])

    const handleAddReview = ( item: BookingData ) => {
        setOpen(true)
        setReviewTrip(item)
    }

    const handleClickClose = () => {
        setOpen(false)
        setView(false)
        setEdit(false)
    }
    
    
    return (
        <>
    {fetchBookings.map((item: BookingData) => {
        return(
            <Grid key={item._id} item xs={12} sm={12} md={6} lg={4} sx={{ my: 2 }} className='booking_card'  >
            <Card sx={{ maxWidth: 345 }}>
                <CardHeader
                     sx={{ cursor: "pointer" }}
                    onClick={() => {router.push(`/toursandactivity/view/${item.tour_and_activity._id}`)}}
                    action={
                    <IconButton aria-label="settings">
                    <Chip label={item.status} color={ item.status === "cancelled" ? "error" : item.status === "pending" ? "warning" : item.status === "approved" ? "primary" : "success"} />
                    </IconButton>
                    }
                    title={`${item.tour_and_activity.title.charAt(0).toUpperCase() + item.tour_and_activity.title.substring(1,15)}...`}
                    subheader={`${new Date(item.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}`}
                />
                <CardMedia
                     sx={{ cursor: "pointer" }}
                    onClick={() => {router.push(`/toursandactivity/view/${item.tour_and_activity._id}`)}}
                    component="img"
                    height="194"
                    image={item.tour_and_activity.highlight}
                    alt={item.tour_and_activity.title}
                />
                <CardContent>
                    <Typography variant='h5' sx={{ display: "flex", justifyContent: "center", fontWeight: "bold", color: "green" }} component="legend" >
                    Total  ₹  {item.total_cost}.00 /-
                    </Typography>
                </CardContent>
                <CardActions disableSpacing sx={{ display: "flex", justifyContent: "center", columnGap: "5px" }}>
                    <Button onClick={ () => handleClickView(item) } variant="outlined" size="small" color="primary" >
                        <Visibility /> 
                                View
                        </Button> 
                    { item.status === "completed" && getRole === "user" && 
                        <Button onClick={() => { handleAddReview(item) }}  variant="outlined" size="small" color="success" >
                        <AddComment /> 
                             Review
                        </Button> 
                    }

                    { item.status === "pending" && getRole === "Tour Operator" && 
                        <Button onClick={ () => handleClickApprove(item._id) } variant="outlined" size="small" color="success" >
                        <Done /> 
                                Approve
                        </Button> 
                    }

                    { item.status !== "cancelled" && item.status !== "completed"  && 
                        <Button onClick={ () => handleClickCancel(item._id) } variant="outlined" size="small" color="error" >
                        <Cancel />
                        Cancel
                        </Button>
                    }

                    {  item.status === "pending" && getRole === "user" && 
                        <Button onClick={ () => handleClickEdit(item) } variant="outlined" size="small" color="primary" >
                        <Edit />
                        Edit
                        </Button>
                    }
                </CardActions>
            </Card>
        </Grid>
        )
    })}
    <Grid>
        <ViewBooking bookingDetails={reviewTrip} open={view} handleClickClose={ handleClickClose } />
        <AddReview bookingDetails={reviewTrip} open={ open } handleClickClose={ handleClickClose } />
        <EditBooking bookingDetails={reviewTrip} book={ edit } handleClickClose={ handleClickClose }  />
    </Grid>
    </>
  )
}

export default ListTourCard