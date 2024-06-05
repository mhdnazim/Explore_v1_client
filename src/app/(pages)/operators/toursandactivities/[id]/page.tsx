'use client'
import DestinationCards from '@/components/home/TourCards'
import AddTourAndActivity from '@/components/tours_and_activity/AddToursAndActivity'
import { AppDispatch, RootState } from '@/store'
import { listTourAction } from '@/store/Tour_And_Activity'
import { AddCircleOutline, Clear, NearMe, Visibility } from '@mui/icons-material'
import { Accordion, AccordionDetails, AccordionSummary, Alert, Button, FormControl, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Select, Slider, Stack, TextField, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRange } from '@mui/x-date-pickers-pro/models';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import axios from 'axios'


function valuetext(value: number) {
  return `${value}°C`;
}

interface Location {
  longitude: number | null;
  latitude: number | null;
  address: string | null;
}

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

interface TourOperator {
  _id: string
  name: string
  location: string
  email: string
  phone_number: number
}

const OperatorPlans = ({params}: {params: { id: string }}) => {
      const [fetchTours, setFetchTours] = useState<TourData[]>(defaultTourData)
      const [open, setOpen] = useState<boolean>(false)
      const [query, setQuery] = useState<string>("")
      const [actType, SetActType] = useState<string>("")
      const [ showNear, setShowNear ] = useState(true)
      const [ isLocation, setIsLocation ] = useState(false)
      const [position, setPosition] = useState<Location>({ latitude: null, longitude: null, address: null });
      const [operator, setOperator] = useState<TourOperator>({
        _id: "",
        name: "",
        location: "",
        email: "",
        phone_number: 0
      })
      const router = useRouter()
      const [minNum, setMinNum] = useState(0);
      const [maxNum, setMaxNum] = useState(99999);
      const minmin = 0;
      const maxmax = 250000;
      const [priceRangeValue, setPriceRangeValue] = useState([0, 99999]);

      const fromDate = new Date()
      const newFromDate = addDays(fromDate, 2);
      const newToDate = addDays(fromDate, 31);
      const [dateRange, setDateRange] = useState<DateRange<any>>([
        dayjs(newFromDate),
        dayjs(newToDate),
      ]);
    
      const [duration, setDuration] = React.useState(0)
    
    
      function addDays(date: Date, days: number) {
        const newDate = new Date(date);
        newDate.setDate(date.getDate() + days);
        return newDate;
        }
    
      useEffect(() => {
        let Difference_In_Time =
        dateRange[1]?.$d.getTime() - dateRange[0]?.$d.getTime();
    
        let Difference_In_Days =
        Math.round
            (Difference_In_Time / (1000 * 3600 * 24));
        
            setDuration(Difference_In_Days)
    
        console.log(duration, "duration")
      }, [dateRange, duration])
      

  const handlePriceRangeChange = (event: any, newValue: any) => {
    setMinNum(newValue[0]);
    setMaxNum(newValue[1]);
    setPriceRangeValue(newValue);
  };

  // console.log(priceRangeValue[0], priceRangeValue[1]);

      const useAppDispatch = useDispatch.withTypes<AppDispatch>()
      const useAppSelector = useSelector.withTypes<RootState>()

      const dispatch = useAppDispatch();
      const store: TourData[] = useAppSelector(state => state.tour.data);
      const redirect: boolean = useAppSelector(state => state.tour.redirect);

      const handleClickOpen = () => {
          setOpen(true)
        }
      const handleClickClose = () => {
          setOpen(false)
      }

    useEffect(() => {
      if (params.id) {
          const storedToken = localStorage.getItem("access_token")
          const findTourOperator = async () => {
          await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/touroperator/find`,  { tour_operator: params.id }  , {
          headers: {Authorization: `Bearer ${storedToken}` } }).then(res=>{
              console.log(res.data.data, "response")
              setOperator(res.data.data)
              })
      }
      findTourOperator()
      }   
      }, [params.id])

      const handleClickLocation = () => {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(async function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
    
            // Fetch address from OpenCage Geocoding API
            const apiKey = '00af53ef37244c0d89041fd6a11a5daf'; // Replace with your OpenCage API key
            const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`);
            const data = await response.json();
            const address = data.results[0].formatted;
    
            setPosition({
              latitude,
              longitude,
              address
            });
          });
          setIsLocation(true)
          setShowNear( showNear === false ? true: false )
        } else {
          console.log("Geolocation is not available in your browser.");
        }
      }

      const handleClickClear = () => {
        setPosition({
          latitude: null,
          longitude: null,
          address: ""
        });
      setIsLocation(false)
      setShowNear( showNear === false ? true: false )
  }

    useEffect(() => {
      dispatch(listTourAction({ search: query, duration, fromPrice: priceRangeValue[0].toString(), toPrice: priceRangeValue[1].toString(), activity_type: actType, tour_operator: params.id, latitude: position.latitude, longitude: position.longitude }));
    }, [dispatch, query, duration, priceRangeValue, redirect, actType, position, params.id ])

    useEffect(() => {
      setFetchTours([...store])
    },[store])

    // useEffect(() => {
    //   console.log(value, "list");
    // },[value])


  return (
    <>
        <Grid id="destination" sx={{ py: 5 }}>
            <Grid className='container' xs={12}>
            { isLocation && 
                  <Alert severity="info">{`Showing tours & activities within 30km of "${position.address}"`} .</Alert>
              }
              <Typography variant='h3' sx={{ marginBottom : "10px" }}>
                  {operator.name.charAt(0).toUpperCase() + operator.name.substring(1)}
              </Typography>
              <Typography variant="body2">
                  <a href={`mailto:${ operator.email }`}>{ operator.email }</a>
                </Typography>
                <Typography variant="body2">
                  <a style={{ color: "green",  marginBottom : "30px" }} href={`tel:${ operator.phone_number }`}>{ operator.phone_number }</a>
                </Typography>
              <Typography variant='h5' sx={{ marginBottom : "30px" }}>
                  Our Top Tour And Activities
              </Typography>
        <AddTourAndActivity open={ open } handleClickClose={ handleClickClose } /> 
            </Grid>
                  <Grid className="filters container"  sx={{ display: "flex", alignItems: "center", flexDirection: {xs: 'column', sm: "row"} }}>
              
              <FormControl
              variant="filled"
              sx={{ m: 1, width: "100%" }}
              >
                      <InputLabel id="demo-simple-select-filled-label">
                          Activity Type
                      </InputLabel>
                      <Select sx={{ backgroundColor: "transparent"}}
                          labelId="demo-simple-select-filled-label"
                          id="demo-simple-select-filled"
                          onChange={(e)=> SetActType(e.target.value)}
                          value={actType}
                      >
                          <MenuItem value="">
                          <em>None</em>
                          </MenuItem>
                          <MenuItem value="Hiking">Hiking</MenuItem>
                            <MenuItem value="Trekking">Trekking</MenuItem>
                            <MenuItem value="Adventure">Adventure</MenuItem>
                            <MenuItem value="Snow Boarding">Snow Boarding</MenuItem>
                            <MenuItem value="Excursions">Excursions</MenuItem>
                            <MenuItem value="Cultural tourism">Cultural tourism</MenuItem>
                            <MenuItem value="Others">Others</MenuItem>
                      </Select>
              </FormControl>
              <TextField
                  required={true}
                  id="outlined-required"
                  name="search"
                  label="Search"
                  sx={{ width: "100%" }}
                  InputProps={{
                  startAdornment: <InputAdornment position="start">
                      <SearchIcon />
                  </InputAdornment>,
                  endAdornment:
                    <InputAdornment position="end">
                      { showNear === true ? <IconButton 
                      sx={{ color: "#2379e3" }}
                        aria-label="toggle password visibility"
                        onClick={handleClickLocation}
                        onMouseDown={handleClickLocation}
                        edge="end"
                      >
                       <NearMe /> <Typography>Nearby</Typography>
                      </IconButton> : <IconButton 
                      sx={{ color: "red" }}
                        aria-label="toggle password visibility"
                        onClick={handleClickClear}
                        onMouseDown={handleClickClear}
                        edge="end"
                      >
                       <Clear /> <Typography>Clear</Typography>
                      </IconButton>}
                    </InputAdornment>
                  }}
                  onChange={(e)=> setQuery(e.target.value)}
                  />
                  </Grid>
          <Grid className='container' >
          <div>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  Filter
                </AccordionSummary>
                <AccordionDetails  sx={{ display: "flex", justifyContent: "space-between"}} >
                  <Grid xs={6} sx={{ botoom: "0px", display: "flex", flexDirection: "column", justifyContent: "end"}} item >
                    <Slider
                      getAriaLabel={() => "Price range"}
                      value={priceRangeValue}
                      onChange={handlePriceRangeChange}
                      valueLabelDisplay="auto"
                      min={minmin}
                      max={maxmax}
                    />
                    <Stack direction="row" justifyContent="space-evenly" alignItems="center">
                      <TextField
                        label="Min"
                        type="number"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                          inputProps: { min: 0 }
                        }}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        sx={{ width: "100%" }}
                        value={minNum}
                        onChange={(e) => {
                          setMinNum(Number(e.target.value));
                          setPriceRangeValue([Number(e.target.value), priceRangeValue[1]]);
                        }}
                      />
                      <Typography>-</Typography>
                      <TextField
                        label="Max"
                        type="number"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                          inputProps: { min: 0 }
                        }}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        sx={{ width: "100%" }}
                        value={maxNum}
                        onChange={(e) => {
                          setMaxNum(Number(e.target.value));
                          setPriceRangeValue([priceRangeValue[0], Number(e.target.value)]);
                        }}
                      />
                    </Stack>
                    </Grid>
                  <Grid xs={6} item  >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DateRangePicker', 'DateRangePicker']}>
                      <DemoItem label="Select Date Range" component="DateRangePicker">
                        <DateRangePicker
                          defaultValue={[dayjs(newFromDate), dayjs(newToDate)]}
                          onChange={(newValue) => setDateRange(newValue)}
                        />
                      </DemoItem>
                    </DemoContainer>
                  </LocalizationProvider>
                    </Grid>
                </AccordionDetails>
              </Accordion>
           </div>

          </Grid>
          { fetchTours.length == 0 ? 
            <Typography variant='h5' sx={{ marginBottom : "30px", color: "red", textAlign: "center" }}>
              No Trips Found
            </Typography>
        : 
          <Grid className='container' sx={{ display: "flex" }} xs={12}>
          <Grid container xs={12} columnSpacing={{ xs: 0, sm: 0, md: 2, lg: 2}} sx={{display: {md: 'flex'}, justifyContent: 'center'}} className="cards-item">
          <DestinationCards fetchTours={fetchTours} />
            </Grid>
           </Grid>
        }
          </Grid>
    </>
  )
}

export default OperatorPlans