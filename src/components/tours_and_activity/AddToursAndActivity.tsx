import React, { useEffect, useState } from "react"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import { Chip, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select } from "@mui/material"
import * as yup from 'yup'
import { Controller, useForm } from "react-hook-form"
import { Delete, TravelExplore } from "@mui/icons-material"
import "../../app/globals.css"
import { AppDispatch, RootState } from "@/store"
import { useDispatch, useSelector } from "react-redux"
import { AddTourAction } from "@/store/Tour_And_Activity"
import toast from "react-hot-toast"
import { yupResolver } from "@hookform/resolvers/yup";
import QuillEditor from "react-quill";
import "react-quill/dist/quill.snow.css";
import styles from "./styles.module.css";

interface Props {
    open : boolean
    handleClickClose : () => void
}

interface TourData {
    title: string
    destination: string
    duration: number
    price: number
    availability: number
    activity_type: string
}

interface Itinerary {
    itinerary : string,
    step: number,
}

const schema = yup.object().shape({
    title: yup.string().required('Tour title is required!!'),
    destination: yup.string().required('Destination is required!!'),
    duration: yup.number().required('Duration must be provided'),
    price: yup.number().required('Price is required'),
    availability: yup.number().required('Availability must be provided'),
    activity_type: yup.string().required('Activity must be provided!!'),
    highlight: yup.string().required('Highlight is required!!')
  })

const AddTourAndActivity = ({ open, handleClickClose}: Props) => {
    const [image, setImage] = useState('');
    const [preview, setPreview] = useState("")
    const [inputs, setInputs] = useState([{ step: 1, itinerary: "" }]);
    const [richText, setRichText] = useState("");
    const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });

    const handleAddInput = () => {
        setInputs([...inputs, { step: inputs.length+1, itinerary: "" }]);
      };


    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset
      } = useForm({
        resolver: yupResolver(schema)
      });

    const useAppDispatch: any = useDispatch.withTypes<AppDispatch>()
    const useAppSelector = useSelector.withTypes<RootState>()
    const redirect: boolean = useAppSelector(state => state.tour.redirect);

    const dispatch = useAppDispatch();
    
    const onFormSubmit = async (data:TourData) => {
        if ( image ){
    
          if (coordinates.latitude && coordinates.longitude) {
            data = { ...data };
            console.log(data,"Data")
            console.log(richText,"richText")
            const { title, destination, duration, availability, price, activity_type } = data
    
            const tour_operator = localStorage.getItem('user_Id')
    
            const formData = new FormData()
            formData.append("tour_operator", tour_operator as string)
            formData.append("title", title)
            formData.append("longitude", coordinates.longitude)
            formData.append("latitude", coordinates.latitude)
            formData.append("duration", duration.toString())
            formData.append("destination", destination)
            formData.append("description", richText)
            formData.append("itinerary", JSON.stringify(inputs))
            formData.append("price", price.toString())
            formData.append("availability", availability.toString())
            formData.append("activity_type", activity_type)
            formData.append("highlight", image)
    
    
            dispatch(AddTourAction(formData));
            handleClose()
        } else {
            toast.error("Destination not exist...")
        }
    
        } else {
          toast.error("Please upload the highlight...")
        }
        }

    const handleImageChange = (e:any) => {
        const selectedFile = URL.createObjectURL(e.target.files[0]);
        setPreview(selectedFile);
        const selectedFiles = e.target.files[0];
        setImage(selectedFiles);
      };

      const getCoordinates = async (address: string) => {
        const apiKey = '00af53ef37244c0d89041fd6a11a5daf'; // Replace with your OpenCage API key
        const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`);
        const data = await response.json();
    
        if (data.results.length > 0) {
          toast.success("Destination verified...")
          const { lat, lng } = data.results[0].geometry;
          setCoordinates({ latitude: lat, longitude: lng });
        } else {
          toast.loading("Ensure that the given destination is correct...", {
            duration: 3000,
          })
          console.log('No results found');
        }
      }
    

    const handleClose = () => {
        handleClickClose()
        setPreview("")
            
        setInputs( [{itinerary: "", step: 1 }] );
    }

    const handleDeleteInput = () => {
        const index = -1
        const newArray = [...inputs];
        newArray.splice(index, 1);
        setInputs(newArray);
      };

      const handleChange = (event: any, index: number) => {
        let { name, value } = event.target;
        let onChangeValue : any = [...inputs];
        onChangeValue[index][name] = value;
        setInputs(onChangeValue);
      };

      const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
        "color",
        "clean",
      ];

    return (
        <>
                <Dialog maxWidth="md"
                    open={ open }
                    onClose={ handleClose }>
                    <Grid item sx={{ display: "flex", justifyContent: "space-between"}}>
                        <DialogTitle> <TravelExplore/> Add new Tour/Activity</DialogTitle>
                    </Grid>
                    <Grid className="container">
                    <Grid sx={{ textAlign: "center"}}>
                        {preview && (
                        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center"}}>
                            <img src={preview} alt="Preview" style={{width:"30%"}}/>
                        </Grid>
                        )}
                    </Grid>

                    <DialogContent>
                    <Grid
                        container
                        rowSpacing={1}
                        columnSpacing={{ xs: 1, sm: 2, md: 3 }}>

                    <Grid item xs={12} sm={12}>  
                        <Controller
                            control={control}
                            name="title"
                            rules={{ required: true }}
                            render={({ field: { ref, ...field } }) => (
                            <TextField {...register('title')}
                                autoComplete="given-name"
                                name="title"
                                fullWidth
                                id="title"
                                InputLabelProps={{ shrink: true }}
                                label="Title"
                                autoFocus
                                error={Boolean(errors.title)}
                                {...(errors.title && {helperText:errors.title.message})}
                            />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <label className="highlight" htmlFor="description" style={{ fontSize: "12px", color: "#808080" }}>Description *</label>
                            <QuillEditor
                                className={styles.editor}
                                theme="snow"
                                value={richText}
                                formats={formats}
                                onChange={(richText) => setRichText(richText)}
                            />
                        </Grid>

                    <Grid item xs={12} sm={6}> 
                        <Controller
                            control={control}
                            name="destination"
                            rules={{ required: true }}
                            render={({ field: { ref, ...field } }) => (
                            <TextField {...register('destination')}
                                onBlur={ (e) => getCoordinates(e.target.value)}
                                autoComplete="given-name"
                                name="destination"
                                fullWidth
                                id="destination"
                                InputLabelProps={{ shrink: true }}
                                label="Destination"
                                error={Boolean(errors.destination)}
                                {...(errors.destination && {helperText:errors.destination.message})}
                            />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}> 
                        <Controller
                            control={control}
                            name="duration"
                            rules={{ required: true }}
                            render={({ field: { ref, ...field } }) => (
                            <TextField {...register('duration')}
                                name="duration"
                                type="number"
                                fullWidth
                                id="duration"
                                InputLabelProps={{ shrink: true }}
                                label="Duration"
                                InputProps={{
                                endAdornment: <InputAdornment position="end">Days</InputAdornment>,
                                inputProps: { min: 1 }
                                }}
                                error={Boolean(errors.duration)}
                                {...(errors.duration && {helperText:errors.duration.message})}
                            />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Controller
                            control={control}
                            name="price"
                            rules={{ required: true }}
                            render={({ field: { ref, ...field } }) => (
                            <TextField {...register('price')}
                                name="price"
                                type="number"
                                InputProps={{
                                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                endAdornment: <InputAdornment position="end">/- Only</InputAdornment>,
                                inputProps: { min: 1 }
                                }}
                                fullWidth
                                id="price"
                                InputLabelProps={{ shrink: true }}
                                label="price"
                                error={Boolean(errors.price)}
                                {...(errors.price && {helperText:errors.price.message})}
                            />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}> 
                        <Controller
                            control={control}
                            name="availability"
                            rules={{ required: true }}
                            render={({ field: { ref, ...field } }) => (
                            <TextField {...register('availability')}
                                name="availability"
                                type="number"
                                fullWidth
                                InputProps={{
                                endAdornment: <InputAdornment position="end">Persons</InputAdornment>,
                                inputProps: { min: 1 }
                                }}
                                id="availability"
                                InputLabelProps={{ shrink: true }}
                                label="Availability"
                                error={Boolean(errors.availability)}
                                {...(errors.availability && {helperText:errors.availability.message})}
                            />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>  
                        <Controller
                            control={control}
                            name="activity_type"
                            rules={{ required: true }}
                            render={({ field: { ref, ...field } }) => (
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label" required>Activity Type</InputLabel>
                                <Select
                                    margin="dense"
                                    labelId="demo-simple-select-label"
                                    id="activity_type"
                                    label="Activity Type"
                                    {...register("activity_type")}
                                >
                                    <MenuItem value="Hiking">Hiking</MenuItem>
                                    <MenuItem value="Trekking">Trekking</MenuItem>
                                    <MenuItem value="Adventure">Adventure</MenuItem>
                                    <MenuItem value="Snow Boarding">Snow Boarding</MenuItem>
                                    <MenuItem value="Excursions">Excursions</MenuItem>
                                    <MenuItem value="Cultural tourism">Cultural tourism</MenuItem>
                                    <MenuItem value="Others">Others</MenuItem>
                                </Select>
                                </FormControl>
                            )}
                        />
                        <p style={{ textAlign: "start", color: "#db2f2f", fontSize: "12px", fontWeight: "400px", marginLeft: "10px" }}>{errors.activity_type?.message}</p>
                    </Grid>

                    <Grid item xs={12} sm={6}>  
                    <Controller
                        control={control}
                        name="highlight"
                        rules={{ required: true }}
                        render={({ field: { ref, ...field } }) => (
                            <Grid>
                            <input
                                {...register("highlight")}
                                name="image"
                                accept="image/png,image/jpg,image/jpeg"
                                style={{ display: "none" }}
                                id="image"
                                type="file"
                                onChange={handleImageChange}
                            />
                            <label htmlFor="image">
                                <Button
                                color="success"
                                variant="contained"
                                component="span"
                                fullWidth
                                sx={{ mt: 2, backgroundColor: "#94bc7b", color: "black", fontWeight: "bold" }}
                                >
                                Upload Highlight
                                </Button>
                            </label>
                            </Grid>
                        )}
                        />
                    <p>{errors.highlight?.message}</p>
                    </Grid>

                    <Grid item className="container" xs={12} >
                        {inputs.map((item, index) => (
                            <Grid  key={index}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    margin="dense"
                                    id="itinerary"
                                    label="Itinerary"
                                    onChange={(event) => handleChange(event, index)}
                                    name="itinerary"
                                    type="text"
                                    fullWidth
                                />
                            </Grid>
                            </Grid>
                        ))}
                        {inputs.length > 1 && 
                        (<Chip
                            label="Delete"onClick={() => handleDeleteInput()}
                            deleteIcon={<Delete />}
                        />)
                        }
                        &nbsp; <Chip
                            label="Add"onClick={() => handleAddInput()}
                            deleteIcon={<Delete  />}
                        />
                        </Grid>

                        </Grid>
                    </DialogContent>
                    
                    <DialogActions>
                        
                        <Button color="error" onClick={ handleClose }>Cancel</Button>
                        <Button color="success" onClick={handleSubmit( onFormSubmit )} type="submit">Update</Button>
                    </DialogActions>
            
                    </Grid>
                </Dialog>
        </>
    )
}

export default AddTourAndActivity
