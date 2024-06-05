'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const Main = () => {

    const router = useRouter()
    
    useEffect(() => {
       router.push(`/register/user`)
    }, [router])
    
  return (
    <>
    </>
  )
}

export default Main
