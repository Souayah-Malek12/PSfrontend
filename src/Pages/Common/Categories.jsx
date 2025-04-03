import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from React Router

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState(null); // State for message feedback
  const [success, setSuccess] = useState(null); // State for success feedback
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_API}/api/cat/all-cat`
      );
      if (data.success) {
        setCategories(data.categories);
      } else {
        setMessage(data.message);
        setSuccess(false);
      }
    } catch (err) {
      console.error("Error fetching categories:", err.message);
      setMessage("Failed to fetch categories");
      setSuccess(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Header */}
      <h1 className="text-4xl font-bold text-center mb-8 animate-pulse text-indigo-600">
        Categories
      </h1>

      {/* Message Feedback */}
      {message && (
        <div
          className={`mb-4 p-4 rounded-lg shadow-md animate-bounce ${
            success
              ? "bg-green-200 border border-green-500 text-green-800"
              : "bg-red-200 border border-red-500 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      {/* Categories List */}
      {Array.isArray(categories) && categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              onClick={() => navigate(`/services/${category._id}`)}
              className="cursor-pointer bg-white shadow-md rounded-lg border border-gray-200 p-4 hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 hover:text-white"
            >
              <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
              <p className="text-gray-600">{category.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 animate-pulse">No categories found.</p>
      )}
    </div>
  );
};

export default Categories;