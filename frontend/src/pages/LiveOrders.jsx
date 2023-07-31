import React from 'react'
import { useQuery } from 'react-query'

import { fetchLiveOrders } from '../api/helpers/orders'
import OrderCard from '../components/OrderCard'

const LiveOrders = () => {
    const { isLoading, isError, data,error }= useQuery('liveOrders',fetchLiveOrders,{retry:2})

    if(isLoading){
        return <>
        <div className='w-full h-screen flex justify-center items-center'>
        <span className='text-lg text-blue-600 animate-pulse'>Loading....</span>
        </div>
        </>
    }

    if(isError){
        return <>
        <div className='w-full h-screen flex justify-center items-center'>
        <span className='text-lg base text-red-500'>{error.message}</span>
        </div>
        </>
    }


  return (
    <div className='w-full h-screen p-2 overflow-y-auto'>
        <h1 className='p-2 text-lg text-gray-500  font-semibold'>Live Orders</h1>
        <div className='flex flex-col gap-2 space-y-2 md:px-4 lg:px-10'>
        {
            data?.map((item,index)=>
            <OrderCard key={index} order={item} />
            )
        }
        </div>
    </div>
  )
}

export default LiveOrders