import React, { useState, useEffect } from "react";
import axios from "axios";

const Registre = () => {
  const [categories, setCategories] = useState([]);
  const [profession, setProfession] = useState("");

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_API}/api/cat/all-cat`
      );
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error("Error fetching categories:", err.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    latitude: "",
    longitude: "",
    profession: "",
    role: "Client",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Ensure profession updates in formData when selected
    if (e.target.name === "profession") {
      setProfession(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      coordinates: [formData.latitude, formData.longitude],
      profession: profession, // Ensure profession is set correctly
      role: formData.role,
    };

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const { data } = await axios.post(
        `${import.meta.env.VITE_APP_API}/api/auth/register`,
        userData
      );

      if (data.success) {
        setSuccess(data.message);
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
          latitude: "",
          longitude: "",
          profession: "",
          role: "Client", // Reset role to default "Client" instead of empty string
        });
        setProfession(""); // Reset profession state
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="latitude"
          placeholder="Latitude"
          value={formData.latitude}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="longitude"
          placeholder="Longitude"
          value={formData.longitude}
          onChange={handleChange}
          required
        />
        <select name="role" value={formData.role} onChange={handleChange} required>
          <option value="Client">Client</option>
          <option value="Service Client">Service Client</option>
          <option value="Worker">Worker</option>
        </select>

        {formData.role !== "Client" &&
          categories.map((cat) => (
            <ul key={cat._id}>
              <li
                onClick={() => {
                  setProfession(cat._id);
                  setFormData({ ...formData, profession: cat._id });
                }}
                style={{ cursor: "pointer", fontWeight: profession === cat._id ? "bold" : "normal" }}
              >
                {cat.name}
              </li>
            </ul>
          ))}

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Registre;
