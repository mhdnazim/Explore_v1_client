import React from 'react'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import { useRouter } from 'next/navigation';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
  </Box>
);

interface Props {
  operators: TourOperator[]
}

interface TourOperator {
  _id: string
  name: string
  location: string
  email: string
  phone_number: number
}

const OperatorCard = ({ operators }: Props ) => {
  const router = useRouter()
  return (
    <>
    {operators.map((item) => {
      return (
        <Grid key={item._id} item xs={12} sm={12} md={6} lg={3} sx={{ my: 2 }} >

                <Card sx={{ minWidth: 275 }}>
            <CardContent>
                {/* <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Riya Travels
                </Typography> */}
                <Typography variant="h5" component="div">
                  {item.name.charAt(0).toUpperCase() + item.name.substring(1,24)}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  {/* {item.location.charAt(0).toUpperCase() + item.location.substring(1,24)} */}
                </Typography>
                <Typography variant="body2">
                  <a href={`mailto:${ item.email }`}>{ item.email }</a>
                </Typography>
                <Typography variant="body2">
                  <a style={{ color: "green"}} href={`tel:${ item.phone_number }`}>{ item.phone_number }</a>
                </Typography>
            </CardContent>
            <CardActions>
                <Button onClick={() => {router.push(`/operators/toursandactivities/${item._id}`)}} size="small">View all Plans</Button>
            </CardActions>
            </Card>
        </Grid>
      )
    })}
    </>
  )
}

export default OperatorCard