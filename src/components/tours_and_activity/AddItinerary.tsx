import React, { useEffect, useState } from "react"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import { Grid } from "@mui/material"
import * as yup from 'yup'
import { Controller, useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store"
import { AddReviewAction, editReviewAction, viewReviewAction } from "@/store/review"
import toast from "react-hot-toast"
import { AddItineraryAction, EditItineraryAction } from "@/store/Tour_And_Activity"
import { yupResolver } from "@hookform/resolvers/yup"

interface Props {
    add : any
    open : boolean
    handleClickClose : () => void,
    
}

const schema = yup.object().shape({
    message: yup.string().required('Itinerary is required!!')
})

const AddItinerary = ({ open, handleClickClose, add }: Props) => {

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset
    } = useForm({
    resolver: yupResolver(schema)
    });

    const useAppDispatch = useDispatch.withTypes<AppDispatch>()
    const useAppSelector = useSelector.withTypes<RootState>()

    const dispatch = useAppDispatch();

    function onSubmit(data:any) {
        data = {...data, _id: add._id }
        dispatch(AddItineraryAction( data ))
        handleClose()
    }

    const handleClose = () => {
        handleClickClose()
        reset({
            message: ""
           })
    }
    


    return (
        <>
                <Dialog
                    fullWidth
                    maxWidth="xs"
                    open={open}
                    onClose={handleClose}>
                    <DialogTitle>Add Itinerary
                    </DialogTitle>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <DialogContent>
                            <Grid
                                container
                                rowSpacing={1}
                                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                            >
                                <Grid item xs={12}>
                                     <Controller
                                        control={control}
                                        name="message"
                                        rules={{ required: true }}
                                        render={({ field: { ref, ...field } }) => (
                                        <textarea style={{ width: "100%", height: "150px", resize: "none", padding: "12px 20px", backgroundColor: "#f8f8f8", border: "0px solid #ccc", borderBottom: "2px solid #ccc"}} id="message" {...register("message")}></textarea>
                                        )}
                                    />
                                    <p style={{ textAlign: "start", color: "#db2f2f", fontSize: "12px", fontWeight: "400px", marginLeft: "10px" }}>{errors.message?.message}</p>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button color="error" onClick={handleClose}>Cancel</Button>
                            <Button color="success" type="submit" >Add</Button>
                        </DialogActions>
                    </form>
                </Dialog>
                
        </>
    )
}

export default AddItinerary