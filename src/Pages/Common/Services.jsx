import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ServiceOrdersByStatus = () => {
  const [orders, setOrders] = useState([]);
  const [list, setList] = useState([]);

  const [status, setStatus] = useState("Pending");
  const navigate = useNavigate();
  const {catId}= useParams();
  console.log("hhhhhhh",catId);

  const fetchOrdersByStatus = async () => {

    try {
      console.log("hhhhhhh",catId);
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_API}/api/serv/servCat/${catId}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      if (data.success) {
        console.log("data.serviceByStatus",data);
        setList(data.servicesByCat);
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

     
      {list.map((service) => (
  <div key={service._id} className="mb-4 p-4 border rounded-lg">
    <h2 className="text-xl font-semibold">{service.name}</h2>
    <p className="text-gray-600 mb-2">Status: {service.status}</p>
    <button
      onClick={() => navigate(`/PassrealTimeOrd/${catId}/${service._id}`)}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      Pass an Order
    </button>
  </div>
))}
    </div>
  );
};

export default ServiceOrdersByStatus;