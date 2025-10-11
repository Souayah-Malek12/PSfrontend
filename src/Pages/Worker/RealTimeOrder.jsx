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
  const [successMessage, setSuccessMessage] = useState("");
  const [localBidValues, setLocalBidValues] = useState({}); // Store bid values per order

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
    const bidValue = localBidValues[ord._id] || bidVal;
    
    if (bidValue && bidValue >= ord.minVal && bidValue <= ord.maxVal) {
      const OrdBid = {
        order: ord,
        price: bidValue,
        socketId: socket.id,
      };
      console.log("Submitting bid:", OrdBid);
      socket.emit("bid", OrdBid);
      
      // Clear the specific bid input
      setLocalBidValues(prev => ({ ...prev, [ord._id]: "" }));
    } else {
      alert("Please enter a valid price within the range.");
    }
  };

  const handleBidInputChange = (ordId, value) => {
    setLocalBidValues(prev => ({ ...prev, [ordId]: value }));
  };

  const acquireOrderCall = async (ordId) => {
    try {
      const token = localStorage.getItem("token");
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

  const showSuccessMessage = (orderDetails, price) => {
    const message = `🎉 Successfully acquired order: "${orderDetails}" for $${price}`;
    setSuccessMessage(message);
    
    // Hide message after 4 seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 4000);
  };

  useEffect(() => {
    socket.on("acquiredOrder", (minBid) => {
      console.log("Acquired Order:", minBid);
      const ordId = minBid.order._id;
      setOrdId(ordId);
      
      // Show success message
      showSuccessMessage(minBid.order.details, minBid.price);
      
      // Acquire the order
      acquireOrderCall(ordId);
      
      // Add to acquired orders
      setAcquiredOrd((prevOrds) => [...prevOrds, minBid]);
      
      // Remove from available orders
      setOrders((prevOrders) => 
        prevOrders.filter(order => order._id !== ordId)
      );
    });

    socket.on("bidEnd", (data) => {
      console.log("Bid ended with value:", data);
    });

    return () => {
      socket.off("acquiredOrder");
      socket.off("bidEnd");
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-8 relative">
      {/* Success Message Toast */}
      {successMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-md">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{successMessage}</span>
            <button 
              onClick={() => setSuccessMessage("")}
              className="ml-2 hover:bg-green-600 rounded-full p-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* NEW ORDERS SECTION */}
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">New Orders</h1>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {orders.length} available
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No new orders</h3>
            <p className="mt-1 text-sm text-gray-500">Check back later for new opportunities.</p>
          </div>
        ) : (
          orders.map((ord, index) => (
            <div key={ord._id || index} className="border border-gray-200 rounded-lg p-6 mb-4 last:mb-0 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{ord.name}</h2>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                  {ord.category}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4">{ord.details}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Desired Time:</span> {ord.desiredTime}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Price Range:</span> ${ord.minVal} - ${ord.maxVal}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Desired Date:</span> {ord.desiredDate}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Status:</span> 
                    <span className="ml-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                      {ord.status || 'Active'}
                    </span>
                  </p>
                </div>
              </div>

              {/* Display Coordinates on Map */}
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2 text-gray-700">Location</h3>
                <MapComponent coordinates={ord?.coordinates?.coordinates} />
              </div>

              {/* Bid Input */}
              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
                <input
                  type="number"
                  min={ord.minVal}
                  max={ord.maxVal}
                  value={localBidValues[ord._id] || ""}
                  onChange={(e) => handleBidInputChange(ord._id, e.target.value)}
                  placeholder={`Enter bid (${ord.minVal}-${ord.maxVal})`}
                  className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => handleBid(ord)}
                  disabled={!localBidValues[ord._id]}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto whitespace-nowrap"
                >
                  Place Bid
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ACQUIRED ORDERS SECTION */}
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Acquired Orders</h1>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            {acquiredOrds.length} acquired
          </span>
        </div>

        {acquiredOrds.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No orders acquired yet.</p>
        ) : (
          acquiredOrds.map((ord, index) => (
            <div key={index} className="border border-green-200 rounded-lg p-6 mb-4 last:mb-0 bg-green-50">
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-semibold text-gray-800">{ord.order?.name}</h2>
                <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                  Acquired
                </span>
              </div>
              
              <p className="text-gray-600 mb-4">{ord.order?.details}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Category:</span> {ord.order?.category}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Price Range:</span> ${ord.order?.minVal} - ${ord.order?.maxVal}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Desired Time:</span> {ord.order?.desiredTime}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Desired Date:</span> {ord.order?.desiredDate}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-green-100 rounded-lg">
                <p className="text-green-800 font-medium text-lg text-center">
                  ✅ Acquired for: ${ord.price}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Custom CSS for fade-in animation */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translate(-50%, -20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default RealTimeOrder;