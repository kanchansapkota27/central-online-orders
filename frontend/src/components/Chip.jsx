import React from 'react'

const Chip = ({icon,text,textcolorclass='text-gray-200',bgcolorclass='bg-blue-700'}) => {
  return (
    <div className={`flex rounded-full justify-center items-center m-1 px-2 py-1 rounded-fulltext-base  font-medium ${bgcolorclass} ${textcolorclass}`}>
    <span className="mr-1">{icon}</span>
    <div className="flex-initial max-w-full leading-none text-xs font-normal">{text}</div>
  </div>  
  )
}

export default Chip