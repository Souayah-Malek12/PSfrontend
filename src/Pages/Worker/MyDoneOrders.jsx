import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Map Component
const MapComponent = ({ coordinates }) => {
  return (
    <MapContainer
      center={coordinates}
      zoom={coordinates ? 15 : 4} // Zoom in if coordinates are provided
      style={{ height: "300px", width: "100%" }}
      className="rounded-lg shadow-md"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {coordinates && (
        <Marker position={coordinates}>
          <Popup className="bg-white rounded-md shadow-md p-2">
            Selected Position
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

const DoneOrders = () => {
  const { wId } = useParams();
  const [orders, setOrders] = useState([]);

  // Fetch completed orders
  const getMyDoneOrders = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_API}/api/order/myDoneOrders`,
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      );

      if (data?.success) {
        setOrders(data.orders);
        console.log("Completed Orders:", data.orders);
      } else {
        console.log("Error Message:", data?.message);
      }
    } catch (err) {
      console.error("Error fetching completed orders:", err.message);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    getMyDoneOrders();
  }, [wId]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-8">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6">Completed Orders</h1>

      {/* Orders List */}
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <div
              key={order._id}
              className="border-b last:border-b-0 pb-4"
            >
              {/* Order Details */}
              <h2 className="text-xl font-semibold mb-2">{order.name}</h2>
              <p className="text-gray-700 mb-2">Status: {order.status}</p>
              <p className="text-gray-700 mb-2">Details: {order.details}</p>
              <p className="text-gray-700 mb-2">Desired Date: {order.desiredDate}</p>
              <p className="text-gray-700 mb-2">Desired Time: {order.desiredTime}</p>

              {/* Map Component */}
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Location:</h3>
                <MapComponent coordinates={order?.coordinates?.coordinates} />
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center">No completed orders found.</p>
        )}
      </div>
    </div>
  );
};

export default DoneOrders;