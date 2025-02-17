import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = ({ coordinates }) => {

  return (
    <MapContainer
      center={coordinates }
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

const DoneOrders = () => {
  const { wId } = useParams();
  const [orders, setOrders] = useState([]);

  const getMyDoneOrders = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_API}/api/order/myDoneOrders`, 
        {
          headers: {
            authorization: localStorage.getItem('token'),
          },
        }
      );

      if (data?.success) {
        setOrders(data.orders);
        console.log(data.orders);
      } else {
        console.log(data?.message);
      }
    } catch (err) {
      console.log("getMyDoneOrders error", err.message);
    }
  };

  useEffect(() => {
    getMyDoneOrders();
  }, [wId]);

  return (
    <div>
    
    <div>
      <h1>Completed Orders</h1>
      {orders.length > 0 ? (
        orders.map((order) => (
          <div key={order._id}>
            <h2>{order.name}</h2>
            <p>{order.status}</p>
            <h3>{order.details}</h3>
            <h4>Desired Date: {order.desiredDate}</h4>
            <h4>Desired Time: {order.desiredTime}</h4>
            <MapComponent coordinates={order.coordinates.coordinates} />
          </div>
        ))
      ) : (
        <p>No completed orders found.</p>
      )}
    </div>
    </div>
  );
};

export default DoneOrders;
