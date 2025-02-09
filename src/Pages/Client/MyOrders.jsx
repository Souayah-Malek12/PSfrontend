import axios from 'axios';
import React, { useEffect, useState } from 'react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState(null); // State for message feedback
  const [success, setSuccess] = useState(null); // State for success feedback

  const idCli = JSON.parse(localStorage.getItem('user')).id; 

  const fetchMyOrders = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_APP_API}/api/order/myOrds/${idCli}`, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });

      if (data.success) {
        setOrders(data.ordsList);
      } else {
        setMessage(data.message);
        setSuccess(false);
      }
    } catch (err) {
      console.error('Error fetching orders:', err.message);
      setMessage('Failed to fetch orders');
      setSuccess(false);
    }
  };
  useEffect(() => {
    fetchMyOrders();
  }, [idCli]);

  const handleDeleteOrder = async (ordId) => {
    try {
      const { data } = await axios.delete(`${import.meta.env.VITE_APP_API}/api/order/${ordId}`, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });

      setMessage(data.message);
      setSuccess(data.success);

      if (data.success) {
        setOrders(orders.filter(order => order._id !== ordId));
      }
    } catch (err) {
      console.error('Error deleting order:', err.message);
      setMessage('Failed to delete order');
      setSuccess(false);
    }
  };
  console.log("message", message)

  return (
    <div>
      <h1>My Orders</h1>

      {/* ✅ Display the message from backend */}
      {message && (
        <div>
          ##{message}##
        </div>
      )}

      {Array.isArray(orders) && orders.length > 0 ? (
        orders.map((order, index) => (
          <div key={index}>
            <h2>{order.name}</h2>
            <p>{order.details}</p>
            <p>Status: {order.status}</p>
            <p>Desired Date: {order.desiredDate}</p>
            <p>Desired Time: {order.desiredTime}</p>
            <button onClick={() => handleDeleteOrder(order._id)}>Delete Order</button>
          </div>
        ))
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default MyOrders;
