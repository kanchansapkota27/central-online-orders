import React from 'react'
import { Outlet } from 'react-router-dom'
import {Toaster} from 'react-hot-toast'


const GlobalLayout = () => {
  return (
    <>
        <Toaster position="top-right" toastOptions={{
            duration:3000
        }}/>

        <Outlet/>
    </>
  )
}

export default GlobalLayout