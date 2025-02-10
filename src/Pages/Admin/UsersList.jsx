import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {useUserRole} from '../../Context/UserContext'

const UsersList = () => {
  const [clients, setClients] = useState([]);
  const [searchedR, setSearchedR] = useState(''); // Role to filter clients
  const [message, setMessage] = useState('');
  const { userRole } = useUserRole();


  const fetchClients = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_APP_API}/api/adm/allUsers/${searchedR}`, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });

      if (data.success) {
        setClients(data.clientsList);
        setMessage('');
      } else {
        setClients([]);
        setMessage(data.message);
      }
    } catch (err) {
      setMessage('Error fetching clients');
      console.error('Error fetching clients:', err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const { data } = await axios.delete(`${import.meta.env.VITE_APP_API}/api/worker/delete-one/${userId}`, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });

      if (data.success) {
        // Re-fetch the clients list after deletion
        setClients(clients.filter((c)=>(c._id !==userId)))
        setMessage('User deleted successfully');
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage('Error deleting user');
      console.error('Error deleting user:', err.message);
    }
  };
  
  useEffect(() => {
    if (searchedR) {
      fetchClients();
    }
  console.log("userRole", userRole)
  }, [searchedR, ]);

  return (
    <div>
      <h1>Clients List</h1>
      
      <select onChange={(e) => setSearchedR(e.target.value)} value={searchedR}>
        <option value="">Select Role</option>
        <option value="Client">Client</option>
        <option value="Worker">Worker</option>
        <option value="Service Client">Service Client</option>
      </select>

      {message && <p>{message}</p>}

      {Array.isArray(clients) && clients.length > 0 ? (
        clients.map((client, index) => (
          <div key={client._id}>
            <h2>{client.nom} {client.prenom}</h2>
            <p>Email: {client.email}</p>
            <p>Phone: {client.phone}</p>
            <p>Role: {client.role}</p>
           { userRole !=="Adminstrator" &&
            <button onClick={() => handleDeleteUser(client._id)}>Delete User</button> 
           }
          </div>
        ))
      ) : (
        !message && <p>No clients found.</p>
      )}
    </div>
  );
};

export default UsersList;
