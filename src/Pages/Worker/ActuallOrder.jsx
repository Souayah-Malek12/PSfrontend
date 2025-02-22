import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ActuallOrder = () => {
  const [ordsList, setOrdsList] = useState([]);
  const navigate = useNavigate();

  const handleAcqOrders = async () => {
    try {
      const wId = JSON.parse(localStorage.getItem("user"))?.id;
      console.log("test", wId);

      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_API}/api/order/acqOrds/${wId}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      setOrdsList(data?.ordsListe);
      console.log("datatataat", data);
    } catch (err) {
      console.log("handleAcqOrders error", err.message);
    }
  };

  useEffect(() => {
    handleAcqOrders();
  }, []);

  const handleInProgress = async (ordid) => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_APP_API}/api/worker/progressOrd/${ordid}`,
        {},
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (data?.success) {
        setOrdsList(
          ordsList.map((ord) =>
            ord?._id === ordid ? { ...ord, status: "in progress" } : ord
          )
        );
      }
      if (!data?.success) {
        console.log(data?.message);
      }
    } catch (err) {
      console.log("handleAcqOrders error", err.message);
    }
  };

  const handleDone = (ordid) => {
    navigate(`/doneJob/${ordid}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-8">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6">Acquired Orders List</h1>

      {/* Orders List */}
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
        {ordsList.length === 0 && (
          <p className="text-gray-600 text-center">No acquired orders available.</p>
        )}

        {ordsList.map((ord, index) => (
          <div key={index} className="border-b last:border-b-0 pb-4">
            {ord?.status !== "completed" && (
              <div>
                {/* Order Name */}
                <h2 className="text-xl font-semibold mb-2">{ord?.name}</h2>

                {/* Order Details */}
                <p className="text-gray-700 mb-2">{ord?.details}</p>

                {/* Status */}
                <p className="text-gray-700 mb-2">Status: {ord?.status}</p>

                {/* Desired Date and Time */}
                <p className="text-gray-700 mb-2">Desired Date: {ord?.desiredDate}</p>
                <p className="text-gray-700 mb-4">Desired Time: {ord?.desiredTime}</p>

                {/* Buttons */}
                <div className="flex items-center space-x-4">
                  {/* In Progress Button */}
                  {ord.status !== "in progress" && ord.status !== "completed" && (
                    <button
                      onClick={() => handleInProgress(ord._id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Mark as In Progress
                    </button>
                  )}

                  {/* Done Button */}
                  <button
                    onClick={() => handleDone(ord._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    Mark as Done
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActuallOrder;