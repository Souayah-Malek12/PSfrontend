import axios from "axios";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";

const MapComponent = ({ coordinates }) => {
  const defaultCenter = [10.505, 34.09];
  return (
    <MapContainer
      center={coordinates || defaultCenter}
      zoom={coordinates ? 15 : 4}
      style={{ height: "400px", width: "100%" }}
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

const socket = io("http://localhost:5001");

const RealTimeOrder = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [acquiredOrds, setAcquiredOrd] = useState([]);
  const [bidVal, setBidVal] = useState("");
  const [ordId, setOrdId] = useState("");
  const [coordinates, setCoordinates] = useState(null);

  useEffect(() => {
    const worker = JSON.parse(localStorage.getItem("user"));
    socket.emit("addWorkers", worker);
  }, []);

  const getOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const workerCoordinates = JSON.parse(localStorage.getItem("user"))?.coordinates;

      const res = await axios.get(
        `${import.meta.env.VITE_APP_API}/api/order/NearbyOrds`,
        {
          params: { coordinates: JSON.stringify(workerCoordinates) },
          headers: { authorization: token },
        }
      );

      if (Array.isArray(res?.data?.nearestOrders)) {
        setOrders([...res.data.nearestOrders]);
      }
      if (orders.length !== 0) {
        console.log("No error available");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
    socket.on("getOrder", (order) => {
      console.log("Real-time order received:", order.order);
      setOrders((prevOrders) => [...prevOrders, order.order]);
    });

    return () => {
      socket.off("getOrder");
    };
  }, []);

  const handleBid = (ord) => {
    if (bidVal && bidVal >= ord.minVal && bidVal <= ord.maxVal) {
      const OrdBid = {
        order: ord,
        price: bidVal,
        socketId: socket.id,
      };
      console.log("Submitting bid:", OrdBid);
      socket.emit("bid", OrdBid);
    } else {
      alert("Please enter a valid price within the range.");
    }
  };

  const acquireOrderCall = async (ordId) => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token);

      const { data } = await axios.put(
        `${import.meta.env.VITE_APP_API}/api/worker/acquireOrd/${ordId}`,
        {},
        { headers: { authorization: token } }
      );

      if (data?.success) {
        console.log(data?.message);
      } else {
        console.log(data?.message);
      }
    } catch (error) {
      console.log("Error in calling API acquireOrderCall", error.message);
    }
  };

  useEffect(() => {
    socket.on("acquiredOrder", (minBid) => {
      console.log("Acquired Order:", minBid);
      setOrdId(minBid.order._id);
      const ordId = minBid.order._id;
      console.log("Order ID:", minBid.order._id);
      acquireOrderCall(ordId);
      setAcquiredOrd((prevOrds) => [...prevOrds, minBid]);

      socket.on("bidEnd", (data) => {
        console.log("Acquired with value of:", data);
      });
    });

    console.log("My Orders:", acquiredOrds);

    return () => {
      socket.off("acquiredOrder");
    };
  }, [acquiredOrds]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-8">
      {/* NEW ORDERS SECTION */}
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg mb-8">
        <h1 className="text-2xl font-bold mb-4">NEW Orders</h1>

        {orders.map((ord, index) => (
          <div key={index} className="border-b last:border-b-0 pb-4">
                        <h1 className="text-xl font-semibold mb-2">{ord.name}</h1>

            <h1 className="text-xl font-semibold mb-2">{ord.details}</h1>
            <p className="text-gray-700 mb-2">Desired Time: {ord.desiredTime}</p>
            <p className="text-gray-700 mb-2">Category: {ord.category}</p>
            <p className="text-gray-700 mb-2">Price Range: ${ord.minVal} - ${ord.maxVal}</p>

            {/* Display Coordinates on Map */}
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Location:</h3>
              <MapComponent coordinates={ord?.coordinates?.coordinates} />
            </div>

            {/* Bid Input */}
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min={ord.minVal}
                max={ord.maxVal}
                onChange={(e) => setBidVal(e.target.value)}
                placeholder={`Enter bid (${ord.minVal}-${ord.maxVal})`}
                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleBid(ord)}
                disabled={!bidVal}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Bid a Price
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ACQUIRED ORDER SECTION */}
      {/* Uncomment and style as needed */}
      {/* 
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Acquired Order</h1>
        {acquiredOrds.length > 0 ? (
          acquiredOrds.map((ord, index) => (
            <div key={index} className="border-b last:border-b-0 pb-4">
              <h1 className="text-xl font-semibold mb-2">{ord.order?.details}</h1>
              <p className="text-gray-700 mb-2">Category: {ord.order?.category}</p>
              <p className="text-gray-700 mb-2">Min Value: ${ord.order?.minVal}</p>
              <p className="text-gray-700 mb-2">Max Value: ${ord.order?.maxVal}</p>
              <p className="text-gray-700 mb-2">Desired Time: {ord.order?.desiredTime}</p>
              <p className="text-gray-700 mb-2">Desired Date: {ord.order?.desiredDate}</p>
              <p className="text-green-600 font-medium">With Price: ${ord.price}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center">No orders acquired yet.</p>
        )}
      </div>
      */}
    </div>
  );
};

export default RealTimeOrder;