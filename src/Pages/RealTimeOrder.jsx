// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import { io } from "socket.io-client";

const RealTimeOrder = () => {
    const [orders, setOrders] = useState([])
    const socket = io("http://localhost:5001");

    useEffect(() => {

      
        const worker = JSON.parse(localStorage.getItem("user"));
        console.log("sendeWorker", worker)
        // Join workers room
        socket?.emit('addWorkers', worker)


        // Listen for the new order event
        socket.on("getOrder", (order) => {
            console.log("real time order", order)
            
            setOrders(prevOrders=>[...prevOrders, order]);
            console.log("ordTab",orders);
            
        });

        // Cleanup when component unmounts or socket is disconnected
        return () => {
            socket.off("newOrder"); // Remove the event listener when component is unmounted
        };
    }, []);
    console.log("New order received:2", orders);

    

      
    

  return (
    <div>
        <h1>NEW Order;;; </h1>
        {orders.map((ord, index)=>
        (
            <div key={index}>
                <h1 >{ord?.name}</h1>
                <h1 >{ord.details}</h1>
                <h1 >{ord.desiredTime}</h1>
            </div>

        ))}
    </div>
  )
}

export default RealTimeOrder
