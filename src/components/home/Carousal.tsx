'use client'
import Image from 'next/image'
import React from 'react'
import Carousel from 'react-material-ui-carousel'

const Carousal = () => {
  return (
    <div>
        <Carousel sx={{display: "flex", flexDirection: "column", alignItems: "center"}} >
                  <Image
                      src="/Explorer_3.jpg"
                      alt="Description of the image"
                      width={500}
                      height={300}
                      layout="responsive"
                    />
                  <Image
                      src="/Explorer_1.jpg"
                      alt="Description of the image"
                      width={500}
                      height={300}
                      layout="responsive"
                    />
                  <Image
                      src="/Explorer_2.jpg"
                      alt="Description of the image"
                      width={500}
                      height={300}
                      layout="responsive"
                    />
                  {/* <img src="/Explorer_3.jpg" alt="Loading..." style={{ width: "100%", maxHeight: "500px"  }} />
                  <img src="/Explorer_1.jpg" alt="Loading..." style={{ width: "100%", maxHeight: "500px"  }} />
                  <img src="/Explorer_2.jpg" alt="Loading..." style={{ width: "100%", maxHeight: "500px"  }} /> */}
        </Carousel>
    </div>
  )
}

export default Carousal