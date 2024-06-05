import React, { useEffect, useState } from 'react'
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import EditItinerary from './EditItinerary';

interface Props {
  role: string | null
  loginId: {
    logId: string | null
    viewId: string | null
  }
    data : {
        _id : string
        itinerary: string,
        step: number
    }[]
}

const Itinerary = ({ data, role, loginId } : Props) => {
  const [ open, setOpen ] = useState(false)
  const [ edit, setEdit ] = useState({})

  const handleClickClose = () => {
    setOpen(false)
  }

  const handleEdit = (item: any) => {
    if ( role === "Tour Operator" && loginId.logId === loginId.viewId ){
      setOpen(true)
      setEdit(item)
    }
  }


  return (
    <>
    <Timeline position="alternate" >

      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot variant="outlined" color="success" />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>Start</TimelineContent>
      </TimelineItem>

      {
        data.length > 0 ? data.map(item => {
            return(
                <TimelineItem key={item._id} >
                    <TimelineSeparator>
                    <TimelineDot onClick={ () => handleEdit(item)} variant="outlined" color="success" />
                    <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>{item.itinerary}</TimelineContent>
                </TimelineItem>
            )
                
        } )
        : (
            <TimelineItem>
                        <TimelineSeparator>
                        <TimelineDot variant="outlined" color="success" />
                        <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>Visit Location</TimelineContent>
            </TimelineItem>
        )
      }


      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot variant="outlined" color="success" />
        </TimelineSeparator>
        <TimelineContent>End</TimelineContent>
      </TimelineItem>

    </Timeline>
    <EditItinerary open={open} handleClickClose={ handleClickClose } edit={edit} />
    </>
  )
}

export default Itinerary