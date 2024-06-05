'use client'
import React, { useEffect, useState } from 'react'
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Chat, ExpandMore, Home, KeyboardArrowDown, LocationOn, Logout, Person, Reply, Star, Store } from '@mui/icons-material';
import { Avatar, Box, Chip, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import PageviewIcon from '@mui/icons-material/Pageview';
import { blue, green, pink } from '@mui/material/colors';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
// import { listUsersByTourOperator } from '@/store/chat';
import Chats from './Chat';
import "../../app/globals.css"
import io from 'socket.io-client';
import { listChatsForOperator } from '@/store/chat';
import axios from 'axios';

interface TourData {
  _id: string,
  title: string,
  tour_operator: {
      _id: string
      name: string
      email: string
      phone_number: number
  }
  destination: string
  coordinates: {
      longitude: any
      latitude: any
  }
  description: string,
  duration: number,
  itinerary: {
      _id: string
      itinerary: string,
      step: number
  }[],
  price: number,
  availability: number,
  activity_type: string,
  highlight: string,
  isDeleted: Boolean,
  isShown: Boolean,
  createdAt: string,
  updatedAt: string
}

const defaultTourData = {
  _id: "",
  title: "",
  tour_operator: {
      _id: "",
      name: "",
      email: "",
      phone_number: 0
  },
  destination: "",
  coordinates: {
      longitude: "",
      latitude: ""
  },
  duration: 0,
  description: "",
  itinerary:[{
      _id: "",
      itinerary: "",
      step: 0
  }],
  price: 0,
  availability: 0,
  activity_type: "",
  highlight: "",
  isDeleted: true,
  isShown: true,
  createdAt: "",
  updatedAt: ""
}

const socket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}`);

const Header = () => {
  const [anchorElChat, setAnchorElChat] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [isLogged, setIsLogged] = useState<null | string>(null);
  const [getRole, setGetRole] = useState<string | null>("")
  const [getId, setGetId] = useState<string | null>("")
  const [chatCount, setChatCount] = useState(5);
  const [chat, setChat] = useState<boolean>(false)
  const [ chatUser, setChatUser ] = useState("")
  const [ messagedTour, setMessagedTour ] = useState<TourData>(defaultTourData)
  const router = useRouter()

  const useAppDispatch: any = useDispatch.withTypes<AppDispatch>()
  const useAppSelector = useSelector.withTypes<RootState>()

  const dispatch = useAppDispatch();
  
  const chats: any = useAppSelector(state => state.chat.userData);

  const handleLogin = () => {
    window.localStorage.removeItem('access_token')
    window.localStorage.removeItem('user_Id')
    window.localStorage.removeItem('role')
    router.push('/login')
  }

  const handleBookings = () => {
    const user_role = localStorage.getItem("role")
    if ( user_role === "Tour Operator"){
      router.push('/toursandactivity/booking/list')
    } else {
      router.push('/toursandactivity/booking/history')
    }
  }

  const handleClickClose = () => {
    setChat(false)
  }

  const handleLog = () => {
    router.push('/login')
  }

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenUserChat = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElChat(event.currentTarget);
  };

  const handleCloseUserChat = ( user_id: string, tour_and_activity: string ) => {
    setAnchorElChat(null);
  };

  const handleReply = ( user_id: string, tour_and_activity: string ) => {
    setChatUser(user_id)
    if ( tour_and_activity !== "" ) {
      const storedToken = localStorage.getItem("access_token")
      const viewTour = async () => {
      await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/toursandactivities/view`,  { _id: tour_and_activity }  , {
      headers: {Authorization: `Bearer ${storedToken}` } }).then(res=>{
          setMessagedTour(res.data.data)
          })
  }
  viewTour()
  }   
  setChat(true)
  };

  useEffect(() => {
    const user_role = localStorage.getItem('role')
    setGetRole(user_role)
    const storedToken = localStorage.getItem('access_token')
    setIsLogged(storedToken)
    const _id = localStorage.getItem('user_Id')
    setGetId(_id)
    // dispatch(listUsersByTourOperator(tour_operator_id))
  }, [isLogged, getRole])

  useEffect(() => {
    if ( getRole === "Tour Operator"){
      dispatch(listChatsForOperator({ tour_operator: getId }))
    }
  }, [getId])

  useEffect(() => {
    socket.on('sendMessage', (message) => {
      if ( getRole === "Tour Operator" ) {
        dispatch(listChatsForOperator({ tour_operator: getId }))
      }
    });
    socket.on('connection', () => {
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  }, [ getId, chats ]);


  useEffect(() => {
    console.log(chats.slice(-5).reverse(), "user chat Id")
  }, [chats])
  


  return (
    <>
        <Toolbar sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: "white" }}>
        {/* <Button size="small">Subscribe</Button> */}
            <img
            src="/favicon.png"
            alt="Logo"
            loading="lazy"
            height={40}
        /> &nbsp;
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          noWrap
          sx={{ flex: 1, fontWeight: "bold", fontStyle: "italic" }}
        >
          <Link href={'/home'} style={{ textDecoration: "none", color: "black" }}>Explorer</Link>
        </Typography>
        <Box sx={{ flexGrow: 0 }}>
                  {/* { getRole === "Tour Operator" && 
                 
                  } */}
            { getRole === "Tour Operator" && 
             <>
                <Tooltip title="Open settings" >
                    <IconButton onClick={handleOpenUserChat} sx={{ p: 1 }}>
                        <Avatar sx={{ bgcolor: blue[500] }}>
                          <Chat />
                      </Avatar>
                    </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElChat}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElChat)}
                  onClose={handleCloseUserChat}
                >
                  <Chats open={chat} handleClickClose={ handleClickClose } user_id={chatUser} data={messagedTour} role={getRole} />
                  { chats.slice(-chatCount).reverse().map((item: any) => {
                    return(
                      <MenuItem key={ item._id }  onClick={ () => handleCloseUserChat(item.user._id, item.tour_and_activity)}>
                        <Typography onClick={ () => handleReply(item.user._id, item.tour_and_activity)}  sx={{ color: blue[500], fontWeight: 'bold' }} textAlign="center">{`${item.message.split(' ').slice(0,3).join(' ')}`} &nbsp;</Typography> 
                        <Typography onClick={ () => handleReply(item.user._id, item.tour_and_activity)}  sx={{ color: "black", fontWeight: 'bold' }} textAlign="center">From &nbsp; 
                        <Chip avatar={<Avatar>{item.user.first_name.charAt(0).toUpperCase()}</Avatar>} label={item.user.first_name.charAt(0).toUpperCase() + item.user.first_name.substring(1)} /> </Typography>

                      </MenuItem>
                    )
                  })}

                  {/* <MenuItem sx={{ display: "flex", justifyContent: "center" }}>
                      <Button variant='outlined' size='small' color='success' className='add' startIcon={ <ExpandMore /> }>View more</Button>
                  </MenuItem> */}

                  { chats.length > chatCount && 
                    <MenuItem sx={{ display: "flex", justifyContent: "center" }}>
                        <Chip onClick={ () => setChatCount(chatCount+5)} label="View More" size='small' color='primary' component="a" href="#basic-chip" clickable />
                    </MenuItem>
                  }

                  
                </Menu>
              </>
            }
            <Tooltip title="Open settings" >
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 1 }}>
                <Avatar sx={{ bgcolor: green[500] }}>
                  { getRole === "Tour Operator" ? 
                  <Store />
                  :
                  <Person />
                  }
              </Avatar>
                <KeyboardArrowDown />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
                <MenuItem  onClick={handleCloseUserMenu}>
                  { isLogged && <Typography onClick={() => {handleBookings()}} textAlign="center">{ getRole === "Tour Operator" ? "All Bookings" : "My Bookings"}</Typography>
                  }
                </MenuItem>
                <MenuItem  onClick={handleCloseUserMenu}>
                  { isLogged ? <Typography onClick={() => {handleLogin()}} textAlign="center">Log Out</Typography>
                  : <Typography onClick={() => {handleLog()}} textAlign="center">Log In</Typography>}
                </MenuItem>

            </Menu>
          </Box>
      </Toolbar>
      <Toolbar
        component="nav"
        variant="dense"
        sx={{ justifyContent: 'center', overflowX: 'auto', columnGap : "20px", bgcolor: "white" }}
      >
        <Link className='nav' href="/home" style={{ color:"black", textDecoration: "none",  display: "flex", alignItems: "center" }}>
        <Home /> <Typography sx={{}} >Home</Typography>
          </Link>
        <Link className='nav' href="/home#destination" style={{ color:"black", textDecoration: "none",  display: "flex", alignItems: "center" }}>
        <LocationOn/> <Typography sx={{}} >Top Destinations</Typography>
          </Link>
        <Link className='nav' href="/home#operator" style={{ color:"black", textDecoration: "none",  display: "flex", alignItems: "center" }}>
        <Person/> <Typography sx={{}} >Top Operators</Typography>
          </Link>
        <Link className='nav' href="/home#reviews" style={{ color:"black", textDecoration: "none",  display: "flex", alignItems: "center" }}>
        <Star/> <Typography sx={{}} >Top Reviews</Typography>
          </Link>
      </Toolbar>
    </>
  )
}

export default Header