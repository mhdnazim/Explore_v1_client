import React, { useContext, useEffect, useState } from "react"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import { Avatar, Chip, Grid, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material"
import * as yup from 'yup'
import axios from "axios"
import { useForm } from "react-hook-form"
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import { AccessAlarm, Contacts, Email, LocalPhone, LocationOn, Payment, Person, Tour } from "@mui/icons-material"
import Image from "next/image"

interface Props {
    bookingDetails : BookingData
    open : boolean
    handleClickClose : () => void
}

interface BookingData {
    _id: string
    user: {
        first_name: string
        last_name: string
    }
    tour_operator: {
        _id: string
    }
    tour_and_activity: {
        _id: string
        title: string
        destination: string
        highlight: string
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


const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    author: yup.string().required(),
    genre: yup.string().required(),
    star_rating: yup.number().required(),
    published: yup.string().required(),
    price: yup.number().required(),
    language: yup.string().required()
})
const ViewBooking = ({ open, handleClickClose, bookingDetails }: Props) => {
 

    const handleClose = () => {
        handleClickClose()}


    return (
        <>
                <Dialog
                    open={open}
                    onClose={handleClose}>
                    <Grid item sx={{ display: "flex", justifyContent: "space-between"}}>
                        <DialogTitle>Booking Details 
                        </DialogTitle>
                    </Grid>
                    <DialogContent>
                    <Grid sx={{ display: "flex", justifyContent: "center", my: 2 }} >
                        <Chip label={bookingDetails.status} color={ bookingDetails.status === "cancelled" ? "error" : bookingDetails.status === "pending" ? "warning" : bookingDetails.status === "approved" ? "primary" : "success"} />
                    </Grid>
                    <Grid sx={{ textAlign: "center"}}>
                        <Image
                            src={bookingDetails.tour_and_activity.highlight}
                            alt="Description of the image"
                            width={500}
                            height={300}
                            layout="responsive"
                            />
                    </Grid>
                    <List sx={{ width: '100%', bgcolor: 'background.paper', }}>
                    <Grid container >
                        <Grid md={6} >
                        <ListItem  >
                            <ListItemAvatar>
                            <Avatar>
                                <Person />
                            </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={`${bookingDetails.user.first_name.charAt(0).toUpperCase() + bookingDetails.user.first_name.substring(1)} ${bookingDetails.user.last_name.charAt(0).toUpperCase() + bookingDetails.user.last_name.substring(1)}`} secondary="Male" />
                        </ListItem>
                        </Grid>
                        <Grid md={6} >
                        <ListItem>
                            <ListItemAvatar>
                            <Avatar>
                                <Tour />
                            </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={`${bookingDetails.tour_and_activity.title.charAt(0).toUpperCase() + bookingDetails.tour_and_activity.title.substring(1, 15)}...`} secondary={bookingDetails.tour_and_activity.destination.charAt(0).toUpperCase() + bookingDetails.tour_and_activity.destination.substring(1)} />
                        </ListItem>
                        </Grid>
                        <Grid md={6} >
                        <ListItem>
                            <ListItemAvatar>
                            <Avatar>
                                <LocationOn />
                            </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={bookingDetails.pickup_point} secondary={`${bookingDetails.no_of_persons} Persons`} />
                        </ListItem>
                        </Grid>
                        <Grid md={6} >
                        <ListItem>
                            <ListItemAvatar>
                            <Avatar>
                                <AccessAlarm />
                            </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={`${new Date(bookingDetails.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}`} secondary={bookingDetails.time} />
                        </ListItem>
                        </Grid>
                        <Grid md={6} >
                        <ListItem>
                            <ListItemAvatar>
                            <Avatar>
                                <Payment />
                            </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={ bookingDetails.payment_mode === "card" ? "Debit / Credit card": bookingDetails.payment_mode === "cod" ? "Cash On Trip" : "UPI payment" } secondary={ bookingDetails.payment_status ? 
                                <Chip label="Paid" color="success" size="small" /> : 
                                <Chip label="Not Paid" color="error" size="small" /> } />
                        </ListItem>
                        </Grid>
                        <Grid md={12} >
                        <ListItem>
                            <ListItemAvatar>
                            <Avatar>
                                <Contacts />
                            </Avatar>
                            </ListItemAvatar>
                            <Grid item xs={12} sx={{ color:"black", textDecoration: "none",  display: "flex", alignItems: "center" }}>
                            <Email sx={{ color: "green" }} /> &nbsp; 
                            <a href={`mailto:${ bookingDetails.email }`}>{ bookingDetails.email }</a>
                            </Grid> 
                            <Grid item xs={12}  style={{ color:"black", textDecoration: "none",  display: "flex", alignItems: "center" }}>
                            <LocalPhone sx={{ color: "green" }} /> &nbsp; 
                            <a style={{ color: "green"}} href={`tel:${ bookingDetails.phone_number }`}>{ bookingDetails.phone_number }</a>
                            </Grid>
                        </ListItem>
                        </Grid>
                            <Grid item xs={12} sx={{ py: 3 }} >
                            <Typography variant='h6' sx={{ fontWeight: "bold", textAlign: "start" }}  >
                                Special Requirement
                                </Typography> 
                                <br />
                                <div dangerouslySetInnerHTML={{__html: bookingDetails.special_requirements }} />
                            </Grid>
                        </Grid>
                        </List>
                    </DialogContent>
                    <DialogActions>
                            <Button color="error" onClick={handleClose}>Close</Button>
                    </DialogActions>
                </Dialog>
        </>
    )
}

export default ViewBooking