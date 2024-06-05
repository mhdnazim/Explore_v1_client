

// 'use client'
// import { Alert, Chip, Grid, Typography } from "@mui/material";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useEffect } from "react";
// import toast from "react-hot-toast";
// import CheckIcon from '@mui/icons-material/Check';
// import { Dangerous } from "@mui/icons-material";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/store";
// import { bookingFailedAction, completePaymentAction } from "@/store/booking";

// const Success = () => {

//   const params = useSearchParams()
//   const success = params?.get('booking_status')
//   const _id = params?.get('booking_id')
//   const booking_type = params?.get('booking_type')

//   const router =  useRouter()

//   const useAppDispatch: any = useDispatch.withTypes<AppDispatch>()
//   const useAppSelector = useSelector.withTypes<RootState>()

//   const dispatch = useAppDispatch();

//   useEffect(()=> {

//     console.log(success, 'success')
//     console.log(_id, 'Booking id')

//     if (success === 'true') {
//       console.log("payment success")
//       dispatch(completePaymentAction({ Booking_id: _id }))
//       setTimeout(() => {
//         router.push('/toursandactivity/booking/history')
//       }, 3000)
//     } else if (success === 'false' && booking_type === "add") {
//       dispatch(bookingFailedAction({ Booking_id: _id }))
//       console.log("payment failed")
//       setTimeout(() => {
//         router.push('/toursandactivity/list')
//       }, 3000)
//     } else if ( success === 'false' ) {
//       router.push('/toursandactivity/list')
//     }
//   }, [params, success, _id, dispatch ])


//   return (
//     <>
//       <Grid container className="container">
//         <Grid xs={12} item sx={{ textAlign: "center", py: 3 }} className="container">
//           { success === 'true'? 
//         <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
//           Your payment is successful.
//         </Alert>
//           :
//         <Alert icon={<Dangerous fontSize="inherit" />} severity="error">
//           Your payment not completed. Booking Not confirmed. Please try again...
//         </Alert>}
//           <Chip sx={{ my: 3, py: 3, fontWeight: "bold" }} label="Don't exit the site. You will redirected in 3 seconds..." color="warning" variant="outlined" />
//         </Grid>
//       </Grid>
//     </>
//   );
// };

// export default Success;

'use client'
import { Alert, Chip, Grid } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import CheckIcon from '@mui/icons-material/Check';
import { Dangerous } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { bookingFailedAction, completePaymentAction } from "@/store/booking";
import { Suspense } from 'react';

const SuccessContent = () => {
  const params = useSearchParams();
  const success = params?.get('booking_status');
  const _id = params?.get('booking_id');
  const booking_type = params?.get('booking_type');

  const router = useRouter();

  const useAppDispatch = useDispatch.withTypes<AppDispatch>()
  const useAppSelector = useSelector.withTypes<RootState>()

  const dispatch = useAppDispatch(); 

  useEffect(() => {
    if (success === 'true') {
      dispatch(completePaymentAction({ Booking_id: _id }));
      setTimeout(() => {
        router.push('/toursandactivity/booking/history');
      }, 3000);
    } else if (success === 'false' && booking_type === "add") {
      dispatch(bookingFailedAction({ Booking_id: _id }));
      setTimeout(() => {
        router.push('/toursandactivity/list');
      }, 3000);
    } else if (success === 'false') {
      router.push('/toursandactivity/list');
    }
  }, [params, success, _id, dispatch, booking_type, router]);

  return (
    <Grid container className="container">
      <Grid xs={12} item sx={{ textAlign: "center", py: 3 }} className="container">
        {success === 'true' ? (
          <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
            Your payment is successful.
          </Alert>
        ) : (
          <Alert icon={<Dangerous fontSize="inherit" />} severity="error">
            Your payment was not completed. Booking not confirmed. Please try again...
          </Alert>
        )}
        <Chip sx={{ my: 3, py: 3, fontWeight: "bold" }} label="Don't exit the site. You will be redirected in 3 seconds..." color="warning" variant="outlined" />
      </Grid>
    </Grid>
  );
};

const Success = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <SuccessContent />
  </Suspense>
);

export default Success;

