import React from 'react'

const NotFound = () => {
  return (
    <div className='w-full h-screen flex justify-center items-center bg-red-400 '>
        <div className='bg-gray-100 p-10 flex justify-center items-center rounded shadow-lg'>
            <h2 className='text-gray-800 text-xl font-semibold'>
            404 | Page Not Found
            </h2>
        </div>
    </div>
  )
}

export default NotFound