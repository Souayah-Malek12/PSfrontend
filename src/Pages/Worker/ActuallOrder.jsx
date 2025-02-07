import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ActuallOrder = () => {

    const  [ordsList, setOrdsList] = useState([]) 
    const navigate = useNavigate();
    
    const handleAcqOrders = async()=>{
        try{
            const wId = JSON.parse(localStorage.getItem('user'))?.id
            console.log("test",wId)
            const {data} = await axios.get(`${import.meta.env.VITE_APP_API}/api/order/acqOrds/${wId}` ,{
                headers : {
                    Authorization : localStorage.getItem('token')
                }
            });
            setOrdsList(data?.ordsListe)
            console.log("datatataat",data)

        }catch(err){
            console.log("handleAcqOrders error",err.message)
        }
    }
    useEffect(()=>{
        handleAcqOrders();
    },[])
    
    const handleInProgress = async(ordid)=>{
        //handle in the same page progress Ord 
        try{
        const {data} = await axios.put(`${import.meta.env.VITE_APP_API}/api/worker/progressOrd/${ordid}`, 
            {},{
                headers : {
                    Authorization : localStorage.getItem('token')
                }
            }
        );
        if(data?.success){
            setOrdsList(ordsList.map((ord)=> (ord?._id===ordid ?{...ord , status : "in progress" }: ord)))
        }if(!data?.success){
            console.log(data?.message)
        }
        
        }catch(err){
            console.log("handleAcqOrders error",err.message)
        }

    }
    const handleDone =(ordid)=>{
        //naviaget to the finished Order detail order details //doneOrd api 
        navigate(`/doneJob/${ordid}`)
    }
  return (
    <div>
        <h1>Acqured Orders List</h1>
      {Array.isArray(ordsList) && ordsList.map((ord, index)=>(
        
        <div key={index}>
            {ord?.status !=="completed" && 
            <div>
            <h1>{ord?.name}</h1>
            <h1>{ord?.details}</h1>
            <h1>##{ord?.status}</h1>
            <h1>{ord?.desiredDate}</h1>
            <h1>{ord?.desiredTime}</h1>
            <div>
            {ord.status !=="in progress" &&  ord.status !== "completed" &&
                <button onClick={()=>handleInProgress(ord._id)}>In progress</button>
            }
            </div>
            <div>
            <button onClick={()=>handleDone(ord._id)}>Done </button>
            </div>
            </div>
}
        </div>
      ))}
    </div>
  )
}

export default ActuallOrder
