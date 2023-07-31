import React from 'react'
import { useQuery } from 'react-query'
import { fetchLatestOrders } from '../api/helpers/orders'
import { fetchLiveOrders } from '../api/helpers/orders'
import { toast } from 'react-hot-toast'
import {useAuth} from '../hooks/useAuth'


import OrderCard from '../components/OrderCard'
import ConfirmModal from '../components/ConfirmModal'


const LatestOrders = () => {

  const [showModal,setShowModal]=React.useState(false)
  const {logout}=useAuth()


  const { isLoading:loadingPull, isError:iserrorPull,error:errorPull,refetch:scrapeOrders }= useQuery('liveOrders',
  fetchLiveOrders,
  {
    enabled:false,
    refetchOnWindowFocus:false,
    onError:(error)=>{
      toast.error('Error:',error)
    }
  })

  const { isLoading:loadingLatest, isError, error, data } = useQuery('todayorders', fetchLatestOrders, {
    refetchInterval: 5000,
    retry: false,
    onError:()=>{
      toast.error('Session Expired')
      logout()
    }

  })

  const forcePullOrders=()=>{
    setShowModal(false)
    toast.promise(scrapeOrders(),
    {
      loading:'Scraping new orders',
      error:'Encountered some error',
      success:'Scraped new orders'
    }
    )
    
  }

  if (loadingPull){
    return (
      <>
      <div className='w-full h-full flex justify-center items-center'>
          <span className='text-lg text-blue-500 animate-bounce'>Reading mail and updating database...</span>
        </div>
      </>

    )
  }


  if (loadingLatest) {
    return (
      <>
        <div className='w-full h-full flex justify-center items-center'>
          <span className='text-lg text-blue-500 animate-bounce'>Fetching new orders...</span>
        </div>
      </>
    )
  }

  if (isError) {
    return <>
      <div className='w-full h-screen flex justify-center items-center'>
        <span className='text-lg base text-red-500'>{error.message}</span>
      </div>
    </>
  }


  return (
    <div className='w-full h-screen p-2 overflow-y-auto'>
      <div className='flex justify-between'>
        <h1 className='p-2 text-lg text-gray-500  font-semibold'>Today's Orders </h1>
        <button disabled={loadingPull} onClick={()=>setShowModal(true)} className='px-2 m-1 text-sm font-semibold flex gap-2 items-center text-red-700 rounded bg-red-100'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          Force Pull
        </button>
      </div>
      {
        data.length > 0 &&
        <div className='space-y-4'>
          
          <div className='flex bg-gray-200/50 rounded py-2 mt-1 flex-col gap-2 space-y-2 md:px-4 lg:px-10'>
          <h2 className='text-lg font-semibold text-gray-700'>Pending Orders</h2>

            {
              data?.map((item, index) => {
                if (item.order_status === 'P') {
                  return <OrderCard key={index} order={item} />
                }
              }
              )
            }
          </div>
          <div className='flex bg-gray-200/50 rounded py-2 flex-col gap-2 space-y-2 md:px-4 lg:px-10'>
            <h2 className='text-lg font-semibold text-gray-700'>Added Orders</h2>
            {
              data?.map((item, index) => {
                if (item.order_status === 'A') {

                  return <OrderCard key={index} order={item} />
                }
              }
              )
            }
          </div>
        </div>
      }
      <ConfirmModal isOpen={showModal} setIsOpen={setShowModal} title={'Scrape new orders from email'} text={'Are you sure you want to refetch orders from mail?'} onConfirm={forcePullOrders}/> 
    </div>
  )
}

export default LatestOrders