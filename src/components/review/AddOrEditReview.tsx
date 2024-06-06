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
import { yupResolver } from "@hookform/resolvers/yup"

interface Props {
    bookingDetails : BookingData
    open : boolean
    handleClickClose : () => void,
}

const schema = yup.object().shape({
    rating: yup.number().required('Rating is required!!'),
    review_title: yup.string().required('Review Title is required!!'),
    review: yup.string().required('Review is required!!')
})

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

  interface reviewData {
    _id: string
    rating: number
    review: string
    review_title: string
    reviewer: {
        _id: string
        first_name: string
        last_name: string
    }
    tour_and_activity: {
        _id: string
        title: string
        destination: string
    }
    tour_operator: {
        _id: string
        name: string
        location: string
    }
  }

const AddOrEditReview = ({ open, handleClickClose, bookingDetails}: Props) => {
    const [value, setValue] = useState<boolean>(false)

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
    
    const preReview: any = useAppSelector(state => state.review.viewReview);

    function onSubmit(data:any) {
        schema.validate(data)
            .then(valid => console.log(valid))
            .catch(error => console.log(error))
            data = {...data, reviewer: bookingDetails.user, tour_operator: bookingDetails.tour_operator._id, tour_and_activity: bookingDetails.tour_and_activity._id }
            console.log(data, "data");
        if ( preReview ){
            dispatch(editReviewAction({ _id: preReview._id, rating: data.rating, review_title: data.review_title, review: data.review }))
        } else {
            dispatch(AddReviewAction(data))
        }
        handleClose()
        setValue(true)
    }

    const initialValue = (preReview: reviewData) => {
        reset({
            rating: preReview.rating,
            review_title: preReview.review_title,
            review: preReview.review
           })
   }

    const handleClose = () => {
        handleClickClose()
    }

    useEffect(() => {
        if ( open === true ){
            dispatch(viewReviewAction({ reviewer: bookingDetails.user._id, tour_and_activity: bookingDetails.tour_and_activity._id }));
        }
    }, [dispatch, open, bookingDetails])
    
    useEffect(() => {
        if ( preReview ){
            if ( Object.keys(preReview).length !== 0 && preReview.tour_and_activity._id === bookingDetails.tour_and_activity._id ){
                initialValue(preReview)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [preReview])
    


    return (
        <>
                <Dialog
                    fullWidth
                    open={open}
                    onClose={handleClose}>
                    <DialogTitle>
                        { preReview ? "Edit your review..."
                        : "Add your review..." }
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
                                        name="rating"
                                        rules={{ required: true }}
                                        render={({ field: { ref, ...field } }) => (
                                        <TextField {...register('rating')}
                                            name="rating"
                                            type="number"
                                            fullWidth
                                            InputProps={{ inputProps: { max: 5, min: 1 } }}
                                            id="availability"
                                            variant="standard"
                                            InputLabelProps={{ shrink: true }}
                                            label="Rating"
                                            error={Boolean(errors.rating)}
                                            {...(errors.rating && {helperText:errors.rating.message})}
                                        />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Controller
                                        control={control}
                                        name="rating"
                                        rules={{ required: true }}
                                        render={({ field: { ref, ...field } }) => (
                                        <TextField {...register('review_title')}
                                            name="review_title"
                                            fullWidth
                                            InputProps={{ inputProps: { max: 5, min: 1 } }}
                                            id="review_title"
                                            variant="standard"
                                            InputLabelProps={{ shrink: true }}
                                            label="Title"
                                            error={Boolean(errors.review_title)}
                                            {...(errors.review_title && {helperText:errors.review_title.message})}
                                        />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                <Controller
                                        control={control}
                                        name="review"
                                        rules={{ required: true }}
                                        render={({ field: { ref, ...field } }) => (
                                        <textarea style={{ width: "100%", height: "150px", resize: "none", padding: "12px 20px", backgroundColor: "#f8f8f8", border: "0px solid #ccc", borderBottom: "2px solid #ccc"}} id="message" {...register("review")}></textarea>
                                        )}
                                    />
                                    <p style={{ textAlign: "start", color: "#db2f2f", fontSize: "12px", fontWeight: "400px", marginLeft: "10px" }}>{errors.review?.message}</p>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button color="error" onClick={handleClose}>Cancel</Button>
                            {preReview ? 
                            <Button color="primary" type="submit" >Edit</Button>
                            :
                            <Button color="success" type="submit">Add</Button>
                            }
                        </DialogActions>
                    </form>
                </Dialog>
                
        </>
    )
}

export default AddOrEditReview