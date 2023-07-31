import React from 'react'
// import OrderType from './OrderType'
// import OrderStatus from './OrderStatus'
import ConfirmModal from './ConfirmModal'
import { upDateOrderStatus } from '../api/helpers/orders'
import { useMutation, useQueryClient } from 'react-query'
import Chip from './Chip'
import {FiCheck} from 'react-icons/fi'
import {MdOutlinePendingActions} from 'react-icons/md'
import toast from 'react-hot-toast'



const formatOrderName=(text)=>{
    const removeText='Comment'
    const splitted=text.split(':')
    var order=splitted[0]
    var comment= splitted[1]
    if(order.endsWith("Comment")){
        var order=order.slice(0,-removeText.length)      
    }
    return (
        <>
        <span className='font-semibold'>{order}</span>
        <br/>
        <span className='text-amber-800'>{comment}</span>
        </>
    )

}


const OrderCard = React.memo(({ order }) => {

    const [orderDetailsOpen, setOrderDetailsOpen] = React.useState(false);
    const [addModalOpen, setAddModalOpen] = React.useState(false)

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: upDateOrderStatus,
        onSuccess: () => {

            queryClient.invalidateQueries({ queryKey: ['allorders'] });
            toast.success("Order has been marked as added to POS")
        },
    })


    const toggleOrderDetails = () => {
        setOrderDetailsOpen(prevVal => !prevVal)
    }

    const onOrderAdd = () => {
        mutation.mutate(
            {
                order_no: order.order_no,
                order_status: 'A'

            }
        )
        setAddModalOpen(false);
    }


    return (
        <div onClick={toggleOrderDetails} className='flex flex-col'>
            <div className='flex justify-between items-center gap-2 rounded py-2 px-4 bg-gray-200 text-gray-800 hover:cursor-pointer hover:shadow-md hover:shadow-sky-300/50'>
                <div className='flex flex-col gap-1 w-full'>
                    <span className='text-lg w-full font-semibold flex-1'>
                        {order.client_name}
                    </span>
                    <span className='py-1 text-xs'>
                        {order.pickup_date}
                    </span>

                    <div className='flex gap-2'>
                        <span>
                            {order.order_no}
                        </span>
                        <span >
                            {
                                order.order_type == 'A' ?
                                    <Chip bgcolorclass='bg-red-200' textcolorclass='text-red-800'
                                        icon={
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                            </svg>}
                                        text={'ASAP'} /> :
                                    <Chip bgcolorclass='bg-blue-200' textcolorclass='text-blue-800'
                                        icon={
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>}
                                        text={'FUTURE'} />
                            }
                        </span>
                        <span>
                            {
                                order.order_status == 'A' ?
                                    <Chip bgcolorclass='bg-transparent outline outline-1 outline-emerald-500' textcolorclass='text-green-800'
                                        icon={<FiCheck className='w-4 h-4'/>}
                                            
                                        text={'Added'} /> :
                                    <Chip bgcolorclass='outline outline-1 outline-amber-800' textcolorclass='text-amber-800'
                                        icon={
                                        <span className='relative w-full h-full'>
                                        <span className='w-2 h-2 top-2 left-14 absolute bg-red-500 animate-ping rounded-full'/>
                                        <MdOutlinePendingActions className='w-4 h-4'/>
                                        </span>
                                        }
                                        text={'Pending'} />
                            }

                        </span>
                    </div>
                </div>
                <div className={`flex flex-col justify-center items-center min-w-24 sm:w-28 lg:w-32 `}>
                    <span className='rounded'>
                        <input disabled type='time' pattern="[0-9]{2}:[0-9]{2}" step="60" value={order.pickup_time} className={`px-2 py-[6px] text-sm ml-1 text-sky-900 rounded ${order.order_type == 'A' ? 'bg-blue-300 hidden' : 'bg-sky-200'}`} />
                    </span>
                </div>
            </div>
            {
                orderDetailsOpen &&
                <div className='w-full transition-all border-2 border-gray-400 border-dashed p-2 px-4 bg-gray-200 rounded-b-md shadow-md'>
                    <table className='min-w-full table-auto text-right text-sm font-light'>
                        <thead className='border-b tracking-wide text-md font-medium dark:border-neutral-500'>

                            <tr>
                                <th className='px-6 py-4'>Item</th>
                                <th className='px-6 py-4'>Quantity</th>
                                <th className='px-6 py-4'>Price</th>
                                <th className='px-6 py-4'>Qty X Price</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                order.order_items.map((item, i) =>
                                    <tr className='border-b dark:border-neutral-500 odd:bg-slate-200' key={order.order_no + order.item + `${i}`}>
                                        <td className='px-6 py-2 font-medium'>{formatOrderName(item.name)}</td>
                                        <td className='font-semibold whitespace-nowrap px-6 py-2'>{item.quantity}</td>
                                        <td className='whitespace-nowrap px-6 py-2 font-medium'>${item.price}</td>
                                        <td className='whitespace-nowrap px-6 py-2 font-medium'>${item.qty_x_price}</td>
                                    </tr>
                                )

                            }
                            <tr className='border-b bg-zinc-300 dark:border-neutral-500'>
                                <td className='whitespace-nowrap px-6 py-2 font-semibold text-right' colSpan={3}>SubTotal</td>
                                <td className='whitespace-nowrap px-6 py-2 font-semibold' >${order.order_sub_total}</td>
                            </tr>
                            <tr className='border-b bg-zinc-300 dark:border-neutral-500'>
                                <td className='whitespace-nowrap px-6 py-2 font-semibold text-right' colSpan={3}>Tax</td>
                                <td className='whitespace-nowrap px-6 py-2 font-semibold'>${order.order_tax}</td>
                            </tr>
                            <tr className='border-b bg-zinc-300 dark:border-neutral-500'>
                                <td className='whitespace-nowrap px-6 py-2 font-semibold text-right' colSpan={3}>Tip</td>
                                <td className='whitespace-nowrap px-6 py-2 font-semibold'>${order.order_tip || 0}</td>
                            </tr>
                            <tr className='border-b bg-zinc-300 dark:border-neutral-500'>
                                <td className='whitespace-nowrap px-6 py-2 font-semibold text-right' colSpan={3}>Total</td>
                                <td className='whitespace-nowrap px-6 py-2 font-semibold'>${order.order_total}</td>
                            </tr>
                        </tbody>
                    </table>

                    {
                        order.order_status === 'P' ?
                            <div className='flex justify-center w-full py-4'>
                                <button onClick={() => setAddModalOpen(true)} className='px-4 py-2 bg-blue-400 text-gray-100 w-1/3 rounded'>Add to POS</button>
                            </div>
                            :
                            <></>
                        // <div className='flex justify-center w-full py-4'>
                        //     <button disabled onClick={() => setAddModalOpen(true)} className='px-4 py-2 bg-emerald-400 text-gray-100 w-1/3 rounded'>Added</button>
                        // </div>

                    }
                </div>
            }
            <ConfirmModal
                isOpen={addModalOpen}
                setIsOpen={setAddModalOpen}
                onConfirm={onOrderAdd}
                title={`Adding order of ${order.client_name} to POS`}
                text='Are you sure you want to add this order to POS?' />

        </div>
    )
})

export default OrderCard