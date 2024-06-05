'use client'
import MyTours from '@/components/home/MyTourCard'
import DestinationCards from '@/components/home/TourCards'
import AddTourAndActivity from '@/components/tours_and_activity/AddToursAndActivity'
import { AppDispatch, RootState } from '@/store'
import { listTourAction, myToursAction } from '@/store/Tour_And_Activity'
import { AddCircleOutline, Visibility } from '@mui/icons-material'
import { Button, Grid, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'


interface TourData {
  _id: string,
  tour_operator: {
      name: string
  }
  title: string,
  destination: string
  duration: number,
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
  tour_operator: {
    name: ""
  },
  duration: 0,
  itinerary: 0,
  price: 0,
  availability: 0,
  activity_type: "",
  highlight: "",
  isDeleted: true,
  createdAt: "",
  updatedAt: ""
}]

const MyToursList = () => {
      const [fetchTours, setFetchTours] = useState<TourData[]>(defaultTourData)
      const [getRole, setGetRole] = useState<string | null>("")
      const [open, setOpen] = useState<boolean>(false)
      const router = useRouter()

      const useAppDispatch = useDispatch.withTypes<AppDispatch>()
      const useAppSelector = useSelector.withTypes<RootState>()

      const dispatch = useAppDispatch();
      const store: TourData[] = useAppSelector(state => state.tour.myTours);
      const redirect: boolean = useAppSelector(state => state.tour.redirect);

      const handleClickOpen = () => {
          setOpen(true)
        }
      const handleClickClose = () => {
          setOpen(false)
      }

      useEffect(() => {
        if (typeof window !== 'undefined') {
        const user_id = localStorage.getItem('user_Id');
        const user_role = localStorage.getItem('role');
        setGetRole(user_role)
        if (user_id && user_role) {
          dispatch(myToursAction({ tour_operator: user_id }));
        }
      }
        // const user_id = localStorage.getItem('user_Id')
        // const user_role = localStorage.getItem('role')
        // // dispatch(listTourAction({}));
        // dispatch(myToursAction({ tour_operator: user_id}));
    }, [dispatch, getRole, redirect])

    useEffect(() => {
      setFetchTours([...store])
    },[store])

    useEffect(() => {
      console.log(fetchTours, "list");
    },[fetchTours])



  return (
    <>
        <Grid id="destination" sx={{ py: 5 }}>
            <Grid className='container' xs={12}>
              <Typography variant='h3' sx={{ marginBottom : "30px" }}>
                  My Tours and Activity
              </Typography>
              <Button onClick={ handleClickOpen } sx={{ mb: 5 }} variant='outlined' color='success' className='add' startIcon={ <AddCircleOutline /> }>Add</Button>
        <AddTourAndActivity open={ open } handleClickClose={ handleClickClose } /> 
            </Grid>
          { fetchTours.length == 0 ? 
            <Typography variant='h5' sx={{ marginBottom : "30px", color: "red", textAlign: "center" }}>
              No Trips Found
            </Typography>
        : 
              <Grid className='container' sx={{ display: "flex" }} xs={12}>
          <Grid container xs={12} columnSpacing={{ xs: 0, sm: 0, md: 2, lg: 2}} sx={{display: {md: 'flex'}, justifyContent: 'center'}} className="cards-item">
          <MyTours fetchTours={fetchTours} />
            </Grid>
           </Grid>
        }
          </Grid>
    </>
  )
}

export default MyToursList