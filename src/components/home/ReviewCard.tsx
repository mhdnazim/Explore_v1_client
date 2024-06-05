import React, { useEffect } from 'react'
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Grid, Rating } from '@mui/material';
import { useRouter } from 'next/navigation';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

interface Props {
  reviews: ReviewData[]
}

interface ReviewData {
  _id: string
  reviewer: {
    _id: string
    first_name: string
    last_name: string
  }
  tour_operator: {
    _id: string
    name: string
    location: string
  }
  tour_and_activity: {
    _id: string
    title: string
    coordinates: {
      destination: string
    }
  }
  rating: number
  review_title: string
  review: string
  createdAt: string
}


const ReviewCard = ({ reviews }: Props) => {
    const [expanded, setExpanded] = React.useState(false);

    const rating: number = 3

    const router = useRouter()
    

  return (
    <>
    { reviews.map((item) => {
      return(
        <Grid key={item._id} item xs={12} sm={12} md={6} lg={3} sx={{ my: 2 }} >
            <Card sx={{ maxWidth: 345 }} >
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                {item.reviewer.first_name.charAt(0).toUpperCase()}
              </Avatar>
            }
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title={`${item.reviewer.first_name.charAt(0).toUpperCase() + item.reviewer.first_name.substring(1,24)} ${item.reviewer.last_name.charAt(0).toUpperCase() + item.reviewer.last_name.substring(1,24)}`}
            subheader={`${new Date(item.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}`}
          />
          <CardContent sx={{ cursor: "pointer" }} onClick={() => {router.push(`/toursandactivity/view/${item.tour_and_activity._id}` )}} >
            <Grid  >
                {/* <Typography title="Click to view..."
                    variant="body2" sx={{ fontWeight: "bold" }} >
                        {item.tour_and_activity.coordinates.destination.charAt(0).toUpperCase() + item.tour_and_activity.coordinates.destination.substring(1)}
                </Typography> */}
                <Rating sx={{ color: item.rating>2 ? "green" : "red" }} value={item.rating}  name="read-only"  readOnly />
                <Typography
                    variant="body2" style={{ fontWeight: "bold" }} >
                        {item.review_title.charAt(0).toUpperCase() + item.review_title.substring(1)}
                </Typography>
            </Grid>
            <Typography variant="body2" color="text.secondary">
              {item.review.charAt(0).toUpperCase() + item.review.substring(1)}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton aria-label="add to favorites">
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="share">
              <ShareIcon />
            </IconButton>
          </CardActions>
            </Card>
        </Grid>
      )
    })}
    </>
  )
}

export default ReviewCard