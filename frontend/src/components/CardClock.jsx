import React, { useEffect,useState } from 'react'

const CardClock = ({order_time,classNames=''}) => {

  return (
    <div className='flex w-full p-1 gap-1 items-center'>
        <span className=''>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock-4"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>        </span>
        <span className='rounded font-semibold text-base lg:text-lg'>
            {order_time}
        </span>
    </div>
  )
}

export default CardClock