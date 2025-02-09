// liste des orders (par etat: unaacepted / accepted/ pending/in progress/ done)
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ServiceOrdersByStatus = () => {
  const [orders, setOrders] = useState([]);
    const [status , setStatus] = useState("Pending")
  const navigate = useNavigate();

  const fetchOrdersByStatus = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_APP_API}/api/order/serv-order/${status}`, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });

      if (data.success) {
        setOrders(data.serviceByStatus);
      } else {
        console.log(data.success);
        console.log(data.message);
      }
    } catch (err) {
      console.error('Error fetching orders by status:', err.message);
    }
  };

  useEffect(() => {
    fetchOrdersByStatus();
  }, [status]);

  return (
    <div>
        <div>
        <select onChange={(e) => setStatus(e.target.value)} value={status}>
          <option value="Pending">Pending</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Done</option>
        </select>
        </div>
        <div>
      <h1>Orders with status: {status}</h1>
      {Array.isArray(orders) && orders.length > 0 ? (
        orders.map((order, index) => (
          <div key={index}>
            <h2>{order.name}</h2>
            <p>{order.details}</p>
            <p>Status: {order.status}</p>
            <p>Desired Date: {order.desiredDate}</p>
            <p>Desired Time: {order.desiredTime}</p>
          </div>
        ))
      ) : (
        <p>No orders found for this status.</p>
      )}
    </div>
    </div>
  );
};

export default ServiceOrdersByStatus;
