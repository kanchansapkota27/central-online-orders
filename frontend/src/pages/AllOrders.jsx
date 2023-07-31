import React, { useState } from 'react'
import { useQuery, useInfiniteQuery } from 'react-query'
// import OrderCard from '../components/OrderCardOld'
import { fetchAllOrders } from '../api/helpers/orders'
import OrderCard from '../components/OrderCard'
import { useAuth } from '../hooks/useAuth'
import { toast } from 'react-hot-toast'

const AllOrders = () => {

    const { logout } = useAuth()
    const [page, setPage] = useState(1) 
    const { isLoading,hasNextPage, error, isError, data,isFetchingNextPage,fetchNextPage } = useInfiniteQuery(
        'allorders',
        fetchAllOrders,
        {
            getNextPageParam: (lastPage,pages) => {
                if (lastPage.currPage < lastPage.totalPages) {
                    return lastPage.currPage + 1;
                  }
                  return undefined;            },
            onError: (e) => {
                const statuscode = e.response.status
                if (statuscode === 401) {
                    toast.error("Session expired please login again", { duration: 6000 })
                    logout()
                }
            }
        }
    )


    if (isLoading) {
        return <>
            <div className='w-full h-screen flex justify-center items-center'>
                <span className='text-lg text-blue-600 animate-pulse'>Loading....</span>
            </div>
        </>
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
            <h1 className='p-2 text-lg text-gray-500  font-semibold'>All Orders</h1>
            <div className='space-y-4'>
                <div className='flex bg-gray-200/50 rounded py-2 flex-col gap-2 space-y-2 md:px-4 lg:px-10'>
                    <h2 className='text-lg font-semibold text-gray-700'>Pending Orders</h2>
                    {
                        data.pages.map((page,pageIndex) =>
                            <React.Fragment key={pageIndex}>
                                {page.items.map((item, index) =>
                                    item.order_status == 'P' ? 
                                    <OrderCard key={page + index} order={item} />
                                     : null
                                )}
                            </React.Fragment>

                        )
                    }
                </div>
                <div className='flex bg-gray-200/50 rounded py-2 flex-col gap-2 space-y-2 md:px-4 lg:px-10'>
                    <h2 className='text-lg font-semibold text-gray-700'>All Orders</h2>
                    {
                        data.pages.map((page,pageIndex) =>
                            <React.Fragment key={pageIndex}>
                                {page.items.map((item, index) =>
                                    item.order_status == 'A' ? 
                                    <OrderCard key={page + index} order={item} />
                                     : null
                                )}
                            </React.Fragment>

                        )
                    }
                </div>

            </div>
            {
                hasNextPage &&
            <div className='w-full p-2 flex justify-center items-center mt-2'>
                <button disabled={isFetchingNextPage} className='px-2 py-1 rounded outline outline-1 cursor-pointer' onClick={()=>fetchNextPage()}>
                    {isFetchingNextPage ? 'Loading...':'Load More'}
                </button>
            </div>
            }
        </div>
    )
}

export default AllOrders