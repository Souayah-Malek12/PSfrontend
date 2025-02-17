import axios from 'axios';
import React, { useEffect, useState } from 'react'
import {useParams} from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';


const MapComponent = ({ coordinates }) => {
    // Default center (fallback if coordinates are not provided)
    const defaultCenter = [10.505, 34.09];
    return (
      <MapContainer
        center={coordinates || defaultCenter}
        zoom={coordinates ? 15 : 4} // Zoom in if coordinates are provided
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {coordinates && (
          <Marker position={coordinates}>
            <Popup>Selected Position</Popup>
          </Marker>
        )}
      </MapContainer>
    );
  };
  
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
      <MapComponent coordinates={ord?.coordinates.coordinates} />

      <h1>{ord?.desiredTime}</h1>
      <h1>{ord?.name}</h1>
    </div>
  )
}

export default Orddetails
