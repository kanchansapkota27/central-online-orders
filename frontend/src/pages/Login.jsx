import {useState} from 'react'
import Logo from '../assets/LogoOrg.png'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { toast } from 'react-hot-toast'
import { Toaster } from 'react-hot-toast'


const Login = () => {

    const [error,setError]=useState({
        username:'',
        password:''
    })
    const [username,setUsername]=useState('')
    const [password,setPassword]=useState('')
    const nav=useNavigate()
    const { user, login } = useAuth();



    const onSubmit=(e)=>{
        toast.promise(login(username,password),{
            loading:'Logging In..',
            error:(e)=>`Unable to login ${e.message}`,
            success: `Welcome to Masala Cottage`
        }).then(()=>{
            nav('/dashboard',{replace:true})
        }).catch(resp=>{
            const respdata=resp?.response?.data
            setError({
                username:respdata?.username,
                password:respdata?.password
            })
        })
    }


    return (
        <div className='w-full h-screen flex justify-center items-center bg-amber-600'>

            <div className='w-72 bg-gray-200 p-4 rounded shadow-md border flex flex-col gap-2'>
                <div className='flex w-full justify-center py-2 px-2'>
                    <img src={Logo} className='w-36' />
                </div>
                <div className='space-y-1'>
                    <label className='text-gray-700'>Username</label>
                    <input value={username} onChange={e=>setUsername(e.target.value)} placeholder='Username'  type='text' className='w-full px-2 py-1 outline outline-1 appearance-none rounded' />
                    {error?.username && <span className='text-sm capitalize text-red-400'>{error?.username}</span>}
                </div>
                <div className='space-y-1'>
                    <label className='text-gray-700'>Password</label>
                    <input value={password} onChange={e=>setPassword(e.target.value)} placeholder='*****' type='password' className='w-full px-2 py-1 outline outline-1 appearance-none rounded' />
                    {error?.password && <span className='text-sm capitalize text-red-400'>{error?.password}</span>}

                </div>
                <div className='mt-3 flex w-full justify-center'>
                    <button type='submit' onClick={onSubmit} className='px-3 py-2 w-full bg-blue-600 rounded text-gray-100'>Login</button>
                </div>
            </div>
        </div>
    )
}

export default Login