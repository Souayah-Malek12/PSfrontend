import axios from 'axios';
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';



const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });
  return null;
};

const MapComponent = ({ onPositionSelect, selectedPosition }) => {
  return (
    <MapContainer center={[34.739763, 10.759990]} zoom={15} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {selectedPosition && (
        <Marker position={selectedPosition}>
          <Popup>Selected Position</Popup>
        </Marker>
      )}

      <MapClickHandler onMapClick={onPositionSelect} />
    </MapContainer>
  );
};

const PassOrderRealTime = () => {
  const [order, setOrder] = useState("");
  const [socket, setSocket] = useState(null);

  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [category, setCategory] = useState(null);
  const [desiredTime, setDesiredTime] = useState("");
  const [desiredDate, setDesiredDate] = useState("");
  const [minVal, setMinVal] = useState("");
  const [maxVal, setMaxVal] = useState("")
  const {sId} = useParams()
  const {catId} = useParams()
  const [selectedPosition, setSelectedPosition] = useState(null);


  const handlePositionSelect = (latlng) => {
    setLatitude(latlng.lat);
    setLongitude(latlng.lng);
    setSelectedPosition(latlng);

  };
  console.log("longitude", longitude)
  console.log("latitude", latitude)

  const handleSubmit = async(e) => {
    e.preventDefault();
      try{

        const coordinates = {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)], // Ensure longitude and latitude are numbers
        }
      //socket sending 
     //Parameter serviceId
     const token = localStorage.getItem('token')

     const res = await axios.post(`${import.meta.env.VITE_APP_API}/api/order/${sId}`, {
      details, coordinates , category: catId,minVal, maxVal, desiredTime, desiredDate  }, {headers: {
        authorization: token }
      }
    )
    if(res?.data){
      console.log("order Passed Successfully", res?.data );
      
    }
      const _id = res?.data?.order?._id
      //send order to backend return order ord.id send it to socket 
      const order = {_id, details, coordinates , category, minVal , maxVal , desiredTime, desiredDate};
      socket.emit("sendOrder", {
        order
      })
      console.log("sende front ",order)
      
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
        {/* Map Part */ }

        <MapComponent onPositionSelect={handlePositionSelect} selectedPosition={selectedPosition} />

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
