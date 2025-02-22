import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Map Component
const MapComponent = ({ coordinates }) => {
  // Default center (fallback if coordinates are not provided)
  const defaultCenter = [10.505, 34.09];
  return (
    <MapContainer
      center={coordinates || defaultCenter}
      zoom={coordinates ? 15 : 4} // Zoom in if coordinates are provided
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

const Orddetails = () => {
  const { ordid } = useParams();
  const [ord, setOrd] = useState(null); // Initialize as null instead of ""

  // Fetch order details
  const handleOrddetails = async () => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_APP_API}/api/worker/doneOrd/${ordid}`,
        {},
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (data?.success) {
        setOrd(data?.order); // Set the fetched order data
        console.log("Order Data:", data?.order);
      } else {
        console.log("Error Message:", data?.message);
      }
    } catch (err) {
      console.error("Error fetching order details:", err.message);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    if (ordid) {
      handleOrddetails();
    }
  }, [ordid]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-8">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        {/* Loading State */}
        {!ord ? (
          <p className="text-center text-gray-600 text-lg font-medium">
            Loading order details...
          </p>
        ) : (
          <>
            {/* Order Details */}
            <h1 className="text-2xl font-bold mb-4">{ord.name}</h1>
            <p className="text-gray-700 mb-2">Status: {ord.status}</p>
            <h2 className="text-lg font-semibold mb-2">Details:</h2>
            <p className="text-gray-700 mb-4">{ord.details}</p>

            {/* Desired Date and Time */}
            <div className="mb-4">
              <p className="text-gray-700">
                Desired Date:{" "}
                <span className="font-semibold">{ord.desiredDate}</span>
              </p>
              <p className="text-gray-700">
                Desired Time:{" "}
                <span className="font-semibold">{ord.desiredTime}</span>
              </p>
            </div>

            {/* Map Component */}
            <MapComponent coordinates={ord?.coordinates.coordinates} />

            {/* Additional Information */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Additional Info:</h3>
              <p className="text-gray-700">Name: {ord.name}</p>
              <p className="text-gray-700">Status: {ord.status}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Orddetails;