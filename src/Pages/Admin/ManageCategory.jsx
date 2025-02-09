import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_APP_API}/api/cat/all-cat`, {
        headers : {
            Authorization: localStorage.getItem('token')
        }
      });
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

  // 📌 Ajouter une catégorie
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
        setCategories([...categories, data.newCat]); // ✅ Ajouter directement à l'état
        setMessage("Catégorie ajoutée avec succès");
        setName("");
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("Erreur lors de l'ajout de la catégorie");
      console.error("Erreur ajout catégorie:", err.message);
    }
  };

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
    <div>
      <h2>Liste des Catégories</h2>
      {message && <p>{message}</p>}

      
      <form onSubmit={handleAddCategory}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nouvelle catégorie"
          required
        />
        <button type="submit">Ajouter</button>
      </form>

      <ul>
        {categories.map((cat) => (
          <li key={cat._id}>
            {cat.name}{"       "}
            <button onClick={() => handleDeleteCategory(cat._id)}>🗑 Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageCategories;
