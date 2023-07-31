import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MdOutlineNotificationsActive, MdRefresh, MdList } from 'react-icons/md'
import { AiOutlinePieChart } from 'react-icons/ai'
import ConfirmModal from './ConfirmModal'
import { useAuth } from '../hooks/useAuth'
import {AiOutlineUser} from 'react-icons/ai'




const Sidebar = () => {
    const [showLogout, setShowLogout] = React.useState(false)
    const nav = useNavigate()
    const { user, logout } = useAuth()

    const confirmLogout = () => {
        nav('/', { replace: true })
        logout()
        setShowLogout(false)
    }

    return (
        <div className='w-32 bg-gray-200 h-full flex flex-col  justify-center items-center px-1'>
            <div className='flex align-top py-10'>
                <div className='py-2 flex gap-2 items-center text-sm rounded px-2 bg-gray-700 text-gray-100'>
                    <span><AiOutlineUser/></span>
                    <span>{user}</span>
                </div>
            </div>
            <div className='space-y-2 h-full w-full flex flex-col px-4  justify-center items-center'>
                <Link  className='rounded space-y-1 flex gap-2 w-full justify-around items-center hover:bg-sky-200 p-2' to='/dashboard'>
                    <span>Dash</span>
                    <AiOutlinePieChart className='w-6 h-6' />
                </Link>
                <Link className='rounded space-y-1 flex gap-2 w-full justify-around items-center hover:bg-sky-200 p-2' to='/latest'>
                    <span>Today</span>
                    <MdOutlineNotificationsActive className='w-6 h-6' />
                </Link>
                {/* <NavLink className='rounded space-y-1 flex gap-2 w-full justify-around items-center hover:bg-sky-200 p-2' to='/live'>
                    <span>Pull</span>
                    <MdRefresh className='w-6 h-6' />
                </NavLink> */}
                <Link className='rounded space-y-1 flex gap-2 w-full justify-around items-center hover:bg-sky-200 p-2' to='/all'>
                    <span>All</span>
                    <MdList className='w-6 h-6' />
                </Link>

            </div>
            <div className='flex align-bottom py-10'>
                <button onClick={() => setShowLogout(true)} className='px-4 py-2 bg-red-100 rounded text-red-700'>LogOut</button>
            </div>
            <ConfirmModal
                isOpen={showLogout}
                setIsOpen={setShowLogout}
                title={'Logout'}
                text={'Are you sure you want to logout?'}
                onConfirm={confirmLogout}
            />
        </div>
    )
}

export default Sidebar