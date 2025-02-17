import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });
  return null;
};
const MapComponent = ({ onPositionSelect, selectedPosition }) => {
  return (
    <MapContainer center={[34.739763, 10.759990]} zoom={15} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {selectedPosition && (
        <Marker position={selectedPosition}>
          <Popup>Selected Position</Popup>
        </Marker>
      )}

      <MapClickHandler onMapClick={onPositionSelect} />
    </MapContainer>
  );
};

const Registre = () => {
  const [categories, setCategories] = useState([]);
  const [profession, setProfession] = useState("");
  const [selectedPosition, setSelectedPosition] = useState(null);


  const handlePositionSelect = (latlng) => {
    setFormData({
      ...formData,
      latitude: latlng.lat,
      longitude: latlng.lng
    })

  };
  

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
  console.log("longitude", formData.longitude)
  console.log("latitude", formData.latitude)
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
    <div className="h-full w-full bg-gray-100 dark:bg-gray-900">
      <div className="mx-auto w-full">
        <div className="flex justify-center px-6 py-12 w-full">
          <div className="w-full xl:w-3/4 lg:w-11/12 flex">
            <div className="w-full lg:w-full bg-blue-100 dark:bg-gray-700 p-5 rounded-lg lg:rounded-l-none">
              <h3 className="py-4 text-2xl text-center text-gray-800 dark:text-white">
                Create an Account!
              </h3>
              <form
                onSubmit={handleSubmit}
                className="px-8 pt-6 pb-8 mb-4 bg-white dark:bg-gray-800 rounded max-w-full"
              >
                <div className="mb-4 md:flex md:justify-around">
                  <div className="md:ml-2">
                    <label
                      className="block mb-2 text-sm font-bold text-gray-700 dark:text-white"
                      htmlFor="name"
                    >
                      Full Name
                    </label>
                    <input
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      id="name"
                      type="text"
                      name="name"
                      placeholder="Full Name"
                    />
                  </div>
                  <div className="mb-4 md:mr-2 md:mb-0">
                    <label
                      className="block mb-2 text-sm font-bold text-gray-700 dark:text-white"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      id="email"
                      type="email"
                      name="email"
                      placeholder="Email"
                    />
                  </div>
                </div>
                <div className="mb-4 md:flex md:justify-around">
                  <div className="mb-4 md:mr-2 md:mb-0">
                    <label
                      className="block mb-2 text-sm font-bold text-gray-700 dark:text-white"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      id="password"
                      placeholder="******************"
                    />
                  </div>
                  <div className="md:ml-2">
                    <label
                      className="block mb-2 text-sm font-bold text-gray-700 dark:text-white"
                      htmlFor="confirmPassword"
                    >
                      Confirm Password
                    </label>
                    <input
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      id="confirmPassword"
                      type="password"
                      name="confirmPassword"
                      placeholder="******************"
                    />
                  </div>
                </div>
                <div className="mb-4 lg:ml-5 md:ml-[90px]">
                  <label
                    className="block mb-2 text-sm font-bold text-gray-700 dark:text-white"
                    htmlFor="phone"
                  >
                    Phone
                  </label>
                  <input
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    id="phone"
                    type="number"
                    name="phone"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block mb-2 text-sm font-bold text-gray-700 dark:text-white"
                    htmlFor="longitude"
                  >
                    Longitude
                  </label>
                  <input
                    type="number"
                    name="longitude"
                    placeholder="Longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block mb-2 text-sm font-bold text-gray-700 dark:text-white"
                    htmlFor="longitude"
                  >
                    lattitude
                  </label>
                  <input
                    type="number"
                    name="latitude"
                    placeholder="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block mb-2 text-sm font-bold text-gray-700 dark:text-white"
                    htmlFor="role"
                  >
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  >
                    <option value="Client">Client</option>
                    <option value="Service Client">Service Client</option>
                    <option value="Worker">Worker</option>
                  </select>
                </div>
                {formData.role !== "Client" && (
                  <div className="mb-4">
                    <label
                      className="block mb-2 text-sm font-bold text-gray-700 dark:text-white"
                      htmlFor="profession"
                    >
                      Profession
                    </label>
                    <ul>
                      {categories.map((cat) => (
                        <li
                          key={cat._id}
                          onClick={() => {
                            setProfession(cat._id);
                            setFormData({ ...formData, profession: cat._id });
                          }}
                          style={{
                            cursor: "pointer",
                            fontWeight: profession === cat._id ? "bold" : "normal",
                          }}
                        >
                          {cat.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <MapComponent  onPositionSelect={handlePositionSelect} selectedPosition={selectedPosition}/>
                <div className="mb-6 text-center">
                  <button
                    className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 dark:bg-blue-700 dark:text-white dark:hover:bg-blue-900 focus:outline-none focus:shadow-outline"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Registering..." : "Register Account"}
                  </button>
                </div>
                <hr className="mb-6 border-t" />
                <div className="text-center">
                  <a
                    className="inline-block text-sm text-blue-500 dark:text-blue-500 align-baseline hover:text-blue-800"
                    href="/login"
                  >
                    Already have an account? Login!
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registre;