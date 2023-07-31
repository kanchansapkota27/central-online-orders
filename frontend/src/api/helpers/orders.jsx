import axios from '../axios'
// import axios from 'axios'



// const sleep = (ms) => new Promise((r) => setTimeout(r, ms));


const fetchSumAnalysis=async()=>{

    const response=await axios.get('/orders/sum_analysis',
    {
        headers:{'Authorization':'Bearer ' + sessionStorage.getItem('token')} // assuming token is stored in localStorage
    }
    )
    return response.data
  
}

async function fetchAllOrders({ pageParam=1}) {
    const response = await axios.get(`/orders/all?page=${pageParam}`, {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token') 
      }
    })
    return response.data
  }
const fetchLatestOrders= async ()=>{
    const response=await axios.get('/orders/today',
    {
        headers:{'Authorization':'Bearer ' + sessionStorage.getItem('token')} // assuming token is stored in localStorage
    }
)
    return response.data
}


const fetchLiveOrders= async ()=>{
    const response=await axios.get('/orders/live',
    {
        timeout:4000,
        headers:{'Authorization':'Bearer ' + sessionStorage.getItem('token')} // assuming token is stored in localStorage
    }
    )
    return response.data
}


const upDateOrderStatus=async (data)=>{
    const response = await  axios.post('orders/update-order',data,
    {
        headers:{'Authorization':'Bearer ' + sessionStorage.getItem('token')} // assuming token is stored in localStorage
    }
    )
    return response.data

}


export {fetchLatestOrders,fetchAllOrders,fetchLiveOrders,upDateOrderStatus,fetchSumAnalysis};