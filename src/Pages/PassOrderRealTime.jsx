import axios from 'axios';
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const PassOrderRealTime = () => {
  const [order, setOrder] = useState("");
  const [socket, setSocket] = useState(null);

  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [category, setCategory] = useState("");
  const [clientId, setClientId] = useState("");
  const [desiredTime, setDesiredTime] = useState("");
  const [desiredDate, setDesiredDate] = useState("");
  const [minVal, setMinVal] = useState("");
  const [maxVal, setMaxVal] = useState("")

  const handleSubmit = async(e) => {
    e.preventDefault();
       
        const coordinates = {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)], // Ensure longitude and latitude are numbers
        }
       
              
    try{
      //socket sending 
     


      const order = {details, coordinates , category, minVal , maxVal , desiredTime, desiredDate};
      socket.emit("sendOrder", {
        order
      })
      const token = localStorage.getItem('token')
      //serviceId
      const res = await axios.post(`${import.meta.env.VITE_APP_API}/api/order/6744a68d06c63ef5996a1900`, {
        details, coordinates , category, desiredTime, desiredDate  }, {headers: {
          authorization: token }
        }
      )
      if(res?.data?.success){
        console.log("order Passed Successfully", res?.data );
        
      }
    }catch(err){
      console.log(err)
    }
     
  }

  useEffect(()=>{
    setSocket(io('http://localhost:5001'));
},[])
  return (
    <div>
    <h1>Pass Order Now</h1>
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Details:</label>
        <input
          type="text"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          required
        />
      </div>
      <div>
        <label>From $ </label>
        <input type="number" value={minVal} onChange={(e)=> setMinVal(e.target.value)} />
      </div>
      <div>
        <label>To $ </label>
        <input type="number" value={maxVal} onChange={(e)=> setMaxVal(e.target.value)} />
      </div>
      <div>
        <label>Longitude:</label>
        <input
          type="number"
          step="any"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Latitude:</label>
        <input
          type="number"
          step="any"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Category:</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Client ID:</label>
        <input
          type="text"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Desired Time:</label>
        <input
          type="datetime-local"
          value={desiredTime}
          onChange={(e) => setDesiredTime(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Desired Date:</label>
        <input
          type="date"
          value={desiredDate}
          onChange={(e) => setDesiredDate(e.target.value)}
          required
        />
      </div>
      <button type="submit">Submit Order</button>
    </form>
  </div>
  );
}

export default PassOrderRealTime
