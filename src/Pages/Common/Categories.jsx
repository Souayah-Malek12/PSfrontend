import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState(null); // State for message feedback
  const [success, setSuccess] = useState(null); // State for success feedback
const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_APP_API}/api/cat/all-cat`);

      if (data.success) {
        setCategories(data.categories);
      } else {
        setMessage(data.message);
        setSuccess(false);
      }
    } catch (err) {
      console.error('Error fetching categories:', err.message);
      setMessage('Failed to fetch categories');
      setSuccess(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      <h1>Categories</h1>

      {/* ✅ Display the message from backend */}
      {message && (
        <div>
          ##{message}##
        </div>
      )}

      {Array.isArray(categories) && categories.length > 0 ? (
        categories.map((category, index) => (
          <div key={index} onClick={() => navigate(`/services/${category._id}`)}>
            <h2>{category.name}</h2>
            <p>{category.description}</p>
          </div>
        ))
      ) : (
        <p>No categories found.</p>
      )}
    </div>
  );
};

export default Categories;