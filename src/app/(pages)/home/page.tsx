'use client'
import Carousal from '@/components/home/Carousal'
import MyTours from '@/components/home/MyTourCard'
import OperatorCard from '@/components/home/OperatorCard'
import ReviewCard from '@/components/home/ReviewCard'
import DestinationCards from '@/components/home/TourCards'
import { AppDispatch, RootState } from '@/store'
import { listOperatorAction } from '@/store/TourOperator'
import { listTourAction, myToursAction } from '@/store/Tour_And_Activity'
import { listReviewAction } from '@/store/review'
import { AddCircleOutline, Visibility } from '@mui/icons-material'
import { Box, Button, Grid, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { string } from 'yup'

interface TourData {
  _id: string,
  title: string,
  destination: string,
  duration: number,
  tour_operator: {
    name: string
  }
  itinerary: number,
  price: number,
  availability: number,
  activity_type: string,
  highlight: string,
  isDeleted: Boolean,
  createdAt: string,
  updatedAt: string
}[]

const defaultTourData = [{
  _id: "",
  title: "",
  destination: "",
  duration: 0,
  tour_operator: {
    name: ""
  },
  itinerary: 0,
  price: 0,
  availability: 0,
  activity_type: "",
  highlight: "",
  isDeleted: true,
  createdAt: "",
  updatedAt: ""
}]


interface TourOperator {
  _id: string
  name: string
  location: string
  email: string
  phone_number: number
}

const Home = () => {
  const [fetchTours, setFetchTours] = useState<TourData[]>(defaultTourData)
  const [myTours, setMyTours] = useState<TourData[]>(defaultTourData)
  const [getRole, setGetRole] = useState<string | null>("")
  const router = useRouter()
  const useAppDispatch = useDispatch.withTypes<AppDispatch>()
  const useAppSelector = useSelector.withTypes<RootState>()

  const dispatch = useAppDispatch();
  const store: TourData[] = useAppSelector(state => state.tour.data);
  const myAllTour: TourData[] = useAppSelector(state => state.tour.myTours);
  // const reviews: ReviewData[] = useAppSelector(state => state.review.reviewData);
  const operators: TourOperator[] = useAppSelector(state => state.tourOperator.data);

  useEffect(() => {
    const user_id = localStorage.getItem('user_Id')
    const user_role = localStorage.getItem('role')
    setGetRole(user_role)
    dispatch(listTourAction({ search: "", duration: "", fromPrice: "", toPrice: "", activity_type: "", tour_operator: "", longitude: "", latitude: "" }));
    dispatch(myToursAction({ tour_operator: user_id}));
    dispatch(listReviewAction({ tour_and_activity: "" }))
    dispatch(listOperatorAction({ search: "", latitude: "", longitude: "" }))
}, [dispatch, getRole])

useEffect(() => {
  setFetchTours([...store])
  setMyTours([...myAllTour])
},[store, myAllTour])

// useEffect(() => {
//   console.log(operators, "list");
// },[operators])

  return (
    <>
      <Box>
          <Grid>
              <Carousal />
          </Grid>

          { getRole === "Tour Operator" && (
          <Grid id="my tours" sx={{ py: 5 }}>
            <Grid className='container' xs={12}>
              <Typography variant='h3' sx={{ marginBottom : "30px" }}>
                  My Tours/Activities
              </Typography>
              <Button  onClick={() => {router.push('/toursandactivity/mytours')}}  sx={{ mb: 5 }} variant='outlined' color='primary' className='add' startIcon={ <Visibility /> }>view More</Button> 
            </Grid>
            { myTours.length == 0 ? 
            <Typography variant='h5' sx={{ marginBottom : "30px", color: "red", textAlign: "center" }}>
              No Trips Found
            </Typography>
        : 
            <Grid className='container' sx={{ display: "flex" }} xs={12}>
              <Grid container xs={12} columnSpacing={{ xs: 0, sm: 0, md: 2, lg: 2}} sx={{display: {md: 'flex'}, justifyContent: 'center'}} className="cards-item">
                <MyTours fetchTours={myTours.slice(myTours.length-3)} />
              </Grid>
           </Grid>
            }
            </Grid>
          ) }
          

          <Grid id="destination" sx={{ py: 5 }}>
            <Grid className='container' xs={12}>
              <Typography variant='h3' sx={{ marginBottom : "30px" }}>
                  Top Tour And Activities
              </Typography>
              <Button  onClick={() => {router.push('/toursandactivity/list')}}  sx={{ mb: 5 }} variant='outlined' color='primary' className='add' startIcon={ <Visibility /> }>view All</Button> 
            </Grid>
          <Grid className='container' sx={{ display: "flex" }} xs={12}>
          <Grid container xs={12} columnSpacing={{ xs: 0, sm: 0, md: 2, lg: 2}} sx={{display: {md: 'flex'}, justifyContent: 'center'}} className="cards-item">
              <DestinationCards fetchTours={fetchTours.slice(fetchTours.length-3)} />
             </Grid>
           </Grid>
          </Grid>

          <Grid id="operator" sx={{ py: 5 }}>
          <Grid className='container' xs={12}>
             <Typography variant='h3' sx={{ marginBottom : "30px" }}>
                Top Tour Operators
            </Typography>
              <Button onClick={() => {router.push('/operators/list')}} sx={{ mb: 5 }} variant='outlined' color='primary' className='add' startIcon={ <Visibility /> }>view All</Button> 
           </Grid>
          <Grid className='container' sx={{ display: "flex" }} xs={12}>
          <Grid container xs={12} columnSpacing={{ xs: 0, sm: 0, md: 2, lg: 2}} sx={{display: {md: 'flex'}, justifyContent: 'center'}} className="cards-item">
              <OperatorCard operators={operators.slice(operators.length-2)} />
             </Grid>
           </Grid>
          </Grid>
      </Box>
    </>
  )
}

export default Home