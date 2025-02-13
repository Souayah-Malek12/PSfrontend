import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // To extract the category ID from the URL
import { useNavigate } from 'react-router-dom';

const ServicesByCategory = () => {
  const { catId } = useParams(); // Extract the category ID from the URL
  const [services, setServices] = useState([]); // State to store the list of services
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors
  const navigate = useNavigate();

  // Fetch services by category ID
  const fetchServicesByCategory = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_API}/api/serv/servCat/${catId}`,
       
      );

      if (data.success) {
        setServices(data.servicesByCat); 
        console.log(data.servicesByCat);
        // Set the list of services
      } else {
        setError(data.message); // Set error message if the request fails
      }
    } catch (err) {
      console.error('Error fetching services:', err.message);
      setError('Failed to fetch services'); // Set generic error message
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Fetch services when the component mounts or when catId changes
  useEffect(() => {
    fetchServicesByCategory();
  }, [catId]);

  if (loading) {
    return <div>Loading...</div>; // Display loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error state
  }

  return (
    <div>
      <h1>Services in This Category</h1>

      {services.length > 0 ? (
        services.map((service, index) => (
          <div key={index} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}
           onClick={()=>{navigate(`/PassrealTimeOrd/${catId}/${service._id}`)}}>
            <h2>{service.name}</h2>
          </div>
        ))
      
      ) : (
        <p>No services found in this category.</p>
      )}

      <div>
        have you an account <button onClick={(()=>navigate('/login'))}>Login</button>
        Registre Now <button onClick={(()=>navigate('/registre'))}>Registre</button>
      </div>
    </div>
  );
};

export default ServicesByCategory;