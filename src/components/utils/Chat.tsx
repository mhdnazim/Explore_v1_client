import React, { useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { Avatar, Chip, Grid, InputAdornment, TextField } from '@mui/material';
import { Chat, ExpandMore, Map, Send } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { AddChatAction, listChatsAction } from '@/store/chat';
import io from 'socket.io-client';
import axios from 'axios';
import { blue, red } from '@mui/material/colors';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

interface TourData {
  _id: string,
  title: string,
  tour_operator: {
    _id: string,
    name: string,
    email: string,
    phone_number: number,
  },
  destination: string,
  coordinates: {
    longitude: any,
    latitude: any,
  },
  description: string,
  duration: number,
  itinerary: {
    _id: string,
    itinerary: string,
    step: number,
  }[],
  price: number,
  availability: number,
  activity_type: string,
  highlight: string,
  isDeleted: Boolean,
  isShown: Boolean,
  createdAt: string,
  updatedAt: string,
}

interface ChatsData {
  _id: string,
  user: {
    _id: string,
    first_name: string,
    last_name: string,
  },
  tour_operator: string,
  send_by: string,
  receive_by: string,
  message: string,
}

interface Props {
  role: string | null,
  data: TourData,
  open: boolean,
  user_id: string | null,
  handleClickClose: () => void,
}

interface UserData {
  _id: string,
  first_name: string,
  last_name: string,
  email: string,
  phone_number: number,
}

const defaultUserData = {
  _id: "",
  first_name: "",
  last_name: "",
  email: "",
  phone_number: 0,
};

const socket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}`);

const Chats = ({ open, handleClickClose, user_id, data, role }: Props) => {
  const [message, setMessage] = useState("");
  const [chatCount, setChatCount] = useState(10);
  const [user, setUser] = useState<UserData>(defaultUserData);

  const useAppDispatch: any = useDispatch.withTypes<AppDispatch>();
  const useAppSelector = useSelector.withTypes<RootState>();

  const dispatch = useAppDispatch();
  const allChats: ChatsData[] = useAppSelector((state) => state.chat.chats);
  const redirect: boolean = useAppSelector((state) => state.chat.redirect);

  const handleClickChat = () => {
    dispatch(AddChatAction({ user: user_id, tour_operator: data.tour_operator._id, tour_and_activity: data._id, message }));
    socket.emit('sendMessage', { name: user_id, message });
    setMessage("");
  };

  useEffect(() => {
    if (user_id) {
      const storedToken = localStorage.getItem("access_token");
      const findUserDetails = async () => {
        await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/user/find`, { _id: user_id }, {
          headers: { Authorization: `Bearer ${storedToken}` },
        }).then((res) => {
          setUser(res.data.data);
        });
      };
      findUserDetails();
    }
    if (data.tour_operator._id !== "") {
      dispatch(listChatsAction({ user: user_id, tour_operator: data.tour_operator._id, tour_and_activity: data._id }));
    }
  }, [dispatch, data, redirect]);

  useEffect(() => {
    socket.on('sendMessage', (message) => {
      if (data.tour_operator._id !== "") {
        dispatch(listChatsAction({ user: user_id, tour_operator: data.tour_operator._id, tour_and_activity: data._id }));
      }
    });
    socket.on('connection', () => {
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
    console.log(data, "chat data")
  }, [allChats, data]);

  const div = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(open);
    if (open && div.current) {
      div.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [allChats, open, div.current]);

  return (
    <>
      <BootstrapDialog className='dialog'
        sx={{ position: "absolute", right: "0px" }}
        fullWidth
        maxWidth="xs"
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2, backgroundColor: "#94bc7b", color: "white" }} id="customized-dialog-title">
          {role === "user" ?
            <Grid sx={{ display: "flex", alignItems: "center" }}>
              <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                {data.tour_operator.name.charAt(0).toUpperCase()}
              </Avatar> &nbsp;
              {`${data.tour_operator.name.charAt(0).toUpperCase() + data.tour_operator.name.substring(1)}`}
            </Grid>
            :
            <>
            <Grid sx={{ display: "flex", alignItems: "center" }}>
              <Avatar sx={{ bgcolor: blue[500] }} aria-label="recipe">
                {user.first_name.charAt(0).toUpperCase()}
              </Avatar> &nbsp;
              {`${user.first_name.charAt(0).toUpperCase() + user.first_name.substring(1) + " " + user.last_name.charAt(0).toUpperCase() + user.last_name.substring(1)}`}
            </Grid>
              <Chip size='small' icon={<Map />} label={`${data.destination}`} color="primary" />
          </>
          }
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClickClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          {allChats.length === 0 ?
            <Grid item sx={{ display: "flex", justifyContent: "center" }}>
              <Typography sx={{ p: 1, borderRadius: "20px", color: "red", position: "left" }} gutterBottom>
                No messages
              </Typography>
            </Grid>
            :
            <>
              { allChats.length > chatCount && 
                <Button onClick={ () => setChatCount(chatCount+10)}  sx={{ mb: 5 }} variant='outlined' size='small' color='success' className='add' startIcon={ <ExpandMore /> }>View more</Button>
              }
              {allChats.slice(-chatCount).map((item: any) => {
                return (
                  <Grid item key={item._id}>
                    {item.send_by === "user" ?
                      <Grid item sx={{ display: "flex", justifyContent: role === "user" ? "end" : "start" }}>
                        <Typography sx={{ backgroundColor: role === "user" ? "#2379e3" : "#E4ECEC", p: 1, borderRadius: "20px", color: role === "user" ? "white" : "black", position: "left" }} gutterBottom>
                          {item.message}
                        </Typography>
                      </Grid>
                      :
                      <Grid item sx={{ display: "flex", justifyContent: role === "user" ? "start" : "end" }}>
                        <Typography sx={{ backgroundColor: role === "user" ? "#E4ECEC" : "#2379e3", p: 1, borderRadius: "20px", color: role === "user" ? "black" : "white" }} gutterBottom>
                          {item.message}
                        </Typography>
                      </Grid>
                    }
                  </Grid>
                );
              })}
            </>
          }
          <div ref={div} />
        </DialogContent>
        <DialogActions>
          <TextField
            required={true}
            id="outlined-required"
            name="search"
            value={message}
            sx={{ width: "100%" }}
            InputProps={{
              startAdornment: <InputAdornment position="start">
                <Chat />
              </InputAdornment>,
              endAdornment:
                <InputAdornment position="end">
                  <IconButton
                    sx={{ color: "#2379e3" }}
                    aria-label="toggle password visibility"
                    onClick={handleClickChat}
                    edge="end"
                  >
                    <Send />
                  </IconButton>
                </InputAdornment>
            }}
            onChange={(e) => setMessage(e.target.value)}
          />
        </DialogActions>
      </BootstrapDialog>
    </>
  )
}

export default Chats;
