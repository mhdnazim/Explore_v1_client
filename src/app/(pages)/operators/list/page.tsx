'use client'
import OperatorCard from '@/components/home/OperatorCard'
import { AppDispatch, RootState } from '@/store'
import { listOperatorAction } from '@/store/TourOperator'
import { Clear, NearMe, Visibility } from '@mui/icons-material'
import { Alert, Button, FormControl, Grid, IconButton, InputAdornment, InputLabel, TextField, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch, useSelector } from 'react-redux'

interface Location {
  longitude: number | null;
  latitude: number | null;
  address: string | null;
}

interface TourOperator {
  _id: string
  name: string
  location: string
  email: string
  phone_number: number
}

const TourOperatorsList = () => {
  const router = useRouter()
  const [ showNear, setShowNear ] = useState(true)
  const [query, setQuery] = useState<string>("")
  const [position, setPosition] = useState<Location>({ latitude: null, longitude: null, address: null });
  const [ isLocation, setIsLocation ] = useState(false)
  const useAppDispatch = useDispatch.withTypes<AppDispatch>()
  const useAppSelector = useSelector.withTypes<RootState>()

  const dispatch = useAppDispatch();
  const operators: TourOperator[] = useAppSelector(state => state.tourOperator.data);

  useEffect(() => {
    dispatch(listOperatorAction({ search: query, latitude: position.latitude, longitude: position.longitude }))
}, [dispatch, query, position])

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
  console.log(query, "query")
  console.log(position, "position")
}, [query, position])


  return (
    <>
        <Grid id="operator" sx={{ py: 5 }}>
          <Grid className='container' xs={12}>
            { isLocation && 
                  <Alert severity="info">{`Showing tours & activities within 30km of "${position.address}"`} .</Alert>
              }
             <Typography variant='h3' sx={{ marginBottom : "30px" }}>
                Our Tour Operators
            </Typography>
            <Grid className="filters container"  sx={{ display: "flex", alignItems: "center", flexDirection: {xs: 'column', sm: "row"} }}>
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
           </Grid>
          <Grid className='container' sx={{ display: "flex" }} xs={12}>
          { operators.length == 0 ? 
            <Typography variant='h5' sx={{ my: 3, color: "red", textAlign: "center" }}>
              No operator or agency Found
            </Typography>
        :  
          <Grid container xs={12} columnSpacing={{ xs: 0, sm: 0, md: 2, lg: 2}} sx={{display: {md: 'flex'}, justifyContent: 'center'}} className="cards-item">
              <OperatorCard operators={operators} />
             </Grid>
        }
           </Grid>
          </Grid>
    </>
  )
}

export default TourOperatorsList