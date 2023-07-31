import React from 'react'

const OrderStatus = ({ status }) => {
    if (status.toUpperCase() === 'A') {
        return (
            <>
                <span className='px-2 py-1 w-24 text-sm flex justify-between items-center gap-2 rounded bg-emerald-200 text-green-700'>
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </span>
                    <span>Added</span>
                </span>
            </>
        )

    }
    else if (status.toUpperCase() === 'D') {
        return (
            <>
                <span className='px-2 py-1 w-24 text-sm flex justify-between items-center gap-2 rounded bg-green-100 text-emerald-700'>
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </span>
                    <span>Delivered</span>
                </span>
            </>
        )
    }
    else {
        return (
            <>
                <span className='px-2 py-1 w-24 text-sm flex justify-between items-center gap-2 rounded bg-amber-100 text-amber-700'>
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>

                    </span>
                    <span>Pending</span>
                </span>
            </>
        )

    }

}

export default OrderStatus