import React, { useEffect, useState } from 'react'
import axios from 'axios'

const availableOrder = () => {

    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_API}/api/order/NearbyOrds?coordinates=${localStorage.getItem('coordinates')}`,
            {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });

            console.log(response.data);
            setOrders(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div>
            
            <h1>availableOrder</h1>
            {orders.map((order) => (
                <div key={order._id}>
                    <h2>{order.name}</h2>
                    <p>{order.details}</p>
                </div>
            ))}
        </div>
    )
}

export default availableOrder
