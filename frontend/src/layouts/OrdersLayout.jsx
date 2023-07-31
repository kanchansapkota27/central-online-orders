import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

const OrdersLayout = () => {
  return (
    <div className='flex w-ful h-screen max-h-screen bg-gray-400/50'>
        <div>
            <Sidebar/>
        </div>
        <div className='flex flex-1 overfllow-y-auto'>
            <Outlet/>
        </div>

    </div>
  )
}

export default OrdersLayout