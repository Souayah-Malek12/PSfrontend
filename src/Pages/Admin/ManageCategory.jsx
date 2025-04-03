import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_API}/api/cat/all-cat`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
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

  // Add Category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_APP_API}/api/cat/create-cat`,
        { name },
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      if (data.success) {
        setCategories((prev) => [...prev, data.newCat]); // Add directly to state
        setMessage("Catégorie ajoutée avec succès");
        setName(""); // Reset input
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("Erreur lors de l'ajout de la catégorie");
      console.error("Erreur ajout catégorie:", err.message);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (catId) => {
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_APP_API}/api/cat/del-cat/${catId}`,
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      if (data.success) {
        setCategories((prev) => prev.filter((cat) => cat._id !== catId));
        setMessage("Catégorie supprimée avec succès");
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("Erreur lors de la suppression de la catégorie");
      console.error("Erreur suppression catégorie:", err.message);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Header */}
      <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600 animate-pulse">
        Liste des Catégories
      </h2>

      {/* Message Feedback */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg shadow-md ${
            message.includes("succès")
              ? "bg-gradient-to-r from-green-200 to-green-100 border border-green-500 text-green-800"
              : "bg-gradient-to-r from-red-200 to-red-100 border border-red-500 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      {/* Add Category Form */}
      <form
        onSubmit={handleAddCategory}
        className="mb-8 bg-white shadow-md rounded-lg p-6"
      >
        <h3 className="text-2xl font-semibold mb-4 text-purple-600">Ajouter une Catégorie</h3>
        <div className="mb-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nouvelle catégorie"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition duration-300 shadow-md"
        >
          Ajouter
        </button>
      </form>

      {/* Categories List */}
      <ul className="space-y-4">
        {categories.map((cat) => (
          <li
            key={cat._id}
            className="flex justify-between items-center bg-gray-50 rounded-md p-4 shadow-sm hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105"
          >
            <span className="font-medium">{cat.name}</span>
            <button
              onClick={() => handleDeleteCategory(cat._id)}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 shadow-md"
            >
              🗑 Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageCategories;