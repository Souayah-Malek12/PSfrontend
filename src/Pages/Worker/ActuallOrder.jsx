import axios from 'axios'
import React, { useEffect, useState } from 'react'
import  {useParams} from "react-router-dom"
const ActuallOrder = () => {

    const  [ordsList, setOrdsList] = useState([]) 
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

    const handleInProgress =()=>{
        //handle in the same page progress Ord 
    }
    const handleDone =()=>{
        //naviaget to the finished Order detail order details //doneOrd api 
    }
  return (
    <div>
        <h1>Acqured Orders List</h1>
      {Array.isArray(ordsList) && ordsList.map((ord, index)=>(
        <div key={index}>
            <h1>{ord?.name}</h1>
            <h1>{ord?.details}</h1>
            <h1>{ord?.desiredDate}</h1>
            <h1>{ord?.desiredTime}</h1>
            <h1>{ord?.name}</h1>
            <button onClick={()=>handleInProgress(ord.id)}>In progress</button>
            <button onClick={()=>handleDone(ord.id)}>Done </button>
        </div>
      ))}
    </div>
  )
}

export default ActuallOrder
