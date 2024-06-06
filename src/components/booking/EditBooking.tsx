import { Accordion, AccordionDetails, AccordionSummary, Alert, AppBar, Button, Chip, Dialog, Divider, FormControlLabel, FormLabel, Grid, IconButton, InputAdornment, Link, List, ListItemButton, ListItemText, Paper, Radio, RadioGroup, SelectChangeEvent, Slide, TextField, Toolbar, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { TransitionProps } from '@mui/material/transitions';
import { AccessTime, Email, Person, Warning } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import toast from 'react-hot-toast';
import { AddBookingAction, EditBookingAction } from '@/store/booking';
import { loadStripe } from "@stripe/stripe-js";
import Image from 'next/image';

const asyncStripe = loadStripe("pk_test_51PLfemC65sgmj7MooXQ04DFKriQO2SlgDsey1FdFOimcW2KriXIuy3YkTm1r2CxsggiK7hXKdOzxHQ5lghhOUKkl009L7KXt9J");

interface Props {
    book : boolean
    handleClickClose : () => void
    bookingDetails: BookingData
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
  payment_status: Boolean
  status: string
  total_cost: number
}

interface UserData {
  _id: string
  first_name: string
  last_name: string
  email: string
  phone_number: number
}

const defaultUserData = {
  _id: "",
  first_name: "",
  last_name: "",
  email: "",
  phone_number: 0
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const EditBooking = ({ bookingDetails, book, handleClickClose }: Props) => {
    const [value, setValue] = useState("");
    const [isShow, setIsShow] = useState(false)

    const useAppDispatch: any = useDispatch.withTypes<AppDispatch>()
    const useAppSelector = useSelector.withTypes<RootState>()

    const dispatch = useAppDispatch();

    const sessionId : string = useAppSelector(state => state.booking.sessionId )
    const router = useRouter()
    const { register, handleSubmit, reset } = useForm({
    })

    function onSubmit(data:any) {
        // schema.validate(data)
        //     .then(valid => console.log(valid))
        //     .catch(error => console.log(error))
        console.log(data,"Data")
        const { phone_number, email, special_requirements, first_name, time, last_name, pickup_point, payment_mode } = data
        if ( !phone_number || !email  || !time || !pickup_point || !payment_mode){
          toast.error("Please Complete Every Details...")
        } else {
          dispatch(EditBookingAction({
            _id: bookingDetails._id,
            special_requirements, 
            phone_number, 
            email,
            payment_mode,
            pickup_point, 
            date: data.date,
            time,
            no_of_persons: data.no_of_persons,
            total_cost: data.no_of_persons * bookingDetails.tour_and_activity.price 
          }));
          handleClickClose()
        }
    }

    useEffect(() => {
      const stripe = async () => {
        const stripe: any = await asyncStripe;
        await stripe.redirectToCheckout({ sessionId }).then((res: any)=> console.log(res.data, 'res '))
      }
      if ( sessionId ) {
        stripe()
      }
      }, [sessionId, dispatch ])

    const initialValue = ( bookingDetails: BookingData ) => {
        reset({
            first_name: bookingDetails.user.first_name.charAt(0).toUpperCase() + bookingDetails.user.first_name.substring(1,24),
            last_name: bookingDetails.user.last_name.charAt(0).toUpperCase() + bookingDetails.user.last_name.substring(1,24),
            email: bookingDetails.email,
            phone_number: bookingDetails.phone_number,
            pickup_point: bookingDetails.pickup_point,
            time: bookingDetails.time,
            special_requirements: bookingDetails.special_requirements,
            no_of_persons: bookingDetails.no_of_persons,
            date: bookingDate,
            payment_mode: bookingDetails.payment_mode
           })
   }

   const date = new Date(bookingDetails.date);
   const formattedDate = date.toLocaleDateString('en-GB', {
       year: 'numeric' ,
       month: '2-digit',
       day: '2-digit'
    });

    const bookingDate = formattedDate.toString().split("/").reverse().join("-")

   useEffect(() => {
    initialValue(bookingDetails)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookingDetails])

    const handleClickCheck = (event: any) => {
        event.preventDefault()
        setIsShow(true)
    }

  const [expanded, setExpanded] = React.useState<string | false>('panel1');


  const handleAccordChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false);
    };

    useEffect(() => {
        setValue(bookingDetails.payment_mode)
        console.log(bookingDetails, "edit booking")
      }, [bookingDetails ])

      const handleChange = (event: SelectChangeEvent) => {
        setValue(event.target.value as string);
      }

  return (
    <>
        <Dialog
        fullScreen
        open={book}
        onClose={handleClickClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative', bgcolor: "#94bc7b" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClickClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Edit Booking
            </Typography>
            <Button autoFocus color="error" variant='contained' onClick={handleClickClose}>
              Cancel
            </Button>
          </Toolbar>
        </AppBar>

        <Grid container sx={{ py:{ md: 8} }}  columnSpacing={{ xs: 0, sm: 0, md: 2, lg: 2}} className='container'>
            <Grid item xs={12} md={8} >
                <Paper elevation={3} sx={{ borderRadius: "10px", p: 2 }} >
                <div>
        <Accordion defaultExpanded expanded={expanded === 'panel1'} onChange={handleAccordChange('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
           <Grid sx={{ display: 'block'}} >
            <Typography variant='h5' sx={{ fontWeight: "bold", textAlign: "start" }}  >
                 Contact Details
                </Typography>
                <Typography variant='body1' sx={{  textAlign: "start", py: 2 }}  >
                  We&lsquo;ll use this information to send you confirmation and updates about your booking
                </Typography>
           </Grid>
        </AccordionSummary>
        <AccordionDetails>
        <form onSubmit={ handleSubmit(onSubmit) }>
            <Grid container xs={12} >

                <Grid item xs={12} sm={6} sx={{ px: 3 }} >
                    <label htmlFor="first_name" style={{ fontSize: "12px", color: "#808080" }}> First Name *</label>
                    <TextField
                        disabled
                        autoFocus
                        required
                        margin="dense"
                        id="first_name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        {...register("first_name")}
                        
                    />
                </Grid>

                <Grid item xs={12} sm={6} sx={{ px: 3 }} >
                    <label htmlFor="last_name" style={{ fontSize: "12px", color: "#808080" }}> Last Name *</label>
                    <TextField
                        disabled
                        autoFocus
                        required
                        margin="dense"
                        id="last_name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        {...register("last_name")}
                    />
                </Grid>

                <Grid item xs={12} md={6} sx={{ px: 3, mt: 3 }} >
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="email"
                        InputProps={{
                          startAdornment: <InputAdornment
                           position="start"><Email /></InputAdornment>,
                          inputProps: { min: 1 }
                        }}
                        label="Email"
                        fullWidth
                        variant="outlined"
                        {...register("email")}
                    />
                </Grid>
                
                <Grid item xs={12} md={6} sx={{ px: 3, mt: 3 }} >
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="phone_number"
                    label="Contact No"
                    placeholder='xxxxx xxxxx'
                    InputProps={{
                      startAdornment: <InputAdornment
                       position="start">+91</InputAdornment>,
                      inputProps: { min: 1 }
                    }}
                    type="number"
                    fullWidth
                    variant="outlined"
                    { ...register("phone_number") }
                />              
                </Grid>

                </Grid>
        </form>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel2'} onChange={handleAccordChange('panel2')}>
      <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
           <Grid sx={{ display: 'block'}} >
            <Typography variant='h5' sx={{ fontWeight: "bold", textAlign: "start" }}  >
                 Activity Details
                </Typography>
           </Grid>
        </AccordionSummary>
        <AccordionDetails>
            
        <form onSubmit={ handleSubmit(onSubmit) }>
        <Grid container xs={12} >
                <Grid item xs={12} md={6} sx={{ px: 3, mt: 3 }} >
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="date"
                        label="Date"
                        InputProps={{ inputProps: { min: new Date().toJSON().slice(0, 10), max: null } }}
                        type='date'
                        fullWidth
                        variant="outlined"
                        {...register("date")}
                    />
                </Grid>

                <Grid item xs={12} md={6} sx={{ px: 3, mt: 3 }} >
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="no_of_persons"
                        label="No of Persons"
                        InputProps={{ inputProps: { min: 1 } }}
                        type='number'
                        fullWidth
                        variant="outlined"
                        {...register("no_of_persons")}
                    />
                </Grid>
                <Grid item xs={12} md={6} sx={{ px: 3, mt: 3 }} >
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="pickup_point"
                        label="Pickup Point"
                        fullWidth
                        variant="outlined"
                        {...register("pickup_point")}
                    />
                </Grid>

                <Grid item xs={12} md={6} sx={{ px: 3, mt: 3 }} >
                <label htmlFor="review" style={{ color: "#808080", marginBottom: "25px" }}>Pickup Time</label>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="time"
                        type='time'
                        fullWidth
                        variant="standard"
                        {...register("time")}
                    />
                </Grid>
                
                <Grid item xs={12} sx={{ p: 3 }} >
                    <label htmlFor="review" style={{ color: "#808080", marginBottom: "25px" }}>Special Requirements (Optional)</label>
                    <textarea {...register("special_requirements")} style={{ width: "100%", height: "150px", resize: "none", padding: "12px 20px", backgroundColor: "#f8f8f8", border: "0px solid #ccc", borderBottom: "2px solid #ccc"}} id="review"></textarea>
                </Grid>

      { bookingDetails.payment_mode === "card" && bookingDetails.payment_status === true && 
                <Button type='submit' sx={{ m: 3 }} variant="contained" color="success" size='large' >
                        Submit Now
                        </Button>
              }

                </Grid>
        </form>
        </AccordionDetails>
      </Accordion>
      { (bookingDetails.payment_mode !== "card" || bookingDetails.payment_status === false) && 
          <Accordion expanded={expanded === 'panel3'} onChange={handleAccordChange('panel3')}>
          <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Grid sx={{ display: 'block'}} >
                <Typography variant='h5' sx={{ fontWeight: "bold", textAlign: "start" }}  >
                    Payment Details
                    </Typography>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
            <Grid container xs={12}  sx={{ display: "flex", flexDirection: "column" }} >

            <form onSubmit={ handleSubmit(onSubmit) }>
                <Grid >
                  <FormLabel id="demo-row-radio-buttons-group-label" required>Payment Method</FormLabel>
                      <RadioGroup
                      sx={{ display: "flex", flexDirection: "column", p: 3 }}
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        value={value}
                        onChange={handleChange}
                        >
                          <FormControlLabel { ...register("payment_mode")}  id='gender' value="cod" control={<Radio />} label="Cash On site" />
                        <FormControlLabel { ...register("payment_mode")} id='gender'  value="card" control={<Radio />} label="Debit/ Credit Card (Stripe)"/>
                        <FormControlLabel { ...register("payment_mode")} id='gender'  value="upi" control={<Radio />} label="UPI (+91 9876543210)"/>
                      </RadioGroup>
                  </Grid>

                  <Alert icon={<Warning fontSize="inherit" />} severity="warning">
                  If you are using Debit card, Credit card or UPI as payment please keep screenshot while traveling...
                </Alert>
                    
                    <Button type='submit' sx={{ m: 3 }} variant="contained" color="success" size='large' >
                        Submit Now
                        </Button>
            </form>

                    </Grid>
            </AccordionDetails>
          </Accordion>
      }
    </div>
                
                </Paper>
            </Grid>
            <Grid sx={{ position: "sticky" }} item xs={12} md={4} >
            <Paper  elevation={3} sx={{ borderRadius: "10px", p: 3 }} >
            
            <form onSubmit={ handleClickCheck }>
                <Typography variant='h5' sx={{ display: "flex", justifyContent: "center", fontWeight: "bold" }} component="legend" >
                From  ₹  {bookingDetails.tour_and_activity.price}.00 /-
                </Typography>
                <Link  sx={{ display: "flex", justifyContent: "center",  color: "black", pb: 2 }} component="legend" >
                    Lowest Price Guarantee
                </Link>
                   <Image
                      src={bookingDetails.tour_and_activity.highlight}
                      alt="Description of the image"
                      width={500}
                      height={300}
                      layout="responsive"
                    />
                  <Typography variant='h5' sx={{ display: "flex", justifyContent: "center", fontWeight: "bold", pt: 2 }} component="legend" >
                  {bookingDetails.tour_and_activity.destination.charAt(0).toUpperCase() + bookingDetails.tour_and_activity.destination.substring(1)}
                </Typography>

                <Grid item xs={12} sx={{ display: "flex" }} >
                      <Person /> &nbsp;
                  <Typography  component="legend" >
                          {bookingDetails.no_of_persons} Persons
                      </Typography>
                </Grid>

                <Grid item xs={12} sx={{ display: "flex", pt: 2 }} >
                      <AccessTime /> &nbsp;
                  <Typography   component="legend" >
                          {`${new Date(bookingDetails.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}`}
                      </Typography>
                </Grid>

                
                  <Grid item xs={12} sx={{ py: 3 }}  >
                  <hr style={{ width: "100%"}} />
                  </Grid>

                <Grid item xs={12} sx={{ px: 3 }} >
                    <Typography variant='h5' sx={{ display: "flex", justifyContent: "center", fontWeight: "bold" }} component="legend" >
                Total Price :  ₹  {bookingDetails.tour_and_activity.price * bookingDetails.no_of_persons}.00 /-
                </Typography>
                </Grid>

                  <Grid item xs={12} sx={{ py: 3 }}  >
                  <hr style={{ width: "100%"}} />
                  </Grid>
                

                

            </form>

            <Grid item xs={12}  >
                <Chip label="Free cancellation up to 24 hours" color="success" variant="outlined" />
            </Grid>
            </Paper>
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
       
      </Dialog>
    </>
  )
}

export default EditBooking