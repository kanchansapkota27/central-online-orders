import React from 'react'
import { useQuery } from 'react-query'
import { fetchSumAnalysis } from '../api/helpers/orders'
import { AiOutlineArrowUp,AiOutlineArrowDown } from 'react-icons/ai'
import {useAuth} from '../hooks/useAuth'
import { toast } from 'react-hot-toast'


const Dashboard = () => {

    const {logout}=useAuth()
    const formatter= Intl.NumberFormat('en',{notation:'compact'})

    const { isLoading, isError, error, data } = useQuery('fetchSumAnalysis', fetchSumAnalysis, {
        refetchInterval: 5000,
        retry: false,
        refetchOnWindowFocus:false,
        onError:(e) => {
            const statuscode = e.response.status
            if (statuscode === 401) {
                toast.error("Session expired please login again", { duration: 6000 })
                logout()
            }
            else if(statuscode==500){
                toast.error('Internal Server Error', { duration: 6000 })
            }
            else{
                toast.error(e.response.message, { duration: 6000 });
            }
        }
    })

    const numFormatter=(num)=>{
        return formatter.format(num)
    }


    if (isLoading) {
        return (
            <>
                <div className='w-full h-full flex justify-center items-center'>
                    <span className='text-lg text-blue-500 animate-bounce'>Loading new orders....</span>
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
            <h1 className='p-2 text-lg text-gray-500 font-semibold'>Sales Dashboard</h1>
            <div className='space-y-4'>
                <div className='flex bg-gray-200/50 text-gray-700 rounded py-2 flex-col gap-2 space-y-2 md:px-4 lg:px-10'>
                    <div className='grid gap-2 grid-flow-col'>
                        <div className='p-4 space-y-2 rounded bg-gray-100 shadow-lg'>
                            <div className='text-sm block tracking-wide'>Total Orders</div>
                            <div className='my-4 block text-4xl font-bold tracking-wide'>
                                {data.total_orders}
                            </div>
                        </div>
                        <div className='p-4 space-y-2 rounded bg-gray-100 shadow-lg'>
                            <div className='text-sm block tracking-wide'>Total Sales</div>
                            <div className='my-4 block text-4xl font-bold tracking-wide'>
                                ${data.total_sales}
                            </div>
                        </div>
                        <div className='p-4 space-y-2 rounded bg-gray-100 shadow-lg'>
                            <div className='text-sm block tracking-wide'>Today's Orders</div>
                            <div className='my-4 block text-4xl font-bold tracking-wide'>
                                {data.today?.orders}
                            </div>
                            <div>
                                {
                                    data?.diff?.orders?.status === 'U' ?
                                        <>
                                            <span className='flex gap-4 text-sm text-green-500 items-center'>
                                                <AiOutlineArrowUp />
                                                <span>
                                                {data?.diff?.orders?.percent}% Since yesterday
                                                <span className='text-blue-600 ml-4 '>
                                                    From {data?.yesterday?.orders}
                                                </span>
                                                </span>
                                            </span>
                                        </> :
                                        <>
                                            <span className='flex gap-4 text-sm text-red-500 items-center'>
                                                <AiOutlineArrowDown />
                                                <span>
                                                {data?.diff?.orders?.percent}% Since yesterday
                                                <span className='text-blue-600 ml-4 '>
                                                    From {data?.yesterday?.orders}
                                                </span>

                                                </span>
                                            </span>

                                        </>
                                }
                            </div>
                        </div>
                        <div className='p-4 space-y-2 rounded bg-gray-100 shadow-lg'>
                            <div className='text-sm block tracking-wide'>Today's Sales</div>
                            <div className='my-4 block text-4xl font-bold tracking-wide'>
                                ${numFormatter(data.today?.sales)}
                            </div>
                            <div>
                            {
                                    data?.diff?.sales?.status === 'U' ?
                                        <>
                                            <span className='flex gap-4 text-sm text-green-500 items-center'>
                                                <AiOutlineArrowUp />
                                                <span>
                                                {data?.diff?.sales?.percent} % Since yesterday
                                                <span className='text-blue-600 ml-4 '>
                                                    From ${data?.yesterday.sales}
                                                </span>

                                                </span>
                                            </span>
                                        </> :
                                        <>
                                            <span className='flex gap-4 text-sm text-red-500 items-center'>
                                                <AiOutlineArrowDown />
                                                <span>
                                                {data?.diff?.sales?.percent}% Since yesterday
                                                <span className='text-blue-600 ml-4 '>
                                                    From ${data?.yesterday.sales}
                                                </span>

                                                </span>
                                            </span>

                                        </>
                                }

                            </div>
                        </div>

                    </div>
                    <div className="w-full mb-12 xl:mb-0 mx-auto mt-24">
                        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded ">
                            <div className="rounded-t mb-0 px-4 py-3 border-0">
                                <div className="flex flex-wrap items-center">
                                    <div className="relative w-full max-w-full flex-grow flex-1">
                                        <h3 className="font-semibold text-lg text-blueGray-700">Top Customers</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="block w-full overflow-x-auto">
                                <table className="items-center bg-transparent w-full border-collapse ">
                                    <thead>
                                        <tr className='bg-gray-300'>
                                            <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-md border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                                Customer Name
                                            </th>
                                            <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-md border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                                Customer Email
                                            </th>
                                            <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-md border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                                Customer Phone
                                            </th>
                                            <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-md border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                                Total Orders
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            data?.top_customers?.map(customer => (
                                                <tr key={customer?.client_email} className='text-base even:bg-gray-200'>
                                                    <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 text-left text-blueGray-700 ">
                                                        {customer.client_name}
                                                    </th>
                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 blur hover:blur-0 transition-all duration-200 cursor-pointer ">
                                                        {customer.client_email}
                                                    </td>
                                                    <td className="border-t-0 px-6 align-center border-l-0 border-r-0 whitespace-nowrap p-4 blur hover:blur-0 transition-all duration-200 cursor-pointer">
                                                        {customer.client_phone}
                                                    </td>
                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4 font-bold text-lg">
                                                        {customer.total}
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Dashboard