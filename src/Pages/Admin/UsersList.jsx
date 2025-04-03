import axios from "axios";
import React, { useEffect, useState } from "react";
import { useUserRole } from "../../Context/UserContext";
import Footer from "../../components/Layouts/Footer";

const UsersList = () => {
  const [clients, setClients] = useState([]);
  const [searchedR, setSearchedR] = useState(""); // Role to filter clients
  const [message, setMessage] = useState("");
  const { userRole } = useUserRole();

  const fetchClients = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_API}/api/adm/allUsers/${searchedR}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      if (data.success) {
        setClients(data.clientsList);
        setMessage("");
      } else {
        setClients([]);
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("Error fetching clients");
      console.error("Error fetching clients:", err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_APP_API}/api/worker/delete-one/${userId}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      if (data.success) {
        // Re-fetch the clients list after deletion
        setClients((prev) => prev.filter((c) => c._id !== userId));
        setMessage("User deleted successfully");
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("Error deleting user");
      console.error("Error deleting user:", err.message);
    }
  };

  useEffect(() => {
    if (searchedR) {
      fetchClients();
    }
    console.log("userRole", userRole);
  }, [searchedR]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Header */}
      <h1 className="text-3xl font-bold text-center mb-6 text-indigo-600 animate-pulse">
        Liste des Utilisateurs
      </h1>

      {/* Message Feedback */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg shadow-md ${
            message.includes("success") || message.includes("deleted")
              ? "bg-gradient-to-r from-green-200 to-green-100 border border-green-500 text-green-800"
              : "bg-gradient-to-r from-red-200 to-red-100 border border-red-500 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      {/* Role Filter */}
      <div className="mb-6">
        <label className="block font-medium text-gray-700 mb-2" htmlFor="roleFilter">
          Filtre par Rôle:
        </label>
        <select
          id="roleFilter"
          onChange={(e) => setSearchedR(e.target.value)}
          value={searchedR}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
        >
          <option value="">Sélectionner un rôle</option>
          <option value="Client">Client</option>
          <option value="Worker">Travailleur</option>
          <option value="Service Client">Service Client</option>
        </select>
      </div>

      {/* Clients List */}
      {Array.isArray(clients) && clients.length > 0 ? (
        clients.map((client, index) => (
          <div
            key={client._id}
            className="bg-white shadow-md rounded-lg p-4 mb-4 hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            <h2 className="text-xl font-semibold mb-2">{client.nom} {client.prenom}</h2>
            <p className="text-gray-600 mb-2">Email: {client.email}</p>
            <p className="text-gray-600 mb-2">Téléphone: {client.phone}</p>
            <p className="text-gray-600 mb-2">Rôle: {client.role}</p>
            {userRole !== "Adminstrator" && (
              <button
                onClick={() => handleDeleteUser(client._id)}
                className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 shadow-md"
              >
                🗑 Supprimer
              </button>
            )}
          </div>
        ))
      ) : !message ? (
        <p className="text-center text-gray-500">Aucun utilisateur trouvé.</p>
      ) : null}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default UsersList;