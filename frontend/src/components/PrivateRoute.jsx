import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { Navigate, Outlet } from 'react-router-dom'


const PrivateRoute = () => {

    const {token}=useAuth()
    
  return (
    token ? <Outlet/>:<Navigate to='/' replace={true}/>
  )
}

export default PrivateRoute