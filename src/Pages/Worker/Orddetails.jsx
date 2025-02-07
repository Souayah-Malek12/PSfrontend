import axios from 'axios';
import React, { useEffect, useState } from 'react'
import {useParams} from "react-router-dom";

const Orddetails = () => {
    const {ordid} = useParams();
    const [ord, setOrd] = useState("");
    
    const handleOrddetails = async()=>{
        
            try{
                const {data} = await axios.put(`${import.meta.env.VITE_APP_API}/api/worker/doneOrd/${ordid}`, 
                    {},{
                        headers : {
                            Authorization : localStorage.getItem('token')
                        }
                    }
                );
                if(data?.success){
                    setOrd(data?.order)
                    console.log(data?.order)
                }if(!data?.success){
                    console.log(data?.message)
                }
                
                }catch(err){
                    console.log("handleAcqOrders error",err.message)
                }
       
    }

    useEffect(()=>{
        handleOrddetails(ordid)
    },[])
  return (
    <div>
        <h1>{ord.name}</h1>
      <p>{ord.status}</p>
      <h1>{ord?.details}</h1>
      <h1>##{ord?.status}</h1>
      <h1>{ord?.desiredDate}</h1>
      <h1>{ord?.desiredTime}</h1>
      <h1>{ord?.name}</h1>
    </div>
  )
}

export default Orddetails
