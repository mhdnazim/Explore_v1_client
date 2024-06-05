import { LocationOn, LockClock } from '@mui/icons-material'
import { Box, Card, CardActionArea, CardContent, CardMedia, Grid, Rating, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import React from 'react'

interface TourData {
  _id: string,
  title: string,
  destination: string
  tour_operator: {
    name: string
  }
  duration: number,
  itinerary: number,
  price: number,
  availability: number,
  activity_type: string,
  highlight: string,
  isDeleted: Boolean,
  createdAt: string,
  updatedAt: string
}

interface Props {
  fetchTours : TourData[]
}

const MyTours = ({ fetchTours }: Props) => {
  const router = useRouter()
  
  const handleView = (tours: TourData ) => {
    const id = tours._id
    router.push(`/toursandactivity/view/${id}`)
}


  return (
    <>
    {fetchTours.map((tours)  =>  {
      return(
      <Grid key={tours._id} item xs={12} sm={12} md={6} lg={4} sx={{ my: 2 }} className='cards' >
            <Card onClick={() => {handleView(tours)}} sx={{ maxWidth: "auto", borderRadius: "30px" }} >
                          <CardActionArea  >
                              <CardMedia
                              className='not'
                              component="img"
                              height="250px"
                              image={tours.highlight}
                              alt="Destination image"
                              />
                              <CardContent> 
                              <Typography
                                  className='not'
                                  gutterBottom
                                  variant="h5"
                                  title={tours.title} >
                                    {tours.title.charAt(0).toUpperCase() + tours.title.substring(1,24)}...
                              </Typography>
                              <Typography sx={{ display: "flex", justifyContent: "center" }} component="legend" >
                                <LocationOn /> 
                                    {tours.destination.charAt(0).toUpperCase() + tours.destination.substring(1,24)}
                              </Typography>
                              <Typography sx={{ display: "flex", justifyContent: "center" }} variant="body2" >
                                <LockClock/>
                                    {tours.duration} Days
                              </Typography>
                                  {/* <Rating value={5} name="read-only"  readOnly /> */}
                              <Typography variant='h5' sx={{ display: "flex", justifyContent: "center", color: "green" }} component="legend" >
                              ₹  {tours.price} /-
                              </Typography>
                              </CardContent>
                          </CardActionArea>
                      </Card>
                    </Grid>
                  )
                })}
    </>
  )
}

export default MyTours