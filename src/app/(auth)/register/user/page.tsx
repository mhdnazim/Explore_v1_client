'use client'
import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { FormControl, FormLabel, IconButton, InputAdornment, InputLabel, OutlinedInput, Radio, RadioGroup } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import * as yup from 'yup'


function Copyright(props: any) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="https://mui.com/">
          Your Website
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }

  interface registerData {
    confirmPassword : string
  }

  const schema = yup.object().shape({
    first_name: yup.string().required("Name cannot be empty"),
    last_name: yup.string().required("Name cannot be empty"),
    gender: yup.string().required("Location cannot be empty"),
    date_of_birth: yup.string().required("Location cannot be empty"),
    email: yup.string().email().required("Email cannot be empty"),
    password: yup.string().required("Password cannot be empty"),
    phone_number: yup.number().required("Phone Number cannot be empty").min(10)
    });
  
  // TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

const UserRegister = () => {

  const [input , setInput] = useState<registerData>({
    confirmPassword : ""
  })

  const router = useRouter()
  
  const [showPassword, setShowPassword] = useState(false);

  const handleNormalInputs = (e:any) => {
    const { name, value } = e.target
    setInput({ ...input, [name]: value })
  }

  const { register , handleSubmit } = useForm({ });

  const onSubmit = async (data: any) => {
    console.log(data, "data")
    schema.validate(data)
          .then(valid => console.log(valid))
          .catch(error => console.log(error))
    if ( input.confirmPassword === data.password) {
      addUser(data)
    }else {
      toast.error(`Password Doesn't Match`)
    }
  }

  const addUser = async (data: any) => {
    const UserRegister = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/user/register`, data).then(res => {
      console.log(res.data , "addUser")
      router.push('/login')})
      .catch(error => {console.log(error , "error")
      if (error.response.status === 422){
        toast.error("Please fill the form correctly...")
      } else if (error.response.status === 406){
        toast.error("Email Already Registered...")
      }
  })
    }

    const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <>
        <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            // backgroundImage: 'url(https://source.unsplash.com/random?explore)',
            backgroundImage: 'url(https://picsum.photos/1200)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
            }}
          >
            <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              User Register
            </Typography>
            </Box>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
            <Grid item xs={12} sx={{ display: "flex", columnGap: "5px"}}>
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="first_name"
                    label="First Name"
                    type="text"
                    fullWidth
                    variant="standard"
                    { ...register("first_name") }
                />
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="last_name"
                    label="Last Name"
                    type="text"
                    fullWidth
                    variant="standard"
                    { ...register("last_name") }
                />
                </Grid>
                <Grid item xs={12} sm={12} sx={{ display: "flex", justifyContent: "space-between", mt: 1}}>
               <Grid>
               <FormLabel id="demo-row-radio-buttons-group-label" required>Gender</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    >
                      <FormControlLabel 
                      { ...register("gender") } id='gender' value="male" control={<Radio />} label="Male" />
                    <FormControlLabel 
                    { ...register("gender") } id='gender'  value="female" control={<Radio />} label="Female"/>
                  </RadioGroup>
               </Grid>
                  <Grid>
                   <label htmlFor="date_of_birth" style={{ fontSize: "12px", color: "#808080" }}>Date of Birth*</label>
                      <TextField
                        autoComplete="given-name"
                        required
                        fullWidth
                        type='date'
                        InputProps={{ inputProps: { max: new Date().toJSON().slice(0, 10), min: null } }}
                        id="date_of_birth"
                        autoFocus
                        variant="standard"
                        { ...register("date_of_birth") }
                      />
                  </Grid>
                </Grid>
            <Grid item xs={12}>
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="email"
                    label="Mail ID"
                    type="email"
                    fullWidth
                    variant="standard"
                    { ...register("email") }
                /></Grid>
            <Grid item xs={12}>
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="phone_number"
                    label="Contact No"
                    placeholder='xxxxx xxxxx'
                    InputProps={{
                      startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                      inputProps: { min: 1 }
                    }}
                    type="number"
                    fullWidth
                    variant="standard"
                    { ...register("phone_number") }
                /></Grid>
                <Grid item xs={12} sx={{ display: "flex", columnGap: "5px"}}>
                <FormControl sx={{ my: 1, width: '100%' }} variant="outlined">
                    <InputLabel htmlFor="password" required >Password</InputLabel>
                      <OutlinedInput
                        id="password"
                              autoComplete="new-password"
                              { ...register("password") }
                        type={ showPassword ? 'text' : 'password' }
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={ handleClickShowPassword }
                              onMouseDown={ handleMouseDownPassword }
                              edge="end"
                            >
                            { showPassword ? <VisibilityOff /> : <Visibility /> }
                            </IconButton>
                          </InputAdornment>
                        }
                        label="Password"
                      />
                </FormControl>
                <FormControl sx={{ my: 1, width: '100%' }} variant="outlined">
                    <InputLabel htmlFor="confirmPassword" required>Confirm Password</InputLabel>
                    <OutlinedInput
                  id="confirmPassword"
                  autoComplete="confirmPassword"
                  name="confirmPassword"
                  onChange={ (e) => { handleNormalInputs(e) }}
                      type={showPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={ handleClickShowPassword }
                            onMouseDown={ handleMouseDownPassword }
                            edge="end"
                          >
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Confirm Password"
                    />
                </FormControl>
              </Grid>
                <Grid item xs={12}>
                
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="/register/touroperator" variant="body2">
                     Register as a Tour Operator.
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/login" variant="body2">
                    {"Have an account? Log in"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
    </>
  )
}

export default UserRegister
