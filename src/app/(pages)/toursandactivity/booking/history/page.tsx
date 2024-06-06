'use client'
import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Chip, Grid } from '@mui/material';
import { AddComment } from '@mui/icons-material';
import ListTourCard from '@/components/booking/ListTour';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { listBookingAction } from '@/store/booking';
import { io } from 'socket.io-client';

interface BookingData {
  _id: string
  user: {
    _id: string
    first_name: string
    last_name: string
  },
  tour_operator: {
    _id: string
  },
  tour_and_activity: {
    _id: string
    title: string
    highlight: string
    destination: string
    price: number
  }
  phone_number: number
  email: string,
  pickup_point: string
  special_requirements: string
  date: Date
  time: string
  no_of_persons: number
  payment_mode: string
  payment_status: boolean
  total_cost: number
  status: string
}

const defaultBookingData = [{
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
}]

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}


const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const socket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}`);

const MyBookings = () => {
  const [expanded, setExpanded] = useState(false);
  const [fetchBookings, setFetchBookings] = useState<BookingData[]>(defaultBookingData)

  const useAppDispatch = useDispatch.withTypes<AppDispatch>()
  const useAppSelector = useSelector.withTypes<RootState>()
  
  const dispatch = useAppDispatch();
  const store: BookingData[] = useAppSelector(state => state.booking.data);
  const redirect: boolean = useAppSelector(state => state.booking.redirect);

  useEffect(() => {
    const user = localStorage.getItem('user_Id')
    dispatch(listBookingAction({user}));
}, [dispatch, redirect])

useEffect(() => {
  socket.on('sendMessage', (message) => {
    const user = localStorage.getItem('user_Id')
    dispatch(listBookingAction({user}));
  });
  socket.on('connection', () => {
    console.log('Connected to server');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });
}, [ store, dispatch ]);


useEffect(() => {
  setFetchBookings([...store])
},[store])




  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return (
    <>
      <Grid id="my tours" sx={{ py: 5 }}>
            <Grid className='container' xs={12}>
              <Typography variant='h3' sx={{ marginBottom : "30px" }}>
                  My Bookings
              </Typography>
            </Grid>
            { fetchBookings.length == 0 ? 
            <Typography variant='h5' sx={{ marginBottom : "30px", color: "red", textAlign: "center" }}>
              No Bookings Found
            </Typography>
        : 
              <Grid className='container' sx={{ display: "flex" }} xs={12}>
              <Grid container xs={12} columnSpacing={{ xs: 0, sm: 0, md: 2, lg: 2}} sx={{display: { md: 'flex'}, justifyContent: 'center' }} className="cards-item">
                <ListTourCard fetchBookings={fetchBookings} />
              </Grid>
           </Grid>
        }
          </Grid>
    </>
  )
}

export default MyBookings