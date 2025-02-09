import axios from 'axios';
import React, { useEffect, useState } from 'react';

const ManageService = () => {
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState("");
    const [services, setServices] = useState([]);
    const [servFilter, setServFilter] = useState("");
    const [serviceName, setServiceName] = useState(""); // Store service name input

    // Fetch Categories
    const fetchCategories = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_APP_API}/api/cat/all-cat`, {
                headers: { Authorization: localStorage.getItem('token') }
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
                    headers: { Authorization: localStorage.getItem('token') }
                }
            );
            if (data.success) {
                setServices([...services, data.newService]); // Update services list
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
            const { data } = await axios.get(`${import.meta.env.VITE_APP_API}/api/serv/servCat/${catfilter}`, {
                headers: { Authorization: localStorage.getItem('token') }
            });
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
        <div>
            {message && <p style={{ color: "red" }}>{message}</p>}
            <div>
                <form onSubmit={(e) => e.preventDefault()}>
                    <label htmlFor="nS">Enter Service Name:</label>
                    <input
                        id="nS"
                        type="text"
                        placeholder="Enter service name"
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                    />

                    <label>Select Category:</label>
                    <ul>
                        {categories.map((cat) => (
                            <li key={cat._id}>
                                {cat.name}
                                <button type="button" onClick={() => handleCreateService(cat._id)}>
                                    ➕ Add Service
                                </button>
                            </li>
                        ))}
                    </ul>
                </form>
            </div>

            <div>
                <h1>List of Services</h1>
                <h2>Filter Services by Category:</h2>
                <ul>
                    {categories.map((cat) => (
                        <li key={cat._id}>
                            {cat.name}
                            <button onClick={() => setServFilter(cat._id)}>Filter By Category</button>
                        </li>
                    ))}
                </ul>

                <ul>
                    {services.map((serv) => (
                        <li key={serv._id}>
                            {serv.name}{" "}
                            <button onClick={() => handleDeleteServ(serv._id)}>🗑 Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ManageService;
