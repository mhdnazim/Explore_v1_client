'use client'
import ReviewCard from '@/components/home/ReviewCard'
import { AppDispatch, RootState } from '@/store'
import { listReviewAction } from '@/store/review'
import { Visibility } from '@mui/icons-material'
import { Button, Grid, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

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
    title: string,
    coordinates: {
      destination: string}
  }
  rating: number
  review_title: string
  review: string
  createdAt: string
}

const ReviewList = () => {
  
  const router = useRouter()
  const useAppDispatch = useDispatch.withTypes<AppDispatch>()
  const useAppSelector = useSelector.withTypes<RootState>()

  const dispatch = useAppDispatch();
  const reviews: ReviewData[] = useAppSelector(state => state.review.reviewData);
  useEffect(() => {
    dispatch(listReviewAction({ tour_and_activity: ""}))
}, [dispatch])

  return (
    <>
      <Grid id="reviews" sx={{ py: 5 }}>
          <Grid className='container' xs={12}>
             <Typography variant='h3' sx={{ marginBottom : "30px" }}>
                Recent Reviews
            </Typography>
           </Grid>
          <Grid className='container' sx={{ display: "flex" }} xs={12}>
          <Grid container xs={12} columnSpacing={{ xs: 0, sm: 0, md: 2, lg: 2}} sx={{display: {md: 'flex'}, justifyContent: 'center'}} className="cards-item">
              <ReviewCard reviews={reviews} />
             </Grid>
           </Grid>
          </Grid>
    </>
  )
}

export default ReviewList