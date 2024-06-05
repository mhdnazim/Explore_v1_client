'use client'
import React, { useEffect, useState } from 'react'
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { Call, ContactSupport, HelpCenter, Home, Info, KeyboardArrowDown, LocationOn, Login, Logout, Map, Person, Security, Star, Work } from '@mui/icons-material';
import { Avatar, Box, Grid, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { useRouter } from 'next/navigation';

function Copyright() {
    return (
      <Typography variant="body2" color="text.secondary">
        {'Copyright © '}
        <Link color="inherit" href="/">
          Explorer.com
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }
  

const Footer = () => {

  const [isLogged, setIsLogged] = useState<null | string>(null);
  const router = useRouter()

  const handleLogin = () => {
    window.localStorage.removeItem('access_token')
    window.localStorage.removeItem('user_Id')
    window.localStorage.removeItem('role')
    router.push('/login')
  }

  const handleLog = () => {
    router.push('/login')
  }


  useEffect(() => {
    const storedToken = localStorage.getItem('access_token')
    setIsLogged(storedToken)
  }, [isLogged])
  


  return (
    <>
      <Box sx={{ backgroundColor: "#94bc7b", padding: "50px 0px"}}>
      <Grid container
            className='container'
            component="footer"
            sx={{ width: "80%", }}>
                <Grid xs={12} sx={{ py: 2 }}>
                    <Link href="/home" style={{ color: "black", textDecoration: "none"}}>
                        <img src="/favicon.png" alt="icon" width={100} style={{ backgroundColor: "black", borderRadius: "50%"}} />
                        <Typography variant='h4' sx={{ fontWeight: "bold", fontStyle: "italic"}}>Explorer</Typography>
                    </Link>
                </Grid>
                <Grid xs={6} md={3} >
                    <Link className='footer' href="/home" style={{ color:"black", textDecoration: "none",  display: "flex", alignItems: "center" }}>
                        <Home /> <Typography sx={{ py: 2 }} >Home</Typography>
                    </Link>
                    <Link className='footer' href="/home" style={{ color:"black", textDecoration: "none",  display: "flex", alignItems: "center" }}>
                    <HelpCenter /> <Typography sx={{ py: 2 }} >Help Center</Typography>
                </Link>
                <Link className='footer' href="/home" style={{ color:"black", textDecoration: "none",  display: "flex", alignItems: "center" }}>
                    <ContactSupport /> <Typography sx={{ py: 2 }} >Support</Typography>
                </Link>
                </Grid>

            <Grid xs={6} md={3} >
                <Link className='footer' href="/home#destination" style={{ color:"black", textDecoration: "none",  display: "flex", alignItems: "center" }}>
                    <LocationOn/> <Typography sx={{ py: 2 }} >Top Destinations</Typography>
                </Link>
                <Link className='footer' href="/home" style={{ color:"black", textDecoration: "none",  display: "flex", alignItems: "center" }}>
                    <Map/> <Typography sx={{ py: 2 }} >Site Map</Typography>
                </Link>
                <Link className='footer' href="/home" style={{ color:"black", textDecoration: "none",  display: "flex", alignItems: "center" }}>
                    <Call/> <Typography sx={{ py: 2 }} >Contact Us</Typography>
                </Link>
            </Grid>

            <Grid xs={6} md={3} >
                <Link className='footer' href="/home#operator" style={{ color:"black", textDecoration: "none",  display: "flex", alignItems: "center" }}>
                    <Person/> <Typography sx={{ py: 2 }} >Top Operators</Typography>
                </Link>
                <Link className='footer' href="/home" style={{ color:"black", textDecoration: "none",  display: "flex", alignItems: "center" }}>
                    <Work/> <Typography sx={{ py: 2 }} >Careers</Typography>
                </Link>
                <Link className='footer' href="/home" style={{ color:"black", textDecoration: "none",  display: "flex", alignItems: "center" }}>
                    <Info/> <Typography sx={{ py: 2 }} >About</Typography>
                </Link>
            </Grid>

            <Grid xs={6} md={3} >
                <Link className='footer' href="/home#reviews" style={{ color:"black", textDecoration: "none",  display: "flex", alignItems: "center" }}>
                    <Star/> <Typography sx={{ py: 2 }} >Top Reviews</Typography>
                </Link>
                <Link className='footer' href="/home" style={{ color:"black", textDecoration: "none",  display: "flex", alignItems: "center" }}>
                    <Security/> <Typography sx={{ py: 2 }} >Privacy & Cooking Statements</Typography>
                </Link>
                <Grid className='footer' style={{ color:"black", textDecoration: "none",  display: "flex", alignItems: "center", cursor: "pointer" }}>
                    <Login/>
                    { ! isLogged ? <Typography sx={{ py: 2 }} onClick={() => {handleLogin()}} >Log In</Typography>
                    : <Typography sx={{ py: 2 }} onClick={() => {handleLog()}} >Log Out</Typography>} 
                </Grid>
            </Grid>

        </Grid>

        <hr style={{ width: "100%" }} />

            <Grid className='container' sx={{ display: "flex", justifyContent: "space-between", py: 2 }}>
                <Copyright />
                <Typography variant='body2' color="text.secondary" >Terms and Conditions Apply*</Typography>
            </Grid>
      </Box>
    </>
  )
}

export default Footer