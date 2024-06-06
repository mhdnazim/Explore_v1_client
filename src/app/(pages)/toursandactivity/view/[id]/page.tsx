'use client'
import Itinerary from '@/components/tours_and_activity/Itinerary';
import { AppDispatch, RootState } from '@/store';
import { DeleteItineraryAction, deleteTourAction, hideTourAction } from '@/store/Tour_And_Activity';
import { AccessTime, Add, Delete, DriveEta, Edit, Email, LocalPhone, LocationOn, Public, Tour, Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, Chip, Grid, Link, Paper, Rating, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import EditTourAndActivity from '@/components/tours_and_activity/EditToursAndActivity';
import { useRouter } from 'next/navigation';
import BookTour from '@/components/booking/BookTour';
import ReviewCard from '@/components/home/ReviewCard';
import { listReviewAction } from '@/store/review';
import toast from 'react-hot-toast';
import { StickyShareButtons } from "sharethis-reactjs";
import Chats from '@/components/utils/Chat';
import AddItinerary from '@/components/tours_and_activity/AddItinerary';
import Image from 'next/image';


interface TourData {
    _id: string,
    title: string,
    tour_operator: {
        _id: string
        name: string
        email: string
        phone_number: number
    }
    destination: string
    coordinates: {
        longitude: any
        latitude: any
    }
    description: string,
    duration: number,
    itinerary: {
        _id: string
        itinerary: string,
        step: number
    }[],
    price: number,
    availability: number,
    activity_type: string,
    highlight: string,
    isDeleted: Boolean,
    isShown: Boolean,
    createdAt: string,
    updatedAt: string
  }
  
  const defaultTourData = {
    _id: "",
    title: "",
    tour_operator: {
        _id: "",
        name: "",
        email: "",
        phone_number: 0
    },
    destination: "",
    coordinates: {
        longitude: "",
        latitude: ""
    },
    duration: 0,
    description: "",
    itinerary:[{
        _id: "",
        itinerary: "",
        step: 0
    }],
    price: 0,
    availability: 0,
    activity_type: "",
    highlight: "",
    isDeleted: true,
    isShown: true,
    createdAt: "",
    updatedAt: ""
  }

  interface ReviewData {
    _id: string
    reviewer: {
      _id: string
      first_name: string
      last_name: string
    }
    tour_operator: {
      _id: string
      name: string
      location: string
    }
    tour_and_activity: {
      _id: string
      title: string
      coordinates: {
        destination: string
    }
    }
    rating: number
    review_title: string
    review: string
    createdAt: string
  }

const ViewTourOrActivity = ({params}: {params: { id: string }}) => {
    const [viewedTour, setViewedTour] = useState<TourData>(defaultTourData)
    const [isShow, setIsShow] = useState(false)
    const [role, setRole] = useState<string | null>("")
    const [loginId, setLoginId] = useState<string | null>("")
    const [chat, setChat] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>(false)
    const [add, setAdd] = useState<boolean>(false)
    const [avgReview, setAvgReview] = useState(0)
    const [book, setBook] = useState<boolean>(false)
    const [state, setState] = useState({
        date: new Date(),
        persons: 0
      });

    const router = useRouter()

    const useAppDispatch: any = useDispatch.withTypes<AppDispatch>()
    const useAppSelector = useSelector.withTypes<RootState>()

    const dispatch = useAppDispatch();
    
    const redirect: boolean = useAppSelector(state => state.tour.redirect);
    const reviews: ReviewData[] = useAppSelector(state => state.review.reviewData);

    const handleDialogOpen = () => {
        setBook(true)
    }

    const handleAdd = () => {
        setAdd(true)
    }

    const handleDialogClose = () => {
        setBook(false)
    }

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleChat = () => {
        setChat(true)
    }

    const handleClickClose = () => {
        setOpen(false)
        setChat(false)
        setAdd(false)
    }

    const handleClickDelete = () => {
        if (params.id){
            dispatch(deleteTourAction({_id: params.id}));
        }
        router.push('/toursandactivity/mytours')
    }

    const handleDeleteItinerary = () => {
        dispatch(DeleteItineraryAction( viewedTour._id ))
    }

    const handleClickCheck = (event: any) => {
        event.preventDefault()
        const storedToken = localStorage.getItem('access_token')
        if ( ! storedToken ){
            toast.error("Please login to continue...")
        } else {
            setIsShow(true)
        }
    }

    const handleClickHide = () => {
        if (params.id){
            dispatch(hideTourAction({_id: params.id}));
        }
    }

    useEffect(() => {
        const user_role = localStorage.getItem("role")
        setRole(user_role)
        const _id = localStorage.getItem("user_Id")
        setLoginId(_id)
    if ( params.id !== "" ) {
        const storedToken = localStorage.getItem("access_token")
        const viewTour = async () => {
        await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/toursandactivities/view`,  { _id: params.id }  , {
        headers: {Authorization: `Bearer ${storedToken}` } }).then(res=>{
            setViewedTour(res.data.data)
            })
    }
    viewTour()
    }   
    }, [params.id, open, redirect, avgReview])

    const handleChange = (evt: any) => {
        const value = evt.target.value;
        setState({
            ...state,
            [evt.target.name]: value
        });
        };

    useEffect(() => {
        dispatch(listReviewAction({ tour_and_activity: params.id }))
      }, [dispatch, redirect, params.id ])

    useEffect(() => {
        if (reviews.length > 0) {
            let total = reviews.reduce((accumulator, current) => accumulator + current.rating, 0);
            const averageRating = total / reviews.length;
            setAvgReview(averageRating);
        } else {
            setAvgReview(0);
        }
    }, [reviews]); // Add productId to dependencies
     
      

  return (
    <>
     <div className="App">
      <div>
        <style
          dangerouslySetInnerHTML={{
            __html: `
          html, body {
            margin: 0;
            padding: 0;
            text-align: center;
          }
          h1 {
            font-size: 24px;
            font-weight: bold;
          }
          hr {
            margin-bottom: 40px;
            margin-top: 40px;
            width: 50%;
          }
        `
          }}
        />

        <StickyShareButtons
          config={{
            alignment: "left", // alignment of buttons (left, right)
            color: "social", // set the color of buttons (social, white)
            enabled: true, // show/hide buttons (true, false)
            font_size: 16, // font size for the buttons
            // hide_desktop: false, // hide buttons on desktop (true, false)
            labels: "counts", // button labels (cta, counts, null)
            language: "en", // which language to use (see LANGUAGES)
            min_count: 0, // hide react counts less than min_count (INTEGER)
            networks: [
              // which networks to include (see SHARING NETWORKS)
              "linkedin",
              "facebook",
              "twitter",
              "pinterest",
              "whatsapp",
              "email"
            ],
            padding: 12, // padding within buttons (INTEGER)
            radius: 4, // the corner radius on each button (INTEGER)
            show_total: true, // show/hide the total share count (true, false)
            show_mobile: true, // show/hide the buttons on mobile (true, false)
            show_toggle: true, // show/hide the toggle buttons (true, false)
            size: 48, // the size of each button (INTEGER)
            top: 160, // offset in pixels from the top of the page

            // OPTIONAL PARAMETERS
            url: `http://localhost:3000/toursandactivity/view/${params.id}`, // (defaults to current url)
            image: "https://bit.ly/2CMhCMC", // (defaults to og:image or twitter:image)
            description: "custom text", // (defaults to og:description or twitter:description)
            title: "Amazing Plans", // (defaults to og:title or twitter:title)
            message: "I am sharing this to you. Take a look...", // (only for email sharing)
            subject: "Just look at this tour plan...", // (only for email sharing)
            username: "custom twitter handle" // (only for twitter sharing)
          }}
        />
      </div>
    </div>
        <Grid container sx={{ py:{ md: 8} }}  columnSpacing={{ xs: 0, sm: 0, md: 2, lg: 2}} className='container'>
           { role === "user" &&  
           <>
               <Chats open={chat} handleClickClose={ handleClickClose } user_id={loginId} data={viewedTour} role={role} />
           <Grid className='chat_icon' onClick={handleChat} >
                    <div style={{ height: '50px' }}>
                        <Image
                            src="/chat.gif"
                            alt="Preview of the image"
                            width={50}
                            height={50} // Specify a default height
                            layout="fixed" // Use responsive layout
                        />
                        </div>
            </Grid>
           </>
            }
            <Grid item xs={12} sx={{ pt: 2, display: "flex", justifyContent: "space-between", flexDirection: { xs: "column-reverse", md: "row"} }} >
                <Grid xs={12} sm={8} item >
                    <Typography variant='h4' sx={{ fontWeight: "bold", textAlign: "start" }} component="legend" >
                    {viewedTour.title.charAt(0).toUpperCase() + viewedTour.title.substring(1)}
                    </Typography>
                </Grid>
                { role === "Tour Operator" && loginId === viewedTour.tour_operator._id ? (
                    <Grid item xs={12} md={4} sx={{ py: { xs: 2, md: 0 }}} >
                        <Button onClick={ handleClickOpen } sx={{ mx: 2 }} variant='outlined' color='primary' className='add' startIcon={ <Edit /> }>edit</Button>
                        {viewedTour.isShown ?
                        <Button onClick={ handleClickHide } sx={{ mx: 2 }} variant='outlined' color='warning' className='add' startIcon={ <VisibilityOff /> }>Hide</Button>
                        :
                        <Button onClick={ handleClickHide } sx={{ mx: 2 }} variant='outlined' color='warning' className='add' startIcon={ <Visibility /> }>Show</Button>
                        }
                        <Button onClick={ handleClickDelete } sx={{ mx: 2 }} variant='outlined' color='error' className='add' startIcon={ <Delete /> }>Delete</Button>
                    </Grid>
                ): 
                    <Grid item xs={12} md={4} sx={{ py: { xs: 2, md: 0 }}} >
                        <Chip label="Book Now"  />
                </Grid>
                }
                <EditTourAndActivity open={ open } handleClickClose={ handleClickClose } viewedTour={viewedTour} />
            </Grid>
            <Grid item xs={12} sx={{ display:{ md: "flex"}, py: 2, columnGap: { md: "10px"} }} >
                { avgReview > 0 && 
                <Rating style={{ color: avgReview > 2 ? "green" : "red" }} name="half-rating-read" value={ avgReview > 1 ? avgReview : 1 } precision={0.5} readOnly />
            }
            <Typography sx={{ textAlign: "start" }} component="legend" >
                    {reviews.length} Reviews
                </Typography> 
            <Typography sx={{ textAlign: "start" }} component="legend" >
                <LocationOn /> 
                    {viewedTour.destination.charAt(0).toUpperCase() + viewedTour.destination.substring(1)}
                </Typography>
            </Grid>
            <Grid item xs={12} md={8} >
                <Paper elevation={3} sx={{ borderRadius: "10px"}} >
                    <Image
                        src={viewedTour.highlight}
                        alt="Preview of the image"
                        width={250}
                        height={50} // Specify a default height
                        layout="responsive" // Use responsive layout
                        style={{ width: "100%", height: "auto", borderRadius: "10px" }}
                    />
                </Paper>
            </Grid>
            <Grid sx={{ position: "sticky" }} item xs={12} md={4} >
            <Paper  elevation={3} sx={{ borderRadius: "10px", p: 3 }} >
            
            <form onSubmit={ handleClickCheck }>
                <Typography variant='h5' sx={{ display: "flex", justifyContent: "center", fontWeight: "bold" }} component="legend" >
                From  ₹  {viewedTour.price}.00 /-
                </Typography>
                <Link  sx={{ display: "flex", justifyContent: "center",  color: "black" }} component="legend" >
                    Lowest Price Guarantee
                </Link>
                <Grid item xs={12} sx={{ px: 3, mt: 3 }} >
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="date"
                        name="date"
                        type="date"
                        InputProps={{ inputProps: { min: new Date().toJSON().slice(0, 10), max: null } }}
                        fullWidth
                        variant="outlined"
                        onChange={handleChange}
                    />
                </Grid>
                
                <Grid item xs={12} sx={{ px: 3 }} >
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="persons"
                        name="persons"
                        label="No of Persons"
                        InputProps={{ inputProps: { min: 1 } }}
                        type="number"
                        fullWidth
                        variant="outlined"
                        onChange={handleChange}
                    />
                </Grid>

                {isShow ? (state.persons <= viewedTour.availability && role === "user" ?
                <Grid item xs={12} sx={{ p: 3 }} >
                    <Chip label="Available" color="success" sx={{ my: 2 }} />
                    <Button onClick={handleDialogOpen} sx={{ width :"100%" }} variant="contained" color="success" size='large' >
                    Book Now
                    </Button>
                    <BookTour book={ book } handleDialogClose={ handleDialogClose } id={params.id} state={state} viewedTour={viewedTour} />
                </Grid>
                :
                <Grid item xs={12} sx={{ p: 3 }} >
                    <Chip label="Not Available" color="error"  />
                </Grid>) :
                <Grid item xs={12} sx={{ p: 3 }} >
                <Button type='submit' sx={{ width :"100%" }} variant="contained" color="success" size='large' >
                    Check Availability
                    </Button>
                </Grid>}

               

            </form>

            <Grid item xs={12}  >
                <Chip label="Free cancellation up to 24 hours" color="success" variant="outlined" />
            </Grid>
            </Paper>
            </Grid>

            
            <Grid item xs={12} sx={{ py: 3 }}  >
                <hr style={{ width: "100%"}} />
            </Grid>


            <Grid item xs={12} sx={{ color:"black", textDecoration: "none",  display: "flex", alignItems: "center" }}>
            <Typography variant='h4' sx={{ fontWeight: "bold", textAlign: "start" }}  >
                 Tour Operator Details
                </Typography> 
                </Grid>

            <Grid item xs={12} sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}>
            <Grid item xs={12} md={2} sx={{ color:"black", textDecoration: "none",  display: "flex", alignItems: "center" }}>
                    <Tour sx={{ color: "green" }} /> &nbsp; <Typography sx={{ pt: 2 }} >{ viewedTour.tour_operator.name.charAt(0).toUpperCase() + viewedTour.tour_operator.name.substring(1) }</Typography>
                </Grid>

            <Grid item xs={12} md={3} sx={{ color:"black", textDecoration: "none",  display: "flex", alignItems: "center", py: { xs: 2, md: 2 } }}>
                    <Email sx={{ color: "green" }} /> &nbsp; 
                    <a href={`mailto:${ viewedTour.tour_operator.email }`}>{ viewedTour.tour_operator.email }</a>
                </Grid>

            <Grid item xs={12} md={2} style={{ color:"black", textDecoration: "none",  display: "flex", alignItems: "center" }}>
                    <LocalPhone sx={{ color: "green" }} /> &nbsp; 
                    <a style={{ color: "green"}} href={`tel:${ viewedTour.tour_operator.phone_number }`}>{ viewedTour.tour_operator.phone_number }</a>
            </Grid>
            </Grid>

            <Grid item xs={12}  >
                <hr style={{ width: "100%"}} />
            </Grid>

            <Grid item xs={12} style={{ color:"black", textDecoration: "none",  display: "flex", alignItems: "center" }}>
            <Typography variant='h4' sx={{ fontWeight: "bold", textAlign: "start" }}  >
                 Tour  Details
                </Typography> 
                </Grid>


                <Grid item xs={12} sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}>
                    <Grid item xs={12} md={2} style={{ color:"black", textDecoration: "none",  display: "flex", alignItems: "center" }}>
                            <AccessTime sx={{ color: "green" }} /> &nbsp; <Typography sx={{ py: 2 }} >{ viewedTour.duration } Days (Approx.)</Typography>
                        </Grid>

                    <Grid item xs={12} md={2} sx={{ color:"black", textDecoration: "none",  display: "flex", alignItems: "center" }}>
                            <DriveEta sx={{ color: "green" }} /> &nbsp; <Typography sx={{ py: 2 }} >Private Tour</Typography>
                        </Grid>

                    <Grid item xs={12} md={2}  style={{ color:"black", textDecoration: "none",  display: "flex", alignItems: "center" }}>
                            <Public sx={{ color: "green" }} /> &nbsp; <Typography sx={{ py: 2 }} >{ viewedTour.activity_type.charAt(0).toUpperCase() + viewedTour.activity_type.substring(1) } </Typography>
                    </Grid>
                </Grid>
            <Grid item xs={12} >
            <hr style={{ width: "100%"}} />
            </Grid>

            <Grid item xs={12} sx={{ color:"black", textDecoration: "none",  display:{ md: "flex"}, alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant='h4' sx={{ fontWeight: "bold", textAlign: "start" }}  >
                 Itinerary
                </Typography> 
            { role === "Tour Operator" && loginId === viewedTour.tour_operator._id &&
            <Grid sx={{ display: { xs: "flex", md: "block"}, flexDirection: "column" }} >
                <Chip label="Click the timeline dot to edit the itinerary" color="primary" variant="outlined" />
                <Button onClick={ handleAdd } sx={{ mx: 2, my: { xs: 2, md: 0} }} variant='outlined' color='success' className='add' startIcon={ <Add /> }>Add</Button>

                <AddItinerary open={ add } handleClickClose={ handleClickClose } add={ viewedTour } />

                <Button onClick={ handleDeleteItinerary } sx={{ mx: 2 }} variant='outlined' color='error' className='add' startIcon={ <Delete /> }>Delete</Button>
            </Grid>
            }

                </Grid>


            <Grid item xs={12} sx={{ py: 3 }}  >
                <Itinerary loginId={{ logId: viewedTour.tour_operator._id, viewId: loginId }} role={role} data={ viewedTour.itinerary }/>
                                       
            </Grid>
            
            <Grid item xs={12} sx={{ py: 3 }}  >
            <hr style={{ width: "100%"}} />
            </Grid>

            <Grid item xs={12} sx={{ py: 3 }} >
            <Typography variant='h4' sx={{ fontWeight: "bold", textAlign: "start" }}  >
                 OverView
                </Typography> 
                <br />
                <div dangerouslySetInnerHTML={{ __html: viewedTour.description }} />
            </Grid>

            <Grid item xs={12} sx={{ py: 3 }}  >
            <hr style={{ width: "100%"}} />
            </Grid>

            <Grid item xs={12} sx={{ py: 3 }} >
            <Typography variant='h4' sx={{ fontWeight: "bold", textAlign: "start" }}  >
                 Reviews
                </Typography> 
                <br />
                { reviews.length == 0 ? 
            <Typography variant='h5' sx={{ marginBottom : "30px", color: "red", textAlign: "center" }}>
              No Reviews Found
            </Typography>
            :
                <Grid container xs={12} columnSpacing={{ xs: 0, sm: 0, md: 2, lg: 2}} sx={{display: {md: 'flex'}}} className="cards-item">
              <ReviewCard reviews={reviews} />
             </Grid>
            }
            </Grid>

            <Grid item xs={12} sx={{ py: 3 }}  >
            <hr style={{ width: "100%"}} />
            </Grid>

            <Grid item xs={12} sx={{ py: 3 }} >
            <Typography variant='h4' sx={{ fontWeight: "bold", textAlign: "start" }}  >
                 Cancellation Policy
                </Typography> 
            <Typography variant='h6' sx={{  textAlign: "start" }}  >
            You can cancel up to 24 hours in advance of the experience for a full refund.
                </Typography> 
                <br />

            <Grid item xs={12} md={4} sx={{ py: 3 }}  >
            <Typography variant='body1' sx={{  textAlign: "start" }}  >
                  For a full refund, you must cancel at least 24 hours before the experience’s start time.
                </Typography>
            </Grid>

            <Grid item xs={12} md={4} sx={{ py: 3 }}  >
            <Typography variant='body1' sx={{  textAlign: "start" }}  >
            Any changes made less than 24 hours before the experience’s start time will not be accepted.
                </Typography>
            </Grid>
            </Grid>
            </Grid>
    </>
  )
}

export default ViewTourOrActivity