'use client'
import React from 'react'
import Carousel from 'react-material-ui-carousel'

const Carousal = () => {
  return (
    <div>
        <Carousel sx={{display: "flex", flexDirection: "column", alignItems: "center"}} >
                  <img src="/Explorer_3.jpg" alt="Loading..." style={{ width: "100%", maxHeight: "500px"  }} />
                  <img src="/Explorer_1.jpg" alt="Loading..." style={{ width: "100%", maxHeight: "500px"  }} />
                  <img src="/Explorer_2.jpg" alt="Loading..." style={{ width: "100%", maxHeight: "500px"  }} />
        </Carousel>
    </div>
  )
}

export default Carousal