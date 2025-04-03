import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ServiceOrdersByStatus = () => {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("Pending");
  const navigate = useNavigate();

  const fetchOrdersByStatus = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_API}/api/order/serv-order/${status}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      if (data.success) {
        setOrders(data.serviceByStatus);
      } else {
        console.log(data.success);
        console.log(data.message);
      }
    } catch (err) {
      console.error("Error fetching orders by status:", err.message);
    }
  };

  useEffect(() => {
    fetchOrdersByStatus();
  }, [status]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Header */}
      <h1 className="text-3xl font-bold text-center mb-6 text-indigo-600 animate-pulse">
        Liste des Commandes par Statut
      </h1>

      {/* Status Filter */}
      <div className="mb-6">
        <label className="block font-medium text-gray-700 mb-2" htmlFor="statusFilter">
          Filtre par Statut:
        </label>
        <select
          id="statusFilter"
          onChange={(e) => setStatus(e.target.value)}
          value={status}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
        >
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Done</option>
        </select>
      </div>

      {/* Orders List */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-purple-600">
          Commandes avec statut: {status}
        </h2>
        {Array.isArray(orders) && orders.length > 0 ? (
          orders.map((order, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-4 mb-6 hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              <h2 className="text-xl font-semibold mb-2">{order.name}</h2>
              <p className="text-gray-600 mb-2">{order.details}</p>
              <p className="text-gray-600 mb-2">Statut: {order.status}</p>
              <p className="text-gray-600 mb-2">Client ID: {order.clientId}</p>
              <p className="text-gray-600 mb-2">Date Désirée: {order.desiredDate}</p>
              <p className="text-gray-600 mb-2">Heure Désirée: {order.desiredTime}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Aucune commande trouvée pour ce statut.</p>
        )}
      </div>
    </div>
  );
};

export default ServiceOrdersByStatus;