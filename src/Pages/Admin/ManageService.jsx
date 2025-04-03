import axios from "axios";
import React, { useEffect, useState } from "react";

const ManageService = () => {
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [services, setServices] = useState([]);
  const [servFilter, setServFilter] = useState("");
  const [serviceName, setServiceName] = useState(""); // Store service name input

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_API}/api/cat/all-cat`,
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      if (data.success) {
        setCategories(data.categories);
      } else {
        setMessage("Erreur lors du chargement des catégories");
      }
    } catch (err) {
      setMessage("Erreur réseau");
      console.error("Erreur fetch categories:", err.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Create Service
  const handleCreateService = async (catId) => {
    if (!serviceName.trim()) {
      setMessage("Veuillez entrer un nom de service.");
      return;
    }
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_APP_API}/api/serv/create-serv/${catId}`,
        { name: serviceName },
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      if (data.success) {
        setServices((prev) => [...prev, data.newService]); // Update services list
        setMessage("Service ajouté avec succès");
        setServiceName(""); // Reset input
      } else {
        setMessage("Erreur lors de l'ajout du service");
      }
    } catch (err) {
      setMessage("Erreur réseau");
      console.error("Erreur ajout service:", err.message);
    }
  };

  // Fetch Services
  useEffect(() => {
    if (servFilter) fetchService(servFilter);
  }, [servFilter]);

  const fetchService = async (catfilter) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_API}/api/serv/servCat/${catfilter}`,
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      if (data.success) {
        setServices(data.servicesByCat);
      }
    } catch (err) {
      setMessage("Erreur réseau");
      console.error("Erreur fetch services:", err.message);
    }
  };

  // Delete Service
  const handleDeleteServ = async (servId) => {
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_APP_API}/api/serv/delServ/${servId}`,
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      if (data.success) {
        setServices((prev) => prev.filter((serv) => serv._id !== servId));
        setMessage("Service supprimé avec succès");
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("Erreur lors de la suppression du service");
      console.error("Erreur suppression service:", err.message);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Message Feedback */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg shadow-md animate-pulse ${
            message.includes("succès")
              ? "bg-gradient-to-r from-green-200 to-green-100 border border-green-500 text-green-800"
              : "bg-gradient-to-r from-red-200 to-red-100 border border-red-500 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      {/* Add Service Section */}
      <section className="mb-8 bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4 text-indigo-600">Ajouter un Service</h1>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-2" htmlFor="nS">
              Nom du Service:
            </label>
            <input
              id="nS"
              type="text"
              placeholder="Entrez le nom du service"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
            />
          </div>
          <ul>
            {categories.map((cat) => (
              <li
                key={cat._id}
                className="flex items-center mb-4 bg-gray-100 rounded-md p-4 shadow-sm hover:bg-gray-200 transition duration-300"
              >
                <span className="mr-4 font-semibold">{cat.name}</span>
                <button
                  onClick={() => handleCreateService(cat._id)}
                  className="px-6 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-300 shadow-md"
                >
                  ➕ Ajouter
                </button>
              </li>
            ))}
          </ul>
        </form>
      </section>

      {/* List of Services */}
      <section className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-indigo-600">Liste des Services</h1>
        <h2 className="text-xl font-semibold mb-4">Filtrer par Catégorie:</h2>
        <ul>
          {categories.map((cat) => (
            <li
              key={cat._id}
              className="flex items-center mb-4 bg-gray-100 rounded-md p-4 shadow-sm hover:bg-gray-200 transition duration-300"
            >
              <span className="mr-4 font-semibold">{cat.name}</span>
              <button
                onClick={() => setServFilter(cat._id)}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 shadow-md"
              >
                Filtrer
              </button>
            </li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-4">Services:</h2>
        <ul>
          {services.map((serv) => (
            <li
              key={serv._id}
              className="flex justify-between items-center mb-4 bg-gray-50 rounded-md p-4 shadow-sm hover:bg-gray-100 transition duration-300"
            >
              <span className="font-medium">{serv.name}</span>
              <button
                onClick={() => handleDeleteServ(serv._id)}
                className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 shadow-md"
              >
                🗑 Supprimer
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default ManageService;