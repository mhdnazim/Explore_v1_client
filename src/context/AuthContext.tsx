"use client"
import axios from 'axios'
import url from '@/config/url'
import { authConfig } from '../config/authConfig'
import type { AuthProvider, Login } from './types'
import { usePathname, useRouter } from 'next/navigation'
import React, { createContext, ReactNode, useEffect } from 'react'

export const defaultProvider: AuthProvider = {
  login : () => Promise.resolve(),
  logout : () => Promise.resolve(),
  confirmAuth : () => Promise.resolve(),
}

const AuthContext = createContext(defaultProvider)

export type Props = {
  children: ReactNode
}

const AuthProvider = ({children}: Props) => {

  const router = useRouter()
  const pathname = usePathname()

  // useEffect- call confirmAuth here
  useEffect(() => {
    confirmAuth()
  },[])

  const confirmAuth = async (): Promise<void> => {
    const storedToken = localStorage.getItem(authConfig.accessToken)!
    const headers = { Authorization: `Bearer ${storedToken}` };
    if ( ! storedToken ){
      
      if ( pathname !== '/register/user' && pathname !== '/register/touroperator' ) { router.push("/login") }
      
    } else {
        const response = axios.post(`${url.serverUrl}/user/auth`,{},{headers})
        .then(res => {
          const { access_token , data} = res.data;
          localStorage.setItem(authConfig.accessToken, access_token)
          localStorage.setItem('role', data.role)
          localStorage.setItem('user_Id', data._id)
        })
        .catch(() => {
          localStorage.removeItem('user_Id')
          localStorage.removeItem('role')
          localStorage.removeItem(authConfig.accessToken)

          const redirectURL = '/login'
          router.replace(redirectURL)
        })
    }
  }

  const handleLogin = async (params: Login, error ?: (err: string) => void): Promise<void> => {
    axios.post(`${url.serverUrl}/user/login`,params).then(res => {
      const { access_token , data } = res.data;
      localStorage.setItem(authConfig.accessToken, access_token)
      localStorage.setItem('role', data.role)
      localStorage.setItem('user_Id', data._id)
      router.push("/home")
    }).catch ( err => {
      if (error) error(err)
    })  
  }

  const handleLogout = async (): Promise<void> => {
    localStorage.removeItem(authConfig.accessToken)
    localStorage.removeItem("role")
    localStorage.removeItem("user_Id")
    router.push("/login")
  }

  const values = {
    confirmAuth,
    login : handleLogin,
    logout : handleLogout
  }


  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthProvider, AuthContext }
