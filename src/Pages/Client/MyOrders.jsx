import axios from "axios";
import React, { useEffect, useState } from "react";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState(null); // State for message feedback
  const [success, setSuccess] = useState(null); // State for success feedback

  const idCli = JSON.parse(localStorage.getItem("user"))?.id;

  const fetchMyOrders = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_API}/api/order/myOrds/${idCli}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      if (data.success) {
        setOrders(data.ordsList);
      } else {
        setMessage(data.message);
        setSuccess(false);
      }
    } catch (err) {
      console.error("Error fetching orders:", err.message);
      setMessage("Failed to fetch orders");
      setSuccess(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, [idCli]);

  const handleDeleteOrder = async (ordId) => {
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_APP_API}/api/order/${ordId}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setMessage(data.message);
      setSuccess(data.success);
      if (data.success) {
        setOrders(orders.filter((order) => order._id !== ordId));
      }
    } catch (err) {
      console.error("Error deleting order:", err.message);
      setMessage("Failed to delete order");
      setSuccess(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">My Orders</h1>

      {/* Display messages */}
      {message && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            success ? "bg-green-100 border border-green-400 text-green-700" : "bg-red-100 border border-red-400 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* Orders List */}
      {Array.isArray(orders) && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <div
              key={index}
              className="p-4 bg-white shadow-md rounded-lg border border-gray-200"
            >
              <h2 className="text-xl font-semibold mb-2">{order.name}</h2>
              <p className="text-gray-600 mb-2">{order.details}</p>
              <p className="text-gray-600 mb-2">Status: {order.status}</p>
              <p className="text-gray-600 mb-2">Desired Date: {order.desiredDate}</p>
              <p className="text-gray-600 mb-2">Desired Time: {order.desiredTime}</p>
              <button
                onClick={() => handleDeleteOrder(order._id)}
                className="mt-4 inline-block px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md transition duration-200"
              >
                Delete Order
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No orders found.</p>
      )}
    </div>
  );
};

export default MyOrders;